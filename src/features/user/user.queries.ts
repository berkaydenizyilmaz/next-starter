import { infiniteQueryOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { browserApiClient } from '@/lib/browser-api.client';

export const securityLogQuery = infiniteQueryOptions({
  queryKey: ['user', 'security-log'],
  queryFn: async ({ pageParam, signal }) => {
    const { data } = await api.getMySecurityLog({
      client: browserApiClient,
      query: { cursor: pageParam },
      signal,
    });
    return data;
  },
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (page) => page.meta.nextCursor ?? undefined,
});
