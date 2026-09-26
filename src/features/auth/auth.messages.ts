import { AUTH_ERROR } from '@/features/auth/auth.constants';
import type { ErrorMessages } from '@/lib/messages/error.messages';

export const AUTH_ERROR_MESSAGES: ErrorMessages = {
  [AUTH_ERROR.INVALID_CREDENTIALS]: 'E-posta ya da şifre hatalı.',
  [AUTH_ERROR.ACCOUNT_TEMPORARILY_LOCKED]:
    'Çok fazla hatalı deneme yaptın, hesabın geçici olarak kilitlendi.',
  [AUTH_ERROR.EMAIL_TAKEN]: 'Bu e-posta adresiyle kayıtlı bir hesap var.',
  [AUTH_ERROR.INVALID_CURRENT_PASSWORD]: 'Mevcut şifren hatalı.',
  [AUTH_ERROR.INVALID_RESET_TOKEN]:
    'Bağlantı geçersiz ya da daha önce kullanılmış.',
  [AUTH_ERROR.RESET_TOKEN_EXPIRED]: 'Bağlantının süresi dolmuş.',
  [AUTH_ERROR.SESSION_NOT_FOUND]: 'Bu oturum zaten kapatılmış.',
};
