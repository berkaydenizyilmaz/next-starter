import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  cacheComponents: true,
  typedRoutes: true,
  agentRules: false,
};

export default nextConfig;
