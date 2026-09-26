import type { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/features/auth/auth.proxy';
import { REQUEST_ID_HEADER, resolveRequestId } from '@/server/request-id';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const requestId = resolveRequestId(request.headers);

  const headers = new Headers(request.headers);
  headers.set(REQUEST_ID_HEADER, requestId);

  const response = await authenticate({ request, headers });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
