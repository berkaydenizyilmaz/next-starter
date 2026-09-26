'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { REDIRECT_PARAM } from '@/features/auth/auth.constants';
import { AUTH_ERROR_MESSAGES } from '@/features/auth/auth.messages';
import {
  clearSession,
  readSession,
  saveSession,
} from '@/features/auth/session';
import * as api from '@/lib/api';
import { zLoginRequest, zRegisterRequest } from '@/lib/api/zod.gen';
import { ROUTE } from '@/lib/constants/route.constants';
import { internalPath } from '@/lib/url.util';
import { apiClient } from '@/server/api/api.client';
import { ApiError, isTransportError } from '@/server/api/api.error';
import { formAction } from '@/server/form-action';
import { requestLogger } from '@/server/logger';

const redirectField = { [REDIRECT_PARAM]: z.string().optional() };

export const login = formAction(
  {
    schema: zLoginRequest.extend(redirectField),
    echoFields: ['email'],
    messages: AUTH_ERROR_MESSAGES,
  },
  async ({ [REDIRECT_PARAM]: redirectTo, ...credentials }) => {
    const { data } = await api.login({
      client: await apiClient(),
      body: credentials,
    });
    await saveSession(data);
    redirect(internalPath(redirectTo));
  },
);

export const register = formAction(
  {
    schema: zRegisterRequest.extend(redirectField),
    echoFields: ['email'],
    messages: AUTH_ERROR_MESSAGES,
  },
  async ({ [REDIRECT_PARAM]: redirectTo, ...account }) => {
    const { data } = await api.register({
      client: await apiClient(),
      body: account,
    });
    await saveSession(data);
    redirect(internalPath(redirectTo));
  },
);

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
  redirect(ROUTE.LOGIN);
}
