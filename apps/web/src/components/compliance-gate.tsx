'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface ComplianceGateProps {
  ageConfirmed: boolean
  analyticsChoice: boolean
  minimumAge: number
  ageGateEnabled: boolean
}

function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${days * 86400}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
}

export function ComplianceGate({
  ageConfirmed,
  analyticsChoice,
  minimumAge,
  ageGateEnabled,
}: ComplianceGateProps) {
  const [needsAge, setNeedsAge] = useState(ageGateEnabled && !ageConfirmed)
  const [needsConsent, setNeedsConsent] = useState(!analyticsChoice)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (needsAge) confirmRef.current?.focus()
  }, [needsAge])

  return (
    <>
      {needsAge && (
        <div
          className="compliance-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
        >
          <div>
            <p className="page-eyebrow">Terrova / Responsible discovery</p>
            <h2 id="age-title">
              Wine is for
              <br />
              grown-up journeys.
            </h2>
            <p>
              Confirm that you are at least {minimumAge}. Please enjoy and share wine thoughtfully.
            </p>
            <button
              ref={confirmRef}
              onClick={() => {
                setCookie('terrova-age', 'confirmed', 365)
                setNeedsAge(false)
              }}
            >
              I am {minimumAge} or older
            </button>
            <Link href="/legal/responsible-drinking">Responsible drinking information</Link>
          </div>
        </div>
      )}
      {!needsAge && needsConsent && (
        <aside className="consent-banner" aria-labelledby="consent-title">
          <div>
            <p id="consent-title">A measured use of data.</p>
            <p>
              Essential cookies keep sign-in secure. Optional anonymous analytics helps improve the
              journey.
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setCookie('terrova-analytics', 'denied', 180)
                setNeedsConsent(false)
              }}
            >
              Essential only
            </button>
            <button
              onClick={() => {
                setCookie('terrova-analytics', 'granted', 180)
                setNeedsConsent(false)
              }}
            >
              Allow analytics
            </button>
            <Link href="/legal/cookies">Details</Link>
          </div>
        </aside>
      )}
    </>
  )
}
