import type { Metadata } from 'next';
import { type ReactNode, Suspense } from 'react';
import { resetToken } from '@/features/auth/auth.util';
import { ResetLinkAlert } from '@/features/auth/components/reset-link-alert';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

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
      <ResetLinkAlert message="Bağlantı geçersiz. Şifre sıfırlama e-postandaki bağlantıyı kullan ya da yeni bir bağlantı iste." />
    );
  }

  return <ResetPasswordForm token={token} />;
}
