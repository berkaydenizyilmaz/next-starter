import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AUDIT_LOG_ROLES } from '@/features/audit-log/audit-log.constants';
import { getCurrentUser, hasRole } from '@/features/auth/auth.data';
import { SignOutButton } from '@/features/auth/components/sign-out-button';
import { APP_NAME } from '@/lib/constants/app.constants';
import { ROUTE } from '@/lib/constants/route.constants';

export default function AppLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <nav className="flex items-center gap-4">
          <Link href={ROUTE.HOME} className="font-semibold">
            {APP_NAME}
          </Link>
          <Link
            href={ROUTE.ACCOUNT}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Hesap
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Suspense fallback={null}>
            <AccountMenu />
          </Suspense>
        </div>
      </header>
      {children}
    </>
  );
}

async function AccountMenu(): Promise<ReactNode> {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center gap-2">
      {hasRole(user, AUDIT_LOG_ROLES) && (
        <Link
          href={ROUTE.ADMIN_AUDIT_LOGS}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Yönetim
        </Link>
      )}
      <span className="text-sm text-muted-foreground">{user.email}</span>
      <SignOutButton />
    </div>
  );
}
