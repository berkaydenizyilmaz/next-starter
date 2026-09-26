'use client';

import { type ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import type { Flash } from '@/lib/flash.types';

export function FlashToast({
  flash,
  onShown,
}: {
  flash: Flash;
  onShown: () => Promise<void>;
}): ReactNode {
  useEffect(() => {
    toast[flash.kind](flash.message, { id: flash.id });
    void onShown();
  }, [flash, onShown]);

  return null;
}
