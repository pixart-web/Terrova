'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createProcessTimeline } from './process-motion'

export function ProcessMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createProcessTimeline)

  return (
    <section
      ref={root}
      id="process"
      className="process-scene"
      aria-labelledby="process-title"
      data-motion-scene="process"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
