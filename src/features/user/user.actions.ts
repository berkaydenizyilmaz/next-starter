'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { FILE_ERROR_MESSAGES } from '@/features/file/file.messages';
import {
  deleteMe,
  removeMyAvatar,
  updateMyAvatar,
} from '@/features/user/user.data';
import {
  USER_ERROR_MESSAGES,
  USER_FLASH_MESSAGES,
} from '@/features/user/user.messages';
import { zUpdateAvatarRequest } from '@/lib/api/zod.gen';
import { ROUTE } from '@/lib/constants/route.constants';
import { formAction } from '@/server/action/form-action';
import { serverAction } from '@/server/action/server-action';
import { setFlash } from '@/server/flash/flash.cookie';

export const updateMyAvatarAction = serverAction(
  {
    schema: zUpdateAvatarRequest,
    messages: { ...FILE_ERROR_MESSAGES, ...USER_ERROR_MESSAGES },
  },
  async ({ fileId }) => {
    await updateMyAvatar(fileId);
    refresh();
  },
);

export const removeMyAvatarAction = formAction(
  { schema: z.object({}), messages: USER_ERROR_MESSAGES },
  async () => {
    await removeMyAvatar();
    refresh();
  },
);

export const deleteMeAction = formAction(
  { schema: z.object({}), messages: USER_ERROR_MESSAGES },
  async () => {
    await deleteMe();
    await setFlash({ kind: 'info', message: USER_FLASH_MESSAGES.DELETED });
    redirect(ROUTE.LOGIN);
  },
);
