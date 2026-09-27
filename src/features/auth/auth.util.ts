import { RESET_TOKEN_PARAM } from '@/features/auth/auth.constants';
import { REDIRECT_PARAM } from '@/lib/constants/route.constants';
import {
  type SearchParams,
  singleSearchParam,
} from '@/lib/utils/search-params.util';

export function redirectTarget(searchParams: SearchParams): string | undefined {
  return singleSearchParam(searchParams, REDIRECT_PARAM);
}

export function resetToken(searchParams: SearchParams): string | undefined {
  return singleSearchParam(searchParams, RESET_TOKEN_PARAM);
}

export function redirectQuery(
  target: string | undefined,
): Record<string, string> {
  return target ? { [REDIRECT_PARAM]: target } : {};
}
