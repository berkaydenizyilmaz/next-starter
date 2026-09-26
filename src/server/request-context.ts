import 'server-only';
import { isIP } from 'node:net';

export const REQUEST_ID_HEADER = 'x-request-id';

export type IncomingHeaders = Pick<Headers, 'get'>;

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

export function resolveRequestId(incoming: IncomingHeaders): string {
  const requestId = incoming.get(REQUEST_ID_HEADER);
  return requestId && REQUEST_ID_PATTERN.test(requestId)
    ? requestId
    : crypto.randomUUID();
}

export function resolveClientIp({
  forwardedFor,
  trustedHops,
}: {
  forwardedFor: string | null;
  trustedHops: number;
}): string | undefined {
  const hops = (forwardedFor ?? '')
    .split(',')
    .map((hop) => hop.trim())
    .filter(Boolean);
  const candidate = hops.at(-trustedHops);

  return candidate && isIP(candidate) !== 0 ? candidate : undefined;
}
