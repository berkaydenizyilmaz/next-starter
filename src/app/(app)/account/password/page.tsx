import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

export const metadata: Metadata = {
  title: 'Şifre',
};

export default function ChangePasswordPage(): ReactNode {
  return (
    <>
      <h1 className="text-2xl font-semibold">Şifreyi değiştir</h1>
      <div className="max-w-sm">
        <ChangePasswordForm />
      </div>
    </>
  );
}
