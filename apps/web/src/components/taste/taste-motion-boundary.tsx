'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createTasteTimeline } from './taste-motion'

export function TasteMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createTasteTimeline)

  return (
    <section
      ref={root}
      id="your-taste"
      className="taste-scene"
      aria-labelledby="taste-title"
      data-motion-scene="your-taste"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
