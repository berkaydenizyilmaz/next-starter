'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { login, logout, register } from '@/features/auth/auth.data';
import { AUTH_ERROR_MESSAGES } from '@/features/auth/auth.messages';
import { zLoginRequest, zRegisterRequest } from '@/lib/api/zod.gen';
import { REDIRECT_PARAM, ROUTE } from '@/lib/constants/route.constants';
import { internalPath } from '@/lib/utils/url.util';
import { formAction } from '@/server/form-action';

const redirectField = { [REDIRECT_PARAM]: z.string().optional() };

export const loginAction = formAction(
  {
    schema: zLoginRequest.extend(redirectField),
    echoFields: ['email'],
    messages: AUTH_ERROR_MESSAGES,
  },
  async ({ [REDIRECT_PARAM]: redirectTo, ...credentials }) => {
    await login(credentials);
    redirect(internalPath(redirectTo));
  },
);

export const registerAction = formAction(
  {
    schema: zRegisterRequest.extend(redirectField),
    echoFields: ['email'],
    messages: AUTH_ERROR_MESSAGES,
  },
  async ({ [REDIRECT_PARAM]: redirectTo, ...account }) => {
    await register(account);
    redirect(internalPath(redirectTo));
  },
);

export async function logoutAction(): Promise<void> {
  await logout();
  redirect(ROUTE.LOGIN);
}
