import type * as api from '@/lib/api';
import { HTTP_STATUS } from '@/lib/constants/http.constants';

export async function putToStorage(
  ticket: api.UploadTicket,
  file: File,
): Promise<boolean> {
  try {
    const response = await fetch(ticket.uploadUrl, {
      method: ticket.method,
      headers: ticket.headers,
      body: file,
    });
    return response.ok || response.status === HTTP_STATUS.PRECONDITION_FAILED;
  } catch (error) {
    if (error instanceof TypeError) return false;
    throw error;
  }
}
