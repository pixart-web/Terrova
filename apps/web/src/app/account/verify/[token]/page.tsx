import type { Metadata } from 'next'
import Link from 'next/link'

import { cmsRequest } from '@/lib/cms'

export const metadata: Metadata = { title: 'Confirm your cellar', robots: { index: false } }

export default async function VerifyAccountPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  let verified = false
  try {
    await cmsRequest(`/api/customers/verify/${encodeURIComponent(token)}`, { method: 'POST' })
    verified = true
  } catch {
    verified = false
  }
  return (
    <main id="main-content" className="status-page">
      <p className="page-eyebrow">My Terrova / Verification</p>
      <h1>
        {verified ? (
          <>
            Your cellar
            <br />
            is ready.
          </>
        ) : (
          <>
            This link has
            <br />
            lost its way.
          </>
        )}
      </h1>
      <p>
        {verified
          ? 'Your email is confirmed. You can now sign in to My Terrova.'
          : 'The verification link is invalid or has expired. Create the account again or contact support.'}
      </p>
      <Link className="button-link" href="/account">
        Continue to My Terrova
      </Link>
    </main>
  )
}
