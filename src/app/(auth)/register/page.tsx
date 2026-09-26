import type { Metadata } from 'next';
import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { redirectQuery, redirectTarget } from '@/features/auth/auth.util';
import { SignedInRedirect } from '@/features/auth/components/signed-in-redirect';
import { RegisterForm } from '@/features/auth/components/register-form';
import { ROUTE } from '@/lib/constants/route.constants';

export const metadata: Metadata = {
  title: 'Kayıt ol',
};

export default function RegisterPage({
  searchParams,
}: PageProps<'/register'>): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Kayıt ol</h1>
      <Suspense fallback={null}>
        <RegisterSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function RegisterSection({
  searchParams,
}: Pick<PageProps<'/register'>, 'searchParams'>): Promise<ReactNode> {
  const target = redirectTarget(await searchParams);

  return (
    <>
      <SignedInRedirect />
      <RegisterForm redirectTo={target} />
      <p className="text-sm text-muted-foreground">
        Zaten hesabın var mı?{' '}
        <Link
          href={{
            pathname: ROUTE.LOGIN,
            query: redirectQuery(target),
          }}
          className="text-foreground underline underline-offset-4"
        >
          Giriş yap
        </Link>
      </p>
    </>
  );
}
