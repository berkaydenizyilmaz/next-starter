import 'server-only';
import { createEnv } from '@t3-oss/env-nextjs';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_URL: z.url(),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(1).default(1),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
});
