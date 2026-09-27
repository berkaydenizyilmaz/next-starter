import { z } from 'zod';
import { formErrorMap } from '@/lib/messages/form.messages';

export type SearchParams = Record<string, string | string[] | undefined>;

type SearchValue = string | number | undefined;

interface ParsedSearchParams<TShape extends z.ZodRawShape> {
  values: Partial<z.output<z.ZodObject<TShape>>>;
  input: Partial<Record<Extract<keyof TShape, string>, string>>;
  fieldErrors: Partial<Record<Extract<keyof TShape, string>, string>>;
}

export function parseSearchParams<TShape extends z.ZodRawShape>(
  schema: z.ZodObject<TShape>,
  searchParams: SearchParams,
): ParsedSearchParams<TShape> {
  const values: Record<string, unknown> = {};
  const input: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const [field, fieldSchema] of Object.entries(schema.shape)) {
    const raw = searchParams[field];
    if (raw === undefined || raw === '') continue;
    if (typeof raw === 'string') input[field] = raw;

    const parsed = z.safeParse(fieldSchema, raw, { error: formErrorMap });
    if (parsed.success) {
      values[field] = parsed.data;
    } else {
      fieldErrors[field] = parsed.error.issues[0]?.message ?? '';
    }
  }

  return {
    values: values as ParsedSearchParams<TShape>['values'],
    input,
    fieldErrors,
  };
}

export function singleSearchParam(
  searchParams: SearchParams,
  name: string,
): string | undefined {
  const value = searchParams[name];
  return typeof value === 'string' && value !== '' ? value : undefined;
}

export function toSearchQuery(
  values: Readonly<Record<string, SearchValue>>,
): Record<string, string> {
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) query[key] = String(value);
  }

  return query;
}
