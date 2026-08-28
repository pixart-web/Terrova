'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createJourneyTimeline } from './journey-motion'

export function JourneyMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createJourneyTimeline)

  return (
    <section
      ref={root}
      id="choose-your-journey"
      className="journey-scene"
      aria-labelledby="journey-title"
      data-motion-scene="choose-your-journey"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
