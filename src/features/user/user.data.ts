import 'server-only';
import { sessionClient } from '@/features/auth/auth.data';
import * as api from '@/lib/api';

export async function getMySecurityLog({
  cursor,
}: {
  cursor?: string;
}): Promise<api.SecurityLogPage> {
  const { data } = await api.getMySecurityLog({
    client: await sessionClient(),
    query: { cursor },
  });
  return data;
}
