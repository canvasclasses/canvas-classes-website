'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const STYLE_PREFIX =
  'A wide hand-drawn coloured illustration on a deep charcoal near-black background, ' +
  'muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), ' +
  'no glow, no neon, no orange haze, no 3D render look, no lens flare.';
const STYLE_SUFFIX =
  'Clean, textured brush strokes, warm and inviting, textbook-illustration feel, ' +
  'not photorealistic, not glossy, no sci-fi lighting. No text, no labels, no arrows.';

const HEROES = [
  {
    slug: 'rutherfords-model',
    alt: "Rutherford's gold-foil experiment — a thin sheet of gold foil with a stream of alpha particles passing mostly straight through a vast empty atom, a few sharply deflected by a tiny dense nucleus at the centre.",
    prompt: `${STYLE_PREFIX} Ultra-wide scene: on the left, a thin vertical sheet of hammered gold-coloured foil (ochre and cream texture). A stream of small terracotta dots (alpha particles) travels left to right toward it — most pass straight through into the wide, mostly empty cream-toned space beyond, only a rare few curving sharply backward after grazing a small, dense indigo-teal dot (the nucleus) suspended alone in that vast open space. The composition conveys how empty an atom mostly is, with all its mass concentrated in one tiny point. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'atomic-number-mass-number-isotopes',
    alt: 'Three small atomic nuclei of the same element side by side, each with the same number of ochre proton dots but a different number of cream neutron dots, showing isotopes of one element.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: three small, evenly spaced circular nuclei drawn side by side across the centre of the banner, each a tight cluster of ochre dots (protons) — the same count in all three — surrounded by a ring of thin indigo electron orbits. Each nucleus differs only in its number of cream-coloured neutron dots tucked among the protons: the first sparse, the second a little fuller, the third fullest. Faint sage-green dotted outlines connect the three to suggest they are variations of one family. The composition conveys identity (same element) alongside difference (different mass). ${STYLE_SUFFIX}`,
  },
  {
    slug: 'wave-nature-em-radiation',
    alt: 'A smooth travelling wave in teal and indigo stretching across the banner, its crests and troughs gradually compressing from long, lazy curves on the left to tight, rapid ripples on the right.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: a single smooth, continuous wave drawn as a hand-inked teal line travelling left to right across the full width of the banner, its wavelength gradually shrinking — wide, lazy crests on the left tightening into short, rapid ripples on the right — with a faint indigo companion wave oscillating at right angles to it, echoing the perpendicular electric and magnetic fields of a light wave. The composition conveys motion, rhythm, and a continuous range from long to short wavelength, without depicting a rainbow spectrum. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'planck-quantum-photoelectric',
    alt: 'Small discrete packets of light drawn as separated cream dots travelling toward a dark metal surface, each striking it and knocking a single teal electron dot free.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: a vertical slab on the right representing a metal surface, textured in charcoal and indigo. From the left, a diagonal line of small, distinctly separated cream dots — drawn as individual packets rather than a continuous beam — travels toward the surface. Where a packet strikes the surface, a single small teal dot (an electron) is shown popping cleanly away from it on the far side, leaving a short trail. The composition conveys light behaving as discrete, countable packets rather than a continuous flow. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'atomic-spectra-hydrogen',
    alt: 'A narrow glass discharge tube on the left producing a fan of a few sharp, separated coloured lines on the right, against a dark charcoal background — the discrete lines of a hydrogen emission spectrum.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: a slim glass discharge tube drawn on the left in cream and indigo outline. To its right, spreading across the rest of the banner, a small number of sharp, widely separated thin vertical lines in teal, sage-green, indigo, and terracotta — each a distinct hand-drawn stroke on the charcoal background, with generous dark space between them. The composition conveys that only a few discrete lines appear, not a continuous smear of colour, evoking the hydrogen atom's fingerprint spectrum. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'bohrs-model',
    alt: "A nucleus with two concentric circular orbits around it; a small teal electron dot leaps from the outer orbit to the inner one, releasing a short cream burst of light at the moment it jumps.",
    prompt: `${STYLE_PREFIX} Ultra-wide scene, centred: a small ochre-cream nucleus with two clean concentric indigo rings drawn around it like a simple solar-system diagram. A small teal dot (electron) sits on the outer ring, with a curved dotted arc showing its path leaping inward to the inner ring; at the point of arrival, a brief cream-coloured burst of light lines radiates outward, hand-drawn as short straight strokes. The composition conveys a single deliberate quantum jump between two fixed paths, not a blur or continuous glow. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'de-broglie-heisenberg',
    alt: 'A single small dot travelling left to right that gradually dissolves from a sharp point into a soft, overlapping ripple pattern, and a second faint duplicate trail beside it suggesting an uncertain, blurred position.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: on the left, a single sharp teal dot with a short, confident straight trail behind it, like a tiny travelling particle. Moving rightward across the banner, the same dot gradually softens and dissolves into a set of overlapping sage-green ripple arcs, as if the point has become a wave. Around the dissolving dot, a second, fainter and slightly offset ghost trail in indigo is layered on top, suggesting its exact position can no longer be pinned down. The composition conveys a single idea shifting from certain and particle-like to blurred and wave-like across the frame. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'quantum-mechanical-model',
    alt: 'A soft, cloud-like sage-green blob around a small central nucleus, denser and darker near the centre and fading into scattered faint dots toward the edges, suggesting a probability cloud rather than a fixed path.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene, centred: a tiny ochre-cream nucleus at the very centre, surrounded not by rings or orbits but by a soft, irregular sage-green cloud of scattered dots — densest and darkest close to the nucleus, gradually thinning into a scatter of faint, isolated dots toward the outer edges of the cloud, with no sharp boundary. Faint concentric dotted contour lines pass through the cloud, hinting at nested shells without ever being drawn as solid rings. The composition conveys a probability cloud — likely-but-uncertain electron location — replacing any fixed path. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'shapes-energies-orbitals',
    alt: 'Three simple hand-drawn orbital shapes floating side by side — a small round sphere, a dumbbell shape with two lobes, and a four-lobed cloverleaf — arranged left to right in increasing size.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: three distinct orbital silhouettes floating in open space, evenly spaced left to right and gradually increasing in size and complexity. On the left, a small solid sage-green sphere (s orbital). In the middle, a teal dumbbell shape made of two rounded lobes pinched at the centre (p orbital). On the right, a larger indigo four-lobed cloverleaf shape (d orbital). Each shape has a soft hand-drawn dotted outline and a faint texture, floating with generous dark space around it and no connecting lines between them. The composition conveys a gallery of distinct three-dimensional forms, increasing in shape complexity. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'filling-orbitals-electronic-configuration',
    alt: 'A rising staircase of short horizontal steps, each step holding one or two small dots, filled in order from the lowest, leftmost step upward and rightward — electrons filling orbitals in order of increasing energy.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene: a simple ascending staircase drawn from lower-left to upper-right, each step a short horizontal indigo bar at a slightly higher level than the last. Small teal and ochre dots (electrons) sit filled in on the lower, already-occupied steps, while the upper-right steps remain bare and outline-only, waiting to be filled. A single dot is shown mid-air just above the next empty step with a short dotted arc, about to land. The composition conveys an orderly, one-step-at-a-time filling sequence from low to high energy. ${STYLE_SUFFIX}`,
  },
  {
    slug: 'stability-filled-halffilled-subshells',
    alt: 'A perfectly symmetric ring of five evenly spaced dots around a centre point, drawn clean and balanced, beside a fainter, unevenly clustered second ring — contrasting a symmetric, stable arrangement with a lopsided one.',
    prompt: `${STYLE_PREFIX} Ultra-wide scene, two small motifs side by side. On the left, a perfectly symmetric rosette: five small teal dots evenly spaced in a clean circle around a central point, connected by faint thin indigo spokes of equal length — calm, balanced, orderly. On the right, a second circle of the same size but with its dots clustered unevenly to one side, spokes of uneven length, slightly tilted and asymmetric — visually restless by comparison. Generous dark space separates the two motifs, inviting a direct visual comparison between balance and imbalance. ${STYLE_SUFFIX}`,
  },
];

(async () => {
  await bw.withDb(async (db) => {
    for (const h of HEROES) {
      const page = await db.collection('book_pages').findOne({
        book_id: 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e',
        chapter_number: 2,
        slug: h.slug,
      });
      if (!page) { console.error(`MISSING PAGE: ${h.slug}`); continue; }

      const existing = page.blocks || [];
      if (existing.some((b) => b.order === 0 && b.type === 'image')) {
        console.log(`SKIP (already has hero): ${h.slug}`);
        continue;
      }

      const heroBlock = {
        id: uuidv4(),
        order: 0,
        type: 'image',
        src: '',
        alt: h.alt,
        caption: '',
        width: 'full',
        aspect_ratio: '16:5',
        generation_prompt: h.prompt,
      };
      const shifted = existing.map((b) => ({ ...b, order: (b.order ?? 0) + 1 }));
      const newBlocks = [heroBlock, ...shifted];

      const res = await bw.savePage(db, { slug: h.slug }, newBlocks, {
        author: 'agent',
        summary: `Insert missing hero banner image block (pending generation_prompt) — page currently has no order:0 hero image`,
      });
      console.log(`OK: ${h.slug} -> version ${res.version}, blocks ${existing.length} -> ${newBlocks.length}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
