import { type NextRequest, NextResponse } from 'next/server';
import { REQUEST_ID_HEADER, resolveRequestId } from '@/server/request-id';

export function proxy(request: NextRequest): NextResponse {
  const requestId = resolveRequestId(request.headers);

  const headers = new Headers(request.headers);
  headers.set(REQUEST_ID_HEADER, requestId);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
