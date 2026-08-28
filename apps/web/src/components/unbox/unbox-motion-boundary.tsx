'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createUnboxTimeline } from './unbox-motion'

export function UnboxMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createUnboxTimeline)

  return (
    <section
      ref={root}
      id="unbox"
      className="unbox-scene"
      aria-labelledby="unbox-title"
      data-motion-scene="unbox"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
