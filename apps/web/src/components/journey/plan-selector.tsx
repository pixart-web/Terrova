'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { IndividualBottle } from '../art-direction/temporary-assets'
import { formatPlanPrice, type PlanPresentation } from './journey-content'

export function PlanSelector({ plans }: { plans: readonly PlanPresentation[] }) {
  const [activePlanId, setActivePlanId] = useState(
    plans.find((plan) => plan.highlighted)?.id ?? plans[0]?.id ?? '',
  )
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncEnhancement = () => setEnhanced(!reducedMotion.matches)

    syncEnhancement()
    reducedMotion.addEventListener('change', syncEnhancement)

    return () => reducedMotion.removeEventListener('change', syncEnhancement)
  }, [])

  return (
    <div
      className="journey-plans"
      data-active-plan={activePlanId}
      data-enhanced={enhanced ? 'true' : 'false'}
    >
      <div className="journey-plan-selectors" aria-label="Choose a Terrova journey">
        {plans.map((plan, index) => {
          const active = plan.id === activePlanId

          return (
            <button
              type="button"
              className="journey-plan-selector"
              aria-pressed={active}
              aria-controls={`journey-plan-${plan.id}`}
              data-plan-selector={plan.id}
              data-active={active ? 'true' : undefined}
              onClick={() => setActivePlanId(plan.id)}
              key={plan.id}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{plan.name}</strong>
              <small>{formatPlanPrice(plan.price)}</small>
              {plan.highlighted && <em>{plan.highlightLabel}</em>}
            </button>
          )
        })}
      </div>

      <div className="journey-plan-stage" aria-live="polite">
        {plans.map((plan) => {
          const active = plan.id === activePlanId

          return (
            <article
              id={`journey-plan-${plan.id}`}
              className={`journey-plan journey-plan--${plan.tone}`}
              data-plan-panel={plan.id}
              data-active={active ? 'true' : undefined}
              aria-hidden={enhanced && !active}
              key={plan.id}
            >
              <div className="journey-plan__atmosphere" aria-hidden="true">
                <span />
                <div className="journey-plan__bottle">
                  <IndividualBottle edition={plan.name} tone={plan.tone} />
                </div>
              </div>

              <div className="journey-plan__content">
                <div className="journey-plan__meta">
                  <span>{plan.highlighted ? plan.highlightLabel : 'Terrova journey'}</span>
                  <span>{plan.cadence.replace('_', ' ')}</span>
                </div>
                <h3>{plan.positioning}</h3>
                <p>{plan.description}</p>
                <p className="journey-plan__price">
                  <strong>{formatPlanPrice(plan.price)}</strong>
                  <span>/ month</span>
                </p>
                {plan.discoveryAttributes && (
                  <ul>
                    {plan.discoveryAttributes.map((attribute) => (
                      <li key={attribute}>{attribute}</li>
                    ))}
                  </ul>
                )}
                <Link className="journey-plan__cta" href={plan.ctaHref}>
                  {plan.ctaLabel} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
