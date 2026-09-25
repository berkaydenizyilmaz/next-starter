import 'server-only';
import { headers } from 'next/headers';
import { type Client, createClient, createConfig } from '@/lib/api/client';
import { isTransportError, toApiError } from '@/server/api/api.error';
import { resolveClientIp } from '@/server/client-ip';
import { env } from '@/server/env';
import { logger } from '@/server/logger';
import { REQUEST_ID_HEADER } from '@/server/request-id';

const API_TIMEOUT_MS = 10_000;
const PASSED_THROUGH_HEADERS = [
  REQUEST_ID_HEADER,
  'user-agent',
  'x-device-name',
] as const;
const FORWARDED_FOR_HEADER = 'x-forwarded-for';

export async function apiClient(): Promise<Client> {
  const outgoing = await forwardedHeaders();
  const requestId = outgoing.get(REQUEST_ID_HEADER) ?? undefined;

  const client = createClient(
    createConfig({
      baseUrl: env.API_URL,
      headers: outgoing,
      fetch: fetchWithTimeout,
      throwOnError: true,
    }),
  );

  client.interceptors.error.use((error, response, options) => {
    const apiError = toApiError({ error, response });

    if (isTransportError(apiError)) {
      logger.error(
        {
          err: apiError.cause,
          code: apiError.code,
          status: response?.status,
          requestId,
          method: options.method,
          path: options.url,
        },
        apiError.message,
      );
    }

    return apiError;
  });

  return client;
}

async function forwardedHeaders(): Promise<Headers> {
  const incoming = await headers();
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
