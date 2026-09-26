import 'server-only';
import { headers } from 'next/headers';
import pino, { type Logger } from 'pino';
import { env } from '@/server/env';
import {
  type IncomingHeaders,
  REQUEST_ID_HEADER,
} from '@/server/request-context';

export const logger: Logger = pino({
  level: env.LOG_LEVEL,
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty', options: { singleLine: true } },
  }),
});

export async function requestLogger(
  incoming?: IncomingHeaders,
): Promise<Logger> {
  const requestId = (incoming ?? (await headers())).get(REQUEST_ID_HEADER);
  return requestId ? logger.child({ requestId }) : logger;
}
