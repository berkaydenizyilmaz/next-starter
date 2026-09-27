import { z } from 'zod';
import { zListAuditLogsQuery } from '@/lib/api/zod.gen';

export const auditLogSearchSchema = zListAuditLogsQuery
  .omit({ page: true, limit: true, from: true, to: true })
  .extend({
    page: z.coerce.number().int().min(1),
    from: z.iso.date(),
    to: z.iso.date(),
  });

export type AuditLogSearch = Partial<z.output<typeof auditLogSearchSchema>>;
