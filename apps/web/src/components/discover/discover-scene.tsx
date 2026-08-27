import Link from 'next/link'

import { DiscoverBottle } from './discover-bottle'
import { DiscoverMotionBoundary } from './discover-motion-boundary'

export function DiscoverScene() {
  return (
    <DiscoverMotionBoundary>
      <div className="discover-sticky">
        <div className="discover-atmosphere" aria-hidden="true" data-discover-landscape>
          <span className="discover-glow" data-discover-halo />
          <svg className="discover-contours" viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-80 720C220 570 360 760 660 620s540-30 1030-240" />
            <path d="M-120 790C210 630 390 830 710 680s590-80 1050-310" />
            <path d="M-60 615C250 470 420 650 700 510s520-40 980-260" />
          </svg>
          <span className="discover-field discover-field--left" />
          <span className="discover-field discover-field--right" />
        </div>

        <div className="discover-heading">
          <p className="discover-overline">Terrova / Private wine journeys</p>
          <h1 id="discover-title">
            <span data-discover-heading="top">Discover wine</span>
            <span data-discover-heading="bottom">beyond the label.</span>
          </h1>
        </div>

        <div className="discover-product" aria-hidden="true" data-discover-bottle>
          <span className="discover-product__index">No. 01</span>
          <DiscoverBottle />
          <span className="discover-product__shadow" />
        </div>

        <div className="discover-copy" data-discover-copy>
          <p>
            A curated journey through remarkable wines, producers and places — delivered every
            month.
          </p>
          <Link className="discover-cta" href="/boxes">
            Explore the boxes <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="discover-provenance" data-discover-provenance>
          <span>Edition 01</span>
          <span>Portugal</span>
          <span>Atlantic edge</span>
        </div>

        <a className="discover-scroll" href="#unbox">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>

        <div className="discover-handoff" aria-hidden="true" data-discover-handoff>
          <span>01 — Discover</span>
          <span>Next: Unbox</span>
        </div>
      </div>
    </DiscoverMotionBoundary>
  )
}
