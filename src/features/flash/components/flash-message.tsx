import type { ReactNode } from 'react';
import { FlashToast } from '@/features/flash/components/flash-toast';
import { readFlash } from '@/server/flash';

export async function FlashMessage(): Promise<ReactNode> {
  const flash = await readFlash();
  return flash ? <FlashToast flash={flash} /> : null;
}
