# Class 9 Hindi (गंगा) — CBSE Exam Alignment Plan

> **Status:** 🟡 Research done; **G1 (अपठित) batch-1 BUILT**; remaining modules pending · **Last updated:** 2026-06-07
> **Done:** Researched the CBSE Class 9 Hindi A paper design + competency framework + publisher model. Confirmed गंगा IS the official 2026-27 NCERT book. **Built the अपठित बोध module batch-1** (गंगा chapter 13, 5 pages: strategy page + 3 गद्यांश + 2 काव्यांश, 28 Qs = 18 MCQ + 5 assertion-reason + 5 short-answer; position-balanced 4/4/6/4 MCQ & 2/1/1/1 AR; zero length giveaways; reuses the shared `reading_comprehension` block, now `lang:'hindi'`-localised). `scripts/setup_class9_hindi_apathit.js`.
> **Pending:** Extend अपठित (more passages) · build रचनात्मक लेखन, व्याकरण, full model papers + per-chapter exam-format additions.
> **Blocked on:** CBSE गंगा-specific SQP not yet published — re-verify Section weights when it drops.
> **Next action:** Either extend अपठित (5→12-15 passages) OR build the **रचनात्मक लेखन (writing-formats) module** (G2 — next-highest weight, 20 marks).

---

## 1. The key finding — we are on the official book

**गंगा is the new NCERT Class 9 Hindi textbook for 2026-27**, developed under NCF-SE 2023 (NEP 2020), replacing क्षितिज + कृतिका (old Course A) and स्पर्श + संचयन. 12 chapters (7 गद्य + 5 काव्य) + 2 साथ-साथ पढ़ें supplementary readings + भाषा संगम. **This matches our book exactly.** So the content base is correct; the gap is **exam-format practice and the non-literature exam sections**, not the teaching.

> Transition caveat: the detailed blueprint below is the **stable CBSE Hindi-A section framework** (carried from the क्षितिज era). CBSE will issue a गंगा-specific SQP; the *section structure* (अपठित / व्याकरण / पाठ्यपुस्तक / लेखन at 14/16/30/20) will persist, but the literature section will now draw from गंगा's own prose/poetry + its साथ-साथ पढ़ें. Re-check when the SQP publishes.

## 2. The exam blueprint (Class 9 Hindi A — 80 theory + 20 internal = 100; 3 hrs)

Class 9 is **school-conducted** but modeled on the Class 10 board, so the structure is the destination students build toward.

| Section | Name | Marks | What it tests |
|---|---|---|---|
| **A** | **अपठित बोध** (unseen) | **14** | 1 unseen गद्यांश (prose) + 1 अपठित काव्यांश (poetry); MCQ + 1/2-mark objective Qs — comprehension, inference, शीर्षक, शब्दार्थ. **Pure transferable skill.** |
| **B** | **व्यावहारिक व्याकरण** | **16** | 4 topics: **शब्द-निर्माण** [उपसर्ग 2 + प्रत्यय 2 + समास 4] · **वाक्य-भेद** (रचना/अर्थ के आधार पर — सरल/संयुक्त/मिश्र) 4 · **अलंकार** (अनुप्रास, यमक, श्लेष, उपमा, रूपक, उत्प्रेक्षा, मानवीकरण, अतिशयोक्ति) 4 |
| **C** | **पाठ्यपुस्तक + पूरक** | **30** | गद्य: 5 MCQ + 3 लघु-उत्तरीय (25-30 शब्द) = 11 · पद्य: 5 MCQ + 3 लघु-उत्तरीय = 11 · पूरक (साथ-साथ पढ़ें): 2 उत्तरीय (50-60 शब्द) = 8. Includes extract-based गद्यांश/काव्यांश, सप्रसंग व्याख्या, चरित्र-चित्रण, भाव-स्पष्ट. |
| **D** | **रचनात्मक लेखन** | **20** | अनुच्छेद/निबंध (~120 श, 6) · पत्र औपचारिक/अनौपचारिक (~100 श, 5) · ई-मेल (~100 श, 5) · कहानी/संवाद/सूचना/विज्ञापन (~80 श, 4). **Format-adherence is heavily marked.** |

**Internal (20):** Periodic Test 5 · Multiple Assessments 5 · Portfolio 5 · Listening-Speaking 5.

**Competency typology (NEP/NCF) — VERIFIED against primary CBSE circulars (Acad-30/2024) by the Kaveri team:** the 80-mark paper is **50% competency-based** (MCQ + case-based/source-based + assertion-reason) **+ 20% objective MCQ + 30% constructed-response**. NOTE: the popular "40→50% rising for Class 9-10" claim is a **myth** — for Class 9-10 it has been **50% since 2023-24, no change** (the 40→50 jump was Class 11-12 only). Build to 50%, not "rising." Class 9 has **no official CBSE sample paper** — it mirrors the Class 10 board, so Class 10 SQPs are the format source of truth. Two CBSE staples we must include: **case-based/source-based** and **assertion-reason** items. Founder decision (2026-06-07): Live Book reading questions check **basic understanding** in a friendly North-Indian-classroom teacher voice; the competitive-hard bank lives separately in **Crucible**. Full verified model: GBrain `reference/2026-06-07-cbse-class9-assessment-model-and-livebook-roadmap.md`; shared `reading_comprehension` block already shipped by the Kaveri team.

## 3. How leading publishers / platforms teach गंगा (Oswaal, Educart, LearnCBSE, myCBSEguide, Vedantu)

The market-standard गंगा prep kit (Oswaal/Educart "Question Bank, new NCERT Ganga") is built around:
- **सारांश (chapter summary)** + revision notes + mind maps + mnemonics + concept videos — revision-first.
- **700+ questions** per book: NCERT in-text + exercise + **NCERT Exemplar** + **competency-based / application** + MCQ.
- **चरित्र-चित्रण, भाव-स्पष्ट, सप्रसंग व्याख्या** model answers; शब्दार्थ.
- **Self-assessment + full practice papers** (mock papers in the exact section format).
- Separate drilled strands for **अपठित**, **व्याकरण**, **लेखन** (not chapter-bound).

**Our teaching is richer than theirs** on the literature side (interactive vocab triple-bridge, अलंकार highlighter, tone-meter, reasoning prompts). The gap is the **exam-format scaffolding and the three non-literature sections** they drill and we don't.

## 4. Gap analysis — our गंगा book vs the exam

| # | Gap | Exam weight | Our status | Priority |
|---|---|---|---|---|
| **G1** | **अपठित बोध** — unseen गद्यांश + काव्यांश practice | **14 (17.5%)** | ✅ **Batch-1 built** (ch13, 5 passages, 28 Qs, MCQ + assertion-reason + short-answer). Extendable to 12-15. | 🟢 done (extend later) |
| **G2** | **रचनात्मक लेखन** — full format toolkit (अनुच्छेद, औ/अनौ पत्र, ई-मेल, संवाद, सूचना, विज्ञापन, लघुकथा) with layout + word-limit + rubric + model answers | **20 (25%)** | One chapter-tied `writing_scaffold` each; no systematic format teaching/marking. | 🔴 **High** |
| **G3** | **व्यावहारिक व्याकरण** — consolidated उपसर्ग/प्रत्यय/समास/वाक्य-भेद/अलंकार in exam format | **16 (20%)** | Scattered per-chapter (Ch2 समास, Ch5 वाक्य, Ch7 उपसर्ग-प्रत्यय, poems अलंकार); not a standalone exam-aligned strand covering all topics. | 🔴 **High** |
| **G4** | **Full model/sample papers** (80-mark, 4-section, real shape & timing) | whole paper | None. Per-chapter banks only. | 🔴 **High** |
| **G5** | **Exam-format literature Qs** — extract-based गद्यांश/काव्यांश, सप्रसंग व्याख्या, लघु-उत्तरीय (25-30 श) + दीर्घ चरित्र-चित्रण/भाव with model answers & word limits | part of 30 | MCQ banks (strong) + open `reasoning_prompt` (no exam-format model answers). | 🟠 Medium-High |
| **G6** | **सारांश** (concise revision summary) per chapter | revision | `theme_explorer` is analytical, not a tight exam सारांश. | 🟠 Medium |
| **G7** | **पूरक / साथ-साथ पढ़ें** supplementary readings | **8 (in C)** | Deferred during build — but it IS assessed (Section C, 8 marks). | 🟠 Medium |
| **G8** | **Competency case-study clusters** (source → 3-4 application Qs) | ~50% of paper | Reasoning MCQs strong but mostly single-stem, not source-clustered. | 🟡 Low-Med |

**What NOT to touch (already strong / exceeds market):** triple-bridge शब्दार्थ vocabulary, अलंकार highlighter teaching, reasoning-tagged MCQ banks (≥60% higher-order), narrated-passage comprehension, tone-meter/theme/character teaching.

## 5. The CBSE-targeted build plan (priority order)

Reuse the existing block engine + `scripts/hindi-fix/validate.mjs` quality gate for every new MCQ.

1. **अपठित बोध module (G1).** ✅ **Batch-1 done** — गंगा chapter 13 "अपठित बोध — पठन अभ्यास" (`scripts/setup_class9_hindi_apathit.js`): a strategy page (4-step attack, friendly teacher voice) + 3 unseen गद्यांश (one case-based with a data table) + 2 unseen काव्यांश, built on the shared **`reading_comprehension`** block (`lang:'hindi'`). Each passage = the unseen text (numbered paras, word-count badge) + a mix of **MCQ + assertion-reason + short-answer (with model answers)** at *basic-understanding* level (hard competitive items → Crucible, per founder decision). Position-balanced, zero length giveaways. **To extend:** add ~7-10 more passages (varied themes/difficulty) by appending to the same script's PAGES array.
2. **रचनात्मक लेखन module (G2).** "लेखन कौशल" section, one page per format: format/layout diagram + marking rubric + 2-3 model answers + `writing_scaffold` practice prompts. Formats: अनुच्छेद, औपचारिक पत्र, अनौपचारिक पत्र, ई-मेल, संवाद, सूचना, विज्ञापन, लघुकथा, संदेश.
3. **व्याकरण module (G3).** "व्याकरण" section: pages for शब्द-निर्माण (उपसर्ग+प्रत्यय+समास), वाक्य-भेद (रचना के आधार पर), अलंकार — each = rules + worked examples + `apply_express` drills (transform/form_select/spot_error) + exam-format MCQ.
4. **Full model papers (G4).** 2-3 "मॉडल प्रश्न-पत्र" in the exact 4-section / 80-mark shape, drawing G1-G3 + chapter content. The capstone exam-readiness tool.
5. **Per-chapter exam-format additions (G5, G6, G7).** Add to each chapter: a tight **सारांश** block; **extract-based** गद्यांश/काव्यांश Q set; **सप्रसंग व्याख्या** (poems); 2-3 **दीर्घ-उत्तरीय model answers** (चरित्र-चित्रण/भाव) with word limits. Build the deferred **साथ-साथ पढ़ें** supplementary (it's assessed).
6. **Tag everything to the blueprint** so the adaptive engine can serve exam-weighted practice (section A/B/C/D + competency level).

## 6. Open questions / to re-verify
- Get the **official CBSE गंगा SQP + marking scheme** when published (cbseacademic.nic.in) and re-check Section C weights (गंगा prose/poetry/पूरक split) against §2.
- Confirm the exact **4 व्याकरण topics** CBSE fixes for गंगा (the क्षितिज-era set is उपसर्ग/प्रत्यय/समास, वाक्य-भेद, अलंकार — likely unchanged, but verify).
- Decide whether अपठित/व्याकरण/लेखन live as **book-level sections** in गंगा or as a sibling "exam prep" book/area in the product.

## Sources
- CBSE Class 9 Hindi A blueprint & sections — [Vedantu](https://www.vedantu.com/syllabus/cbse-class-9-hindi-a-syllabus), [LearnCBSE](https://www.learncbse.in/cbse-sample-papers-class-9-hindi-a/), [Careers360](https://school.careers360.com/ncert/ncert-syllabus-for-class-9-hindi)
- गंगा = new 2026-27 NCERT textbook — [LearnCBSE](https://www.learncbse.in/ncert-solutions-class-9-hindi/), [myCBSEguide](https://mycbseguide.com/blog/class-9-hindi-book-ganga-2026-27/), [Tiwari Academy](https://www.tiwariacademy.com/ncert-solutions/class-9/hindi/)
- Publisher model — [Oswaal गंगा Question Bank](https://oswaalbooks.com/products/cbse-hindi-question-bank-chapter-wise-topic-wise-class-9-based-on-new-ncert-textbook-ganga-includes-summary-competency-based-question-self-assessment-practice-papers-for-r2-level)
- Competency-based 50/20/30 shift — [MTG](https://blog.mtg.in/decoding-the-new-cbse-exam-pattern/), [Edulytics](https://edulyticspro.com/cbse-class-10-board-exam-2026-new-pattern-competency-based-questions/)
