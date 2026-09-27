import 'server-only';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { FLASH_KINDS } from '@/lib/constants/flash.constants';
import { MS_PER_MINUTE, MS_PER_SECOND } from '@/lib/constants/time.constants';
import type { Flash } from '@/lib/types/flash.types';
import { HOST_COOKIE_OPTIONS } from '@/server/host-cookie';

const FLASH_COOKIE_OPTIONS = {
  ...HOST_COOKIE_OPTIONS,
  name: '__Host-flash',
} as const;

const FLASH_MAX_AGE_SECONDS = MS_PER_MINUTE / MS_PER_SECOND;

const flashSchema = z.object({
  id: z.uuid(),
  kind: z.enum(FLASH_KINDS),
  message: z.string().min(1),
}) satisfies z.ZodType<Flash>;

export async function setFlash(flash: Omit<Flash, 'id'>): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    ...FLASH_COOKIE_OPTIONS,
    value: JSON.stringify({ ...flash, id: crypto.randomUUID() }),
    maxAge: FLASH_MAX_AGE_SECONDS,
  });
}

export async function readFlash(): Promise<Flash | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(FLASH_COOKIE_OPTIONS.name)?.value;
  if (!value) return null;

  const parsed = flashSchema.safeParse(parseJson(value));
  return parsed.success ? parsed.data : null;
}

export async function clearFlash(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({ ...FLASH_COOKIE_OPTIONS, value: '', maxAge: 0 });
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
