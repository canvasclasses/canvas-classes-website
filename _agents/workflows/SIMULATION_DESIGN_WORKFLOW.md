---
description: Simulation Design Workflow — Canvas Classes Interactive Labs
---

# SIMULATION DESIGN WORKFLOW v1.0

> **Design principle:** Every simulation — Chemistry, Physics, Biology — must feel like it belongs to the same product. Never invent new colors, fonts, or component patterns. This document is the single source of truth. When it conflicts with anything else, it wins.
>
> **Building a 3D anatomy model (heart/nephron/neuron — glTF + three.js/R3F)?** This
> doc covers 2D/SVG canvas sims. For 3D organ models use the dedicated
> [`ANATOMY_3D_SIMULATOR_WORKFLOW.md`](ANATOMY_3D_SIMULATOR_WORKFLOW.md) (Z-Anatomy →
> Blender → glTF pipeline, the viewer template, the guided "follow a drop of blood"
> pattern, and all the hard-won gotchas). It inherits the colour/typography tokens below.

---

## QUICK REFERENCE (read this first)

```
BACKGROUND HIERARCHY    #0d1117 → #0B0F15 → #151E32
PRIMARY ACCENT (fg)     violet-300 #c4b5fd   ← light tier ONLY on the dark bg
SECONDARY ACCENT (fg)   sky-300    #7dd3fc   ← at most ONE, for a 2nd axis
SUCCESS / OK            #6ee7b7      ERROR / BAD   #fca5a5   (pass/fail only)
TEXT                    #e2e8f0 → #94a3b8 → #64748b → #475569
ATOM: Carbon            fill #2d3a5a  stroke #6366f1   (viz-internal, not fg text)
ATOM: Oxygen            fill #d64545  stroke #991b1b
ATOM: Hydrogen          fill #0a2218  stroke #34d399
ATOM: Functional group  fill #8b5cf6  stroke #5b21b6
```

> **Two-colour rule + tokens (2026-07-23):** the CANONICAL source of truth for
> colour and typography is now code, not this table:
> **`packages/book-renderer/blocks/simulations/_shared/tokens.ts`** (imported via
> `_shared`). A sim uses ONE primary accent + AT MOST ONE secondary, both LIGHT
> tier; mid/dark tiers (`#6366f1`, `#7c3aed`, …) may only be low-opacity fills or
> SVG-internal, never foreground text. Compose the shared chrome components
> (`SimShell`, `SimHeader`, `StepBar`, `SimTabs`, `SimSlider`, `NavButtons`,
> `ExpertTip`, `SectionLabel`) instead of hand-rolling — see §4. An automated gate
> (`npm run lint:sims`, and the pre-push hook) enforces this; see §12.

---

## 1. BACKGROUND & SURFACE SYSTEM

| Layer | Hex | Usage |
|---|---|---|
| Page / simulator root | `#0d1117` | Outermost wrapper — must match page background exactly |
| Card surface | `#0B0F15` | Raised surfaces, info panels |
| Input / interactive surface | `#151E32` | Tabs, selectors, SVG canvas background |
| Canvas / visualization area | `radial-gradient(circle at center, #1e204a 0%, #050614 100%)` | SVG simulation viewports only |

**Rule:** The simulator root `<div>` must always use `background:'#0d1117'`. Never use a different value — mismatching this creates a visible break against the page background.

---

## 2. TYPOGRAPHY SYSTEM

### Font Stack — sans-serif ONLY
- **Use the inherited body sans-serif (Geist Sans) for ALL text in the simulator.** Do nothing — by inheriting from the page, the text picks up the right font automatically. No custom font imports.
- **Never use monospace fonts in a simulator.** That means:
  - ❌ no `font-mono` Tailwind class
  - ❌ no `fontFamily: 'monospace'`, `'Courier'`, `'Menlo'`, etc.
  - ❌ no `<code>` or `<pre>` tags around values shown to students
  - Monospace reads as raw data / source code, not as the natural prose-with-arithmetic feel a teaching simulator needs. It also clashes visually with the body Geist Sans typography of the surrounding book page.
- **Need digits to line up in a column (sliders, tables, time-series readouts)?** Use `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`) instead. Geist Sans supports OpenType `tnum`, so columns of numbers stay aligned WITHOUT the typewriter look. Example: `<span className="tabular-nums">1.000</span>`.
- **Italic math variables** (e.g. `M`, `m`, `n`, `χ`) → use `fontStyle: 'italic'` on a sans-serif glyph, not a monospace font. Matches the convention used in `OrbitalShapeExplorerSim` and the KaTeX-rendered formulas in the book pages.

### Division & Fractions — NEVER use the ÷ symbol
- **The `÷` (Unicode U+00F7) glyph is banned in simulator UI text.** From any normal viewing distance it reads as a `+` (the centre stroke of the divide sign looks like the cross of a plus). It silently makes "A ÷ B" look like "A + B" to students sitting at the back of a classroom or anyone glancing at the screen.
- **Use stacked numerator/denominator notation everywhere a division appears**, both in:
  - Formula headers (e.g. "M = [moles of solute] / [volume of solution]")
  - Step-by-step calculation rows (e.g. "moles of KMnO₄ = [15.80 g] / [158.03 g/mol] = 0.100 mol")
- **Implementation pattern** — a small `Frac` component renders the numerator/denominator stack inline with the surrounding text:

  ```tsx
  function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
    return (
      <span style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        verticalAlign: 'middle', lineHeight: 1.15, margin: '0 4px',
      }}>
        <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
        <span style={{
          padding: '2px 6px 0 6px',
          borderTop: '1.5px solid currentColor',
          width: '100%', textAlign: 'center',
        }}>{den}</span>
      </span>
    );
  }

  // Usage in a derivation step:
  <Frac num="15.80 g" den="158.03 g/mol" />
  ```

  When a row contains a `Frac`, align the row with `items-center` (not `items-baseline`) so the step number and result column sit visually centred on the fraction.

- **The ONLY exception** is when the simulator is explicitly teaching the `÷` glyph itself (e.g. an arithmetic-symbols flashcard sim) — and even then, call it out in a comment so future readers know it's intentional.
- **Inline prose like "Power = Work / Time" or "effort = load / 2"** — a plain ASCII forward slash `/` is acceptable for short descriptive captions. It doesn't have the ÷-as-+ ambiguity. Keep `Frac` for the prominent / displayed formula, use `/` for the sub-caption explaining it. (Example: `<p>P = W / t</p>` underneath, with `Frac` above showing the stacked version.)
- For multiplication, `×` (U+00D7) reads cleanly from a distance and stays. For subtraction use `−` (U+2212, the proper minus), not the hyphen.

### Scientific Notation — NEVER expose "e+23" to students
- **JavaScript's `Number.prototype.toExponential()` returns strings like `"6.022e+23"`. NEVER render that string directly in a simulator's UI.** The `e+` form is programming syntax — it's not what students see in NCERT or in any chemistry / physics textbook, and it actively confuses them.
- **Always render as `6.022 × 10²³`** — proper mantissa-times-power-of-ten form with the exponent in Unicode superscript digits.
- **Implementation pattern** — keep a tiny `prettyExp` helper that post-processes `toExponential()` output:

  ```tsx
  const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  function prettyExp(eNotation: string): string {
    const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
    if (!m) return eNotation;
    const mantissa = m[1];
    const expNum = parseInt(m[2], 10);
    if (expNum === 0) return mantissa;
    const sup = String(Math.abs(expNum)).split('')
      .map(d => SUP_DIGITS[parseInt(d, 10)]).join('');
    const sign = expNum < 0 ? '⁻' : '';
    return `${mantissa} × 10${sign}${sup}`;
  }

  // Use anywhere you'd otherwise call .toExponential() directly:
  prettyExp(value.toExponential(3))   // → "6.022 × 10²³"
  ```

- **Editable input fields** (where the user types a value back) need a *separate* "draft" formatter that returns plain `"6.022e+23"`, because `parseFloat()` cannot parse Unicode superscripts. Pattern: pretty form for the read-only display, raw e-notation for the editable draft initialised on focus.
- Negative exponents use the proper Unicode minus `⁻` (U+207B), not a hyphen.

### Scale & Usage

| Element | Tailwind class | Additional style |
|---|---|---|
| Simulator title (e.g. "Biomolecules Lab") | `text-2xl md:text-3xl font-black tracking-tight text-white` | Accent word in `color:#c4b5fd` (light-tier ACCENT — NOT the old dark `#7c3aed`) |
| Subtitle / descriptor | `text-[11px] font-bold uppercase tracking-widest` | `color:#475569` |
| Section heading (sidebar) | `text-xl font-black uppercase tracking-tighter` | `color:#e2e8f0` |
| Phase concept heading | `text-lg font-bold leading-snug text-white` | — |
| Step / rule label | `text-xs font-semibold uppercase tracking-widest` | accent color per phase |
| Body / explanation text | `text-base leading-snug` | `color:#94a3b8` |
| Metadata / badge text | `text-[10px] font-semibold uppercase tracking-widest` | `color:#64748b` |
| StepBar pill label | `text-[11px] font-black uppercase tracking-wider` | — |
| Sub-label under elements | `text-[10px]` | `color:#475569` |

**Rule:** Never go below `text-[10px]`. Never use `text-[9px]` for anything a student must read — only decorative labels.

**Rule — weight must scale DOWN with size (added 2026-07-21):** `font-black` (900) is reserved for `text-lg` and above — titles, headings, big numeric readouts. At `text-xs` / `text-[10px]` / `text-[11px]`, the heaviest weight a label may use is `font-semibold` (600); `font-black` at that size renders as a dense, hard-to-read smudge, especially in all-caps tracking-widest labels stacked near each other (found during the Eudiometer Lab v3 redesign — every section label on that sim was `text-[10px] font-black`, which was flagged as looking bad and heavy). The StepBar pill label keeps `font-black` as an exception because it sits alone inside a bordered pill, not stacked with other caption text. This applies to SVG `<text>` labels too: match the same weight ceiling to the pixel `fontSize`.

---

## 3. COLOR PALETTE — FULL REFERENCE

> **Canonical source: [`_shared/tokens.ts`](../../packages/book-renderer/blocks/simulations/_shared/tokens.ts).** Import colours from there (`ACCENT`, `ACCENT_2`, `ACCENTS`, `TEXT`, `OK`, `BAD`, `BORDER`) rather than pasting hex. The tables below are the human-readable reference; the file is what the code and the validator use.

### The two-colour rule (2026-07-23) — READ THIS

A simulator uses **ONE primary accent** plus **AT MOST ONE secondary accent**, and both must be **light-tier** colours, because they sit as foreground on a near-black background — a mid/dark tier (`#6366f1`, `#7c3aed`) reads muddy and pulls focus. Everything else is white/gray. Default primary is violet `#c4b5fd` (`ACCENT`); pick a secondary from `ACCENTS` only when the content has a genuine second axis (water vs solute, acid vs base, reactant vs product).

- **Base/mid/dark tiers** (`#6366f1`, `#7c3aed`, `#818cf8`, …) may appear ONLY as low-opacity background tints / active borders (`accentTint(ACCENT, 0.15)`) or inside the SVG visualization — **never as foreground text on the dark bg.**
- **Two sanctioned exceptions** (mark them `// sim-lint-ok` at the usage site): a real-world identity colour shown *inside the visualization* (a solute's true solution colour, an atom's periodic-table colour), and the `OK`/`BAD` pass-fail pair. These are data, not chrome.

### Accent / Semantic Colors

| Purpose | Color name | Hex values |
|---|---|---|
| Primary interactive / indigo | indigo | `#6366f1` (base) · `#818cf8` (mid) · `#c4b5fd` (light) · `rgba(129,140,248,0.15)` (bg tint) |
| Correct / D-series / success | emerald | `#059669` (dark) · `#10b981` (mid) · `#34d399` (light) · `#6ee7b7` (pale) |
| Warning / highlight / C5 | amber | `#d97706` · `#fbbf24` · `#fcd34d` |
| Error / L-series / wrong | red | `#dc2626` · `#991b1b` · `#f87171` |
| Epimer / secondary toggle | pink | `#ec4899` · `#f472b6` · `rgba(244,114,182,0.15)` |
| Structural label / violet | violet | `#7c3aed` · `#8b5cf6` · `#5b21b6` |

### Text & Border Hierarchy

| Purpose | Value |
|---|---|
| Primary text | `#e2e8f0` / `text-white` |
| Secondary text | `#94a3b8` |
| Muted / disabled | `#475569` |
| Ghost / barely-there | `#64748b` |
| Divider line | `rgba(255,255,255,0.05)` |
| Card border | `rgba(255,255,255,0.07)` |
| Interactive border (active) | `rgba(129,140,248,0.4)` |
| Interactive border (done) | `rgba(52,211,153,0.25)` |

---

## 4. COMPONENT PATTERNS — COPY EXACTLY

### 4a. Simulator Outer Wrapper
```tsx
<div className="p-4 md:p-6" style={{background:'#0d1117',color:'#e2e8f0',minHeight:'80vh'}}>
```

> **Prefer the shared components (2026-07-23).** The snippets in §4 are the
> reference for how the chrome looks; for NEW sims, import the ready-made
> components from `_shared` instead of pasting these — they bake in the correct
> font sizes/weights/colours so nothing can drift:
> ```tsx
> import { SimShell, SimHeader, SimTabs, StepBar, NavButtons, SimSlider, ExpertTip, SectionLabel, ACCENT, ACCENT_2, TEXT } from '../_shared';
> ```
> Each takes an optional `accent` prop (defaults to the violet `ACCENT`). Drop to
> raw markup only for the sim's bespoke canvas/visualization.

### 4b. Simulator Header  → prefer `<SimHeader title="…" accentWord="Lab" subtitle="…" badge={…} />`
```tsx
<div className="mb-4 flex justify-between items-start flex-wrap gap-2">
  <div>
    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
      [Subject] <span style={{color:'#c4b5fd'}}>Lab</span>
    </h2>
    <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{color:'#475569'}}>
      [Descriptor — e.g. "Interactive Glucose Explorer"]
    </p>
  </div>
  <div className="text-[10px] font-semibold uppercase tracking-widest pt-1" style={{color:'#64748b'}}>
    [Current molecule / topic badge]
  </div>
</div>
```

### 4c. StepBar (Phase Navigation Pills)
```tsx
<div className="flex items-center gap-2 mb-6 flex-wrap">
  {STEPS.map((s,i) => {
    const active=s.id===current, done=i<currentIndex;
    return (
      <button key={s.id}
        onClick={()=>done&&onGo(s.id)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
        style={{
          background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
          color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
          cursor: done ? 'pointer' : 'default',
        }}>
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color:'white' }}>
          {done ? '✓' : i+1}
        </span>
        {s.label}
      </button>
    );
  })}
</div>
```

### 4d. Back / Next Navigation
```tsx
<div className="flex justify-between items-center pt-2">
  <button onClick={onBack}
    className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8'}}>
    ← Back
  </button>
  <button onClick={onNext}
    className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
    style={{background:'rgba(99,102,241,0.18)',border:'1px solid rgba(129,140,248,0.4)',color:'#c4b5fd'}}>
    Next: [Phase Name] →
  </button>
</div>
```

### 4e. Concept Rule Block (plain text, no card)
```tsx
<div>
  <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'[phase accent]'}}>
    The Rule
  </p>
  <p className="text-white font-bold text-lg leading-snug">
    Rule text. <span style={{color:'#fbbf24'}}>Highlighted term</span>.
  </p>
</div>
```
**Anti-pattern:** Never wrap concept text in a bordered card. Plain text on the dark background is the correct style.

### 4f. Inline Toggle / Highlight Button (underline link style)
```tsx
<button onClick={()=>setActive(v=>!v)}
  className="self-start text-xs font-semibold transition-colors pb-0.5"
  style={{
    color: active ? '#fbbf24' : '#475569',
    borderBottom: `1px solid ${active ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
    background:'none', outline:'none',
  }}>
  {active ? '✓ Active label' : 'Inactive label'}
</button>
```

### 4g. Tab Selector (underline style, no pill boxes)
```tsx
<button onClick={()=>setView(key)}
  className="px-3 py-2 text-center transition-all"
  style={{
    borderBottom: `2px solid ${active ? accentColor : 'rgba(255,255,255,0.06)'}`,
    opacity: active ? 1 : 0.5,
    background:'none', outline:'none',
  }}>
  <div className="text-xs font-black" style={{color:accentColor}}>{label}</div>
  <div className="text-[10px]" style={{color:'#475569'}}>{sublabel}</div>
</button>
```

### 4h. Action / Reset Button (bordered pill)
```tsx
<button onClick={onReset}
  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
  style={{background:'rgba(99,102,241,0.10)',border:'1px solid rgba(129,140,248,0.3)',color:'#a5b4fc'}}>
  ↺ Reset to [Default State]
</button>
```

### 4i. SVG Canvas Viewport
```tsx
<div className="relative overflow-hidden flex items-center justify-center rounded-3xl"
  style={{
    minHeight:420,
    background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
    border:'1px solid rgba(99,102,241,0.2)',
  }}>
  <svg width="100%" height="100%" viewBox="0 0 800 600" style={{minHeight:420}}>
    {/* content */}
  </svg>
</div>
```

### 4j. Sidebar (Mechanism / Explanation Panel)
```tsx
<div className="lg:col-span-4 flex flex-col py-1 gap-5">
  <h2 className="text-xl font-black uppercase tracking-tighter" style={{color:'#e2e8f0'}}>
    [Panel Title]
  </h2>
  <div className="space-y-5 flex-grow">
    {steps.map(({id,title,body})=>(
      <div key={id} style={{
        transition:'all 0.3s ease',
        opacity: current===id ? 1 : 0.35,
        transform: current===id ? 'translateX(4px)' : 'none',
      }}>
        <h4 className="font-black text-[13px] uppercase tracking-widest mb-1"
          style={{color: current===id ? '#818cf8' : '#94a3b8'}}>{title}</h4>
        <p className="text-base leading-snug" style={{color:'#94a3b8'}}
          dangerouslySetInnerHTML={{__html:body}}/>
      </div>
    ))}
  </div>
  {/* Expert Tip — always at bottom.  Prefer <ExpertTip>…</ExpertTip>. */}
  <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
    <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{color:'#c4b5fd'}}>Expert Tip</div>
    <p className="text-sm font-medium leading-snug italic" style={{color:'#e2e8f0'}}>&ldquo;[Mnemonic or key insight]&rdquo;</p>
  </div>
</div>
```
> Note: the old version of this block used `text-[9px] font-black … text-white
> font-bold` — three violations of this doc's own §2 rules (sub-10px text,
> font-black at tiny size, pure-white heavy body). Corrected 2026-07-23; the
> `<ExpertTip>` component is the drift-proof version.

### 4k. Atom Node (SVG)
```tsx
/* CSS classes — inject via <style> tag inside the component */
.sim-atom-c    { fill:#2d3a5a; stroke:#6366f1; stroke-width:2.5; }  /* Carbon */
.sim-atom-o    { fill:#d64545; stroke:#991b1b; stroke-width:2.5; }  /* Oxygen */
.sim-atom-h    { fill:#0a2218; stroke:#34d399; stroke-width:2.5; }  /* Hydrogen */
.sim-atom-func { fill:#8b5cf6; stroke:#5b21b6; stroke-width:2.5; }  /* Functional group */
.sim-bond      { stroke:rgba(99,102,241,0.4); stroke-width:6; stroke-linecap:round; }
.sim-attack-arrow { stroke:#fbbf24; stroke-width:4; stroke-dasharray:10; fill:none; }
```

### 4l. Dividers
```tsx
/* Horizontal hairline */
<div style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}/>

/* Vertical mirror line with glow */
<div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full"
  style={{
    background:'linear-gradient(to bottom,transparent,rgba(148,163,184,0.3) 20%,rgba(148,163,184,0.3) 80%,transparent)',
    boxShadow:'0 0 10px rgba(148,163,184,0.35), 0 0 24px rgba(148,163,184,0.12)',
  }}/>
```

---

## 5. LAYOUT SYSTEM

### Grid Patterns

| Use case | Class |
|---|---|
| Canvas + sidebar | `grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6` |
| Hand + Fischer side by side | `grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-center` |
| D vs L / two Fischer projections | `grid grid-cols-[1fr_28px_1fr] gap-2 items-start` |
| Full-width phase content | `flex flex-col gap-6` |

### Spacing Rules
- Phase wrapper inner gap: `gap-6`
- Section gap within a phase: `gap-4` or `gap-5`
- Label → content gap: `gap-2`
- Nav row top padding: `pt-2`
- Simulator outer padding: `p-4 md:p-6`

---

## 6. ANIMATION & INTERACTION RULES

| Pattern | Implementation |
|---|---|
| Step transition (fade + slide) | `opacity`, `transform: translateX(4px)` via inline style, `transition:'all 0.3s ease'` |
| Pulse highlight | `@keyframes sim-pulse { 0%,100%{filter:brightness(1);}50%{filter:brightness(1.5);} }` |
| Hover state (interactive atom) | `cursor:pointer` on SVG `<g>`, brightness filter on hover |
| Fold/unfold (finger segments) | `transformBox:'fill-box'`, `transformOrigin:'0% 50%'`, `rotate()` on SVG path |
| Slider progress | Native `<input type="range">` — no custom slider library |
| Bond dashes (attack arrows) | `stroke-dasharray:10` |

**Rule:** Never use CSS frameworks or animation libraries (Framer Motion, GSAP). All animation is via CSS `transition` and `@keyframes` only.

---

## 7. ACADEMIC ACCURACY RULES

### Anti-Hallucination Gate (mandatory before writing any simulation)
> Before coding any scientific interaction, state the fact being visualized verbatim from an authoritative source (NCERT, JEE syllabus, standard textbook). If you cannot cite the source, write `NEEDS_REVIEW: [reason]` in a code comment. Never generate molecular geometry, reaction conditions, or stereochemistry from training knowledge alone.

### Subject-Specific Checkpoints

**Chemistry simulations:**
- Stereochemistry (R/S, D/L, cis/trans) — always verify configuration against Fischer projection rules, not intuition
- Ring closure — state ring size explicitly (5-membered = furanose, 6-membered = pyranose)
- Bond angles — cite VSEPR or hybridization explicitly in a comment
- Reaction conditions — temperature, catalyst, solvent must be sourced

**Physics simulations (future):**
- All equations shown to students must include unit labels
- Constants (G, h, c, e) must use exact NIST values — never rounded approximations in code comments
- Vector arrows must have correct relative magnitudes — never decorative

**Biology simulations (future):**
- Cell dimensions and organelle positions must be approximately to scale within the SVG viewport
- Enzyme active site interactions — cite the specific enzyme and substrate by name
- Process sequences (e.g. Krebs cycle steps) — number them explicitly and match NCERT ordering

### Interaction Design Rules
| Control type | Use when |
|---|---|
| Slider | Continuous variable (progress, angle, concentration) |
| Toggle button | Binary state (alpha/beta anomer, D/L, cis/trans) |
| Click on SVG element | Discrete state change (fold finger, flip OH, highlight carbon) |
| Tab selector (underline) | Choosing between named options (mannose, galactose) |
| StepBar pill | Phase / lesson navigation only — never for data selection |

---

## 8. WHAT NOT TO DO (Anti-Patterns)

| Anti-pattern | Correct pattern |
|---|---|
| Wrapping text in a bordered card inside a phase | Plain text directly on `#0d1117` background |
| Box-in-box (card inside a card) | Single surface level — hairline dividers only |
| `text-[9px]` for readable labels | Minimum `text-[10px]`; body copy minimum `text-sm` |
| `$$...$$` double-dollar LaTeX | `$...$` single dollar only |
| `\dfrac` in LaTeX | `\frac` only |
| Raw Unicode `→` outside math | `$\rightarrow$` inside `$...$` |
| Custom animation libraries | CSS `transition` + `@keyframes` only |
| Hardcoded simulator background different from page | Always `#0d1117` — matches page exactly |
| Inventing new accent colors | Only use palette defined in Section 3 |
| Omitting the Expert Tip in sidebars | Every mechanism sidebar must end with an Expert Tip block |
| Generating scientific facts from training knowledge without citation | Always state source or mark `NEEDS_REVIEW:` |
| `font-mono` Tailwind class on numbers or text | Inherit body sans-serif; use `tabular-nums` for column alignment |
| `fontFamily: 'monospace'` (or 'Courier', 'Menlo', etc.) | Same — sans-serif only. Italic for math variables. |
| `÷` (division sign U+00F7) in any formula or calc step | Stacked numerator/denominator via the `Frac` component (see §2). From a distance, ÷ reads as +. |
| Hyphen `-` used for subtraction in a formula | Proper minus `−` (U+2212). |
| `"6.022e+23"` or any other `e+N`/`e-N` programming syntax visible to students | `"6.022 × 10²³"` via the `prettyExp` helper (see §2). Use raw e-notation only inside editable input drafts. |

---

## 9. FILE & NAMING CONVENTIONS

| Item | Convention |
|---|---|
| Simulator file | `app/[subject]-[hub-name]/[Topic]Simulator.tsx` |
| Component name | `[Topic]Simulator` (default export) |
| Phase function names | `[PhaseName]Phase` (e.g. `DLPhase`, `EpimersPhase`) |
| SVG component names | `[Element]SVG` (e.g. `HandSVG`, `FischerSVG`) |
| Phase type | `type Phase = 'slug-1' | 'slug-2' | ...` |
| CSS class prefix | Subject abbreviation (e.g. `bio-`, `phys-`, `cell-`) |
| Atom class names | `[prefix]-atom-c`, `[prefix]-atom-o`, `[prefix]-atom-h`, `[prefix]-atom-func` |

---

## 10. CHECKLIST — BEFORE SHIPPING A SIMULATION

- [ ] Simulator background is `#0d1117` — matches page background
- [ ] All fonts follow the typography scale (Section 2)
- [ ] **No `font-mono` class or `fontFamily: 'monospace'` anywhere in the simulator.** Use `tabular-nums` for column alignment, `fontStyle: 'italic'` for math variables.
- [ ] **No `÷` symbol anywhere in formulas or calc steps.** Use the `Frac` component (numerator stacked over denominator) — see §2 "Division & Fractions". The `÷` glyph reads as `+` from a distance.
- [ ] **No `e+N` / `e-N` programming-style scientific notation rendered to students.** Use `prettyExp(value.toExponential(n))` so values appear as `6.022 × 10²³`, never `6.022e+23`.
- [ ] **ONE primary accent + at most ONE secondary, both light-tier** (§3 two-colour rule). Imported from `_shared` tokens, not hardcoded. No mid/dark tier as foreground text.
- [ ] **`font-black` only at `text-lg`+** — `font-semibold` is the ceiling at `text-xs` / `text-[10px]` / `text-[11px]` (§2 weight rule). The StepBar pill is the sole exception and lives in the shared component.
- [ ] `npm run lint:sims` passes for your file (§12) — the pre-push hook runs it automatically.
- [ ] StepBar uses pill pattern from Section 4c
- [ ] Back/Next buttons use pattern from Section 4d
- [ ] No card-in-card nesting anywhere in the phase content
- [ ] Every scientific claim has a source citation or `NEEDS_REVIEW:` comment
- [ ] Minimum text size is `text-[10px]`
- [ ] All animations use CSS only — no third-party libraries
- [ ] Expert Tip block present in any mechanism sidebar
- [ ] LaTeX uses `$...$` and `\frac` — no double dollar, no `\dfrac`
- [ ] Atom colors match the defined atom palette (Section 4k)

---

## 11. SHARED MODULE — WHAT TO IMPORT (don't hand-roll)

Everything reusable lives under `packages/book-renderer/blocks/simulations/_shared` and is re-exported from its `index.ts` barrel. Import from `../_shared` (or `./_shared`), never reach into individual files.

| Import | What it is |
|---|---|
| `ACCENT`, `ACCENT_2`, `ACCENTS`, `TEXT`, `OK`, `BAD`, `BORDER`, `SIM_BG`, `accentTint` | Design tokens (`tokens.ts`) — the single source of truth for colour |
| `TYPE` | Typography className strings (title, subtitle, sectionLabel, body, …) with the weight-scale-down rule baked in |
| `SimShell` | Outer wrapper (`#0d1117`, padding, radius, font) |
| `SimHeader` | Title + accent word + subtitle + optional badge |
| `SimTabs`, `StepBar`, `NavButtons` | Tab selector, phase pills, back/next |
| `SimSlider` | Labeled range input with a tabular-nums readout |
| `SectionLabel`, `ExpertTip` | Uppercase mini-heading; the calm closing tip |
| `Frac`, `prettyExp`, `fmt` | No-÷ fraction, `6.022 × 10²³` formatter, standard number formatter |
| `useResolvedFont`, `useCanvasSize`, `useAnimationFrame`, `mulberry32`, spectrum helpers | Canvas/animation utilities |

Each chrome component takes an optional `accent` prop (defaults to `ACCENT`). Write raw markup only for the sim's bespoke canvas/visualization — the frame around it should be composed from the above.

---

## 12. AUTOMATED ENFORCEMENT — the design gate

Consistency across hundreds of sims cannot rely on anyone reading this doc. It is enforced by **`scripts/validate-sims.mjs`**:

- **`npm run lint:sims`** — checks only the simulator files changed on this branch / in your working tree (so untouched legacy sims are never blocked; they convert when next edited — "migrate when touched").
- **`npm run lint:sims:all`** — audits the whole library (report only). Use to see outstanding debt.
- The **pre-push git hook** runs the changed-file gate automatically and **blocks the push** on any error.

It flags: monospace fonts, the `÷` glyph, sub-`text-[10px]` text, `font-black` at `text-xs`/`text-[10px]`, the dark-violet `#7c3aed` as foreground, and `.toExponential()` not wrapped in `prettyExp()`. Mark a deliberate exception with a `// sim-lint-ok` comment on that line (reserve this for the two sanctioned cases in §3). The rule set is intentionally high-confidence; it will tighten (e.g. banning all non-token hex) as the library migrates onto the shared components.
