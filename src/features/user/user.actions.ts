'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { deleteMe } from '@/features/user/user.data';
import {
  USER_ERROR_MESSAGES,
  USER_FLASH_MESSAGES,
} from '@/features/user/user.messages';
import { ROUTE } from '@/lib/constants/route.constants';
import { setFlash } from '@/server/flash/flash.cookie';
import { formAction } from '@/server/form-action';

export const deleteMeAction = formAction(
  { schema: z.object({}), messages: USER_ERROR_MESSAGES },
  async () => {
    await deleteMe();
    await setFlash({ kind: 'info', message: USER_FLASH_MESSAGES.DELETED });
    redirect(ROUTE.LOGIN);
  },
);
