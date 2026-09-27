import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type * as api from '@/lib/api';
import { AUDIT_OUTCOME } from '@/lib/constants/audit.constants';
import {
  auditEventLabel,
  auditOutcomeLabel,
} from '@/lib/messages/audit.messages';
import { formatDateTime } from '@/lib/utils/date.util';

export function AuditLogTable({
  entries,
}: {
  entries: api.AuditLog[];
}): ReactNode {
  if (entries.length === 0) {
    return <p className="text-muted-foreground">Kayıt bulunamadı.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Zaman</TableHead>
          <TableHead>Olay</TableHead>
          <TableHead>Sonuç</TableHead>
          <TableHead>Aktör</TableHead>
          <TableHead>Konu</TableHead>
          <TableHead>Hedef</TableHead>
          <TableHead>IP</TableHead>
          <TableHead>Ayrıntı</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id} className="align-top">
            <TableCell>
              <time dateTime={entry.createdAt}>
                {formatDateTime(entry.createdAt)}
              </time>
            </TableCell>
            <TableCell>{auditEventLabel(entry.event)}</TableCell>
            <TableCell
              className={
                entry.outcome === AUDIT_OUTCOME.FAILURE
                  ? 'text-destructive'
                  : undefined
              }
            >
              {auditOutcomeLabel(entry.outcome)}
            </TableCell>
            <TableCell>
              <IdText id={entry.actorId} />
            </TableCell>
            <TableCell>
              <IdText id={entry.subjectId} />
            </TableCell>
            <TableCell>
              {entry.targetType
                ? [entry.targetType, entry.targetId].filter(Boolean).join(' · ')
                : '—'}
            </TableCell>
            <TableCell>{entry.ip ?? '—'}</TableCell>
            <TableCell>
              <details>
                <summary className="cursor-pointer text-muted-foreground">
                  Göster
                </summary>
                <pre className="mt-2 max-w-xs overflow-x-auto text-xs whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      requestId: entry.requestId,
                      userAgent: entry.userAgent,
                      metadata: entry.metadata,
                    },
                    null,
                    2,
                  )}
                </pre>
              </details>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function IdText({ id }: { id: string | null }): ReactNode {
  if (!id) return '—';

  return (
    <span className="font-mono text-xs" title={id}>
      {id.slice(0, 8)}
    </span>
  );
}
