import 'server-only';
import { createEnv } from '@t3-oss/env-nextjs';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_URL: z.url(),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
});
