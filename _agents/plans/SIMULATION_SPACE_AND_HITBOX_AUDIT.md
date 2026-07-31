# Simulation audit — pointer hitboxes and canvas-space utilisation

**Date:** 2026-07-29 · **Trigger:** founder report on the vector-addition page —
(a) *"the drag feature is not working… when I move the cursor to the left of the hotspot the drag works, but not when it's actually on the hotspot"*, and
(b) *"since we are working in only one quadrant… the rest of the three quadrants (75% of the space) are being wasted… adjust the coordinates so the origin is near the left bottom, so the vectors can be bigger. Analyze every simulation for such wastage of space."*

Two reusable audit scripts came out of this. Run them before shipping any new interactive board.

| Audit | Script |
|---|---|
| Pointer-guard (dead hotspots) | `node scripts/audit/svg-pointer-guard-audit.mjs` |
| vector_board space utilisation | `npx tsx scripts/audit/_vector_board_space_audit.mts` |
| math_graph default bounds | `npx tsx scripts/audit/_math_graph_bounds_audit.mts` |

---

## 1. The dead hotspot — root cause and fix

**SVG has no z-index: later siblings paint on top AND receive the pointer.** In
`DraggableHead` the three circles were ordered

```
1. r = radius + 12   fill="transparent"   ← the hit area, with the handlers
2. r = radius        fill={color}          ← halo, NO pointer-events guard  ✗
3. r = radius − 3    fill={color}          pointerEvents="none"             ✓
```

Circle 2 is painted *after* the hit area and was not opted out, so it swallowed
every `pointerdown` within `radius` (9px) of the centre. That is a **dead disc
sitting exactly on the dot the student is told to grab**, with a working annulus
around it — precisely the founder's "works to the left, not on it".

Measured before the fix: at the handle centre `document.elementFromPoint`
returned the decorative circle, and **19 of the 41 px across the handle were
dead**. After adding `pointerEvents="none"` to circle 2: hit target resolves at
the centre and **0 dead pixels**. A synthetic press exactly on the hotspot then
dragged correctly (angle 90° → 120°, |R| 8.5 → 6.0 N).

**This one component is behind every `vector_board` and all of Vector Lab**, so
the single-attribute fix covers all of them.

### The rest of the estate is clean

218 simulation files; 48 contain pointer handlers; 16 implement real drag.
The audit flagged 9 further candidates — **all false positives on inspection**
(the roller-coaster car, the orbit ship, a guess marker: decorative shapes with
no hit area beneath them).

The newer bench families — `mechanics-bench/fbd`, `mechanics-bench/energy`,
`circuit-bench`, `optics-bench`, `field-bench`, `motion-lab` — already get this
right, and deliberately: they paint the visible ring **first** with
`style={{ pointerEvents: 'none' }}` and the transparent hit disc **last**, with
comments explaining the ordering. `DraggableHead` (the oldest of the drag
components) was the only one with it backwards.

> **House rule going forward:** in any interactive SVG, either paint the hit
> target LAST, or guard *every* decorative sibling with `pointerEvents="none"`.
> Never leave one unguarded — tsc, ESLint and Zod cannot see this class of bug,
> and it presents as "the sim feels broken" rather than as an error.

---

## 2. Canvas-space waste — the founder was right, and it was worse than 75%

Measured across all 9 `vector_board` archetypes by running each archetype's own
pure `build()` and taking the bounding box of everything it actually draws:

| | before | after |
|---|---|---|
| Median ink coverage (drawn bbox ÷ canvas) | **5%** | **30%** |
| Archetypes that could be ≥50% bigger | **9 of 9** | **0 of 9** |
| `polygon-equilibrium` scale | 11.3 px/unit | **55.5** (4.9×) |
| `vector-anatomy` | 18.9 | **56.5** (3.0×) |
| `dot-cross` | 15.5 | **46.3** (3.0×) |
| `resolution` | 18.9 | **51.8** (2.7×) |
| `triangle-law` | 15.5 | **34.2** (2.2×) |
| `scalar-vs-vector` | 43.5 | **70.0** (1.6×) |

### Why it was so bad

Two compounding causes, neither visible without measuring:

1. **The origin was centred and all four quadrants were reserved**, while almost
   every construction lives in the first quadrant. Exactly the founder's point.
2. **`reach` was over-estimated.** It was guessed from the *sum* of the seed
   magnitudes plus a full `max_mag` allowance whenever anything was draggable.
   A 6 N and a 5 N vector at 60° spans **8.1** units — `reach` claimed 11, then
   reserved that symmetrically in all four directions.

### The fix — fit the content box, don't guess a reach

`packages/book-renderer/blocks/vector-board/frame.ts` (new, pure, node-testable):

- run the archetype's `build()` at its final step with the **seed** vectors
- take the world-space bbox of every arrow, guide and resultant
- add a fixed **34% drag headroom**, fit the box to the canvas, centre it
- **derive `max_mag` FROM the frame** (`maxMagForTail`) instead of the frame
  from `max_mag`, so tight framing can never let a dragged tip leave the view

The residual "gain" of ≈1.34 on every archetype *is* that drag headroom — i.e.
the framing is now optimal to within the reserve we deliberately keep.

**Invariant preserved:** the box is computed from the STATIC seed vectors, never
the live dragged ones. Verified in-browser — the goal ring's geometry was
byte-identical across 14 consecutive drag frames, so the earlier
"circle size flickers while dragging" bug has not returned.

`frameAnchor` / `frameQuadrant` / `frameReach` on `ArchetypeDef` are now
**`@deprecated` and ignored** (kept so existing definitions compile). They were
a worse solution to the same problem, and the quadrant-merge semantics had
already produced one near-miss bug. `defaultFrame` remains the manual override.

---

## 3. `math_graph` — all 37 archetypes now have default bounds

**Done 2026-07-29** on the founder's instruction ("work through them and perfect them").
Audit: `npx tsx scripts/audit/_math_graph_bounds_audit.mts` — it asserts coverage,
validity, aspect-consistency, **content containment** (bounds must not clip the
construction), **no-regression** (a default must never be wider than the generic
±6 box it replaces), and **live-page invariants** keyed to the params actually
shipping on published pages.

### What changed

`ARCHETYPE_DEFAULT_BOUNDS` went from 1 entry to **37**, and entries may now be a
**function of the archetype's params** — so overriding `r`, `shape`, `base`,
`demo`, `kind` or the seed coordinates still yields a correct view instead of
re-breaking. Two helpers keep it honest:

- `radial(r)` — a disc of radius r about the origin, giving the construction
  **74% of the width** (the generic box gave 50% at r = 3, and 17% at r = 1).
- `fit(x0,x1,y0,y1)` — pads an explicit content box (12% sides/bottom, 34% top
  for the overlay panels) then equalises the two spans, so `keepAspectRatio` has
  nothing left to silently stretch.

An entry may also set **`keepSquare: false`**. `MathGraphBoard` previously forced
equal unit scale on every archetype-mode board, which is wrong for plots whose
axes differ by orders of magnitude — 200 trials against a probability of 0.5, or
12 sequence terms against values reaching 41.

### Blast radius, measured

122 `math_graph` blocks exist across the books. **82 already set an explicit
`spec.bounds`** and are untouched — which is also the correction to an earlier
claim in this doc: the "clipped" archetypes were never visibly broken, because
every existing page had already worked around them **per page**. That per-page
workaround is exactly what an archetype default is supposed to make unnecessary.

**40 blocks improve**, 6 of them on **live** Class 9 Mathematics pages.

### Two real bugs found on live pages while doing this

Both would have shipped silently; both are now locked behind assertions.

1. **The sequence-pattern board was clipping half its own data.** With the square
   ±6 box, the live *Linear Patterns* page (a = 1, d = 2, 6 terms → values 1…11)
   showed only terms 1, 3 and 5 — **terms 7, 9 and 11 were off-screen**. My first
   attempt then framed it from the slider's *maximum* (a_max = 30) rather than
   the page's seed, which squashed the real points into a sliver; fixed to frame
   from the seeded a and d.
2. **Tight-fitting the coordinate-geometry boards pushed the origin out of view.**
   On the live *Distance Formula* page a snug fit to P(1,1) and Q(6,5) put both
   axes outside the box — on a page whose entire purpose is reading coordinates.
   The origin is now forced into the box for every coordinate-geometry board.

Two further regressions were caught by the no-regression assertion rather than by
eye: `reflection` and `piecewise-highlight` initially came out **wider** than the
generic box they replaced, because `fit`'s asymmetric top padding inflates tall
or symmetric content. `reflection` now uses the symmetric `radial()` instead.

### Verified in the browser

Read back from JSXGraph's own resulting bounding box, not judged from screenshots:

| board | before | after |
|---|---|---|
| `unit-circle` | 17% of width | **74%** |
| `sector-explorer` (r = 3) | 50% | **74%** |
| `distance-explorer` (live) | span 12, origin out of view after first fix | **span 7.4, both axes visible** |
| `sequence-pattern` (live) | 3 of 6 terms visible | **all 6 visible** |
| `reflection` (live) | span 12 | **span 11.6** |

## 4. Still open — the bench/lab families

The bench/lab families each own their own canvas and projection
(`mechanics-bench`, `circuit-bench`, `optics-bench`, `field-bench`, `motion-lab`).
They share no frame model, so measuring them needs a per-family harness.

**Deliberately not started** — founder direction 2026-07-29: *"do not work on the
bench lab families because they are still a work in progress."*

> **Note (2026-07-29):** `mechanics-bench/pulley/{Readouts,PulleyLab}.tsx` were
> mid-edit by a concurrent session while this audit ran and currently fail to
> parse. Not touched here.
