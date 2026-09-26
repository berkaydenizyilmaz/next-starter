import { toApiError } from '@/lib/api.error';
import { type Client, createClient, createConfig } from '@/lib/api/client';

export const browserApiClient: Client = createClient(
  createConfig({ throwOnError: true }),
);

browserApiClient.interceptors.error.use((error, response) =>
  toApiError({ error, response }),
);
