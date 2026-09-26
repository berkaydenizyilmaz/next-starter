import {
  environmentManager,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import { ApiError, isTransportError } from '@/lib/api.error';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import { MS_PER_MINUTE } from '@/lib/constants/time.constants';
import { signInPath } from '@/lib/utils/url.util';

const MAX_RETRIES = 2;

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError: redirectWhenSignedOut }),
    defaultOptions: {
      queries: {
        staleTime: MS_PER_MINUTE,
        retry: shouldRetry,
      },
    },
  });
}

function shouldRetry(failureCount: number, error: Error): boolean {
  return (
    failureCount < MAX_RETRIES &&
    error instanceof ApiError &&
    (isTransportError(error) ||
      error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR)
  );
}

function redirectWhenSignedOut(error: Error): void {
  if (environmentManager.isServer()) return;

  if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) {
    const { pathname, search } = window.location;
    window.location.assign(signInPath(`${pathname}${search}`));
  }
}
