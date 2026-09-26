import { type ReactNode, Suspense } from 'react';
import { SignedInRedirect } from '@/features/auth/components/signed-in-redirect';

export default function AuthLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-4 py-12">
      <Suspense fallback={null}>
        <SignedInRedirect />
      </Suspense>
      {children}
    </main>
  );
}
