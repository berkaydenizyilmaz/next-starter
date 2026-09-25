import 'server-only';
import pino, { type Logger } from 'pino';
import { env } from '@/server/env';

export const logger: Logger = pino({
  level: env.LOG_LEVEL,
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty', options: { singleLine: true } },
  }),
});
