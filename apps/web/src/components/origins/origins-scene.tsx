import { IndividualBottle, OriginLandscape } from '../art-direction/temporary-assets'
import { originJourney } from './origins-content'
import { OriginsMotionBoundary } from './origins-motion-boundary'

export function OriginsScene() {
  return (
    <OriginsMotionBoundary>
      <div className="origins-sticky">
        <div className="origins-landscapes">
          {originJourney.map((origin, index) => (
            <OriginLandscape index={index} key={origin.id} tone={origin.tone} />
          ))}
        </div>

        <header className="origins-intro" data-origins-intro>
          <p className="scene-kicker">03 — Origins / Five Portuguese regions</p>
          <h2 id="origins-title">Every bottle begins somewhere.</h2>
          <p>
            Follow five landscapes that shape Portuguese wine. The bottles and their makers remain a
            surprise until your box is opened.
          </p>
        </header>

        <div className="origins-bottle-anchor" data-origins-bottle aria-hidden="true">
          <IndividualBottle edition="Anonymous bottle" tone="vine" />
        </div>

        <div className="origins-editorial-track">
          {originJourney.map((origin, index) => (
            <article
              className="origin-entry"
              data-origin-entry
              data-origin-index={index}
              key={origin.id}
            >
              <div className="origin-entry__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="origin-entry__copy">
                <p>{origin.coordinates}</p>
                <h3>
                  {origin.region}, <em>{origin.country}</em>
                </h3>
                <blockquote>{origin.tagline}</blockquote>
                <dl>
                  <div>
                    <dt>Region notes</dt>
                    <dd>{origin.description}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="origins-progress" aria-hidden="true">
          {originJourney.map((origin, index) => (
            <span data-origin-progress key={origin.id}>
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
        </div>

        <div className="scene-handoff origins-handoff" data-origins-handoff aria-hidden="true">
          <span>03 — Origins</span>
          <span>Next: Process</span>
        </div>
      </div>
    </OriginsMotionBoundary>
  )
}
