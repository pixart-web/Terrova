import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createFinalCtaTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const traces = select<HTMLElement>('[data-closing-traces]')
  const bottle = select<HTMLElement>('[data-closing-bottle]')
  const copy = select<HTMLElement>('[data-closing-copy]')
  const actions = select<HTMLElement>('[data-closing-actions]')

  if (mode === 'full') {
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.58,
        },
      })
      .fromTo(
        traces,
        { opacity: 0.72, scale: 1.08 },
        { opacity: 0.08, scale: 0.88, duration: 0.64 },
        0,
      )
      .fromTo(
        bottle,
        { yPercent: 18, scale: 0.82 },
        { yPercent: -2, scale: 1, duration: 0.72 },
        0.04,
      )
      .fromTo(copy, { y: 52, opacity: 0.28 }, { y: 0, opacity: 1, duration: 0.35 }, 0.1)
      .fromTo(actions, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18 }, 0.62)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 85%',
        end: 'bottom bottom',
        scrub: 0.25,
      },
    })
    .fromTo(bottle, { yPercent: 3 }, { yPercent: -2 }, 0)
    .fromTo(traces, { opacity: 0.3 }, { opacity: 0.08 }, 0)
}
