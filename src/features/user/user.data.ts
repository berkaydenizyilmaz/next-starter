import 'server-only';
import { clearSession, sessionClient } from '@/features/auth/auth.data';
import * as api from '@/lib/api';

export async function getMe(): Promise<api.Me> {
  const { data } = await api.getMe({ client: await sessionClient() });
  return data;
}

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

export async function deleteMe(): Promise<void> {
  await api.deleteMe({ client: await sessionClient() });
  await clearSession();
}

export async function updateMyAvatar(fileId: string): Promise<void> {
  await api.updateMyAvatar({
    client: await sessionClient(),
    body: { fileId },
  });
}

export async function removeMyAvatar(): Promise<void> {
  await api.removeMyAvatar({ client: await sessionClient() });
}
