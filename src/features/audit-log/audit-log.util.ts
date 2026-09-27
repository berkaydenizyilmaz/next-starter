import type { AuditLogSearch } from '@/features/audit-log/audit-log.schemas';
import type * as api from '@/lib/api';
import { zonedDayEnd, zonedDayStart } from '@/lib/utils/date.util';

export function toListAuditLogsQuery({
  from,
  to,
  ...filters
}: AuditLogSearch): api.ListAuditLogsData['query'] {
  return {
    ...filters,
    from: from && zonedDayStart(from),
    to: to && zonedDayEnd(to),
  };
}
