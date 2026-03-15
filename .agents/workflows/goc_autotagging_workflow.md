---
description: Auto-Tagging Workflow for GOC (General Organic Chemistry)
---
# 5-Level Adaptive Tagging Workflow for GOC

## 🎯 Objective
This workflow defines the systematic process for an AI agent to auto-tag the 300+ General Organic Chemistry (GOC) questions in the Crucible database using the new 5-Level Hierarchical Tagging System. The process emphasizes safety, accuracy, small batch sizes, and a strict confidence threshold that delegates uncertain cases to human review.

---

## 🛑 Strict Safety & Process Rules
1. **Never guess or hallucinate tags.** If you are not completely certain about any level of tagging for a question, mark it for `HUMAN_REVIEW`.
2. **Process in strict batches of 20-25 questions maximum.** Do not exceed this limit under any circumstances. Wait for human validation before proceeding to the next batch.
3. **Do not modify or delete existing legacy tags.** The script or API call must solely append/update the new 5-level tagging fields while preserving the old `tags` array for backward compatibility.
4. **Always verify the question text/image** when assessing its cognitive type and entry point clarity. Don't rely solely on the topic.
5. **DO NOT output markdown in the code generation.** The AI output should provide only pure JSON for updates, or run the custom python scripts provided.
6. **Double check the IDs.** Always use the precise tag IDs listed below. Do not use the natural language names.

---

## 🏷️ The 5-Level Tagging Hierarchy

### Level 1: Primary Concept Tag (Single Selection)
Choose exactly one primary tag from the following list of valid `id`s for GOC:
- `tag_goc_1` Classification & IUPAC Naming
- `tag_goc_2` Electronic Effects
- `tag_goc_3` Acidity & Basicity
- `tag_goc_4` Reaction Intermediates
- `tag_goc_5` Electrophiles, Nucleophiles & Basic Terms
- `tag_goc_6` Structural Isomerism & Tautomerism
- `tag_goc_7` Geometrical Isomerism
- `tag_goc_8` Optical Isomerism & Chirality
- `tag_goc_9` Conformational Isomerism
- `tag_goc_10` Huckel's Rule & Aromaticity
- `tag_goc_11` Allenes, Atropisomers & Spiro Compounds

### Level 2: Micro Concept Tags (Multiple Selection)
Choose one or more valid `micro_topic` ids that strictly fall under the chosen Primary Concept Tag.
*Reference List per Primary Tag:*
- **tag_goc_1**: `micro_goc_1_1` (Classification, Homologous series & functional group), `micro_goc_1_2` (IUPAC acyclic), `micro_goc_1_3` (IUPAC cyclic & bicyclic), `micro_goc_1_4` (Common names), `micro_goc_1_5` (Degree of unsaturation/DBE).
- **tag_goc_2**: `micro_goc_2_1` (Inductive ±I), `micro_goc_2_2` (Resonance/Mesomeric ±M), `micro_goc_2_3` (Hyperconjugation), `micro_goc_2_4` (Combined effect reasoning), `micro_goc_2_5` (Stability of Resonating Structures).
- **tag_goc_3**: `micro_goc_3_1` (Acidity of C-H/O-H/N-H), `micro_goc_3_2` (Acidity of Phenols & carboxylic acids), `micro_goc_3_3` (Basicity of amines & others), `micro_goc_3_4` (Comparative acidity/basicity chains), `micro_goc_3_5` (Ortho effect and SIP).
- **tag_goc_4**: `micro_goc_4_1` (Carbocation), `micro_goc_4_2` (Carbanion), `micro_goc_4_3` (Free radical), `micro_goc_4_4` (Carbene & nitrene), `micro_goc_4_5` (Stability comparison across types), `micro_goc_4_6` (Rearrangements in carbocations).
- **tag_goc_5**: `micro_goc_5_1` (Electrophiles vs nucleophiles), `micro_goc_5_2` (Nucleophilicity, Basicity & leaving groups), `micro_goc_5_3` (Physical Properties Trends).
- **tag_goc_6**: `micro_goc_6_1` (Chain & Position), `micro_goc_6_2` (Calculating number of structural isomers), `micro_goc_6_3` (Functional group & metamerism), `micro_goc_6_4` (Tautomerism/keto-enol).
- **tag_goc_7**: `micro_goc_7_1` (E/Z & cis/trans), `micro_goc_7_2` (Conditions for geometrical), `micro_goc_7_3` (Number of Geometrical isomers).
- **tag_goc_8**: `micro_goc_8_1` (Chirality & Symmetry elements), `micro_goc_8_2` (R/S CIP rules), `micro_goc_8_3` (Optical/specific rotation), `micro_goc_8_4` (Enantiomers, Diastereomers & Identical Pairs), `micro_goc_8_5` (Meso compounds), `micro_goc_8_6` (Newman-Fischer-Sawhorse Mapping), `micro_goc_8_7` (D/L Naming), `micro_goc_8_8` (Total number of stereoisomers), `micro_goc_8_9` (Chirality in Conformers), `micro_goc_8_10` (Pseudo-Chiral Centers), `micro_goc_8_11` (Resolution & Racemic Mixtures).
- **tag_goc_9**: `micro_goc_9_1` (Conformations of alkanes), `micro_goc_9_2` (Cyclohexane Chair/Boat), `micro_goc_9_3` (Conformations of cycloalkanes), `micro_goc_9_4` (Energy diagrams), `micro_goc_9_5` (The Gauche Effect & H-Bonding), `micro_goc_9_6` (Substituted Cyclohexanes), `micro_goc_9_7` (Stereochemical Relationships), `micro_goc_9_8` (Conformationally Locked Systems).
- **tag_goc_10**: `micro_goc_10_1` (Aromatic/Anti/Non), `micro_goc_10_2` (Structural Planarity & Annulenes), `micro_goc_10_3` (Aromaticity in charged/heterocycles), `micro_goc_10_4` (Quasi-Aromaticity & Dipole).
- **tag_goc_11**: `micro_goc_11_1` (Axial chirality in allenes), `micro_goc_11_2` (Atropisomerism), `micro_goc_11_3` (Spiro nomenclature/isomerism).

### Level 3: Cognitive Type (Universal)
Choose exactly one:
- `recall` - Memorization, direct definitions or factual rules.
- `application` - Using a concept in a straightforward scenario (e.g., standard IUPAC naming).
- `analysis` - Comparing multiple species or breaking down complex problems (e.g., ordering stability of 4 carbocations).
- `synthesis` - Combining multiple concepts (e.g., assigning R/S configuration AND identifying enantiomer pairs).
- `evaluation` - Judging or choosing between assertions (Assertion-Reasoning questions).

### Level 4: Calculation Load (Universal)
Choose exactly one:
- `none` - Purely conceptual, visual, or structural (The vast majority of GOC questions).
- `light` - Simple counting (e.g., counting chiral centers, pi bonds, calculation of DBE).
- `moderate` - Multi-step addition/subtraction or simple formulas (Rare in GOC, maybe specific rotation calculations).
- `heavy` - Complex calculations (Extremely rare in GOC).

### Level 5: Entry Point Clarity (Universal)
Choose exactly one:
- `clear` - Obvious starting point. The question tells the student exactly what to do (e.g., "What is the IUPAC name?").
- `moderate` - Requires identifying the core concept before starting (e.g., "Which of the following is most basic?" requires recognizing steric inhibition of resonance vs normal +M/-I effects).
- `ambiguous` - Unclear what the trap is; multiple approaches possible; complex multi-statement problems.

---

## 🤖 Confidence Threshold & Human Review Logic

The AI Agent must internally assess a **Confidence Score (0-100%)** for each question's tagging schema before committing it.

**Threshold rules:**
- **Confidence >= 90%**: Auto-accept and queue for database update.
- **Confidence < 90%**: DO NOT auto-update. Present the question to the USER in a report for human review. Output the reason for low confidence (e.g., "Ambiguous between tagging as Resonance vs Hyperconjugation").

**Common Triggers for Low Confidence in GOC:**
- Multi-concept questions that touch upon 3+ primary tags.
- Questions with poorly OCR'd text or low-quality images.
- Subjective questions or complex matrix-match questions.

---

## ⚙️ The Execution Pipeline

**Step 1: Batch Identification**
1. Fetch 20-25 questions from the database where `metadata.primary_concept_tag` is missing or null, explicitly filtered for the GOC chapter.
2. Load the question content, options, and solution (including image OCR if available).

**Step 2: AI Tagging & Confidence Scoring**
1. Determine: Level 1, Level 2, Level 3, Level 4, Level 5, and the Confidence Score.

**Step 3: Segregation**
1. **Auto-Accepted Queue:** Questions with ≥90% confidence.
2. **Review Queue:** Questions with <90% confidence.

**Step 4: Update Execution**
1. Use the pre-built utility script `scripts/rebuild_gpw_part_X.py` or write a new one to apply the exact JSON/Dictionary payload to the MongoDB database. Make sure you fetch directly by question `_id`. DO NOT rely simply on the display_id.

**Step 5: Reporting & Human Handoff**
1. Generate an artifact report or write directly to the user detailing the batch bounds (e.g., GOC-001 to GOC-025), how many were auto-tagged, and a Markdown list of questions needing Human Review, specifying the exact reasons.
2. Pause and wait for user clearance before running the next batch.

---
*End of Workflow Documentation.*
