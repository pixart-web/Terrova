import { IndividualBottle, TerrovaBox } from '../art-direction/temporary-assets'
import { processSteps } from './process-content'

export function ProcessVisual() {
  return (
    <div className="process-visual" aria-hidden="true">
      <span className="process-visual__path" data-process-path />
      <div className="process-visual__bottle" data-process-bottle>
        <IndividualBottle edition="Edition 01" tone="vine" />
      </div>
      <div className="process-visual__box">
        <TerrovaBox edition="Monthly edition" state="open" />
      </div>

      <div className="process-visual__states">
        {processSteps.map((step) => (
          <span
            className={`process-visual__state process-visual__state--${step.id}`}
            data-process-visual-step
            key={step.id}
          >
            <i>{step.index}</i>
            <b>{step.verb}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
