# Motion architecture

## Principles

Motion is progressive enhancement. Terrova renders complete semantic content before hydration and never uses animation to reveal essential copy, navigation or calls to action. GSAP owns scroll timelines, Lenis owns optional smooth scrolling, and CSS owns layout and the static/reduced-motion composition. Framer Motion remains available for isolated UI feedback but is not used for scene orchestration.

## Runtime boundaries

- `SmoothScroll` is the single page-level client entry point for Lenis. Its lifecycle is reusable and contains no Discover-specific selectors.
- `useSmoothScroll` integrates Lenis with the GSAP ticker and `ScrollTrigger.update`, disables itself for `prefers-reduced-motion`, and guarantees cleanup across navigation, Strict Mode and HMR.
- `useSceneTimeline` is the reusable scene lifecycle. It creates a scoped GSAP context, selects Full or Reduced mode through media queries, refreshes ScrollTrigger after setup and reverts every timeline on cleanup.
- Discover owns only `createDiscoverTimeline`, passed into the generic scene lifecycle. Future scenes must provide their own setup functions rather than adding selectors to the shared runtime.

## Modes

### Full

Landscape viewports at 1024px and above use the complete scroll narrative. The Discover frame stays sticky for a multi-viewport section while the bottle, atmospheric field, headline and supporting copy move at restrained independent rates. The product remains anchored and the handoff to the existing Unbox boundary appears near the end.

### Reduced

Portrait and sub-1024px viewports retain a shorter sticky composition with smaller transform ranges. The bottle and contour field carry depth; the headline remains stable and readable. Mobile navigation uses native `details`/`summary`, so it is keyboard-operable without client state.

### Static

When `prefers-reduced-motion: reduce` is active, Lenis and scene timelines do not initialize. The Discover section collapses to one complete editorial viewport, all transforms are removed, the scroll prompt is hidden and the handoff remains available. The same composition is also the no-JavaScript fallback because no essential element starts hidden.

## Performance and accessibility

- Animation is limited to transforms and opacity; scroll handlers do not read and write layout per frame.
- The SVG bottle and contour study have fixed view boxes and require no network request, preventing CLS.
- Decorative atmosphere and product theatre are hidden from assistive technology; the temporary bottle SVG has descriptive text only in source documentation because its rendered parent is decorative.
- All links retain visible `:focus-visible` treatment and meaningful labels.
- No WebGL, canvas runtime, video or large raster media is included in this increment.

## Temporary asset contract

`DiscoverBottle` is an isolated, original SVG/CSS art-direction study. It establishes silhouette, scale, overlap and lighting without encoding assumptions about final photography. Replace the component as a unit when production assets arrive.

Production replacement still requires:

1. final bottle and label artwork with approved packaging typography;
2. transparent high-resolution bottle photography or an approved rendered packshot;
3. optional art-directed environmental still or short loop, supplied in responsive formats with mobile crops;
4. final font licensing decision if Terrova moves beyond the documented system stacks.

The current typography uses production-safe system stacks: Iowan Old Style/Baskerville for editorial display and Helvetica Neue/Segoe UI/Arial for interface copy. No external font service is called at runtime.
