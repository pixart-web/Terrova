import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createOriginsTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const intro = select<HTMLElement>('[data-origins-intro]')
  const bottle = select<HTMLElement>('[data-origins-bottle]')
  const landscapes = select<HTMLElement>('[data-origin-landscape]')
  const entries = select<HTMLElement>('[data-origin-entry]')
  const progress = select<HTMLElement>('[data-origin-progress]')
  const handoff = select<HTMLElement>('[data-origins-handoff]')

  if (mode === 'full') {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.75,
      },
    })

    timeline
      .fromTo(
        bottle,
        { yPercent: -18, scale: 1.1 },
        { yPercent: 1, scale: 0.94, duration: 0.92 },
        0,
      )
      .to(intro, { yPercent: -22, opacity: 0.16, duration: 0.18 }, 0.09)

    entries.forEach((entry, index) => {
      const start = 0.14 + index * 0.19
      const landscape = landscapes[index]
      const marker = progress[index]

      timeline
        .fromTo(
          entry,
          { xPercent: 9, y: 30, opacity: 0 },
          { xPercent: 0, y: 0, opacity: 1, duration: 0.1 },
          start,
        )
        .fromTo(
          landscape,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.12 },
          start,
        )
        .to(marker, { scaleX: 1, opacity: 1, duration: 0.08 }, start)

      if (index < entries.length - 1) {
        timeline
          .to(entry, { xPercent: -7, opacity: 0, duration: 0.06 }, start + 0.13)
          .to(landscape, { opacity: 0, scale: 1.04, duration: 0.06 }, start + 0.13)
      }
    })

    timeline
      .to(bottle, { xPercent: 18, yPercent: -7, scale: 0.86, duration: 0.18 }, 0.75)
      .fromTo(handoff, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.12 }, 0.86)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 82%',
        end: 'bottom bottom',
        scrub: 0.35,
      },
    })
    .fromTo(bottle, { yPercent: -5 }, { yPercent: 4 }, 0)
    .fromTo(landscapes, { yPercent: 3 }, { yPercent: -2, stagger: 0.04 }, 0)
    .fromTo(handoff, { opacity: 0.45 }, { opacity: 1 }, 0.72)
}
