import type { ReactNode } from 'react';
import { FlashToast } from '@/components/flash-toast';
import { readFlash } from '@/server/flash';
import { dismissFlashAction } from '@/server/flash.actions';

export async function FlashMessage(): Promise<ReactNode> {
  const flash = await readFlash();
  return flash ? (
    <FlashToast flash={flash} onShown={dismissFlashAction} />
  ) : null;
}
