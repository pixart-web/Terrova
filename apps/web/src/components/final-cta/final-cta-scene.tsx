import Link from 'next/link'

import { IndividualBottle } from '../art-direction/temporary-assets'
import { FinalCtaMotionBoundary } from './final-cta-motion-boundary'

export function FinalCtaScene() {
  return (
    <FinalCtaMotionBoundary>
      <div className="closing-sticky">
        <div className="closing-traces" data-closing-traces aria-hidden="true">
          <span />
          <span />
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-120 720C230 480 520 810 810 510s590-80 940-310" />
            <path d="M-80 820C310 590 550 880 900 610s620-110 870-350" />
          </svg>
        </div>

        <div className="closing-bottle" data-closing-bottle aria-hidden="true">
          <IndividualBottle edition="Still out there" tone="vine" />
          <span>Unknown origin · next edition</span>
        </div>

        <div className="closing-copy" data-closing-copy>
          <p className="scene-kicker">07 — The next discovery</p>
          <h2 id="closing-title">Your next favourite wine is still out there.</h2>
          <p>
            The story closes where the next one begins: with a place, a maker and a bottle you have
            not met yet.
          </p>
        </div>

        <div className="closing-actions" data-closing-actions>
          <Link className="closing-cta" href="/boxes">
            Join Terrova <span aria-hidden="true">↗</span>
          </Link>
          <Link className="closing-secondary" href="/boxes">
            Explore the boxes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </FinalCtaMotionBoundary>
  )
}
