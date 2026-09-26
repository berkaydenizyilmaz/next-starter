import 'server-only';
import type { z } from 'zod';
import { ApiError, isTransportError } from '@/lib/api.error';
import { COMMON_ERROR } from '@/lib/constants/error.constants';
import { HTTP_STATUS } from '@/lib/constants/http.constants';
import {
  apiErrorMessage,
  type ErrorMessages,
  errorMessage,
} from '@/lib/messages/error.messages';
import type { ActionResult } from '@/lib/types/action.types';

interface ServerActionDefinition<TSchema extends z.ZodType> {
  schema: TSchema;
  messages?: ErrorMessages;
}

type ServerAction<TInput, TData> = (
  input: TInput,
) => Promise<ActionResult<TData>>;

export function serverAction<TSchema extends z.ZodType, TData = undefined>(
  { schema, messages = {} }: ServerActionDefinition<TSchema>,
  handler: (input: z.output<TSchema>) => Promise<TData>,
): ServerAction<z.input<TSchema>, TData> {
  return async (input) => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: COMMON_ERROR.VALIDATION_FAILED,
        message: errorMessage(COMMON_ERROR.VALIDATION_FAILED, messages),
        retryable: false,
      };
    }

    try {
      return { ok: true, data: await handler(parsed.data) };
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;

      return {
        ok: false,
        code: error.code,
        message: apiErrorMessage(error, messages),
        retryable:
          error.status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
          isTransportError(error),
      };
    }
  };
}
