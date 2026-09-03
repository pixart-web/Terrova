import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false } }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const token = typeof query.token === 'string' ? query.token : ''
  return (
    <main id="main-content" className="auth-page">
      <p className="page-eyebrow">My Terrova / Security</p>
      <h1>
        A new key
        <br />
        for your cellar.
      </h1>
      {query.error && <p role="alert">This reset link is invalid or expired.</p>}
      <form action="/api/auth/reset-password" method="post" className="editorial-form">
        <input type="hidden" name="token" value={token} />
        <label>
          New password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
          />
        </label>
        <button type="submit">Update password</button>
      </form>
    </main>
  )
}
