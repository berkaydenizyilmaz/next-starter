import 'server-only';
import { z } from 'zod';
import { ApiError } from '@/lib/api.error';
import type { FormState, FormValue } from '@/lib/form.types';
import {
  apiErrorMessage,
  type ErrorMessages,
  errorMessage,
} from '@/lib/messages/error.messages';
import {
  formErrorMap,
  ISSUE_CODE_MESSAGES,
} from '@/lib/messages/form.messages';

type FieldName<TSchema extends z.ZodObject> = Extract<
  keyof z.input<TSchema>,
  string
>;

type FormValues<TField extends string> = Partial<Record<TField, FormValue>>;

interface FormActionDefinition<TSchema extends z.ZodObject> {
  schema: TSchema;
  echoFields?: readonly FieldName<TSchema>[];
  messages?: ErrorMessages;
}

type FormAction<TField extends string, TData> = (
  state: FormState<TField, TData>,
  formData: FormData,
) => Promise<FormState<TField, TData>>;

export function formAction<TSchema extends z.ZodObject, TData = undefined>(
  { schema, echoFields = [], messages = {} }: FormActionDefinition<TSchema>,
  handler: (data: z.output<TSchema>) => Promise<TData>,
): FormAction<FieldName<TSchema>, TData> {
  const fields = Object.keys(schema.shape) as FieldName<TSchema>[];
  const arrayFields = new Set(
    fields.filter((field) => isArraySchema(schema.shape[field])),
  );

  return async (_state, formData) => {
    const input = readFields({ formData, fields, arrayFields });
    const values = echoedValues(input, echoFields);

    const parsed = schema.safeParse(input, { error: formErrorMap });
    if (!parsed.success) {
      return {
        status: 'error',
        values,
        fieldErrors: fieldErrorsOf(parsed.error.issues, fields),
      };
    }

    let data: TData;
    try {
      data = await handler(parsed.data);
    } catch (error) {
      if (error instanceof ApiError) {
        return apiErrorState({ error, values, fields, messages });
      }
      throw error;
    }

    return { status: 'success', values: {}, fieldErrors: {}, data };
  };
}

function isArraySchema(schema: unknown): boolean {
  let current = schema;
  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodNullable ||
    current instanceof z.ZodDefault
  ) {
    current = current.unwrap();
  }
  return current instanceof z.ZodArray;
}

function readFields<TField extends string>({
  formData,
  fields,
  arrayFields,
}: {
  formData: FormData;
  fields: readonly TField[];
  arrayFields: ReadonlySet<TField>;
}): FormValues<TField> {
  const input: FormValues<TField> = {};

  for (const field of fields) {
    if (arrayFields.has(field)) {
      input[field] = formData
        .getAll(field)
        .filter(
          (value): value is string => typeof value === 'string' && value !== '',
        );
      continue;
    }

    const value = formData.get(field);
    if (typeof value === 'string' && value !== '') input[field] = value;
  }

  return input;
}

function echoedValues<TField extends string>(
  input: FormValues<TField>,
  echoFields: readonly TField[],
): FormValues<TField> {
  const values: FormValues<TField> = {};

  for (const field of echoFields) {
    const value = input[field];
    if (value !== undefined) values[field] = value;
  }

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
  values: FormValues<TField>;
  fields: readonly TField[];
  messages: ErrorMessages;
}): FormState<TField, never> {
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
    formError: hasFieldErrors ? undefined : apiErrorMessage(error, messages),
  };
}
