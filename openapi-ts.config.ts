import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.OPENAPI_INPUT ?? '../nest-starter/openapi.json',
  output: 'src/lib/api',
  plugins: [
    '@hey-api/typescript',
    { name: '@hey-api/client-next', throwOnError: true },
    { name: '@hey-api/sdk', client: false },
    'zod',
  ],
});
