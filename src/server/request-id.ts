import 'server-only';

export const REQUEST_ID_HEADER = 'x-request-id';

export type IncomingHeaders = Pick<Headers, 'get'>;

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

export function resolveRequestId(headers: Headers): string {
  const incoming = headers.get(REQUEST_ID_HEADER);
  return incoming && REQUEST_ID_PATTERN.test(incoming)
    ? incoming
    : crypto.randomUUID();
}
