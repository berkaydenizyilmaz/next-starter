import type { Instrumentation } from 'next';

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await import('@/server/env');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getLogger } = await import('@/server/logger');
    const { REQUEST_ID_HEADER } = await import('@/server/request-context');
    const requestId = request.headers[REQUEST_ID_HEADER];

    getLogger().error(
      {
        err: error,
        digest: digestOf(error),
        requestId: typeof requestId === 'string' ? requestId : undefined,
        method: request.method,
        path: request.path,
        routeType: context.routeType,
        routePath: context.routePath,
      },
      'Unhandled server error',
    );
  }
};

function digestOf(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'digest' in error
    ? String(error.digest)
    : undefined;
}
