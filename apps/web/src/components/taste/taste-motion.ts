import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createTasteTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const heading = select<HTMLElement>('[data-taste-heading]')
  const bottle = select<HTMLElement>('[data-taste-bottle]')
  const traces = select<SVGPathElement>('[data-taste-trace]')
  const nodes = select<HTMLElement>('[data-taste-node]')
  const signals = select<HTMLElement>('[data-taste-signal]')
  const profile = select<HTMLElement>('[data-taste-profile]')
  const handoff = select<HTMLElement>('[data-taste-handoff]')

  if (mode === 'full') {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.62,
      },
    })

    timeline
      .fromTo(heading, { y: 44, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.2 }, 0)
      .fromTo(bottle, { yPercent: 12, scale: 0.86 }, { yPercent: -3, scale: 1, duration: 0.72 }, 0)

    signals.forEach((signal, index) => {
      const start = 0.16 + index * 0.12

      timeline
        .fromTo(signal, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.11 }, start)
        .fromTo(
          nodes[index],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.1 },
          start,
        )

      if (traces[index]) {
        timeline.fromTo(
          traces[index],
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.12 },
          start + 0.03,
        )
      }
    })

    timeline
      .to(heading, { y: -28, opacity: 0.1, duration: 0.18 }, 0.24)
      .to(bottle, { x: 150, yPercent: -8, scale: 0.92, opacity: 0.1, duration: 0.16 }, 0.64)
      .fromTo(profile, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.16 }, 0.68)
      .fromTo(handoff, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1 }, 0.88)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 82%',
        end: 'bottom bottom',
        scrub: 0.28,
      },
    })
    .fromTo(bottle, { yPercent: 3 }, { yPercent: -2 }, 0)
    .fromTo(traces, { opacity: 0.35 }, { opacity: 1 }, 0)
    .fromTo(handoff, { opacity: 0.45 }, { opacity: 1 }, 0.75)
}
