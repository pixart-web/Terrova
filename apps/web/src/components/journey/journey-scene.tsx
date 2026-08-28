import { journeyPlans } from './journey-content'
import { JourneyMotionBoundary } from './journey-motion-boundary'
import { PlanSelector } from './plan-selector'

export function JourneyScene() {
  return (
    <JourneyMotionBoundary>
      <div className="journey-sticky">
        <div className="journey-atmosphere" data-journey-atmosphere aria-hidden="true">
          <span />
          <span />
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-80 680C250 500 430 740 750 535s590-35 940-255" />
            <path d="M-130 790C230 590 480 830 820 610s630-80 990-310" />
          </svg>
        </div>

        <header className="journey-heading" data-journey-heading>
          <p className="scene-kicker">05 — Choose your journey</p>
          <h2 id="journey-title">Choose your journey.</h2>
          <p>Different ways to discover. The same Terrova point of view.</p>
        </header>

        <div data-journey-plans>
          <PlanSelector plans={journeyPlans} />
        </div>

        <div className="scene-handoff journey-handoff" data-journey-handoff aria-hidden="true">
          <span>05 — Choose your journey</span>
          <span>Next: Your taste</span>
        </div>
      </div>
    </JourneyMotionBoundary>
  )
}
