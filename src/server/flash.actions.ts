'use server';

import { clearFlash } from '@/server/flash';

export async function dismissFlashAction(): Promise<void> {
  await clearFlash();
}
