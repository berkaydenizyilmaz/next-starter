import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { ROUTE } from '@/lib/constants/route.constants';

export const metadata: Metadata = {
  title: 'Şifremi unuttum',
};

export default function ForgotPasswordPage(): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Şifremi unuttum</h1>
      <p className="text-sm text-muted-foreground">
        Hesabının e-posta adresini yaz, şifreni sıfırlaman için bir bağlantı
        gönderelim.
      </p>
      <ForgotPasswordForm />
      <Link
        href={ROUTE.LOGIN}
        className="text-sm text-foreground underline underline-offset-4"
      >
        Girişe dön
      </Link>
    </>
  );
}
