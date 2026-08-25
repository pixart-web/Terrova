import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@terrova/config', '@terrova/ui'],
}

export default nextConfig
