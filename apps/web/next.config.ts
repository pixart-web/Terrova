import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: [
    '@terrova/config',
    '@terrova/ui',
    '@terrova/types',
    '@terrova/content',
    '@terrova/commerce',
  ],
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.CMS_MEDIA_HOST ?? 'localhost',
      },
    ],
  },
}

export default nextConfig
