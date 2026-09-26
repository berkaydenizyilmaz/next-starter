import type { Metadata } from 'next';
import { type ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { SecurityLogSection } from '@/features/user/components/security-log-section';

export const metadata: Metadata = {
  title: 'Güvenlik günlüğü',
};

export default function SecurityLogPage(): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Güvenlik günlüğü</h1>
      <Suspense fallback={<Spinner />}>
        <SecurityLogSection />
      </Suspense>
    </>
  );
}
