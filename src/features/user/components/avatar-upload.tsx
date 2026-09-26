'use client';

import { type ChangeEvent, type ReactNode, useRef } from 'react';
import { FormAlert } from '@/components/form/form-alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useFileUpload } from '@/features/file/use-file-upload';
import { updateMyAvatarAction } from '@/features/user/user.actions';
import {
  USER_AVATAR_CONTENT_TYPES,
  USER_FILE_PURPOSE,
} from '@/features/user/user.constants';

export function AvatarUpload(): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, retry, isPending, error, canRetry } = useFileUpload({
    purpose: USER_FILE_PURPOSE.USER_AVATAR,
    onUploaded: (file) => updateMyAvatarAction({ fileId: file.id }),
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) upload(file);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={USER_AVATAR_CONTENT_TYPES.join(',')}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending && <Spinner />}
        Fotoğraf yükle
      </Button>
      <FormAlert message={error ?? undefined} />
      {canRetry && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={retry}
        >
          Tekrar dene
        </Button>
      )}
    </div>
  );
}
