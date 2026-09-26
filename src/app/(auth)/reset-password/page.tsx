import type { Metadata } from 'next';
import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { FormAlert } from '@/components/form/form-alert';
import { resetToken } from '@/features/auth/auth.util';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { ROUTE } from '@/lib/constants/route.constants';

export const metadata: Metadata = {
  title: 'Yeni şifre belirle',
};

export default function ResetPasswordPage({
  searchParams,
}: PageProps<'/reset-password'>): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Yeni şifre belirle</h1>
      <Suspense fallback={null}>
        <ResetPasswordSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ResetPasswordSection({
  searchParams,
}: Pick<PageProps<'/reset-password'>, 'searchParams'>): Promise<ReactNode> {
  const token = resetToken(await searchParams);

  if (!token) {
    return (
      <>
        <FormAlert message="Bağlantı geçersiz. Şifre sıfırlama e-postandaki bağlantıyı kullan ya da yeni bir bağlantı iste." />
        <Link
          href={ROUTE.FORGOT_PASSWORD}
          className="text-sm text-foreground underline underline-offset-4"
        >
          Yeni bağlantı iste
        </Link>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}
