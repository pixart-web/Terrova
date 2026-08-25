'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { SceneFrame } from '@terrova/ui'

const scenes = [
  {
    index: '01',
    eyebrow: 'Discover',
    title: 'Wine without the usual script.',
    body: 'Follow texture, weather and instinct. Each edition begins with a question, never a score.',
    tone: 'terracotta',
  },
  {
    index: '02',
    eyebrow: 'Unbox',
    title: 'A ritual, composed in layers.',
    body: 'Three bottles, one place in focus, and editorial objects that turn opening the box into an evening.',
    tone: 'wine',
  },
  {
    index: '03',
    eyebrow: 'Origins',
    title: 'Meet the hands behind the land.',
    body: 'Independent growers. Singular parcels. Honest stories, traced from vineyard to your table.',
    tone: 'vine',
  },
  {
    index: '04',
    eyebrow: 'Process',
    title: 'Curated slowly. Delivered simply.',
    body: 'We taste, revisit and assemble each edition. You choose the rhythm; we handle the rest.',
    tone: 'cream',
  },
  {
    index: '05',
    eyebrow: 'Choose your journey',
    title: 'One landscape, three ways in.',
    body: 'Start with The Field, move deeper with The Cellar, or send a one-off Edition as a gift.',
    tone: 'terracotta',
  },
  {
    index: '06',
    eyebrow: 'Your taste',
    title: 'A palate that becomes a map.',
    body: 'Tell us what moved you. Over time, Terrova learns the shapes, places and makers you return to.',
    tone: 'wine',
  },
] as const

function BottleStudy({ tone, ordinal }: { tone: string; ordinal: number }) {
  return (
    <div className={`bottle-study bottle-study--${tone}`} data-parallax>
      <span className="bottle-study__halo" />
      <span className="bottle-study__bottle" />
      <span className="bottle-study__label">T / {String(ordinal).padStart(2, '0')}</span>
    </div>
  )
}

export function CinematicHomepage() {
  const root = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!root.current || reduceMotion) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((scene) => {
        const copy = scene.querySelector('.scene-frame__copy')
        const visual = scene.querySelector<HTMLElement>('[data-scene-visual]')
        const parallax = scene.querySelector<HTMLElement>('[data-parallax]')

        gsap
          .timeline({
            scrollTrigger: { trigger: scene, start: 'top 70%', end: 'bottom 35%', scrub: 0.7 },
          })
          .fromTo(copy, { y: 80, opacity: 0.25 }, { y: 0, opacity: 1, ease: 'none' })
          .fromTo(
            parallax,
            { yPercent: 10, rotate: -2 },
            { yPercent: -8, rotate: 2, ease: 'none' },
            0,
          )

        if (visual && window.matchMedia('(min-width: 900px)').matches) {
          ScrollTrigger.create({
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            pin: visual,
            pinSpacing: false,
          })
        }
      })
    }, root)

    return () => {
      context.revert()
      lenis.destroy()
      gsap.ticker.remove(onTick)
    }
  }, [reduceMotion])

  return (
    <main id="main-content" ref={root} className="cinematic-home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__kicker">
          <span>01 / First edition</span>
          <span>Portugal, Atlantic edge</span>
        </div>
        <h1 id="hero-title">
          Wine,
          <br />
          <em>shaped by place.</em>
        </h1>
        <p className="hero__intro">
          A subscription for curious drinkers. Small-production bottles, human stories and a new
          landscape at your door.
        </p>
        <motion.div
          whileHover={reduceMotion ? undefined : { x: 8 }}
          transition={{ duration: 0.28 }}
        >
          <Link className="text-link" href="/boxes">
            Enter the first edition <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
        <div className="hero__orb" aria-hidden="true">
          <span>T</span>
        </div>
        <p className="hero__scroll" aria-hidden="true">
          Scroll to follow the journey
        </p>
      </section>

      <div className="scene-rail">
        {scenes.map((scene, index) => (
          <SceneFrame
            key={scene.index}
            index={scene.index}
            eyebrow={scene.eyebrow}
            title={scene.title}
            visual={<BottleStudy tone={scene.tone} ordinal={index + 1} />}
          >
            <p>{scene.body}</p>
            {index === 4 && (
              <Link className="text-link" href="/boxes">
                Compare journeys <span aria-hidden="true">→</span>
              </Link>
            )}
          </SceneFrame>
        ))}
      </div>

      <section className="final-scene" aria-labelledby="final-title">
        <p className="scene-frame__eyebrow">07 / Begin here</p>
        <h2 id="final-title">
          Your next favourite wine
          <br />
          has a place to come from.
        </h2>
        <Link className="cta" href="/boxes">
          Choose your journey
        </Link>
      </section>
    </main>
  )
}
