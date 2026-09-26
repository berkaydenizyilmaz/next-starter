import type { NextRequest } from 'next/server';
import { getAccessTokenOrNull } from '@/features/auth/auth.data';
import { forwardToApi } from '@/server/api.client';

export async function GET(request: NextRequest): Promise<Response> {
  return forwardToApi({ request, accessToken: await getAccessTokenOrNull() });
}
