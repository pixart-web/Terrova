'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createOriginsTimeline } from './origins-motion'

export function OriginsMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createOriginsTimeline)

  return (
    <section
      ref={root}
      id="origins"
      className="origins-scene"
      aria-labelledby="origins-title"
      data-motion-scene="origins"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
