import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Reset password', robots: { index: false } }

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  return (
    <main id="main-content" className="auth-page">
      <p className="page-eyebrow">My Terrova / Security</p>
      <h1>
        Find your way
        <br />
        back in.
      </h1>
      {query.sent ? (
        <p role="status">
          If an account exists for that address, reset instructions are on their way.
        </p>
      ) : (
        <form action="/api/auth/forgot-password" method="post" className="editorial-form">
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">Send reset instructions</button>
        </form>
      )}
      <Link href="/account">Return to sign in</Link>
    </main>
  )
}
