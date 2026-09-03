import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'

import { ComplianceGate } from '@/components/compliance-gate'
import { SiteHeader } from '@/components/site-header'
import { contentRepository, requestBrand } from '@/lib/content'

import '@terrova/ui/tokens.css'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await requestBrand()
  const settings = await contentRepository.getSiteSettings(brand.id)
  return {
    metadataBase: new URL(settings.siteUrl),
    title: { default: settings.defaultTitle, template: `%s — ${settings.siteName}` },
    description: settings.defaultDescription,
    alternates: { canonical: '/' },
    openGraph: {
      title: settings.defaultTitle,
      description: settings.defaultDescription,
      siteName: settings.siteName,
      type: 'website',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: `${settings.siteName} — wine shaped by place.`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.defaultTitle,
      description: settings.defaultDescription,
      images: ['/og.png'],
    },
  }
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#171714' }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ brand }, cookieStore] = await Promise.all([requestBrand(), cookies()])
  const settings = await contentRepository.getSiteSettings(brand.id)
  return (
    <html lang={brand.locale.split('-')[0]}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <p className="wordmark">{brand.name}</p>
          <p>Wine, shaped by place.</p>
          <p>Enjoy thoughtfully. 18+</p>
          <nav aria-label="Legal and help">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/legal/shipping">Delivery</Link>
            <Link href="/legal/returns">Returns</Link>
            <Link href="/legal/responsible-drinking">Responsible drinking</Link>
          </nav>
        </footer>
        <ComplianceGate
          ageGateEnabled={settings.ageGateEnabled}
          minimumAge={settings.minimumAge}
          ageConfirmed={cookieStore.get('terrova-age')?.value === 'confirmed'}
          analyticsChoice={Boolean(cookieStore.get('terrova-analytics'))}
        />
      </body>
    </html>
  )
}
