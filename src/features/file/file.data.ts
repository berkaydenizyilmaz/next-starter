import 'server-only';
import { sessionClient } from '@/features/auth/auth.data';
import * as api from '@/lib/api';

export async function createUpload(
  input: api.CreateUploadRequest,
): Promise<api.UploadTicket> {
  const { data } = await api.createUpload({
    client: await sessionClient(),
    body: input,
  });
  return data;
}

export async function completeUpload(id: string): Promise<api.StoredFile> {
  const { data } = await api.completeUpload({
    client: await sessionClient(),
    path: { id },
  });
  return data;
}
