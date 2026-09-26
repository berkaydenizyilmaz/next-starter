'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { COMMON_ERROR } from '@/lib/constants/error.constants';
import { errorMessage } from '@/lib/messages/error.messages';

export function ErrorFallback({ retry }: { retry: () => void }): ReactNode {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Bir hata oluştu</h1>
      <p className="text-muted-foreground">
        {errorMessage(COMMON_ERROR.INTERNAL_ERROR)}
      </p>
      <Button type="button" className="self-start" onClick={() => retry()}>
        Tekrar dene
      </Button>
    </main>
  );
}
