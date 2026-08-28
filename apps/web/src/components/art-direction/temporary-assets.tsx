export type BottleTone = 'vine' | 'wine' | 'terracotta' | 'chalk'

export interface IndividualBottleProps {
  edition: string
  tone?: BottleTone
  className?: string
}

export function IndividualBottle({
  edition,
  tone = 'vine',
  className = '',
}: IndividualBottleProps) {
  return (
    <div className={`asset-bottle asset-bottle--${tone} ${className}`.trim()}>
      <span className="asset-bottle__glass" />
      <span className="asset-bottle__neck" />
      <span className="asset-bottle__foil" />
      <span className="asset-bottle__label">
        <i>Terrova</i>
        <small>{edition}</small>
      </span>
      <span className="asset-bottle__shine" />
    </div>
  )
}

export interface BottleSetProps {
  editions: readonly [string, string, string]
}

export function BottleSet({ editions }: BottleSetProps) {
  const tones: readonly BottleTone[] = ['wine', 'vine', 'terracotta']

  return (
    <div className="asset-bottle-set" aria-hidden="true">
      {editions.map((edition, index) => (
        <div
          className="asset-bottle-set__item"
          data-unbox-bottle
          data-selected={index === 1 ? 'true' : undefined}
          key={edition}
        >
          <IndividualBottle edition={edition} tone={tones[index]} />
        </div>
      ))}
    </div>
  )
}

export interface TerrovaBoxProps {
  edition: string
  state?: 'closed' | 'open'
}

export function TerrovaBox({ edition, state = 'closed' }: TerrovaBoxProps) {
  return (
    <div className={`asset-box asset-box--${state}`} aria-hidden="true">
      <div className="asset-box__lid" data-unbox-lid>
        <span>Terrova</span>
        <small>{edition}</small>
      </div>
      <div className="asset-box__interior" data-unbox-interior>
        <span />
        <span />
        <span />
      </div>
      <div className="asset-box__base" data-unbox-base>
        <span>Wine, shaped by place.</span>
      </div>
    </div>
  )
}

export interface OriginLandscapeProps {
  index: number
  tone: BottleTone
}

export function OriginLandscape({ index, tone }: OriginLandscapeProps) {
  const paths = [
    'M-80 520C160 370 310 570 560 410s470-10 790-190',
    'M-120 610C170 430 370 650 650 465s510-40 850-240',
    'M-40 700C250 540 400 730 720 550s520-55 850-260',
  ]

  return (
    <div
      className={`asset-landscape asset-landscape--${tone}`}
      data-origin-landscape
      data-origin-index={index}
      aria-hidden="true"
    >
      <span className="asset-landscape__sun" />
      <svg viewBox="0 0 1200 760" preserveAspectRatio="none">
        {paths.map((path) => (
          <path d={path} key={path} />
        ))}
      </svg>
      <span className="asset-landscape__ridge asset-landscape__ridge--near" />
      <span className="asset-landscape__ridge asset-landscape__ridge--far" />
    </div>
  )
}

export interface ProducerImageSlotProps {
  initials: string
}

export function ProducerImageSlot({ initials }: ProducerImageSlotProps) {
  return (
    <div className="asset-producer-slot" aria-hidden="true">
      <span>{initials}</span>
      <i>Producer portrait</i>
    </div>
  )
}
