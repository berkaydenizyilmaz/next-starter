import type * as api from '@/lib/api';

export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const satisfies Record<string, api.Me['role']>;
