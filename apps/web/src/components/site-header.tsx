'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  ['Boxes', '/boxes'],
  ['Producers', '/producers'],
  ['Journal', '/journal'],
  ['Gifts', '/gifts'],
  ['Account', '/account'],
] as const

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="site-header" data-surface={pathname === '/' ? 'cinematic' : 'light'}>
      <Link className="wordmark" href="/" aria-label="Terrova home">
        Terrova
      </Link>

      <nav className="desktop-navigation" aria-label="Primary navigation">
        {navigation.slice(0, 4).map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="account-link" href="/account">
          Account
        </Link>
        <Link className="join-link" href="/boxes">
          Join the journey
        </Link>
      </div>

      <details className="mobile-navigation">
        <summary aria-label="Open navigation">
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <Link key={href} href={href}>
              <span aria-hidden="true">0{index + 1}</span>
              {label}
            </Link>
          ))}
          <Link className="mobile-navigation__join" href="/boxes">
            Join the journey <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </details>
    </header>
  )
}
