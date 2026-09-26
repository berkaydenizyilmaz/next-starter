'use server';

import { clearFlash } from '@/server/flash/flash.cookie';

export async function dismissFlashAction(): Promise<void> {
  await clearFlash();
}
