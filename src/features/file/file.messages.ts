import { FILE_ERROR } from '@/features/file/file.constants';
import type { ErrorMessages } from '@/lib/messages/error.messages';

const FILE_BUSY_MESSAGE = 'Dosya şu anda işlenemiyor. Biraz sonra tekrar dene.';

export const FILE_ERROR_MESSAGES: ErrorMessages = {
  [FILE_ERROR.FILE_PURPOSE_UNKNOWN]: 'Bu yükleme türü tanınmıyor.',
  [FILE_ERROR.FILE_TYPE_NOT_ALLOWED]: 'Bu dosya türü desteklenmiyor.',
  [FILE_ERROR.FILE_TOO_LARGE]: 'Dosya çok büyük.',
  [FILE_ERROR.FILE_NOT_UPLOADED]: 'Dosya yüklenmemiş. Dosyayı yeniden seç.',
  [FILE_ERROR.FILE_INVALID_CONTENT]:
    'Dosya okunamadı ya da içeriği türüyle uyuşmuyor.',
  [FILE_ERROR.FILE_NOT_READY]: 'Dosya henüz hazır değil.',
  [FILE_ERROR.FILE_NOT_FOUND]: 'Dosya bulunamadı.',
  [FILE_ERROR.STORAGE_UNAVAILABLE]: FILE_BUSY_MESSAGE,
  [FILE_ERROR.FILE_PROCESSING_BUSY]: FILE_BUSY_MESSAGE,
};

export const FILE_UPLOAD_MESSAGES = {
  STORAGE_FAILED: 'Dosya gönderilemedi. Bağlantını kontrol edip tekrar dene.',
} as const;
