---
description: Solution Ingestion Workflow — Standardizing Chemical Explanations
---

# Solution Ingestion Workflow

This workflow ensures that every question in the database has a high-quality, consistent, and step-by-step explanation following the "Goldilocks" standard (pedagogical but concise).

## 1. Analysis Logic (Expert Filtering)
Before writing a solution, classify the question:

### ✅ SIMPLE (Generate Solution)
- IUPAC Nomenclature (merge rules into steps).
- Comparing Acidic/Basic strength (Inductive, Resonance, Ortho effect).
- Stability of Intermediates (Hyperconjugation, Resonance).
- Aromaticity (Huckel's Rule).
- Number of sigma/pi bonds or hybridization.
- Basic chain/position/functional isomerism.

### ❌ COMPLEX (Skip / Mark as "Requires Manual Review")
- Detailed reaction mechanisms with rearrangements.
- Multi-step organic synthesis.
- Complex 3D stereochemistry (Newman/Fischer transformations).
- Questions requiring multi-line block LaTeX equations that may break the renderer.

## 2. Solution Structure
Every solution MUST follow this template:

```markdown
> **Strategy:**
> [Conceptual overview and problem-solving methodology]

**Step 1: [Short Title]**
[Logic implementation using \ce{} for formulas]

**Step 2: [Short Title]**
[Final comparison or calculation]

$$\boxed{\text{Answer: (Option) [Final Value/Name]}}$$
```

## 3. The "Solution Ingestor" Prompt
*Copy and paste the block below to start the ingestion process:*

> **PROMPT:**
> Act as a Chemistry Expert. I will provide a list of questions from [Chapter Name], Range [GOC-XXX to GOC-YYY].
> 
> **Your Task:**
> 1. Analyze each question. 
> 2. Skip "Complex" questions (Mechanisms/Stereo-complexity).
> 3. For "Simple" questions, generate high-quality solutions using the **Solution Ingestion Workflow**.
> 4. Use `\ce{}` for all chemical formulas (EXCEPT for coordination compounds with `[` and `]`; for those, use `\mathrm{}` with explicit subscripts).
> 5. Keep logic concise; merge baseline rules into the steps.
> 6. Output a JS update script that uses `db.collection('questions_v2').updateOne` to update the `solution.text_markdown` and `answer.explanation` fields for each processed question.
> 
> Let's begin with the first batch.
