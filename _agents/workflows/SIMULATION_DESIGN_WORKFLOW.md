---
description: Simulation Design Workflow — Canvas Classes Interactive Labs
---

# SIMULATION DESIGN WORKFLOW v1.0

> **Design principle:** Every simulation — Chemistry, Physics, Biology — must feel like it belongs to the same product. Never invent new colors, fonts, or component patterns. This document is the single source of truth. When it conflicts with anything else, it wins.

---

## QUICK REFERENCE (read this first)

```
BACKGROUND HIERARCHY    #0d1117 → #0B0F15 → #151E32
PRIMARY ACCENT          indigo  → #6366f1 / #818cf8 / #c4b5fd
SUCCESS STATE           emerald → #10b981 / #34d399 / #6ee7b7
WARNING / HIGHLIGHT     amber   → #d97706 / #fbbf24
ERROR / L-SERIES        red     → #dc2626 / #f87171
EPIMER / TOGGLE         pink    → #ec4899 / #f472b6
ATOM: Carbon            fill #2d3a5a  stroke #6366f1
ATOM: Oxygen            fill #d64545  stroke #991b1b
ATOM: Hydrogen          fill #0a2218  stroke #34d399
ATOM: Functional group  fill #8b5cf6  stroke #5b21b6
```

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

### Font Stack
No custom font imports. Use Tailwind's system font stack (`font-sans`) throughout.

### Scale & Usage

| Element | Tailwind class | Additional style |
|---|---|---|
| Simulator title (e.g. "Biomolecules Lab") | `text-3xl font-black tracking-tight text-white` | Accent word in `color:#7c3aed` |
| Subtitle / descriptor | `text-[11px] font-bold uppercase tracking-widest` | `color:#475569` |
| Section heading (sidebar) | `text-xl font-black uppercase tracking-tighter` | `color:#e2e8f0` |
| Phase concept heading | `text-lg font-bold leading-snug text-white` | — |
| Step / rule label | `text-xs font-black uppercase tracking-widest` | accent color per phase |
| Body / explanation text | `text-base leading-snug` | `color:#94a3b8` |
| Metadata / badge text | `text-[10px] font-black uppercase tracking-widest` | `color:#64748b` |
| StepBar pill label | `text-[11px] font-black uppercase tracking-wider` | — |
| Sub-label under elements | `text-[10px]` | `color:#475569` |

**Rule:** Never go below `text-[10px]`. Never use `text-[9px]` for anything a student must read — only decorative labels.

---

## 3. COLOR PALETTE — FULL REFERENCE

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

### 4b. Simulator Header
```tsx
<div className="mb-3 flex justify-between items-start flex-wrap gap-2">
  <div>
    <h1 className="text-3xl font-black tracking-tight text-white">
      [Subject] <span style={{color:'#7c3aed'}}>Lab</span>
    </h1>
    <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{color:'#475569'}}>
      [Descriptor — e.g. "Interactive Glucose Explorer"]
    </p>
  </div>
  <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{color:'#64748b'}}>
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
  {/* Expert Tip — always at bottom */}
  <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
    <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{color:'#6366f1'}}>Expert Tip</h5>
    <p className="text-white text-base font-bold leading-tight italic">&ldquo;[Mnemonic or key insight]&rdquo;</p>
  </div>
</div>
```

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
- [ ] No colors outside the defined palette (Section 3)
- [ ] StepBar uses pill pattern from Section 4c
- [ ] Back/Next buttons use pattern from Section 4d
- [ ] No card-in-card nesting anywhere in the phase content
- [ ] Every scientific claim has a source citation or `NEEDS_REVIEW:` comment
- [ ] Minimum text size is `text-[10px]`
- [ ] All animations use CSS only — no third-party libraries
- [ ] Expert Tip block present in any mechanism sidebar
- [ ] LaTeX uses `$...$` and `\frac` — no double dollar, no `\dfrac`
- [ ] Atom colors match the defined atom palette (Section 4k)
