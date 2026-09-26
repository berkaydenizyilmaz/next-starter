import { z } from 'zod';
import type { ErrorMessages } from '@/lib/errors/error.messages';

const REQUIRED_MESSAGE = 'Bu alan zorunlu.';
const INVALID_FORMAT_MESSAGE = 'Geçersiz biçim.';

const turkishLocale = z.locales.tr();

export const ISSUE_CODE_MESSAGES: ErrorMessages = {
  invalid_type: REQUIRED_MESSAGE,
  too_small: 'Çok kısa.',
  too_big: 'Çok uzun.',
  invalid_format: INVALID_FORMAT_MESSAGE,
  invalid_value: 'Geçerli bir seçim yap.',
};

export const formErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case 'invalid_type':
      return issue.input === undefined
        ? REQUIRED_MESSAGE
        : turkishLocale.localeError(issue);
    case 'too_small':
      return tooSmallMessage(issue.origin, Number(issue.minimum));
    case 'too_big':
      return tooBigMessage(issue.origin, Number(issue.maximum));
    case 'invalid_format':
      return invalidFormatMessage(issue.format);
    case 'invalid_value':
      return ISSUE_CODE_MESSAGES.invalid_value;
    default:
      return turkishLocale.localeError(issue);
  }
};

function tooSmallMessage(origin: string, minimum: number): string {
  if (origin === 'string') {
    return minimum <= 1
      ? REQUIRED_MESSAGE
      : `En az ${minimum} karakter olmalı.`;
  }
  if (origin === 'array' || origin === 'set') {
    return `En az ${minimum} seçim yapmalısın.`;
  }
  return `En az ${minimum} olmalı.`;
}

function tooBigMessage(origin: string, maximum: number): string {
  if (origin === 'string') return `En fazla ${maximum} karakter olabilir.`;
  if (origin === 'array' || origin === 'set') {
    return `En fazla ${maximum} seçim yapabilirsin.`;
  }
  return `En fazla ${maximum} olabilir.`;
}

function invalidFormatMessage(format: string): string {
  if (format === 'email') return 'Geçerli bir e-posta adresi gir.';
  if (format === 'url') return 'Geçerli bir adres gir.';
  return INVALID_FORMAT_MESSAGE;
}
