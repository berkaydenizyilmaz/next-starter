import 'server-only';
import { headers } from 'next/headers';
import pino, { type Logger } from 'pino';
import { env } from '@/server/env';
import {
  type IncomingHeaders,
  REQUEST_ID_HEADER,
} from '@/server/request-context';

let rootLogger: Logger | undefined;

export function getLogger(): Logger {
  rootLogger ??= pino({
    level: env.LOG_LEVEL,
    ...(process.env.NODE_ENV === 'development' && {
      transport: { target: 'pino-pretty', options: { singleLine: true } },
    }),
  });
  return rootLogger;
}

export async function requestLogger(
  incoming?: IncomingHeaders,
): Promise<Logger> {
  const requestId = (incoming ?? (await headers())).get(REQUEST_ID_HEADER);
  const log = getLogger();
  return requestId ? log.child({ requestId }) : log;
}
