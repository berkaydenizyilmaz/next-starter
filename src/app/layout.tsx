import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { APP_NAME } from '@/lib/app.constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
