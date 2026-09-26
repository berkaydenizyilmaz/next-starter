import type { Route } from 'next';
import { REDIRECT_PARAM, ROUTE } from '@/lib/constants/route.constants';

const INTERNAL_ORIGIN = 'http://internal.invalid';

export function internalPath(value: string | undefined): Route {
  const url = value ? URL.parse(value, INTERNAL_ORIGIN) : null;

  return url?.origin === INTERNAL_ORIGIN
    ? (`${url.pathname}${url.search}${url.hash}` as Route)
    : ROUTE.HOME;
}

export function signInPath(returnTo: string): string {
  if (returnTo === ROUTE.HOME) return ROUTE.LOGIN;

  const query = new URLSearchParams({ [REDIRECT_PARAM]: returnTo });
  return `${ROUTE.LOGIN}?${query.toString()}`;
}
