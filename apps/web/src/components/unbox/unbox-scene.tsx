import { BottleSet, TerrovaBox } from '../art-direction/temporary-assets'
import { unboxNarrative } from './unbox-content'
import { UnboxMotionBoundary } from './unbox-motion-boundary'

export function UnboxScene() {
  return (
    <UnboxMotionBoundary>
      <div className="unbox-sticky">
        <div className="unbox-atmosphere" data-unbox-atmosphere aria-hidden="true">
          <span />
          <span />
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-80 750C250 550 410 790 730 590s560-70 970-330" />
            <path d="M-120 830C240 620 460 850 790 650s610-120 1010-390" />
          </svg>
        </div>

        <div className="unbox-copy" data-unbox-copy>
          <p className="scene-kicker">
            {unboxNarrative.index} — {unboxNarrative.eyebrow}
          </p>
          <h2 id="unbox-title">{unboxNarrative.title}</h2>
          <p>{unboxNarrative.supportingCopy}</p>
        </div>

        <div className="unbox-product-stage">
          <TerrovaBox edition={unboxNarrative.edition} />
          <BottleSet editions={unboxNarrative.bottleEditions} />
        </div>

        <div className="unbox-edition" data-unbox-edition>
          <span>{unboxNarrative.edition}</span>
          <p>{unboxNarrative.variationNote}</p>
        </div>

        <div className="scene-handoff unbox-handoff" data-unbox-handoff aria-hidden="true">
          <span>02 — Unbox</span>
          <span>Follow one bottle to its origin</span>
        </div>
      </div>
    </UnboxMotionBoundary>
  )
}
