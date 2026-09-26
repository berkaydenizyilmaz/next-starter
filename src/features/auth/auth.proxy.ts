import 'server-only';
import { type NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_REFRESH_MARGIN_MS,
  REDIRECT_PARAM,
} from '@/features/auth/auth.constants';
import {
  expiredSessionCookie,
  type Session,
  SESSION_COOKIE_NAME,
  type SessionCookie,
  sessionCookie,
  sessionFromCookie,
} from '@/features/auth/session.cookie';
import * as api from '@/lib/api';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import { PUBLIC_ROUTES, ROUTE } from '@/lib/constants/route.constants';
import { createApiClient } from '@/server/api/api.client';
import { ApiError, isTransportError } from '@/server/api/api.error';
import { requestLogger } from '@/server/logger';

type RefreshOutcome =
  | { status: 'refreshed'; tokens: api.TokenPair }
  | { status: 'rejected' }
  | { status: 'unavailable' };

interface SessionState {
  signedIn: boolean;
  cookie?: SessionCookie;
}

const GUARDED_METHODS: ReadonlySet<string> = new Set(['GET', 'HEAD']);
const UNGUARDED_PATH = /^\/(?:api|_next)\/|\.[^/]*$/;

const inflightRefreshes = new Map<string, Promise<RefreshOutcome>>();

export async function authenticate({
  request,
  headers,
}: {
  request: NextRequest;
  headers: Headers;
}): Promise<NextResponse> {
  const { signedIn, cookie } = await resolveSession({
    value: request.cookies.get(SESSION_COOKIE_NAME)?.value,
    headers,
  });

  const response =
    !signedIn && requiresSignIn(request)
      ? NextResponse.redirect(signInUrl(request))
      : NextResponse.next({ request: { headers } });

  if (cookie) response.cookies.set(cookie);
  return response;
}

async function resolveSession({
  value,
  headers,
}: {
  value: string | undefined;
  headers: Headers;
}): Promise<SessionState> {
  if (!value) return { signedIn: false };

  const session = await sessionFromCookie({ value, incoming: headers });
  if (!session) return { signedIn: false, cookie: expiredSessionCookie() };
  if (!expiresSoon(session)) return { signedIn: true };

  const outcome = await refreshOnce({
    refreshToken: session.refreshToken,
    headers,
  });

  switch (outcome.status) {
    case 'refreshed':
      return { signedIn: true, cookie: await sessionCookie(outcome.tokens) };
    case 'rejected':
      return { signedIn: false, cookie: expiredSessionCookie() };
    case 'unavailable':
      return { signedIn: true };
  }
}

function expiresSoon(session: Session): boolean {
  return (
    session.accessTokenExpiresAt - Date.now() < ACCESS_TOKEN_REFRESH_MARGIN_MS
  );
}

function refreshOnce({
  refreshToken,
  headers,
}: {
  refreshToken: string;
  headers: Headers;
}): Promise<RefreshOutcome> {
  const inflight = inflightRefreshes.get(refreshToken);
  if (inflight) return inflight;

  const refresh = refreshTokens({ refreshToken, headers }).finally(() => {
    inflightRefreshes.delete(refreshToken);
  });
  inflightRefreshes.set(refreshToken, refresh);

  return refresh;
}

async function refreshTokens({
  refreshToken,
  headers,
}: {
  refreshToken: string;
  headers: Headers;
}): Promise<RefreshOutcome> {
  try {
    const { data } = await api.refresh({
      client: createApiClient({ incoming: headers }),
      body: { refreshToken },
    });
    return { status: 'refreshed', tokens: data };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;

    const log = await requestLogger(headers);

    if (error.status === HTTP_STATUS.UNAUTHORIZED) {
      log.info({ code: error.code }, 'Session refresh rejected');
      return { status: 'rejected' };
    }

    if (!isTransportError(error)) {
      log.warn(
        { code: error.code, status: error.status },
        'Session refresh failed',
      );
    }
    return { status: 'unavailable' };
  }
}

function requiresSignIn(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  return (
    GUARDED_METHODS.has(request.method) &&
    !PUBLIC_ROUTES.has(pathname) &&
    !UNGUARDED_PATH.test(pathname)
  );
}

function signInUrl(request: NextRequest): URL {
  const url = new URL(ROUTE.LOGIN, request.url);
  const { pathname, search } = request.nextUrl;

  if (pathname !== ROUTE.HOME) {
    url.searchParams.set(REDIRECT_PARAM, `${pathname}${search}`);
  }

  return url;
}
