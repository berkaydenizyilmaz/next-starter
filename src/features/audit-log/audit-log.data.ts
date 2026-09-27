import 'server-only';
import { sessionClient } from '@/features/auth/auth.data';
import * as api from '@/lib/api';

export async function listAuditLogs(
  query: api.ListAuditLogsData['query'],
): Promise<api.AuditLogPage> {
  const { data } = await api.listAuditLogs({
    client: await sessionClient(),
    query,
  });
  return data;
}
