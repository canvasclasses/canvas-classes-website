# Teacher Voice System — Canonical Workflow

> **Status:** 🟢 Live — profile v1 + format v2 shipped; **ALL 23 chemistry chapters distilled (2026-06-12)** · **Last updated:** 2026-06-12
> **Done:** profile + ATOM exemplars + 5-question pilot (live in DB) + workflow/validator integration (Crucible §🎤 + Live Books §5.V)
> **Pending:** founder edit-diff loop (the convergence mechanism); physics/math voice systems (separate pilots)
> **Blocked on:** —
> **Next action:** ✅ **23/23 CHEMISTRY CHAPTERS COMPLETE.** Distillation phase done. Next: (1) voice-rewrite a full chapter (MOLE — launch chapter, exemplars ready, accuracy-audited) for founder judgment → start the edit-diff loop; (2) founder records the 2 ATOM audio-wishlist items. Physics/math voice systems are separate future pilots.

**The goal:** every written surface — Crucible solutions AND Live Books chemistry pages —
sounds like Paaras sir, in sync with his video lectures. A student who watches the lecture
and then reads the page/solution hears the same teacher.

**Why this works without fine-tuning:** the voice is captured as (a) a master profile of
his teaching *moves* and (b) per-chapter exemplar banks of his actual analogies, traps, and
question-openings, distilled from his own lecture transcripts. Writers read these before
writing. Inspectable, editable, per-chapter targetable.

---

## 1. The artifacts

| File | What it holds | Consumed by |
|---|---|---|
| `_agents/voice/teacher-voice-profile.md` | Master profile: spoken DNA, written-register translation rules (FORMAT v2), anti-parody guardrails | chemistry-solution-workflow §🎤 · BOOK_PAGE_WORKFLOW §5.V |
| `_agents/voice/<PREFIX>-exemplars.md` | Per-chapter: analogy inventory, trap bank, must-memorize constants, per-question exemplars from DPPs | Solution batches + book pages for that chapter |
| `_agents/solution-flags/<PREFIX>-audio-wishlist.md` | Questions whose elaborate framing is offloaded to founder audio (`audio_flag` in apply-batch) | Founder's recording sessions |
| `_agents/voice/_*.md` | Working notes / pilots / comparisons | Reference only |

## 2. The distillation pipeline (per chapter)

1. **Source videos** from the dropper section of `apps/student/app/study-planner/planner-data.ts`
   (`RESOURCE_MAP`). Priority: **DPPs first** (per-question exemplars — the highest-value
   artifact), then crash courses (analogies + concept-teaching moves). **One-shots are
   LOW-TRUST**: they are livestream recordings with corrupted auto-ASR (learned on ATOM) —
   use only directionally, never for verbatim quotes.
2. **Transcribe** via the vidiq MCP tool (`vidiq_video_transcript`, videoId from the planner;
   5 credits/call). Transcripts arrive as Devanagari Hinglish.
3. **Distill with agents** (transcripts are too big for one context): typically one agent per
   2–3 videos, OR one agent per chapter instructed to prioritize DPPs fully and skim crash
   courses for the analogy/trap inventory. The agent writes
   `_agents/voice/<PREFIX>-exemplars.md` directly, **following the structure of
   `ATOM-exemplars.md`** (sections A–E: analogies / constants / traps / per-question
   exemplars / register notes).
4. **Update the tracker** below + the cockpit row.
5. **Use it:** solution batches (format v2) and book pages for that chapter now read the
   exemplar file. Existing AI solutions in that chapter get voice-rewritten opportunistically
   (founder-priority chapters first), not big-bang.

## 3. The feedback loop (what makes it converge)

Whenever the founder hand-edits a voice-styled solution or page: diff his edit against the
generated text, extract the missed pattern, update `teacher-voice-profile.md` (bump the
version note) and/or the chapter exemplar file. The profile is a living document.

## 4. Chapter coverage tracker (dropper-batch chemistry videos)

Legend: CC = crash course · DPP = question-practice session · OS = one-shot (low-trust ASR).
Video IDs are from `planner-data.ts` RESOURCE_MAP (2026-06-12 snapshot).

| # | Chapter (PREFIX) | Videos | Exemplar file | Status |
|---|---|---|---|---|
| 1 | Structure of Atom (ATOM) | 3 CC + 3 DPP + OS | `ATOM-exemplars.md` | ✅ DONE (pilot, 2026-06-12) |
| 2 | Mole Concept (MOLE) | CC: tvp-RDY_FM0, 8c8ayHmxzlA · DPP: rOjFuHsVQu4, dPx9bNzgsNw, Wf5lLogiAnQ · 15-min: 9yga2IAEm3g | `MOLE-exemplars.md` | ✅ DONE 2026-06-12 (26 DPP per-question exemplars, coffee-sachet limiting reagent + unitary-method chant; 15-min video ASR-degraded, directional only) |
| 3 | Periodicity (PERI) | CC: C6bHDPJfvwk, T368-IpfD7U · OS: p-NdkOfm0tQ | `PERI-exemplars.md` | ✅ DONE 2026-06-12 (24 analogies, 24 traps, 27 worked-Q exemplars + comparison-ordering grammar; OS excluded — corrupted ASR) |
| 4 | Chemical Bonding (BOND) | CC: _RLPotf0NSA, jyzzVa2Dgj0, ENICF20VTuM, xhYjvroxVF4 · OS: yMpD6PEFjmw | `BOND-exemplars.md` | ✅ DONE 2026-06-12 (24 analogies, 21 traps, 26 worked-Q exemplars incl. L4 PYQ session; shape-prediction thought-chain + MOT hooks; OS skipped) |
| 5 | Thermodynamics (THERMO) | Pre-req: TADFKhfM1tE · CC: V7uChUeuSzc, AnnJaLUlnMk, hQDUFSHokTQ, 6dxB49anz8o · extras: OdjaGJca4A0, HTqpDc-nWB8 · OS: 437RxJzwOhk | `THERMO-exemplars.md` | ✅ DONE 2026-06-12 (34 worked-Q exemplars, 27 analogies, ~18 traps; beggar-vs-₹2000 entropy, mummy-papa spontaneity, rice-grain reversibility; pre-req video skipped, OS skipped) |
| 6 | Chemical Equilibrium (CEQ) | CC: ugcCAg8WzdE, 3PpmAFLQscw · OS: pcokrXtUnGo | `CEQ-exemplars.md` | ✅ DONE 2026-06-12 (22 worked-Q exemplars, 14 traps; musical-chairs saturation + complaint-handler Le Chatelier; clean ASR) |
| 7 | Ionic Equilibrium (IEQ) | CC: SrHK0T8-YEo, C-CjfepOz6k, jTKFF-LGN1k · DPP: ZdDQ_lXFhkU, ggC5pmkOPw8, v9ejpnHwPR8 | `IEQ-exemplars.md` | ✅ DONE 2026-06-12 (25 DPP exemplars across 3 DPPs; 5-kg-weight relative strength, brakes+indivisible-drop endpoint, ₹50/₹60 dissolution ledger; decision-tree doctrine; clean ASR) |
| 8 | Redox (RDX) | CC: U-66N5u5Wbw, y9K0PxbnEzA · DPP: Dc5eSTfkclI, nPjM6SCJYAo · extras: DJuPWr2X7_k (n-factor), QhgfhqPPbOw (titration) · OS: g5EwjAaNhqs | `RDX-exemplars.md` | ✅ DONE 2026-06-12 (20 DPP exemplars + n-factor & titration specials; lonely-KMnO₄-drop endpoint, KMnO₄ 5/3/1 media; strongest examiner-critique register; clean ASR) |
| 9 | P-Block 11 (PB11) | CC: dFAxLN_s9sE · OS: 8zT9gXplLBQ | `PB11-exemplars.md` | ✅ DONE 2026-06-12 (14 worked-Q; kharcha-return inert pair, 'kamra nahi hai' CCl4 metaphor, NCERT recall-ladder; clean ASR) |
| 10 | GOC + Stereo (GOC) | basics: -Y2tMcrhDxU, IUPAC: juJkhCprxy0 · CC: RThlnLU2zMA, g15a2bGGx10, _CsdX3HByew, KmNGhqk4ew4 · extras: dG3wjRQeuYw, O8nET7unnWM · DPP: 7rnNFgtijiw, eEjQvsw-4tg, okfrmz5xpGs, OeKWfd1v0jQ, clI0KeT_h0c · Stereo L: CztG35_8LyU, UUuMydKkxjc, cER7cjvD0PY · Stereo DPP: pmQZ4YzC2CM, 0TS9DlLGF4Y, 2Mkb4d8TdHA · OS: yg_xIkyGtxg | `GOC-exemplars.md` | ✅ DONE 2026-06-12 (LARGEST: 171 exemplars across 8 DPPs+CCs, 73 analogies, 8 narration frameworks in A2 — order-question spine, stability escalation ladder, arrow-pushing law, 12 stereo chants; DPP 4–5 = purification/analysis, reusable for POC; 4 working-notes files kept) |
| 11 | Hydrocarbons (HC) | CC: izezV1oOg88, xU_IfAL0x14 · Aromatic L1: 2Z1FXBYuqVA · DPP: PCNI19FUG5w, yCgvotvl7GE, 3EcsAlTtUIU, BvyMbE1zshg | `HC-exemplars.md` | ✅ DONE 2026-06-12 (70 DPP exemplars — largest; +A2 mechanism-narration moves; khula-saand chlorine selectivity, we-can-afford thermodynamic product, bus-seat sulfonation blocking; "laddu question" verdict; clean ASR) |
| 12 | Practical Organic (POC) | CC: 4Dj-XRvdcAk, AWbrOiDFZ4E, jm2yvtavhQ4 · OS: 6_HOV4tkxwk | `POC-exemplars.md` | ✅ DONE 2026-06-12 (technique-narration + sodium-fusion detection chemistry; deduped vs GOC DPP4-5; jigri-dost extraction analogy; clean ASR) |
| 13 | Solutions (SOL) | CC: QffwSl90ax8, tcHediJk-Ek · OS: Vb_6VKw7Yrw | `SOL-exemplars.md` | ✅ DONE 2026-06-12 (29 worked-Q, 28 analogies; housefull-theatre saturation, monsoon-clothes vapor pressure, entropy-compromise RLVP; two-Kb IIT trap; clean ASR) |
| 14 | Electrochemistry (EC) | CC: JELPbgL0va4, 6v-VdC0QBUM, u60yZjm8c5A · OS: MiIJwC0LpaE | `EC-exemplars.md` | ✅ DONE 2026-06-12 (40 worked-Q, 27 analogies; slap-and-₹500 electrode potential, election/daavedaar electrolysis, Faraday queue; unbalanced-Nernst trap; clean ASR) |
| 15 | Chemical Kinetics (CK) | CC: uC3FNcNtLQo, EbHkb9_5FzU, lRfiA7ej9_c · OS: sYXMqIHGew8 | `CK-exemplars.md` | ✅ DONE 2026-06-12 (35 worked-Q, 35 analogies; potholed-highway RDS, tunnel/Ferrari activation energy, 'I am OK because I am K'; k-units order-detective; clean ASR) |
| 16 | P-Block 12 (PB12) | CC: XOTxkxHReZM, l0-4y_M1pWI · OS: gpuuH89ZyGo, VEmatUp30r4 | `PB12-exemplars.md` | ✅ DONE 2026-06-12 (18 worked-Q; bond-lamba→weak causal chant, F2 first-person boast, oleum apple-juice analogy; N&O one-shot was word-salad→skipped, Halogens OS ~60% used directionally) |
| 17 | D & F Block (DNF) | CC: 7xY-da7ieh4, sbWFK6bKzRg, JorfXDJzbTc | `DNF-exemplars.md` | ✅ DONE 2026-06-12 (68 worked-Q exemplars; khush/dukhi oxidation-state personification, reaction-as-story memory method, observed-vs-calculated μ trap; clean ASR) |
| 18 | Coordination (CORD) | CC: TiSmwEBs3jg, nYPWrhnJUbw, UJ_Hux972ZQ, 5sC84hpyqsY · OS: uRPfNa5_RPk | `CORD-exemplars.md` | ✅ DONE 2026-06-12 (32 worked-Q; IUPAC naming chant, laddoo CFT redistribution, hanging-by-two-hands chelate, jugaadu VBT, isomer-count automate tip; clean ASR) |
| 19 | Haloalkanes (HALO) | CC: Z4YWjfg7pg4, ZaryOPtJJBs · extras: WLmjfuOZVz0 (SN/E), RDb8n8vW4NQ (E2), CdXGWqRlG3U (E1cB) · DPP: 1CXZ6nbkTn4, 9fA69CCln2k · OS: ZACn8YVBkGY | `HALO-exemplars.md` | ✅ DONE 2026-06-12 (42 DPP exemplars + full 6-step SN/E decision narration; ion-pair slow-goodbye racemization, utawla-bawla nucleophile, Sharma-ji-ka-beta NGP; options-as-data move; clean ASR) |
| 20 | Alcohols/Phenols/Ethers (ALCO) | CC: kQ9VF_X-LpA, CeOYhkbHkMM · Phenols: 1ISE9oTxoSs · DPP: e58LfiXWNSo, EjSp5KS_MBo, qI3OTCIjiSE | `ALCO-exemplars.md` | ✅ DONE 2026-06-12 (46 DPP exemplars — largest bank; LiAlH4 over-enthusiastic worker, phenol-acidity doctor dialogue, chill-chloride leaving group; mental-vs-written budget split; clean ASR) |
| 21 | Carbonyl (ALDO) | CC: 5hQLYGROys8, a510QK4g36g, InOZqUbJ36I · extras: zPSLTqf_OdI (Grignard), Tt0weUW1Fp4 (enamines) · DPP: 7YSM-VEerpk, VaPBFtTnP-g, KowXV88vUv0 · OS: 4NqlPuJHves | `ALDO-exemplars.md` | ✅ DONE 2026-06-12 (47 DPP exemplars; wrestler nucleophile, stability-is-laziness Grignard, auto-wala info-dump move; OMSGAP mnemonic + named-test pack; clean ASR) |
| 22 | Amines (AMIN) | CC: ZDkssRMx1Go · Aromatic L3: FYX2Tx961Ss · DPP: G0bKRxMo5p0, lKT2L6aLM3g · NCERT rxns: eyWYnda7DL8 · conversions: fBGrkjlh2kA, _Z4vlyk2LGY | `AMIN-exemplars.md` | ✅ DONE 2026-06-12 (22 DPP exemplars; umbrella-flip N-inversion, kuan-vs-khai directing choice, retro-conversion doctrine; NCERT-reactions video ASR-degraded — directional only) |
| 23 | Biomolecules (BIO) | CC: aNTrA8TmPb8, 3tDMfV71AT8 · OS: PnwNgp7HUeg | `BIO-exemplars.md` | ✅ DONE 2026-06-12 (37 worked-Q, ~35 memory hooks; Lalit-MP-VV-TH amino-acid mnemonic, RD rule, hemiacetal-dhoondo reducing test; Lab-Manual-Unit-11 PYQ insight; clean ASR) |

**Suggested order after the current three:** chapters with DPPs first (IEQ, RDX, HC, HALO,
ALCO, ALDO, AMIN, then the GOC monster), because DPP per-question exemplars feed Crucible
solutions directly; CC-only chapters (THERMO, EC, CK, CORD, …) mainly feed Live Books pages.

## 5. Standing rules

- The profile's general moves are chapter-independent — a chapter WITHOUT its exemplar file
  still gets voice-styled writing from the profile alone (note the gap here when that happens).
- vidiq transcript = 5 credits/video. GOC alone is ~20 videos — batch consciously.
- Physics & math: same system later, separate pilots (their lecture sets + their workflows
  still use the legacy 6-section format).
