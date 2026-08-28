import type { SceneMotionSetup } from '@/motion/use-cinematic-motion'

export const createUnboxTimeline: SceneMotionSetup = ({ root, gsap, mode }) => {
  const select = gsap.utils.selector(root)
  const lid = select<HTMLElement>('[data-unbox-lid]')
  const interior = select<HTMLElement>('[data-unbox-interior]')
  const base = select<HTMLElement>('[data-unbox-base]')
  const bottles = select<HTMLElement>('[data-unbox-bottle]')
  const selectedBottle = select<HTMLElement>('[data-selected="true"]')
  const copy = select<HTMLElement>('[data-unbox-copy]')
  const edition = select<HTMLElement>('[data-unbox-edition]')
  const handoff = select<HTMLElement>('[data-unbox-handoff]')
  const atmosphere = select<HTMLElement>('[data-unbox-atmosphere]')

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
      .fromTo(atmosphere, { scale: 1.08, opacity: 0.45 }, { scale: 1, opacity: 0.9 }, 0)
      .fromTo(copy, { y: 64, opacity: 0.35 }, { y: 0, opacity: 1 }, 0.02)
      .fromTo(lid, { yPercent: 0, rotateX: 0 }, { yPercent: -76, rotateX: -68 }, 0.18)
      .fromTo(interior, { opacity: 0.05, scaleY: 0.62 }, { opacity: 1, scaleY: 1 }, 0.2)
      .to(base, { yPercent: 7, scale: 1.025 }, 0.2)
      .fromTo(
        bottles,
        { yPercent: 58, opacity: 0, rotate: -2 },
        { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.07 },
        0.34,
      )
      .fromTo(edition, { y: 28, opacity: 0 }, { y: 0, opacity: 1 }, 0.5)
      .to(
        bottles.filter((_, index) => index !== 1),
        { xPercent: (index) => (index ? 56 : -56), opacity: 0.24 },
        0.7,
      )
      .to(selectedBottle, { yPercent: -12, scale: 1.13 }, 0.7)
      .fromTo(handoff, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.78)

    return
  }

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    })
    .fromTo(lid, { yPercent: 0, rotateX: 0 }, { yPercent: -34, rotateX: -28 }, 0.08)
    .fromTo(
      bottles,
      { yPercent: 16, opacity: 0.58 },
      { yPercent: 0, opacity: 1, stagger: 0.04 },
      0.2,
    )
    .fromTo(handoff, { opacity: 0.35 }, { opacity: 1 }, 0.65)
}
