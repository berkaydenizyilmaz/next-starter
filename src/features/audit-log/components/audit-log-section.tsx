import type { ReactNode } from 'react';
import { PaginationNav } from '@/components/pagination-nav';
import { AUDIT_LOG_ROLES } from '@/features/audit-log/audit-log.constants';
import { listAuditLogs } from '@/features/audit-log/audit-log.data';
import {
  auditLogSearchSchema,
  toListAuditLogsQuery,
} from '@/features/audit-log/audit-log.util';
import { AuditLogFilters } from '@/features/audit-log/components/audit-log-filters';
import { AuditLogTable } from '@/features/audit-log/components/audit-log-table';
import { requireRole } from '@/features/auth/auth.data';
import { ROUTE } from '@/lib/constants/route.constants';
import {
  parseSearchParams,
  type SearchParams,
  toSearchQuery,
} from '@/lib/utils/search-params.util';

export async function AuditLogSection({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  await requireRole(AUDIT_LOG_ROLES);

  const { values, input, fieldErrors } = parseSearchParams(
    auditLogSearchSchema,
    searchParams,
  );
  const { data, meta } = await listAuditLogs(toListAuditLogsQuery(values));

  return (
    <div className="flex flex-col gap-6">
      <AuditLogFilters
        key={JSON.stringify(input)}
        input={input}
        fieldErrors={fieldErrors}
      />
      <AuditLogTable entries={data} />
      <PaginationNav
        page={meta.page}
        pageCount={Math.ceil(meta.total / meta.limit)}
        href={(target) => ({
          pathname: ROUTE.ADMIN_AUDIT_LOGS,
          query: toSearchQuery({ ...values, page: target }),
        })}
      />
    </div>
  );
}
