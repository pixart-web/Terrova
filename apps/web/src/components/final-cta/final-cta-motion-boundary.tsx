'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createFinalCtaTimeline } from './final-cta-motion'

export function FinalCtaMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createFinalCtaTimeline)

  return (
    <section
      ref={root}
      id="join-terrova"
      className="closing-scene"
      aria-labelledby="closing-title"
      data-motion-scene="final-cta"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
