import { cn } from 'cn';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontSans } from '@/app/fonts';
import { THEME_SCRIPT } from '@/components/theme/theme.script';
import { Toaster } from '@/components/ui/sonner';
import { APP_LOCALE, APP_NAME } from '@/lib/constants/app.constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <html
      lang={APP_LOCALE}
      className={cn('font-sans', fontSans.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
