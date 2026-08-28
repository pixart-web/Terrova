import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createJourneyTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const heading = select<HTMLElement>('[data-journey-heading]')
  const plans = select<HTMLElement>('[data-journey-plans]')
  const atmosphere = select<HTMLElement>('[data-journey-atmosphere]')
  const handoff = select<HTMLElement>('[data-journey-handoff]')

  if (mode === 'full') {
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
        },
      })
      .fromTo(
        atmosphere,
        { scale: 1.09, opacity: 0.55 },
        { scale: 1, opacity: 1, duration: 0.8 },
        0,
      )
      .fromTo(heading, { y: 52, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.3 }, 0.04)
      .fromTo(plans, { y: 70, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.34 }, 0.12)
      .fromTo(handoff, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14 }, 0.79)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 82%',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })
    .fromTo(atmosphere, { yPercent: 3 }, { yPercent: -2 }, 0)
    .fromTo(handoff, { opacity: 0.45 }, { opacity: 1 }, 0.7)
}
