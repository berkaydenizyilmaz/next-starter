'use server';

import { completeUpload, createUpload } from '@/features/file/file.data';
import { FILE_ERROR_MESSAGES } from '@/features/file/file.messages';
import { zCompleteUploadPath, zCreateUploadRequest } from '@/lib/api/zod.gen';
import { serverAction } from '@/server/action/server-action';

export const createUploadAction = serverAction(
  { schema: zCreateUploadRequest, messages: FILE_ERROR_MESSAGES },
  createUpload,
);

export const completeUploadAction = serverAction(
  { schema: zCompleteUploadPath, messages: FILE_ERROR_MESSAGES },
  ({ id }) => completeUpload(id),
);
