import { RESET_TOKEN_PARAM } from '@/features/auth/auth.constants';
import { REDIRECT_PARAM } from '@/lib/constants/route.constants';

type SearchParams = Record<string, string | string[] | undefined>;

export function redirectTarget(searchParams: SearchParams): string | undefined {
  return singleParam(searchParams, REDIRECT_PARAM);
}

export function resetToken(searchParams: SearchParams): string | undefined {
  return singleParam(searchParams, RESET_TOKEN_PARAM);
}

export function redirectQuery(
  target: string | undefined,
): Record<string, string> {
  return target ? { [REDIRECT_PARAM]: target } : {};
}

function singleParam(
  searchParams: SearchParams,
  name: string,
): string | undefined {
  const value = searchParams[name];
  return typeof value === 'string' && value !== '' ? value : undefined;
}
