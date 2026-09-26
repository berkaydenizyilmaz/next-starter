'use client';

import { type ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { dismissFlashAction } from '@/features/flash/flash.actions';
import type { Flash } from '@/lib/flash.types';

export function FlashToast({ flash }: { flash: Flash }): ReactNode {
  useEffect(() => {
    toast[flash.kind](flash.message, { id: flash.id });
    void dismissFlashAction();
  }, [flash]);

  return null;
}
