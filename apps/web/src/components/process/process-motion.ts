import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createProcessTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const intro = select<HTMLElement>('[data-process-intro]')
  const steps = select<HTMLElement>('[data-process-step]')
  const visualStates = select<HTMLElement>('[data-process-visual-step]')
  const markers = select<HTMLElement>('[data-process-marker]')
  const bottle = select<HTMLElement>('[data-process-bottle]')
  const path = select<HTMLElement>('[data-process-path]')
  const handoff = select<HTMLElement>('[data-process-handoff]')

  if (mode === 'full') {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.72,
      },
    })

    timeline
      .fromTo(path, { scaleY: 0 }, { scaleY: 1, duration: 0.88 }, 0)
      .fromTo(
        bottle,
        { yPercent: -16, scale: 0.84 },
        { yPercent: 8, scale: 1.04, duration: 0.86 },
        0,
      )
      .to(intro, { yPercent: -18, opacity: 0.12, duration: 0.17 }, 0.08)

    steps.forEach((step, index) => {
      const start = 0.14 + index * 0.19
      const visual = visualStates[index]
      const marker = markers[index]

      timeline
        .fromTo(
          step,
          { y: 34, xPercent: 6, opacity: 0 },
          { y: 0, xPercent: 0, opacity: 1, duration: 0.1 },
          start,
        )
        .fromTo(visual, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1 }, start)
        .to(marker, { opacity: 1, scale: 1, duration: 0.08 }, start)

      if (index < steps.length - 1) {
        timeline
          .to(step, { y: -24, opacity: 0, duration: 0.06 }, start + 0.13)
          .to(visual, { scale: 1.06, opacity: 0, duration: 0.06 }, start + 0.13)
      }
    })

    timeline.fromTo(handoff, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12 }, 0.86)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 0.35,
      },
    })
    .fromTo(bottle, { yPercent: -3 }, { yPercent: 4 }, 0)
    .fromTo(path, { scaleY: 0.45 }, { scaleY: 1 }, 0)
    .fromTo(handoff, { opacity: 0.4 }, { opacity: 1 }, 0.7)
}
