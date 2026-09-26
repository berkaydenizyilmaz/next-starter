import type { ReactNode } from 'react';
import { FlashToast } from '@/components/flash-toast';
import { dismissFlashAction } from '@/server/flash/flash.actions';
import { readFlash } from '@/server/flash/flash.cookie';

export async function FlashMessage(): Promise<ReactNode> {
  const flash = await readFlash();
  return flash ? (
    <FlashToast flash={flash} onShown={dismissFlashAction} />
  ) : null;
}
