import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';

type Href = LinkProps<string>['href'];

export function PaginationNav({
  page,
  pageCount,
  href,
}: {
  page: number;
  pageCount: number;
  href: (page: number) => Href;
}): ReactNode {
  if (pageCount <= 1) return null;

  const linkClass = buttonVariants({ variant: 'outline', size: 'sm' });

  return (
    <nav aria-label="Sayfalar" className="flex items-center gap-3">
      {page > 1 && (
        <Link href={href(page - 1)} className={linkClass}>
          Önceki
        </Link>
      )}
      <span className="text-sm text-muted-foreground">
        Sayfa {page} / {pageCount}
      </span>
      {page < pageCount && (
        <Link href={href(page + 1)} className={linkClass}>
          Sonraki
        </Link>
      )}
    </nav>
  );
}
