import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'next-starter',
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
