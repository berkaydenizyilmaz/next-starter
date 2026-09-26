import type { Metadata } from 'next';
import { type ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { ProfileSection } from '@/features/user/components/profile-section';

export const metadata: Metadata = {
  title: 'Profil',
};

export default function ProfilePage(): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Profil</h1>
      <Suspense fallback={<Spinner />}>
        <ProfileSection />
      </Suspense>
    </>
  );
}
