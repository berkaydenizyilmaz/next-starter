import { COMMON_ERROR } from '@/lib/errors/error.constants';

export type ErrorMessages = Readonly<Partial<Record<string, string>>>;

const FALLBACK_MESSAGE = 'Beklenmeyen bir sorun çıktı. Lütfen tekrar dene.';

const COMMON_ERROR_MESSAGES: ErrorMessages = {
  [COMMON_ERROR.VALIDATION_FAILED]: 'Gönderdiğin bilgilerde hata var.',
  [COMMON_ERROR.INSUFFICIENT_ROLE]: 'Bu işlem için yetkin yok.',
  [COMMON_ERROR.NOT_FOUND]: 'Aradığın kayıt bulunamadı.',
  [COMMON_ERROR.UNIQUE_CONSTRAINT]: 'Bu kayıt zaten var.',
  [COMMON_ERROR.FOREIGN_KEY_CONSTRAINT]:
    'Bu kayda bağlı başka kayıtlar olduğu için işlem yapılamadı.',
  [COMMON_ERROR.INTERNAL_ERROR]: FALLBACK_MESSAGE,
  [COMMON_ERROR.TOO_MANY_REQUESTS]: 'Çok fazla istek gönderdin.',
  [COMMON_ERROR.PAYLOAD_TOO_LARGE]: 'Gönderdiğin veri çok büyük.',
  [COMMON_ERROR.API_UNREACHABLE]:
    'Sunucuya şu anda ulaşılamıyor. Biraz sonra tekrar dene.',
  [COMMON_ERROR.API_TIMEOUT]:
    'Sunucu zamanında yanıt vermedi. Biraz sonra tekrar dene.',
  [COMMON_ERROR.API_INVALID_RESPONSE]: FALLBACK_MESSAGE,
};

export function errorMessage(
  code: string,
  messages: ErrorMessages = {},
): string {
  return messages[code] ?? COMMON_ERROR_MESSAGES[code] ?? FALLBACK_MESSAGE;
}
