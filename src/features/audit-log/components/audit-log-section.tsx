import type { ReactNode } from 'react';
import { PaginationNav } from '@/components/pagination-nav';
import { listAuditLogs } from '@/features/audit-log/audit-log.data';
import { AuditLogTable } from '@/features/audit-log/components/audit-log-table';
import { requireRole } from '@/features/auth/auth.data';
import { ROLE } from '@/lib/constants/role.constants';
import { ROUTE } from '@/lib/constants/route.constants';

export async function AuditLogSection({
  page,
}: {
  page: number;
}): Promise<ReactNode> {
  await requireRole(ROLE.ADMIN);
  const { data, meta } = await listAuditLogs({ page });

  return (
    <div className="flex flex-col gap-4">
      <AuditLogTable entries={data} />
      <PaginationNav
        page={meta.page}
        pageCount={Math.ceil(meta.total / meta.limit)}
        href={(target) => ({
          pathname: ROUTE.ADMIN_AUDIT_LOGS,
          query: { page: target },
        })}
      />
    </div>
  );
}
