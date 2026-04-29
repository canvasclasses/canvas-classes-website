---
name: simulation-builder
description: Build interactive Chemistry, Physics, or Biology simulations for Canvas Classes (class 9-12, JEE/NEET). Enforces the canonical SIMULATION_DESIGN_WORKFLOW — dark theme background #0d1117, indigo accent palette, reusable StepBar/sidebar/SVG canvas patterns, atom color conventions, and the anti-hallucination gate for scientific accuracy. Trigger when the user asks to build, create, edit, or scaffold a simulator, interactive lab, mechanism animation, phase-based visualizer, or React-based educational simulation (e.g. "build a simulator for orbital shapes", "make a Fischer projection lab", "create an interactive SN2 mechanism", "[Topic]Simulator.tsx"). Skip for static diagrams, MCQ widgets, content/book pages, marketing visuals, or generic React components unrelated to educational simulations.
---

# Simulation Builder

You are building an interactive educational simulation for Canvas Classes. **The canonical ruleset lives in `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md`.** That file is the single source of truth. When anything below conflicts with it, the workflow doc wins.

## STEP 0 — ALWAYS DO THIS FIRST

Before writing a single line of simulation code, read the full workflow:

```
Read _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md
```

Do not skip this. The workflow contains exact hex values, copy-pasteable component patterns, and academic accuracy gates that must not be paraphrased from memory.

## STEP 1 — ANTI-HALLUCINATION GATE (mandatory)

Before coding any scientific interaction, state the fact being visualized **verbatim from an authoritative source** (NCERT, JEE/NEET syllabus, standard textbook). If you cannot cite the source, write `NEEDS_REVIEW: [reason]` in a code comment at that exact location. **Never** generate molecular geometry, reaction conditions, stereochemistry, equations, or biological process steps from training knowledge alone.

This applies to:
- **Chemistry**: stereochemistry (R/S, D/L, cis/trans), bond angles, ring sizes, reaction conditions (temp/catalyst/solvent)
- **Physics**: equations (with units), constants (use exact NIST values), vector magnitudes
- **Biology**: cell dimensions, organelle scale, enzyme/substrate names, process step ordering (must match NCERT)

## STEP 2 — UNDERSTAND THE TOPIC

Before scaffolding, confirm with the user (or verify in their request):

1. **Subject + topic**: e.g. "Chemistry — SN2 mechanism", "Physics — projectile motion", "Biology — Krebs cycle"
2. **Class level**: 9, 10, 11, 12, or JEE/NEET aspirant
3. **Phases**: what discrete steps does the simulation have? (e.g. "intro → reactants → transition state → products")
4. **Interactions**: sliders, toggles, click-to-fold, tab selectors — pick from the Section 7 interaction-design table in the workflow

If the user has not specified phases, propose 3–5 phases and confirm before scaffolding.

## STEP 3 — FILE STRUCTURE

Per the workflow's Section 9 naming conventions:

| Item | Convention |
|---|---|
| File | `app/[subject]-[hub-name]/[Topic]Simulator.tsx` |
| Component | `[Topic]Simulator` (default export) |
| Phase functions | `[PhaseName]Phase` |
| SVG components | `[Element]SVG` |
| Phase type | `type Phase = 'slug-1' \| 'slug-2' \| ...` |
| CSS class prefix | Subject abbreviation: `bio-`, `phys-`, `chem-` |

Place the simulator under the right hub. If the hub does not exist yet, ask before creating one.

## STEP 4 — SCAFFOLD USING CANONICAL PATTERNS

Copy the patterns **exactly** from the workflow doc — never retype them from memory:

- **Outer wrapper** → Section 4a (`background:'#0d1117'` is non-negotiable)
- **Header** → Section 4b
- **StepBar** → Section 4c
- **Back/Next** → Section 4d
- **Concept rule block** (plain text, no card) → Section 4e
- **Inline toggle** → Section 4f
- **Tab selector** (underline, not pill) → Section 4g
- **Action/Reset button** → Section 4h
- **SVG canvas** (radial gradient background) → Section 4i
- **Sidebar with Expert Tip** → Section 4j
- **Atom CSS classes** → Section 4k (`sim-atom-c`, `sim-atom-o`, `sim-atom-h`, `sim-atom-func`, `sim-bond`, `sim-attack-arrow`)
- **Dividers** → Section 4l

If a pattern doesn't exist for what you need, **ask the user** before inventing one. Do not silently improvise.

## STEP 5 — VALIDATE BEFORE DECLARING DONE

Run through Section 10's pre-ship checklist mentally and report any gaps to the user:

- [ ] Simulator background is `#0d1117`
- [ ] Typography matches Section 2 scale
- [ ] No colors outside the Section 3 palette
- [ ] StepBar uses Section 4c pattern
- [ ] Back/Next uses Section 4d pattern
- [ ] No card-in-card nesting
- [ ] Every scientific claim has source citation or `NEEDS_REVIEW:` comment
- [ ] Minimum text size `text-[10px]`
- [ ] All animations are CSS-only (no Framer Motion / GSAP)
- [ ] Expert Tip block present in mechanism sidebars
- [ ] LaTeX uses `$...$` and `\frac` — never `$$...$$`, never `\dfrac`
- [ ] Atom colors match Section 4k

## ABSOLUTE RULES (do not violate)

1. **Never** invent new colors, fonts, or component patterns. Use only what's in the workflow doc.
2. **Never** wrap concept text in a bordered card — plain text on `#0d1117` is correct.
3. **Never** use a custom animation library (Framer Motion, GSAP, react-spring). CSS `transition` + `@keyframes` only.
4. **Never** use `text-[9px]` for anything a student must read.
5. **Never** use `$$...$$` or `\dfrac` in LaTeX. Use `$...$` and `\frac`.
6. **Never** generate scientific facts from training knowledge without a citation or `NEEDS_REVIEW:` flag.
7. **Never** change the simulator outer-wrapper background away from `#0d1117` — it must match the page.

## DARK PATTERNS TO AVOID

The workflow's Section 8 lists every anti-pattern. Flag (don't silently fix) if the user requests one:

- Box-in-box nesting
- Decorative-only vector arrows in physics sims
- Text below 10px
- Hardcoded mismatched backgrounds
- Custom slider libraries (use native `<input type="range">`)
- Omitting Expert Tip blocks in mechanism sidebars

## WHEN UNSURE

Re-read the relevant section of `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md`. The workflow is detailed precisely so you don't have to guess. Ask the user only when the workflow is silent on a specific case.
