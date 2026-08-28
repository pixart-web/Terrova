import { processNarrative, processSteps } from './process-content'
import { ProcessMotionBoundary } from './process-motion-boundary'
import { ProcessVisual } from './process-visual'

export function ProcessScene() {
  return (
    <ProcessMotionBoundary>
      <div className="process-sticky">
        <div className="process-atmosphere" aria-hidden="true">
          <span />
          <span />
        </div>

        <header className="process-intro" data-process-intro>
          <p className="scene-kicker">
            {processNarrative.index} — {processNarrative.eyebrow}
          </p>
          <h2 id="process-title">{processNarrative.title}</h2>
          <p>{processNarrative.supportingLine}</p>
        </header>

        <ProcessVisual />

        <ol className="process-steps">
          {processSteps.map((step, index) => (
            <li data-process-step key={step.id}>
              <span className="process-step__number">{step.index}</span>
              <div>
                <p>{step.verb}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <i data-process-marker aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </i>
            </li>
          ))}
        </ol>

        <div className="scene-handoff process-handoff" data-process-handoff aria-hidden="true">
          <span>04 — Process</span>
          <span>Three ways to begin</span>
        </div>
      </div>
    </ProcessMotionBoundary>
  )
}
