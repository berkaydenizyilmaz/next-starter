'use server';

import { z } from 'zod';
import { completeUpload, createUpload } from '@/features/file/file.data';
import { FILE_ERROR_MESSAGES } from '@/features/file/file.messages';
import { zCompleteUploadPath, zCreateUploadRequest } from '@/lib/api/zod.gen';
import { serverAction } from '@/server/action/server-action';

const createUploadSchema = zCreateUploadRequest.extend({
  fileName: z
    .string()
    .optional()
    .transform((name) =>
      zCreateUploadRequest.shape.fileName.safeParse(name).success
        ? name
        : undefined,
    ),
});

export const createUploadAction = serverAction(
  { schema: createUploadSchema, messages: FILE_ERROR_MESSAGES },
  createUpload,
);

export const completeUploadAction = serverAction(
  { schema: zCompleteUploadPath, messages: FILE_ERROR_MESSAGES },
  ({ id }) => completeUpload(id),
);
