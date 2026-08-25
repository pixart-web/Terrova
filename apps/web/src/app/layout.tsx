import type { Metadata, Viewport } from 'next'
import Link from 'next/link'

import '@terrova/ui/tokens.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Terrova — Wine, shaped by place', template: '%s — Terrova' },
  description: 'A cinematic wine subscription shaped by place, people and discovery.',
  openGraph: {
    title: 'Terrova — Wine, shaped by place',
    description: 'A cinematic wine subscription shaped by place, people and discovery.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Terrova — Wine, shaped by place.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrova — Wine, shaped by place',
    description: 'A cinematic wine subscription shaped by place, people and discovery.',
    images: ['/og.png'],
  },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#171714' }

const navigation = [
  ['Boxes', '/boxes'],
  ['Producers', '/producers'],
  ['Journal', '/journal'],
  ['Gifts', '/gifts'],
] as const

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="Terrova home">
            Terrova
          </Link>
          <nav aria-label="Primary navigation">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <Link className="account-link" href="/account">
            Account
          </Link>
        </header>
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
