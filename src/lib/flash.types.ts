export type FlashKind = 'success' | 'info';

export interface Flash {
  id: string;
  kind: FlashKind;
  message: string;
}
