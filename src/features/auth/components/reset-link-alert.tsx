import Link from 'next/link';
import type { ReactNode } from 'react';
import { FormAlert } from '@/components/form/form-alert';
import { ROUTE } from '@/lib/constants/route.constants';

export function ResetLinkAlert({ message }: { message: string }): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <FormAlert message={message} />
      <Link
        href={ROUTE.FORGOT_PASSWORD}
        className="text-sm text-foreground underline underline-offset-4"
      >
        Yeni bağlantı iste
      </Link>
    </div>
  );
}
