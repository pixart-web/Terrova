import type { Metadata, Viewport } from 'next'

import { SiteHeader } from '@/components/site-header'

import '@terrova/ui/tokens.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Terrova — Discover wine beyond the label', template: '%s — Terrova' },
  description: 'Remarkable wines, producers and places — delivered as a monthly journey.',
  openGraph: {
    title: 'Terrova — Discover wine beyond the label',
    description: 'Remarkable wines, producers and places — delivered as a monthly journey.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Terrova — Discover wine beyond the label.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrova — Discover wine beyond the label',
    description: 'Remarkable wines, producers and places — delivered as a monthly journey.',
    images: ['/og.png'],
  },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#171714' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <p className="wordmark">Terrova</p>
          <p>Wine, shaped by place.</p>
          <p>Enjoy thoughtfully. 18+</p>
        </footer>
      </body>
    </html>
  )
}
