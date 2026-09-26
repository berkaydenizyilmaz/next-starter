import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { SecurityLogList } from '@/features/user/components/security-log-list';
import { getMySecurityLog } from '@/features/user/user.data';
import { securityLogQuery } from '@/features/user/user.queries';
import { getQueryClient } from '@/lib/clients/query.client';

export async function SecurityLogSection(): Promise<ReactNode> {
  const queryClient = getQueryClient();
  await queryClient.infiniteQuery({
    ...securityLogQuery,
    queryFn: ({ pageParam }) => getMySecurityLog({ cursor: pageParam }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SecurityLogList />
    </HydrationBoundary>
  );
}
