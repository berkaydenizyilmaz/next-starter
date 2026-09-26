import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUpload } from '@/features/user/components/avatar-upload';
import { DeleteAccountDialog } from '@/features/user/components/delete-account-dialog';
import { RemoveAvatarButton } from '@/features/user/components/remove-avatar-button';
import { USER_AVATAR_VARIANT } from '@/features/user/user.constants';
import { getMe } from '@/features/user/user.data';
import { APP_LOCALE } from '@/lib/constants/app.constants';
import { roleLabel } from '@/lib/messages/role.messages';
import { formatDateTime } from '@/lib/utils/date.util';

export async function ProfileSection(): Promise<ReactNode> {
  const me = await getMe();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          {me.avatar && (
            <AvatarImage
              src={
                me.avatar.variants[USER_AVATAR_VARIANT] ??
                me.avatar.url ??
                undefined
              }
              alt=""
            />
          )}
          <AvatarFallback className="text-2xl">
            {me.email.charAt(0).toLocaleUpperCase(APP_LOCALE)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-1">
          <AvatarUpload />
          {me.avatar && <RemoveAvatarButton />}
        </div>
      </div>
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
      <section className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 px-4 py-3">
        <h2 className="font-medium">Hesabı sil</h2>
        <p className="text-sm text-muted-foreground">
          Hesabını silebilirsin; geri alma süresi içinde tekrar giriş yaparak
          geri açabilirsin.
        </p>
        <DeleteAccountDialog />
      </section>
    </div>
  );
}
