'use client';

import type { ReactNode } from 'react';
import { ErrorFallback } from '@/components/error-fallback';

export default function SegmentError({
  retry,
}: {
  retry: () => void;
}): ReactNode {
  return <ErrorFallback retry={retry} />;
}
