import 'server-only';
import { sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';
import { z } from 'zod';
import type * as api from '@/lib/api';
import { MS_PER_SECOND } from '@/lib/constants/time.constants';
import { env } from '@/server/env';
import { requestLogger } from '@/server/logger';
import type { IncomingHeaders } from '@/server/request-context';

export const SESSION_COOKIE_NAME = '__Host-session';

const COOKIE_HEADER = 'cookie';

const sessionSchema = z.object({
  accessToken: z.string().min(1),
  accessTokenExpiresAt: z.number().int(),
  refreshToken: z.string().min(1),
});

export type Session = z.infer<typeof sessionSchema>;

export interface SessionCookie {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
}

const SESSION_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;

export async function sessionFromCookie({
  value,
  incoming,
}: {
  value: string | undefined;
  incoming?: IncomingHeaders;
}): Promise<Session | null> {
  if (!value) return null;

  const log = await requestLogger(incoming);
  const unsealed = await unsealData<unknown>(value, {
    password: env.SESSION_SECRET,
    onUnsealError: (reason, error) => {
      if (reason !== 'expired') {
        log.warn({ err: error, reason }, 'Session cookie rejected');
      }
    },
  });
  const parsed = sessionSchema.safeParse(unsealed);

  return parsed.success ? parsed.data : null;
}

export async function sessionCookie(
  tokens: api.TokenPair,
): Promise<SessionCookie> {
  const session: Session = {
    accessToken: tokens.accessToken,
    accessTokenExpiresAt:
      Date.now() + tokens.accessTokenExpiresIn * MS_PER_SECOND,
    refreshToken: tokens.refreshToken,
  };

  return {
    ...SESSION_COOKIE_OPTIONS,
    value: await sealData(session, {
      password: env.SESSION_SECRET,
      ttl: tokens.refreshTokenExpiresIn,
    }),
    maxAge: tokens.refreshTokenExpiresIn,
  };
}

export function expiredSessionCookie(): SessionCookie {
  return { ...SESSION_COOKIE_OPTIONS, value: '', maxAge: 0 };
}

export function applySessionCookie(
  headers: Headers,
  cookie: SessionCookie,
): void {
  const pairs = (headers.get(COOKIE_HEADER) ?? '')
    .split(';')
    .map((pair) => pair.trim())
    .filter((pair) => pair && !pair.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (cookie.value) pairs.push(`${SESSION_COOKIE_NAME}=${cookie.value}`);

  if (pairs.length > 0) headers.set(COOKIE_HEADER, pairs.join('; '));
  else headers.delete(COOKIE_HEADER);
}

export async function readSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  return sessionFromCookie({
    value: cookieStore.get(SESSION_COOKIE_NAME)?.value,
  });
}

export async function saveSession(tokens: api.TokenPair): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(await sessionCookie(tokens));
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(expiredSessionCookie());
}
