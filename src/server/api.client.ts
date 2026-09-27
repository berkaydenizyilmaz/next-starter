import 'server-only';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import type * as api from '@/lib/api';
import { ApiError, isTransportError, toApiError } from '@/lib/api.error';
import { type Client, createClient, createConfig } from '@/lib/api/client';
import { COMMON_ERROR } from '@/lib/constants/error.constants';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import { MS_PER_SECOND } from '@/lib/constants/time.constants';
import { env } from '@/server/env';
import { requestLogger } from '@/server/logger';
import {
  type IncomingHeaders,
  REQUEST_ID_HEADER,
  resolveClientIp,
} from '@/server/request-context';

const API_TIMEOUT_MS = 10 * MS_PER_SECOND;
const PASSED_THROUGH_HEADERS = [
  REQUEST_ID_HEADER,
  'user-agent',
  'x-device-name',
] as const;
const FORWARDED_FOR_HEADER = 'x-forwarded-for';
const API_PATH_PREFIX = '/api/v1/';
const RELAYED_RESPONSE_HEADERS = ['content-type', 'retry-after'] as const;
const NO_STORE = 'private, no-store';

export async function apiClient({
  accessToken,
}: { accessToken?: string } = {}): Promise<Client> {
  return createApiClient({ incoming: await headers(), accessToken });
}

export function createApiClient({
  incoming,
  accessToken,
}: {
  incoming: IncomingHeaders;
  accessToken?: string;
}): Client {
  const client = createClient(
    createConfig({
      baseUrl: env.API_URL,
      headers: forwardedHeaders(incoming),
      auth: accessToken,
      fetch: fetchWithTimeout,
      throwOnError: true,
    }),
  );

  client.interceptors.error.use(async (error, response, options) => {
    const apiError = toApiError({ error, response });

    if (isTransportError(apiError)) {
      await logTransportError({
        incoming,
        error: apiError,
        status: response?.status,
        method: options.method,
        path: options.url,
      });
    }

    return apiError;
  });

  return client;
}

export async function forwardToApi({
  request,
  accessToken,
}: {
  request: NextRequest;
  accessToken: string | null;
}): Promise<Response> {
  const { pathname, search } = request.nextUrl;
  const target = new URL(`${pathname}${search}`, env.API_URL);

  if (!target.pathname.startsWith(API_PATH_PREFIX)) {
    return errorResponse({
      error: new ApiError({
        code: COMMON_ERROR.NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Route not found',
      }),
      request,
    });
  }

  const outgoing = forwardedHeaders(request.headers);
  outgoing.set('accept', 'application/json');
  if (accessToken) outgoing.set('authorization', `Bearer ${accessToken}`);

  let upstream: Response;
  try {
    upstream = await fetchWithTimeout(target, {
      headers: outgoing,
      redirect: 'manual',
    });
  } catch (error) {
    const apiError = toApiError({ error, response: undefined });
    await logTransportError({
      incoming: request.headers,
      error: apiError,
      method: request.method,
      path: target.pathname,
    });
    return errorResponse({ error: apiError, request });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: relayedHeaders(upstream.headers),
  });
}

async function logTransportError({
  incoming,
  error,
  status,
  method,
  path,
}: {
  incoming: IncomingHeaders;
  error: ApiError;
  status?: number;
  method: string | undefined;
  path: string;
}): Promise<void> {
  const log = await requestLogger(incoming);
  log.error(
    { err: error.cause, code: error.code, status, method, path },
    error.message,
  );
}

function errorResponse({
  error,
  request,
}: {
  error: ApiError;
  request: NextRequest;
}): Response {
  const body: api.ErrorResponse = {
    statusCode: error.status,
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
    requestId: request.headers.get(REQUEST_ID_HEADER) ?? undefined,
  };

  return Response.json(body, {
    status: error.status,
    headers: { 'cache-control': NO_STORE },
  });
}

function relayedHeaders(upstream: Headers): Headers {
  const relayed = new Headers({ 'cache-control': NO_STORE });

  for (const name of RELAYED_RESPONSE_HEADERS) {
    const value = upstream.get(name);
    if (value) relayed.set(name, value);
  }

  return relayed;
}

function forwardedHeaders(incoming: IncomingHeaders): Headers {
  const outgoing = new Headers();

  for (const name of PASSED_THROUGH_HEADERS) {
    const value = incoming.get(name);
    if (value) outgoing.set(name, value);
  }

  const clientIp = resolveClientIp({
    forwardedFor: incoming.get(FORWARDED_FOR_HEADER),
    trustedHops: env.TRUST_PROXY_HOPS,
  });
  if (clientIp) outgoing.set(FORWARDED_FOR_HEADER, clientIp);

  return outgoing;
}

const fetchWithTimeout: typeof fetch = (input, init) => {
  const timeout = AbortSignal.timeout(API_TIMEOUT_MS);

  return fetch(input, {
    ...init,
    signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
  });
};
