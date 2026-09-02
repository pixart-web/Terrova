import { TasteConstellation } from './taste-constellation'
import { tasteNarrative, tasteSignals } from './taste-content'
import { TasteMotionBoundary } from './taste-motion-boundary'

export function TasteScene() {
  return (
    <TasteMotionBoundary>
      <div className="taste-sticky">
        <div className="taste-paper" aria-hidden="true">
          <span />
          <span />
        </div>

        <header className="taste-heading" data-taste-heading>
          <p className="scene-kicker">
            {tasteNarrative.index} — {tasteNarrative.eyebrow}
          </p>
          <h2 id="taste-title">{tasteNarrative.title}</h2>
          <p>{tasteNarrative.supportingLine}</p>
        </header>

        <TasteConstellation />

        <ol className="taste-signals" aria-label="Examples of discoveries that can shape taste">
          {tasteSignals.map((signal) => (
            <li data-taste-signal data-weight={signal.displayWeight} key={signal.id}>
              <span>{signal.index}</span>
              <div>
                <p>{signal.label}</p>
                <h3>{signal.value}</h3>
                <p>
                  {[signal.region, signal.country, signal.grape, signal.style]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="taste-profile" data-taste-profile aria-labelledby="taste-profile-title">
          <p>{tasteNarrative.profileLabel}</p>
          <h3 id="taste-profile-title">A journey with memory.</h3>
          <p>{tasteNarrative.profileCopy}</p>
          <small>{tasteNarrative.boundaryNote}</small>
        </aside>

        <div className="scene-handoff taste-handoff" data-taste-handoff aria-hidden="true">
          <span>06 — Your taste</span>
          <span>The next bottle remains unknown</span>
        </div>
      </div>
    </TasteMotionBoundary>
  )
}
