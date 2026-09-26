export type ActionResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; code: string; message: string; retryable: boolean };
