import { REDIRECT_PARAM } from '@/features/auth/auth.constants';

type SearchParams = Record<string, string | string[] | undefined>;

export function redirectTarget(searchParams: SearchParams): string | undefined {
  const target = searchParams[REDIRECT_PARAM];
  return typeof target === 'string' ? target : undefined;
}

export function redirectQuery(
  target: string | undefined,
): Record<string, string> {
  return target ? { [REDIRECT_PARAM]: target } : {};
}
