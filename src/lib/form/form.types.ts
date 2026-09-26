export type FormValue = string | string[];

export interface FormState<TField extends string, TData = undefined> {
  status: 'idle' | 'success' | 'error';
  values: Partial<Record<TField, FormValue>>;
  fieldErrors: Partial<Record<TField, string>>;
  formError?: string;
  data?: TData;
}

export function idleFormState<
  TField extends string,
  TData = undefined,
>(): FormState<TField, TData> {
  return { status: 'idle', values: {}, fieldErrors: {} };
}
