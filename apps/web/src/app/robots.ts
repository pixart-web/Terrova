import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terrova.net'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/account', '/api/', '/checkout/'] },
    sitemap: new URL('/sitemap.xml', siteURL).toString(),
    host: siteURL,
  }
}
