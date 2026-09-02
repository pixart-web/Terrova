# Production asset manifest

## Purpose

The complete seven-scene homepage currently uses original CSS/SVG art-direction studies. They define composition, scale, layering and replacement boundaries without introducing unlicensed photography or coupling scene mechanics to temporary artwork.

## Replaceable components

| Component           | Current study                             | Production replacement needed                                                                |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `DiscoverBottle`    | Inline SVG glass/label silhouette         | Approved transparent bottle packshot and final Edition 01 label                              |
| `TerrovaBox`        | Layered CSS lid, interior and base        | Final structural packaging renders for closed/open states, aligned to one shared perspective |
| `BottleSet`         | Three wrappers around `IndividualBottle`  | Three transparent bottle packshots with consistent lighting and colour-managed glass         |
| `IndividualBottle`  | CSS glass, foil and paper label           | Reusable responsive packshot or approved rendered bottle family                              |
| `OriginLandscape`   | SVG contours, gradient sun and CSS ridges | Four art-directed landscape stills or restrained loops with desktop/mobile crops             |
| `ProducerImageSlot` | Initials-based documentary frame          | Approved producer portraits with rights, focal metadata and responsive sources               |

Process reuses `IndividualBottle` and `TerrovaBox` to create continuity from Origins without adding a new media dependency. Choose Your Journey reuses one `IndividualBottle` instance per plan in a shared stage; these are art-direction studies, not representations of plan inclusions.

Your Taste and Final CTA also reuse `IndividualBottle`. Their constellation/trace artwork is inline SVG and CSS geometry with no network request. The final bottle represents an unresolved future discovery, not a real SKU or personalized recommendation.

## Interface contract

- Product assets remain decorative in scene markup; all narrative text exists as semantic HTML outside the artwork.
- Replacement components must retain their current outer class names and data attributes or update the colocated timeline at the same time.
- Bottle and box sources need transparent backgrounds, stable intrinsic dimensions and art-directed mobile crops where applicable.
- Landscape sources must support the palette tone supplied by `OriginNarrative` without embedding region-specific animation logic.
- Final media should be served through Payload Media with explicit width/height, modern formats and responsive sizes. CMS media rendering remains outside the completed homepage milestone.

## Known limitations

- The CSS box communicates opening and depth but is not a physically accurate packaging model.
- Bottle glass, reflections and label paper are indicative rather than colour-accurate.
- Landscapes intentionally communicate terrain and atmosphere without claiming documentary specificity.
- Producer slots are spatial placeholders; they do not represent the named demo producers.
- The cross-scene bottle handoff is a matched visual cut between isolated scene roots, not one persistent 3D object.
- Journey bottle tones distinguish editorial atmospheres only. They do not communicate bottle count, inventory or contractual plan contents.
- Taste signals and final coordinates are fictional art-direction content. They must not be presented as stored customer history when production data is connected later.
