import type { ReactNode } from 'react';
import { listSessions } from '@/features/auth/auth.data';
import { RevokeAllSessionsButton } from '@/features/auth/components/revoke-all-sessions-button';
import { RevokeSessionButton } from '@/features/auth/components/revoke-session-button';
import { formatDateTime } from '@/lib/utils/date.util';

export async function SessionList(): Promise<ReactNode> {
  const sessions = await listSessions();

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y rounded-lg border">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-start justify-between gap-4 px-4 py-3"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span
                className="truncate font-medium"
                title={session.userAgent ?? undefined}
              >
                {session.device ?? session.userAgent ?? 'Bilinmeyen cihaz'}
              </span>
              <span className="text-sm text-muted-foreground">
                Son kullanım:{' '}
                <time dateTime={session.lastUsedAt}>
                  {formatDateTime(session.lastUsedAt)}
                </time>
              </span>
              <span className="text-xs text-muted-foreground">
                {session.ip && `${session.ip} · `}Açılış:{' '}
                <time dateTime={session.createdAt}>
                  {formatDateTime(session.createdAt)}
                </time>
              </span>
            </div>
            {session.isCurrent ? (
              <span className="shrink-0 text-sm text-muted-foreground">
                Bu cihaz
              </span>
            ) : (
              <RevokeSessionButton id={session.id} />
            )}
          </li>
        ))}
      </ul>
      <RevokeAllSessionsButton />
    </div>
  );
}
