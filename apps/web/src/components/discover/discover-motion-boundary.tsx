'use client'

import { useRef, type ReactNode } from 'react'

import { useSceneTimeline } from '@/motion/use-cinematic-motion'
import { createDiscoverTimeline } from './discover-motion'

export function DiscoverMotionBoundary({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useSceneTimeline(root, createDiscoverTimeline)

  return (
    <section
      ref={root}
      className="discover-scene"
      aria-labelledby="discover-title"
      data-motion-scene="discover"
      data-motion-mode="static"
      data-reduced-motion-ready="true"
    >
      {children}
    </section>
  )
}
