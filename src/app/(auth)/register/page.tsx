import type { Metadata } from 'next';
import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { REDIRECT_PARAM } from '@/features/auth/auth.constants';
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
  const redirectTo = (await searchParams)[REDIRECT_PARAM];
  const next = typeof redirectTo === 'string' ? redirectTo : undefined;

  return (
    <>
      <RegisterForm redirectTo={next} />
      <p className="text-sm text-muted-foreground">
        Zaten hesabın var mı?{' '}
        <Link
          href={{
            pathname: ROUTE.LOGIN,
            query: next ? { [REDIRECT_PARAM]: next } : {},
          }}
          className="text-foreground underline underline-offset-4"
        >
          Giriş yap
        </Link>
      </p>
    </>
  );
}
