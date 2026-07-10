# Ionic Equilibrium (Ch.7) — Live Book Build Contract

> **Status:** 🟢 ALL 20 PAGES BUILT (0–19), `published:false` — awaiting founder review. 213 blocks, 24 worked_examples (all NCERT Problems 7.12–7.28 folded). **`titration-curve-builder` flagship sim BUILT + embedded (p16) + preview-verified.** Practice bank still to come.
> **Book:** `ncert-simplified` (Class 11 Chemistry) · **Chapter:** 7 "Ionic Equilibrium" (empty 0-page shell). **Last touched:** 2026-06-25.
> Shares the end-of-chapter **practice-bank design** + the build mechanics recorded in [`CHEMICAL_EQUILIBRIUM_BUILD.md`](CHEMICAL_EQUILIBRIUM_BUILD.md) — read that for the section-navigated practice bank and the voice-calibration notes.

## Sources
- **Voice:** `_agents/voice/teacher-voice-profile.md` + `_agents/voice/IEQ-exemplars.md` (his analogies). The founder-approved Ch.6 pages (`scripts/ceq/pages/*`) + the pilot are the style gold standard. §5.V/§5.X enforced.
- **Content:** founder notes `~/Downloads/ionic-equilibrium-notes.pdf` (55pp) + NCERT Unit 7 (the ionic half, NCERT pp 205–230). Mittal Vol.2 not supplied → NCERT + JEE Main.

## Build mechanics
`scripts/ieq/pages/pNN_*.js` modules (export `{page_number,slug,title,subtitle,page_type,build(h)}`) → shared `scripts/ceq/_helpers.js` → orchestrated by `scripts/ieq/build_chapter.js` (CH=7, dry-run default + `--apply`, idempotent, links to `chapters[7].page_ids`). `published:false`. Hero/diagram images `src:''` + dark hand-drawn `generation_prompt`.

## Approved page structure (~20 pages, 5 arcs) — `[N]`=notes/NCERT · `[P 7.x]`=fold NCERT solved Problem
**Arc A — Electrolytes, α, Ostwald**
- 0 Opener "The Chemistry of Balance Inside You" (blood-pH / O₂–haemoglobin hero) · 1 Ionic equilibrium & electrolytes (strong α=1 / weak α<1) · 2 Degree of dissociation & its factors · 3 Ostwald's dilution law

**Arc B — Acid–base theories**
- 4 Arrhenius · 5 Brønsted–Lowry + conjugate pairs `[P 7.12,7.13,7.14]` · 6 Lewis + 3-theory summary `[P 7.15]` · 7 Factors affecting acid strength + leveling effect

**Arc C — Water, pH, ionization constants**
- 8 Ka, Kb, pKa, pKb `[P 7.18,7.21,7.23]` · 9 Ionic product of water Kw · 10 The pH scale `[P 7.16]` · 11 pH calculations (strong/weak + the water-contribution trap + polyprotic) `[P 7.17,7.19,7.20]`

**Arc D — Salts, buffers, indicators**
- 12 Common-ion effect · 13 Salt hydrolysis I (SA/SB, SA/WB, WA/SB) · 14 Salt hydrolysis II (WA/WB) `[P 7.25]` · 15 Buffer solutions `[P 7.22,7.24]` · 16 Titration curves & indicators

**Arc E — Solubility equilibria**
- 17 Solubility product Ksp `[P 7.26,7.27]` · 18 Common-ion effect on solubility & precipitation `[P 7.28]` · 19 Applications (qualitative salt analysis; solubility in acid)

NCERT solved Problems 7.12–7.28 (17) all folded as tap-to-reveal `worked_example` at the mapped pages.

## Changelog
- 2026-06-25 — Contract created; building pages via parallel subagents (same as Ch.6).
- 2026-06-25 — **CHAPTER COMPLETE: all 20 pages (0–19) built, `published:false`.** Authored via 9 parallel subagents (calibrated voice, Ch.6 pages as gold standard); `scripts/ieq/pages/pNN_*.js` modules + `scripts/ieq/build_chapter.js` orchestrator (reuses `scripts/ceq/_helpers.js`). Ch.7 = 20 pages, 213 blocks, 24 worked_examples — all 17 NCERT Problems 7.12–7.28 folded as tap-to-reveal `worked_example` + 7 constructed. Arcs: A electrolytes/α/Ostwald (0–3), B theories (4–7), C Kw/pH/Ka-Kb (8–11), D salts/buffers/titration (12–16), E solubility (17–19). His analogies used (salt-in-oil, spectator-ion "watching the match", auto-proto-lysis etymology, water-brings-everyone-to-one-level for leveling, money-ledger for Ksp, log-2/log-5 trick, the 10⁻⁸-M-HCl water-trap). Voice-audited clean (no banned metaphors, no "Not X. It is Y." pairs). Subagent caught that the brief's recollection of NCERT 7.22 was wrong (it's a basic NH₄Cl/NH₃ buffer) and folded the real one. NEXT: founder review; then the section-navigated practice bank (Ch.6 + Ch.7) + the Le Chatelier Lab & Titration Curve Builder sims.
