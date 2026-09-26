export type FormValue = string | string[];

export interface FormState<TField extends string, TData = undefined> {
  status: 'idle' | 'success' | 'error';
  values: Partial<Record<TField, FormValue>>;
  fieldErrors: Partial<Record<TField, string>>;
  formError?: string;
  data?: TData;
}
