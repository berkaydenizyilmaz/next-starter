import type { Metadata } from 'next';
import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { redirectQuery, redirectTarget } from '@/features/auth/auth.util';
import { LoginForm } from '@/features/auth/components/login-form';
import { ROUTE } from '@/lib/constants/route.constants';

export const metadata: Metadata = {
  title: 'Giriş yap',
};

export default function LoginPage({
  searchParams,
}: PageProps<'/login'>): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Giriş yap</h1>
      <Suspense fallback={null}>
        <LoginSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function LoginSection({
  searchParams,
}: Pick<PageProps<'/login'>, 'searchParams'>): Promise<ReactNode> {
  const target = redirectTarget(await searchParams);

  return (
    <>
      <LoginForm redirectTo={target} />
      <p className="text-sm text-muted-foreground">
        Hesabın yok mu?{' '}
        <Link
          href={{
            pathname: ROUTE.REGISTER,
            query: redirectQuery(target),
          }}
          className="text-foreground underline underline-offset-4"
        >
          Kayıt ol
        </Link>
      </p>
    </>
  );
}
