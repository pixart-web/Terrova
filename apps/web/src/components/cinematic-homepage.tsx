import { DiscoverScene } from './discover/discover-scene'
import { FinalCtaScene } from './final-cta/final-cta-scene'
import { JourneyScene } from './journey/journey-scene'
import { OriginsScene } from './origins/origins-scene'
import { ProcessScene } from './process/process-scene'
import { SmoothScroll } from './smooth-scroll'
import { TasteScene } from './taste/taste-scene'
import { UnboxScene } from './unbox/unbox-scene'

export function CinematicHomepage() {
  return (
    <main id="main-content" className="cinematic-home">
      <SmoothScroll />
      <DiscoverScene />
      <UnboxScene />
      <OriginsScene />
      <ProcessScene />
      <JourneyScene />
      <TasteScene />
      <FinalCtaScene />
    </main>
  )
}
