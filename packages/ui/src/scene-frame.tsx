import type { HTMLAttributes, ReactNode } from 'react'

export interface SceneFrameProps extends HTMLAttributes<HTMLElement> {
  index: string
  eyebrow: string
  title: string
  children: ReactNode
  visual?: ReactNode
}

export function SceneFrame({
  index,
  eyebrow,
  title,
  children,
  visual,
  className,
  ...props
}: SceneFrameProps) {
  return (
    <section className={`scene-frame ${className ?? ''}`} data-scene {...props}>
      <div className="scene-frame__copy">
        <span className="scene-frame__index" aria-hidden="true">
          {index}
        </span>
        <p className="scene-frame__eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <div className="scene-frame__body">{children}</div>
      </div>
      <div className="scene-frame__visual" data-scene-visual aria-hidden={!visual}>
        {visual}
      </div>
    </section>
  )
}
