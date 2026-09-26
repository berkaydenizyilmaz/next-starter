import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ROUTE } from '@/lib/constants/route.constants';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı',
};

export default function NotFound(): ReactNode {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="text-muted-foreground">
        Aradığın sayfa yok ya da taşınmış olabilir.
      </p>
      <Link
        href={ROUTE.HOME}
        className={buttonVariants({ className: 'self-start' })}
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
