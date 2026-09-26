import 'server-only';
import { headers } from 'next/headers';
import { type Client, createClient, createConfig } from '@/lib/api/client';
import { MS_PER_SECOND } from '@/lib/constants/time.constants';
import { isTransportError, toApiError } from '@/server/api/api.error';
import { resolveClientIp } from '@/server/client-ip';
import { env } from '@/server/env';
import { requestLogger } from '@/server/logger';
import { type IncomingHeaders, REQUEST_ID_HEADER } from '@/server/request-id';

const API_TIMEOUT_MS = 10 * MS_PER_SECOND;
const PASSED_THROUGH_HEADERS = [
  REQUEST_ID_HEADER,
  'user-agent',
  'x-device-name',
] as const;
const FORWARDED_FOR_HEADER = 'x-forwarded-for';

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
      const log = await requestLogger(incoming);
      log.error(
        {
          err: apiError.cause,
          code: apiError.code,
          status: response?.status,
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
