import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createDiscoverTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const bottle = select<HTMLElement>('[data-discover-bottle]')
  const halo = select<HTMLElement>('[data-discover-halo]')
  const landscape = select<HTMLElement>('[data-discover-landscape]')
  const headingTop = select<HTMLElement>('[data-discover-heading="top"]')
  const headingBottom = select<HTMLElement>('[data-discover-heading="bottom"]')
  const supportingCopy = select<HTMLElement>('[data-discover-copy]')
  const provenance = select<HTMLElement>('[data-discover-provenance]')
  const handoff = select<HTMLElement>('[data-discover-handoff]')

  if (mode === 'full') {
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.75,
        },
      })
      .fromTo(bottle, { yPercent: 4, scale: 0.94 }, { yPercent: -3, scale: 1.035 }, 0)
      .fromTo(halo, { scale: 0.9, opacity: 0.64 }, { scale: 1.14, opacity: 0.92 }, 0)
      .fromTo(landscape, { yPercent: 8, scale: 1 }, { yPercent: -7, scale: 1.08 }, 0)
      .to(headingTop, { xPercent: -5, opacity: 0.7 }, 0.18)
      .to(headingBottom, { xPercent: 6, opacity: 0.76 }, 0.18)
      .to(supportingCopy, { yPercent: -24, opacity: 0.18 }, 0.52)
      .to(provenance, { yPercent: -38, opacity: 0.2 }, 0.52)
      .fromTo(handoff, { opacity: 0, y: 28 }, { opacity: 1, y: 0 }, 0.72)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })
    .fromTo(bottle, { yPercent: 2, scale: 0.98 }, { yPercent: -4, scale: 1.02 }, 0)
    .fromTo(landscape, { yPercent: 3 }, { yPercent: -3 }, 0)
    .to([headingTop, headingBottom], { opacity: 0.78 }, 0.45)
    .fromTo(handoff, { opacity: 0 }, { opacity: 1 }, 0.72)
}
