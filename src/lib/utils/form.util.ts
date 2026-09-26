import type { FormState } from '@/lib/types/form.types';

export function idleFormState<
  TField extends string,
  TData = undefined,
>(): FormState<TField, TData> {
  return { status: 'idle', values: {}, fieldErrors: {} };
}
