'use client';

import type { ReactNode } from 'react';
import { APP_NAME } from '@/lib/app.constants';

export default function GlobalError({
  retry,
}: {
  retry: () => void;
}): ReactNode {
  return (
    <html lang="tr">
      <body>
        <title>{APP_NAME}</title>
        <main>
          <h1>Bir hata oluştu</h1>
          <p>Beklenmeyen bir sorun çıktı. Lütfen tekrar dene.</p>
          <button type="button" onClick={() => retry()}>
            Tekrar dene
          </button>
        </main>
      </body>
    </html>
  );
}
