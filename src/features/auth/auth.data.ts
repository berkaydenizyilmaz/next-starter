import 'server-only';
import { notFound, redirect } from 'next/navigation';
import {
  clearSession,
  readSession,
  saveSession,
} from '@/features/auth/session.cookie';
import * as api from '@/lib/api';
import { ApiError, isTransportError } from '@/lib/api.error';
import type { Client } from '@/lib/api/client';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import { ROUTE } from '@/lib/constants/route.constants';
import { apiClient } from '@/server/api.client';
import { requestLogger } from '@/server/logger';

export { clearSession };

export interface CurrentUser {
  id: string;
  email: string;
  role: api.Me['role'];
}

const SIGNED_OUT_STATUSES: ReadonlySet<number> = new Set([
  HTTP_STATUS.UNAUTHORIZED,
  HTTP_STATUS.NOT_FOUND,
]);

export async function login(
  credentials: api.LoginRequest,
): Promise<{ reactivated: boolean }> {
  const { data } = await api.login({
    client: await apiClient(),
    body: credentials,
  });
  await saveSession(data);

  return { reactivated: data.reactivated };
}

export async function register(account: api.RegisterRequest): Promise<void> {
  const { data } = await api.register({
    client: await apiClient(),
    body: account,
  });
  await saveSession(data);
}

export async function logout(): Promise<void> {
  const session = await readSession();

  if (session) {
    try {
      await api.logout({
        client: await apiClient(),
        body: { refreshToken: session.refreshToken },
      });
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      if (!isTransportError(error)) {
        const log = await requestLogger();
        log.warn(
          { code: error.code, status: error.status },
          'Logout was not recorded by the API',
        );
      }
    }
  }

  await clearSession();
}

export async function requestPasswordReset(
  input: api.ForgotPasswordRequest,
): Promise<void> {
  await api.requestPasswordReset({ client: await apiClient(), body: input });
}

export async function resetPassword(
  input: api.ResetPasswordRequest,
): Promise<void> {
  await api.resetPassword({ client: await apiClient(), body: input });
  await clearSession();
}

export async function changePassword(
  input: api.ChangePasswordRequest,
): Promise<void> {
  await api.changePassword({ client: await sessionClient(), body: input });
}

export async function listSessions(): Promise<api.Session[]> {
  const { data } = await api.listSessions({ client: await sessionClient() });
  return data;
}

export async function revokeSession(id: string): Promise<void> {
  await api.revokeSession({ client: await sessionClient(), path: { id } });
}

export async function revokeAllSessions(): Promise<void> {
  await api.revokeAllSessions({ client: await sessionClient() });
  await clearSession();
}

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

export async function requireRole(
  ...roles: CurrentUser['role'][]
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!roles.includes(user.role)) notFound();

  return user;
}

export async function getAccessTokenOrNull(): Promise<string | null> {
  const session = await readSession();
  return session?.accessToken ?? null;
}

export async function sessionClient(): Promise<Client> {
  const session = await readSession();
  if (!session) redirect(ROUTE.LOGIN);

  const client = await apiClient({ accessToken: session.accessToken });
  client.interceptors.error.use((error) => {
    if (
      error instanceof ApiError &&
      error.status === HTTP_STATUS.UNAUTHORIZED
    ) {
      redirect(ROUTE.LOGIN);
    }
    return error;
  });

  return client;
}
