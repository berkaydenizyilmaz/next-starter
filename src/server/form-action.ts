import 'server-only';
import type { z } from 'zod';
import { type ErrorMessages, errorMessage } from '@/lib/errors/error.messages';
import { formErrorMap, ISSUE_CODE_MESSAGES } from '@/lib/form/form.messages';
import type { FormState } from '@/lib/form/form.types';
import { ApiError } from '@/server/api/api.error';

type FieldName<TSchema extends z.ZodObject> = Extract<
  keyof z.input<TSchema>,
  string
>;

interface FormActionDefinition<TSchema extends z.ZodObject> {
  schema: TSchema;
  secretFields: readonly FieldName<TSchema>[];
  messages?: ErrorMessages;
}

type FormAction<TField extends string> = (
  state: FormState<TField>,
  formData: FormData,
) => Promise<FormState<TField>>;

export function formAction<TSchema extends z.ZodObject>(
  { schema, secretFields, messages = {} }: FormActionDefinition<TSchema>,
  handler: (data: z.output<TSchema>) => Promise<void>,
): FormAction<FieldName<TSchema>> {
  const fields = Object.keys(schema.shape) as FieldName<TSchema>[];

  return async (_state, formData) => {
    const input = readFields(formData, fields);
    const values = withoutSecrets(input, secretFields);

    const parsed = schema.safeParse(input, { error: formErrorMap });
    if (!parsed.success) {
      return {
        status: 'error',
        values,
        fieldErrors: fieldErrorsOf(parsed.error.issues, fields),
      };
    }

    try {
      await handler(parsed.data);
    } catch (error) {
      if (error instanceof ApiError) {
        return apiErrorState({ error, values, fields, messages });
      }
      throw error;
    }

    return { status: 'success', values: {}, fieldErrors: {} };
  };
}

function readFields<TField extends string>(
  formData: FormData,
  fields: readonly TField[],
): Partial<Record<TField, string>> {
  const input: Partial<Record<TField, string>> = {};

  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === 'string' && value !== '') input[field] = value;
  }

  return input;
}

function withoutSecrets<TField extends string>(
  input: Partial<Record<TField, string>>,
  secretFields: readonly TField[],
): Partial<Record<TField, string>> {
  const values = { ...input };
  for (const field of secretFields) delete values[field];
  return values;
}

function fieldErrorsOf<TField extends string>(
  issues: readonly z.core.$ZodIssue[],
  fields: readonly TField[],
): Partial<Record<TField, string>> {
  const fieldErrors: Partial<Record<TField, string>> = {};

  for (const issue of issues) {
    const field = fields.find((name) => name === issue.path[0]);
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }

  return fieldErrors;
}

function apiErrorState<TField extends string>({
  error,
  values,
  fields,
  messages,
}: {
  error: ApiError;
  values: Partial<Record<TField, string>>;
  fields: readonly TField[];
  messages: ErrorMessages;
}): FormState<TField> {
  const fieldErrors: Partial<Record<TField, string>> = {};

  for (const issue of error.fieldErrors) {
    const field = fields.find((name) => name === issue.field);
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = errorMessage(issue.code, {
        ...ISSUE_CODE_MESSAGES,
        ...messages,
      });
    }
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    status: 'error',
    values,
    fieldErrors,
    formError: hasFieldErrors
      ? undefined
      : withRetryHint(errorMessage(error.code, messages), error),
  };
}

function withRetryHint(message: string, error: ApiError): string {
  return error.retryAfterSeconds
    ? `${message} ${error.retryAfterSeconds} saniye sonra tekrar deneyebilirsin.`
    : message;
}
