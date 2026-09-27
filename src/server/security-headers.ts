import 'server-only';
import { MS_PER_DAY, MS_PER_SECOND } from '@/lib/constants/time.constants';
import { env } from '@/server/env';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

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
  headers.set('Content-Security-Policy', contentSecurityPolicy());
}

function contentSecurityPolicy(): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(IS_DEVELOPMENT ? ["'unsafe-eval'"] : []),
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', env.STORAGE_PUBLIC_ORIGIN],
    'font-src': ["'self'"],
    'connect-src': ["'self'", env.STORAGE_UPLOAD_ORIGIN],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(IS_PRODUCTION && { 'upgrade-insecure-requests': [] }),
  };

  return Object.entries(directives)
    .map(([name, sources]) => [name, ...sources].join(' '))
    .join('; ');
}
