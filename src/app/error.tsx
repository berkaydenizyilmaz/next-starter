'use client';

import type { ReactNode } from 'react';

export default function SegmentError({
  retry,
}: {
  retry: () => void;
}): ReactNode {
  return (
    <main>
      <h1>Bir hata oluştu</h1>
      <p>Beklenmeyen bir sorun çıktı. Lütfen tekrar dene.</p>
      <button type="button" onClick={() => retry()}>
        Tekrar dene
      </button>
    </main>
  );
}
