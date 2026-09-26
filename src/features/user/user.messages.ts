import { USER_ERROR } from '@/features/user/user.constants';
import type { ErrorMessages } from '@/lib/messages/error.messages';

export const USER_ERROR_MESSAGES: ErrorMessages = {
  [USER_ERROR.USER_NOT_FOUND]: 'Hesabın bulunamadı.',
};

export const USER_FLASH_MESSAGES = {
  DELETED:
    'Hesabın silindi. Geri alma süresi içinde tekrar giriş yaparsan hesabın geri açılır.',
} as const;
