'use client';

import { startTransition, useState, useTransition } from 'react';
import {
  completeUploadAction,
  createUploadAction,
} from '@/features/file/file.actions';
import { FILE_UPLOAD_MESSAGES } from '@/features/file/file.messages';
import { putToStorage } from '@/features/file/file.upload';
import type * as api from '@/lib/api';
import type { ActionResult } from '@/lib/types/action.types';

interface FileUploadOptions {
  purpose: string;
  onUploaded: (file: api.StoredFile) => Promise<ActionResult<unknown>>;
}

interface FileUpload {
  upload: (file: File) => void;
  retry: () => void;
  isPending: boolean;
  error: string | null;
  canRetry: boolean;
}

export function useFileUpload({
  purpose,
  onUploaded,
}: FileUploadOptions): FileUpload {
  const [isPending, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [retryFileId, setRetryFileId] = useState<string | null>(null);

  function settle(message: string | null, fileId: string | null): void {
    startTransition(() => {
      setError(message);
      setRetryFileId(fileId);
    });
  }

  async function finish(fileId: string): Promise<void> {
    const completed = await completeUploadAction({ id: fileId });
    if (!completed.ok) {
      settle(completed.message, completed.retryable ? fileId : null);
      return;
    }

    const attached = await onUploaded(completed.data);
    if (!attached.ok) {
      settle(attached.message, attached.retryable ? fileId : null);
      return;
    }

    settle(null, null);
  }

  function upload(file: File): void {
    startUpload(async () => {
      setError(null);
      setRetryFileId(null);

      const ticket = await createUploadAction({
        purpose,
        contentType: file.type,
        size: file.size,
        fileName: file.name || undefined,
      });
      if (!ticket.ok) {
        settle(ticket.message, null);
        return;
      }

      if (!(await putToStorage(ticket.data, file))) {
        settle(FILE_UPLOAD_MESSAGES.STORAGE_FAILED, null);
        return;
      }

      await finish(ticket.data.fileId);
    });
  }

  function retry(): void {
    if (!retryFileId) return;
    const fileId = retryFileId;

    startUpload(async () => {
      setError(null);
      await finish(fileId);
    });
  }

  return { upload, retry, isPending, error, canRetry: retryFileId !== null };
}
