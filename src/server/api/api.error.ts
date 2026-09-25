import 'server-only';
import type { ValidationIssue } from '@/lib/api';
import { zErrorResponse } from '@/lib/api/zod.gen';
import { COMMON_ERROR } from '@/lib/errors/error.constants';

const HTTP_BAD_GATEWAY = 502;
const HTTP_GATEWAY_TIMEOUT = 504;
const TIMEOUT_ERROR_NAME = 'TimeoutError';

const TRANSPORT_ERROR_CODES: ReadonlySet<string> = new Set([
  COMMON_ERROR.API_UNREACHABLE,
  COMMON_ERROR.API_TIMEOUT,
  COMMON_ERROR.API_INVALID_RESPONSE,
]);

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fieldErrors: ValidationIssue[];
  readonly retryAfterSeconds?: number;

  constructor({
    code,
    status,
    message,
    fieldErrors = [],
    retryAfterSeconds,
    cause,
  }: {
    code: string;
    status: number;
    message: string;
    fieldErrors?: ValidationIssue[];
    retryAfterSeconds?: number;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function toApiError({
  error,
  response,
}: {
  error: unknown;
  response: Response | undefined;
}): ApiError {
  if (!response) {
    return error instanceof Error && error.name === TIMEOUT_ERROR_NAME
      ? new ApiError({
          code: COMMON_ERROR.API_TIMEOUT,
          status: HTTP_GATEWAY_TIMEOUT,
          message: 'API request timed out',
          cause: error,
        })
      : new ApiError({
          code: COMMON_ERROR.API_UNREACHABLE,
          status: HTTP_BAD_GATEWAY,
          message: 'API is unreachable',
          cause: error,
        });
  }

  const body = zErrorResponse.safeParse(error);
  if (!body.success) {
    return new ApiError({
      code: COMMON_ERROR.API_INVALID_RESPONSE,
      status: HTTP_BAD_GATEWAY,
      message: `API answered ${response.status} with an unexpected body`,
      cause: error instanceof Error ? error : undefined,
    });
  }

  return new ApiError({
    code: body.data.code,
    status: response.status,
    message: body.data.message,
    fieldErrors: body.data.errors,
    retryAfterSeconds: retryAfterSeconds(response),
  });
}

export function isTransportError(error: ApiError): boolean {
  return TRANSPORT_ERROR_CODES.has(error.code);
}

function retryAfterSeconds(response: Response): number | undefined {
  const seconds = Number(response.headers.get('Retry-After'));
  return Number.isInteger(seconds) && seconds > 0 ? seconds : undefined;
}
