import type { Metadata } from 'next';
import { type ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { SessionList } from '@/features/auth/components/session-list';

export const metadata: Metadata = {
  title: 'Oturumlar',
};

export default function SessionsPage(): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Oturumlar</h1>
      <Suspense fallback={<Spinner />}>
        <SessionList />
      </Suspense>
    </>
  );
}
