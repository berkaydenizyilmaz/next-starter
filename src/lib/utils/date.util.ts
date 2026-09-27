import { APP_LOCALE, APP_TIMEZONE } from '@/lib/constants/app.constants';
import {
  MINUTES_PER_HOUR,
  MS_PER_MINUTE,
} from '@/lib/constants/time.constants';

const dateTimeFormat = new Intl.DateTimeFormat(APP_LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: APP_TIMEZONE,
});

const offsetFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TIMEZONE,
  timeZoneName: 'longOffset',
});

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

export function zonedDayStart(date: string): string {
  return zonedDateTime(date, '00:00:00.000');
}

export function zonedDayEnd(date: string): string {
  return zonedDateTime(date, '23:59:59.999');
}

function zonedDateTime(date: string, time: string): string {
  const wallClock = Date.parse(`${date}T${time}Z`);
  return new Date(wallClock - offsetMs(wallClock)).toISOString();
}

function offsetMs(instant: number): number {
  const name = offsetFormat
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? '');
  if (!match) return 0;

  const [, sign, hours, minutes] = match;
  const total = Number(hours) * MINUTES_PER_HOUR + Number(minutes);
  return (sign === '-' ? -total : total) * MS_PER_MINUTE;
}
