import { APP_LOCALE, APP_TIMEZONE } from '@/lib/constants/app.constants';

const dateTimeFormat = new Intl.DateTimeFormat(APP_LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: APP_TIMEZONE,
});

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}
