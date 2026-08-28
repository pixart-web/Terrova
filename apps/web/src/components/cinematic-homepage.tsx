import Link from 'next/link'

import { SceneFrame } from '@terrova/ui'
import { DiscoverScene } from './discover/discover-scene'
import { JourneyScene } from './journey/journey-scene'
import { OriginsScene } from './origins/origins-scene'
import { ProcessScene } from './process/process-scene'
import { SmoothScroll } from './smooth-scroll'
import { UnboxScene } from './unbox/unbox-scene'

const scenes = [
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
      <ProcessScene />
      <JourneyScene />

      <div className="scene-rail" aria-label="Later journey scenes">
        {scenes.map((scene, index) => (
          <SceneFrame
            key={scene.index}
            id={index === 0 ? 'your-taste' : undefined}
            index={scene.index}
            eyebrow={scene.eyebrow}
            title={scene.title}
            visual={<BottleStudy tone={scene.tone} ordinal={index + 6} />}
          >
            <p>{scene.body}</p>
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
