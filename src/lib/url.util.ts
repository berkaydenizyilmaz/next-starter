import type { Route } from 'next';
import { ROUTE } from '@/lib/constants/route.constants';

const INTERNAL_ORIGIN = 'http://internal.invalid';

export function internalPath(value: string | undefined): Route {
  const url = value ? URL.parse(value, INTERNAL_ORIGIN) : null;

  return url?.origin === INTERNAL_ORIGIN
    ? (`${url.pathname}${url.search}${url.hash}` as Route)
    : ROUTE.HOME;
}
