import Link from 'next/link'

import { SceneFrame } from '@terrova/ui'
import { DiscoverScene } from './discover/discover-scene'
import { OriginsScene } from './origins/origins-scene'
import { SmoothScroll } from './smooth-scroll'
import { UnboxScene } from './unbox/unbox-scene'

const scenes = [
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
  return (
    <main id="main-content" className="cinematic-home">
      <SmoothScroll />
      <DiscoverScene />
      <UnboxScene />
      <OriginsScene />

      <div className="scene-rail" aria-label="Later journey scenes">
        {scenes.map((scene, index) => (
          <SceneFrame
            key={scene.index}
            id={index === 0 ? 'process' : undefined}
            index={scene.index}
            eyebrow={scene.eyebrow}
            title={scene.title}
            visual={<BottleStudy tone={scene.tone} ordinal={index + 4} />}
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
