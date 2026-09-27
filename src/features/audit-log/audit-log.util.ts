import { z } from 'zod';
import type * as api from '@/lib/api';
import { zListAuditLogsQuery } from '@/lib/api/zod.gen';
import { zonedDayEnd, zonedDayStart } from '@/lib/utils/date.util';
import { toSearchQuery } from '@/lib/utils/search-params.util';

export const auditLogSearchSchema = zListAuditLogsQuery
  .omit({ page: true, limit: true, from: true, to: true })
  .extend({
    page: z.coerce.number().int().min(1),
    from: z.iso.date(),
    to: z.iso.date(),
  });

export type AuditLogSearch = Partial<z.output<typeof auditLogSearchSchema>>;

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

export function auditLogSearchQuery(
  search: AuditLogSearch,
  page: number,
): Record<string, string> {
  return toSearchQuery({ ...search, page });
}
