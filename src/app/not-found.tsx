import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı',
};

export default function NotFound(): ReactNode {
  return (
    <main>
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığın sayfa yok ya da taşınmış olabilir.</p>
      <Link href="/">Ana sayfaya dön</Link>
    </main>
  );
}
