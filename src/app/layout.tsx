import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import type { ReactNode } from 'react';
import { THEME_SCRIPT } from '@/components/theme/theme.script';
import { Toaster } from '@/components/ui/sonner';
import { APP_NAME } from '@/lib/constants/app.constants';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <html
      lang="tr"
      className={cn('font-sans', geist.variable)}
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
