'use client';

import { cn } from 'cn';
import type { ReactNode } from 'react';
import { fontSans } from '@/app/fonts';
import { ErrorFallback } from '@/components/error-fallback';
import { DARK_THEME_CLASS, THEME } from '@/components/theme/theme.constants';
import { useTheme } from '@/components/theme/use-theme';
import { APP_LOCALE, APP_NAME } from '@/lib/constants/app.constants';
import './globals.css';

export default function GlobalError({
  retry,
}: {
  retry: () => void;
}): ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <html
      lang={APP_LOCALE}
      className={cn(
        'font-sans',
        fontSans.variable,
        resolvedTheme === THEME.DARK && DARK_THEME_CLASS,
      )}
      suppressHydrationWarning
    >
      <body>
        <title>{APP_NAME}</title>
        <ErrorFallback retry={retry} />
      </body>
    </html>
  );
}
