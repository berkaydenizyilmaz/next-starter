export interface FormState<TField extends string> {
  status: 'idle' | 'success' | 'error';
  values: Partial<Record<TField, string>>;
  fieldErrors: Partial<Record<TField, string>>;
  formError?: string;
}

export function idleFormState<TField extends string>(): FormState<TField> {
  return { status: 'idle', values: {}, fieldErrors: {} };
}
