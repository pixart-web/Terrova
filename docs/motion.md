# Motion architecture

## Principles

Motion is progressive enhancement. Terrova renders complete semantic content before hydration and never uses animation to reveal essential copy, navigation or calls to action. GSAP owns scroll timelines, Lenis owns optional smooth scrolling, and CSS owns layout and the static/reduced-motion composition. Framer Motion remains available for isolated UI feedback but is not used for scene orchestration.

## Runtime boundaries

- `SmoothScroll` is the single page-level client entry point for Lenis. Its lifecycle is reusable and contains no Discover-specific selectors.
- `useSmoothScroll` integrates Lenis with the GSAP ticker and `ScrollTrigger.update`, disables itself for `prefers-reduced-motion`, and guarantees cleanup across navigation, Strict Mode and HMR.
- `useSceneTimeline` is the reusable scene lifecycle. It creates a scoped GSAP context, selects Full or Reduced mode through media queries, refreshes ScrollTrigger after setup and reverts every timeline on cleanup.
- Discover, Unbox, Origins, Process, Choose Your Journey, Your Taste and Final CTA each own a colocated timeline factory passed into the generic scene lifecycle. Scene selectors never enter the shared runtime.

## Cross-scene continuity

The production scenes use separate DOM roots and timelines so navigation/HMR cleanup remains deterministic. Continuity is created through matched visual anchors and overlapping colour fields rather than one global master timeline:

1. Discover ends with its bottle centred against Ink and introduces the Unbox label.
2. Unbox begins through a dark-to-Chalk transition, opens the box and separates three bottles. The centre Vine bottle remains dominant while the outer bottles recede.
3. Origins begins with the same scale, tone and vertical bottle axis. That anchor reduces in scale as provenance content replaces the commerce object.
4. Origins resolves into a Chalk gradient. Process continues that paper field as one four-act typographic sequence around the inherited bottle axis: search, curate, deliver and taste.
5. Process hands its Terracotta/Wine line into the dark Choose Your Journey stage. One plan occupies the stage at a time while the adjacent plan names remain directly operable.
6. Choose Your Journey releases its Wine atmosphere into a light paper field. Your Taste retains the same trace motif while one bottle accumulates four editorial discovery signals.
7. Those signals resolve into the future Wine Profile idea, then lose density as Final CTA returns to Ink and leaves one unknown bottle. The Ink field continues directly into the global footer.

This matched-anchor strategy avoids cross-component element ownership, layout reads in animation loops and timeline coupling between scenes.

## Modes

### Full

Landscape viewports at 1024px and above use the complete scroll narrative. Discover stays sticky for its product reveal. Unbox uses a longer pinned 2.5D sequence for the box lid, interior and staggered bottles. Origins uses a pinned editorial stage where four typed records replace one another while the selected bottle and landscape layers move at independent restrained rates. Process pins one shared composition while four semantic list entries replace one another. Choose Your Journey pins one shared plan stage; plan changes are explicit UI interactions rather than scroll-controlled purchasing decisions. Your Taste progressively accumulates four signals, their traces and a Wine Profile resolution. Final CTA uses a shorter, decisive closing timeline.

### Reduced

Portrait and sub-1024px viewports retain a shorter Discover/Unbox composition with smaller transform ranges. Origins, Process and Your Taste become readable vertical editorial sequences instead of reproducing the desktop pinned metaphor. Choose Your Journey keeps its three touch-sized selectors above one shared plan stage. Final CTA fits its content and actions into one natural-height closing composition. Mobile navigation uses native `details`/`summary`, so it is keyboard-operable without client state.

### Static

When `prefers-reduced-motion: reduce` is active, Lenis and scene timelines do not initialize. Discover collapses to one editorial viewport, Unbox shows the box already open with the complete bottle set, Origins, Process and Your Taste render all records in document order, and Choose Your Journey exposes all three plan narratives and CTAs. Final CTA renders its complete promise and `/boxes` links without a scrub. Handoffs remain readable. The same compositions are the no-JavaScript fallback through the server-rendered `data-motion-mode="static"` state.

## Content boundary prepared for Payload

Scene mechanics do not import CMS types. `UnboxNarrative` contains the edition-level copy and bottle labels. `OriginNarrative` contains stable identifiers, place/country, coordinates, producer metadata, editorial copy and an art-direction tone. `ProcessStep` keeps the four-act sequence data-driven. `PlanPresentation` describes only editorial plan content and numeric money; it deliberately excludes bottle counts and payment-provider identifiers. `TasteSignal` models optional place/grape/style context, coarse sentiment and display weight without pretending that ratings, persistence or recommendation logic exists. These demo records can be replaced by adapters without changing timeline selectors or scene markup.

## Performance and accessibility

- Animation is limited to transforms and opacity; scroll handlers do not read and write layout per frame.
- The SVG bottle and contour study have fixed view boxes and require no network request, preventing CLS.
- Decorative atmosphere and product theatre are hidden from assistive technology; the temporary bottle SVG has descriptive text only in source documentation because its rendered parent is decorative.
- All links and plan selectors retain visible `:focus-visible` treatment and meaningful labels. The selected plan is exposed with `aria-pressed`, not colour alone; the Most Popular label remains textual and accessible.
- No WebGL, canvas runtime, video or large raster media is included in this increment.
- All scene timelines animate only transform and opacity. No layout measurements occur inside animation ticks.
- Your Taste and Final CTA reuse the existing `IndividualBottle`; their SVG traces are inline, fixed-view-box decoration. No new runtime dependency or media request was introduced.
- Mobile uses natural-height Taste/Final compositions, and the desktop closing scene is materially shorter than the accumulation scene to reduce total scroll fatigue.

## Homepage completion continuity pass

M5 made only scoped cross-scene refinements:

1. Journey's existing handoff now resolves into Your Taste rather than a placeholder.
2. Wine/trace motifs continue across Journey, Taste and Final CTA while their colour fields deliberately change rhythm.
3. Scene numbering and handoff language now complete 01–07 consistently.
4. The final Ink field continues into the global footer without an unrelated colour break.
5. Mobile Taste and Final CTA use natural height, avoiding two additional pinned narratives at the end of the page.

## Temporary asset contract

`DiscoverBottle` is an isolated, original SVG/CSS art-direction study. It establishes silhouette, scale, overlap and lighting without encoding assumptions about final photography. Replace the component as a unit when production assets arrive.

Production replacement still requires:

1. final bottle and label artwork with approved packaging typography;
2. transparent high-resolution bottle photography or an approved rendered packshot;
3. optional art-directed environmental still or short loop, supplied in responsive formats with mobile crops;
4. final font licensing decision if Terrova moves beyond the documented system stacks.

The current typography uses production-safe system stacks: Iowan Old Style/Baskerville for editorial display and Helvetica Neue/Segoe UI/Arial for interface copy. No external font service is called at runtime.

The complete temporary-asset inventory and replacement requirements are maintained in [`assets.md`](./assets.md).
