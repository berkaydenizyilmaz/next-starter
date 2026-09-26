import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROUTE } from '@/lib/constants/route.constants';

const ACCOUNT_LINKS = [
  { href: ROUTE.SESSIONS, label: 'Oturumlar' },
  { href: ROUTE.SECURITY_LOG, label: 'Güvenlik günlüğü' },
] as const;

export default function AccountLayout({
  children,
}: LayoutProps<'/account'>): ReactNode {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <nav className="flex gap-4 border-b pb-3">
        {ACCOUNT_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
