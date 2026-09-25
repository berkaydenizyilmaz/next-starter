import 'server-only';
import { isIP } from 'node:net';

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
