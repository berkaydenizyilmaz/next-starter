import 'server-only';
import { redirect } from 'next/navigation';
import { readSession } from '@/features/auth/session';
import * as api from '@/lib/api';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import { ROUTE } from '@/lib/constants/route.constants';
import { apiClient } from '@/server/api/api.client';
import { ApiError } from '@/server/api/api.error';

export interface CurrentUser {
  id: string;
  email: string;
  role: api.Me['role'];
}

const SIGNED_OUT_STATUSES: ReadonlySet<number> = new Set([
  HTTP_STATUS.UNAUTHORIZED,
  HTTP_STATUS.NOT_FOUND,
]);

export async function getCurrentUserOrNull(): Promise<CurrentUser | null> {
  'use cache: private';

  const session = await readSession();
  if (!session) return null;

  try {
    const { data } = await api.getMe({
      client: await apiClient({ accessToken: session.accessToken }),
    });
    return { id: data.id, email: data.email, role: data.role };
  } catch (error) {
    if (error instanceof ApiError && SIGNED_OUT_STATUSES.has(error.status)) {
      return null;
    }
    throw error;
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUserOrNull();
  if (!user) redirect(ROUTE.LOGIN);

  return user;
}
