import 'server-only';
import { MS_PER_DAY, MS_PER_SECOND } from '@/lib/constants/time.constants';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const HSTS_MAX_AGE_SECONDS = (2 * 365 * MS_PER_DAY) / MS_PER_SECOND;

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  ...(IS_PRODUCTION && {
    'Strict-Transport-Security': `max-age=${HSTS_MAX_AGE_SECONDS}; includeSubDomains`,
  }),
};

export function applySecurityHeaders(headers: Headers): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
}
