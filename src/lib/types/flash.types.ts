import type { FLASH_KINDS } from '@/lib/constants/flash.constants';

type FlashKind = (typeof FLASH_KINDS)[number];

export interface Flash {
  id: string;
  kind: FlashKind;
  message: string;
}
