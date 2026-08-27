'use client'

import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export type MotionMode = 'full' | 'reduced'

export interface SceneMotionContext {
  root: HTMLElement
  gsap: typeof gsap
  ScrollTrigger: typeof ScrollTrigger
  mode: MotionMode
}

export type SceneMotionSetup = (context: SceneMotionContext) => void | (() => void)

let pluginsRegistered = false
let activeSmoothScrollCleanup: (() => void) | undefined

function registerMotionPlugins() {
  if (pluginsRegistered) return
  gsap.registerPlugin(ScrollTrigger)
  pluginsRegistered = true
}

export function useSmoothScroll() {
  useEffect(() => {
    registerMotionPlugins()
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      activeSmoothScrollCleanup?.()

      const lenis = new Lenis({
        duration: 1.08,
        smoothWheel: true,
        syncTouch: false,
      })
      const updateScrollTrigger = () => ScrollTrigger.update()
      const tick = (time: number) => lenis.raf(time * 1000)
      let destroyed = false

      lenis.on('scroll', updateScrollTrigger)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      const cleanup = () => {
        if (destroyed) return
        destroyed = true
        lenis.off('scroll', updateScrollTrigger)
        lenis.destroy()
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        if (activeSmoothScrollCleanup === cleanup) activeSmoothScrollCleanup = undefined
      }

      activeSmoothScrollCleanup = cleanup
      return cleanup
    })

    return () => media.revert()
  }, [])
}

export function useSceneTimeline(rootRef: RefObject<HTMLElement | null>, setup: SceneMotionSetup) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    registerMotionPlugins()
    const media = gsap.matchMedia()

    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        full: '(min-width: 1024px) and (orientation: landscape)',
      },
      (matchContext) => {
        const conditions = matchContext.conditions as
          { motion?: boolean; full?: boolean } | undefined

        if (!conditions?.motion) {
          root.dataset.motionMode = 'static'
          return
        }

        const mode: MotionMode = conditions.full ? 'full' : 'reduced'
        root.dataset.motionMode = mode
        let release: void | (() => void)
        const context = gsap.context(() => {
          release = setup({ root, gsap, ScrollTrigger, mode })
        }, root)

        ScrollTrigger.refresh()

        return () => {
          release?.()
          context.revert()
        }
      },
    )

    return () => {
      media.revert()
      root.dataset.motionMode = 'static'
    }
  }, [rootRef, setup])
}
