import type { Metadata } from 'next';
import { type ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { AuditLogSection } from '@/features/audit-log/components/audit-log-section';

export const metadata: Metadata = {
  title: 'Denetim kayıtları',
};

export default function AuditLogsPage({
  searchParams,
}: PageProps<'/admin/audit-logs'>): ReactNode {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Denetim kayıtları</h1>
      <Suspense fallback={<Spinner />}>
        <AuditLogPage searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function AuditLogPage({
  searchParams,
}: Pick<PageProps<'/admin/audit-logs'>, 'searchParams'>): Promise<ReactNode> {
  const { page } = await searchParams;
  const parsed = Number(page);

  return (
    <AuditLogSection
      page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1}
    />
  );
}
