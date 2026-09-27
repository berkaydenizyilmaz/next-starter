import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactCompiler: true,
  cacheComponents: true,
  typedRoutes: true,
  agentRules: false,
};

export default nextConfig;
