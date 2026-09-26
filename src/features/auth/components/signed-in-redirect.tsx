import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCurrentUserOrNull } from '@/features/auth/current-user';
import { ROUTE } from '@/lib/constants/route.constants';

export async function SignedInRedirect(): Promise<ReactNode> {
  if (await getCurrentUserOrNull()) redirect(ROUTE.HOME);
  return null;
}
