import { IndividualBottle } from '../art-direction/temporary-assets'
import { tasteSignals } from './taste-content'

export function TasteConstellation() {
  return (
    <div className="taste-constellation" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {tasteSignals.map((signal) => (
          <path
            d={`M50 48 Q${(signal.position.x + 50) / 2} ${signal.position.y - 8} ${signal.position.x} ${signal.position.y}`}
            data-taste-trace
            key={signal.id}
          />
        ))}
      </svg>

      <div className="taste-constellation__bottle" data-taste-bottle>
        <IndividualBottle edition="Your taste" tone="wine" />
      </div>

      {tasteSignals.map((signal) => (
        <span
          className={`taste-node taste-node--${signal.displayWeight}`}
          data-taste-node
          style={{ left: `${signal.position.x}%`, top: `${signal.position.y}%` }}
          key={signal.id}
        >
          <i />
          <b>{signal.value}</b>
        </span>
      ))}
    </div>
  )
}
