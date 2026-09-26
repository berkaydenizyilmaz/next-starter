import type { ReactNode } from 'react';
import { getMe } from '@/features/user/user.data';
import { roleLabel } from '@/lib/messages/role.messages';
import { formatDateTime } from '@/lib/utils/date.util';

export async function ProfileSection(): Promise<ReactNode> {
  const me = await getMe();

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-lg border px-4 py-3 text-sm">
      <dt className="text-muted-foreground">E-posta</dt>
      <dd className="truncate">{me.email}</dd>
      <dt className="text-muted-foreground">Rol</dt>
      <dd>{roleLabel(me.role)}</dd>
      <dt className="text-muted-foreground">Üyelik</dt>
      <dd>
        <time dateTime={me.createdAt}>{formatDateTime(me.createdAt)}</time>
      </dd>
      <dt className="text-muted-foreground">Son giriş</dt>
      <dd>
        {me.lastLoginAt ? (
          <time dateTime={me.lastLoginAt}>
            {formatDateTime(me.lastLoginAt)}
          </time>
        ) : (
          '—'
        )}
      </dd>
    </dl>
  );
}
