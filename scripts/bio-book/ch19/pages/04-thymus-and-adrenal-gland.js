'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'thymus-and-adrenal-gland',
  title: 'The Thymus & Adrenal Glands',
  subtitle: "One gland trains your immune army, the other floods your body with the 'fight or flight' rush. Learn which hormone comes from which layer — that exact match is what NEET tests.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'adrenal-gland'],
  glossary: [
    { term: 'thymus', definition: 'A lobular gland located between the lungs, behind the sternum, on the ventral side of the aorta; it plays a major role in developing the immune system.' },
    { term: 'thymosins', definition: 'Peptide hormones secreted by the thymus that drive the differentiation of T-lymphocytes (cell-mediated immunity) and promote antibody production (humoral immunity).' },
    { term: 'adrenal medulla', definition: 'The centrally located tissue of the adrenal gland; it secretes the catecholamines adrenaline and noradrenaline.' },
    { term: 'adrenal cortex', definition: 'The outer tissue of the adrenal gland, made of three layers; it secretes hormones called corticoids.' },
    { term: 'catecholamines', definition: 'The common name for adrenaline (epinephrine) and noradrenaline (norepinephrine) — the emergency "fight or flight" hormones of the adrenal medulla.' },
    { term: 'glucocorticoids', definition: 'Corticoids involved in carbohydrate metabolism; the main one in our body is cortisol. They stimulate gluconeogenesis, lipolysis and proteolysis.' },
    { term: 'mineralocorticoids', definition: 'Corticoids that regulate the balance of water and electrolytes; the main one is aldosterone, which acts at the renal tubules.' },
    { term: "Addison's disease", definition: 'A disease caused by underproduction of hormones by the adrenal cortex, which alters carbohydrate metabolism and causes acute weakness and fatigue.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim anatomical scene of two kidneys, each capped by a small adrenal gland glowing with a warm inner light, against deep shadow',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Two kidneys sit in deep shadow, and perched on top of each one is a small triangular adrenal gland glowing with a soft, warm inner light, as if quietly holding a store of energy ready to be released. A faint sense of a rush or surge is suggested by soft streaks of warm light spilling from the glands into the surrounding darkness, without any literal labels or diagram elements. Painterly, atmospheric, anatomical illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Jolt You Feel Before an Exam Has a Source',
      markdown: "That sudden thump in your chest before results are announced — heart pounding, palms sweating, hair standing up on your arms — is not \"nerves\" in some vague sense. It is a real chemical, poured into your blood in seconds by a tiny gland sitting on top of each of your kidneys. The **adrenal medulla** releases **adrenaline**, and your whole body switches into emergency mode. This page is about that gland, and one more you almost never hear about — the **thymus**, the gland that quietly trained your immune system when you were young.",
    },
    // ── 2 · Core concept — the thymus and thymosins ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the quieter of the two. The **thymus** is a **lobular** gland sitting **between the lungs, behind the sternum** (your breastbone), on the **ventral side of the aorta**. Its big job is building your **immune system**.\n\nIt does this by secreting peptide hormones called **thymosins**. Thymosins do two things. First, they drive the **differentiation of T-lymphocytes** — the immune cells that provide **cell-mediated immunity** (the arm of your immunity that fights using cells directly). Second, they **promote the production of antibodies**, which gives you **humoral immunity** (the arm that fights using antibodies floating in body fluids).\n\nHere's the catch that NEET loves. The thymus **degenerates in old age**. As it shrinks, it makes **fewer thymosins** — and with fewer thymosins, the immune responses of old people become **weak**. That single cause-and-effect chain (old age → less thymus → less thymosin → weaker immunity) is worth locking in.",
    },
    // ── 3 · Heading — adrenal medulla ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Adrenal Medulla — Fight or Flight',
      objective: "By the end of this you can name the two hormones the adrenal medulla releases in an emergency, call them by their group name, and list what they do to your body in seconds.",
    },
    // ── 4 · Text — adrenal gland structure + medulla ─────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "You have **one pair** of adrenal glands — **one sitting on top of each kidney**. Slice one open and you find **two different tissues**: the **centrally located adrenal medulla** (the core), and the **adrenal cortex** lying outside it (the shell).\n\nThe **adrenal medulla** secretes two hormones: **adrenaline (also called epinephrine)** and **noradrenaline (also called norepinephrine)**. Together these two are called **catecholamines**. They are **rapidly secreted in response to stress of any kind and during emergencies** — which is why they are nicknamed the **emergency hormones**, or the hormones of **'Fight or Flight'**.\n\nWhat do they actually do? They increase your **alertness**, cause **pupillary dilation** (pupils widen), **piloerection** (hairs stand up), and **sweating**. Both hormones increase the **heart beat**, the **strength of heart contraction**, and the **rate of respiration**. They also stimulate the **breakdown of glycogen**, which raises the **glucose concentration in your blood** — instant fuel — and they break down **lipids and proteins** too. Every one of these changes is aimed at one thing: getting your body ready to either fight the threat or run from it.",
    },
    // ── 5 · Interactive image — adrenal gland anatomy ────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A sectioned adrenal gland sitting atop a kidney, showing the central medulla and the three layers of the cortex, with the hormone each part secretes',
      caption: '📸 Tap each dot to explore the adrenal gland — which part it is, and the hormone it releases.',
      generation_prompt: "Scientific textbook illustration of an adrenal gland sitting on top of a kidney, shown in two linked views like NCERT Figure 19.4. On the left, a small triangular adrenal gland capping the top of a bean-shaped kidney. On the right, an enlarged cut-away section of the same adrenal gland showing its internal structure: a central region labelled adrenal medulla, surrounded by the adrenal cortex which is drawn as three distinct concentric layers (from outer to inner: zona glomerulosa, zona fasciculata, zona reticularis). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, thin white leader lines. Kidney in deep red (blood-rich organ), adrenal cortex layers in warm tan and brown tones, adrenal medulla in a distinct pink/magenta core. No photorealism, no cartoon, no mascots, no text baked into the image.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.68, label: 'Kidney', detail: 'The bean-shaped organ underneath. Each kidney has one adrenal gland perched on top of it — you have one pair of adrenal glands in total.', icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.30, label: 'Adrenal gland', detail: 'The small triangular gland sitting on top of the kidney. Cut it open and it has two tissues: a central **medulla** and an outer **cortex**.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.50, label: 'Adrenal medulla', detail: 'The centrally located core. It secretes the **catecholamines** — **adrenaline (epinephrine)** and **noradrenaline (norepinephrine)** — the emergency "fight or flight" hormones.', icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.22, label: 'Zona glomerulosa (outer cortex)', detail: 'The **outer** layer of the cortex. The cortex secretes **corticoids** — including the **mineralocorticoids** such as **aldosterone**, which balances water and electrolytes.', icon: 'circle' },
        { id: uuid(), x: 0.83, y: 0.38, label: 'Zona fasciculata (middle cortex)', detail: 'The **middle** layer of the cortex. It is associated with the **glucocorticoids** such as **cortisol**, which handle carbohydrate metabolism.', icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.62, label: 'Zona reticularis (inner cortex)', detail: 'The **inner** layer of the cortex, lying just outside the medulla. The cortex also secretes small amounts of **androgenic steroids** here.', icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.70, label: 'Adrenal cortex', detail: 'The outer tissue of the gland, made of three layers (glomerulosa, fasciculata, reticularis). It secretes **corticoids**: glucocorticoids + mineralocorticoids. Its underproduction causes **Addison\'s disease**.', icon: 'circle' },
      ],
    },
    // ── 6 · Heading — adrenal cortex ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Adrenal Cortex — The Corticoids',
      objective: "By the end of this you can split the cortex's hormones into glucocorticoids and mineralocorticoids, name the main one in each group, and say what each controls.",
    },
    // ── 7 · Text — cortex, glucocorticoids, mineralocorticoids ───────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The **adrenal cortex** — the outer shell — is built from **three layers**: **zona reticularis** (inner), **zona fasciculata** (middle), and **zona glomerulosa** (outer). All the hormones it makes are grouped together under one name: **corticoids**. There are two families of them.\n\n**Glucocorticoids** are the corticoids involved in **carbohydrate metabolism**. The main one in our body is **cortisol**. Glucocorticoids stimulate **gluconeogenesis** (making new glucose), **lipolysis** (breaking down fats), and **proteolysis** (breaking down proteins), while inhibiting the cellular uptake and use of amino acids. Cortisol does even more: it helps maintain the **cardiovascular system** and **kidney function**, produces **anti-inflammatory reactions**, **suppresses the immune response**, and **stimulates RBC (red blood cell) production**.\n\n**Mineralocorticoids** are the corticoids that regulate the **balance of water and electrolytes**. The main one is **aldosterone**. Aldosterone acts mainly at the **renal tubules** (in the kidney), where it stimulates the **reabsorption of Na⁺ and water** and the **excretion of K⁺ and phosphate ions**. Through this, aldosterone maintains **electrolytes, body fluid volume, osmotic pressure, and blood pressure**.\n\nOne more small note: the cortex also secretes **small amounts of androgenic steroids**, which play a role in the growth of **axial, pubic, and facial hair** at puberty.",
    },
    // ── 8 · Comparison card — medulla vs cortex ──────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Adrenal Medulla vs Adrenal Cortex',
      columns: [
        {
          heading: 'Adrenal Medulla (central core)',
          points: [
            'Secretes catecholamines: adrenaline (epinephrine) + noradrenaline (norepinephrine)',
            "The 'Fight or Flight' / emergency hormones — released fast in stress",
            'Raise heart beat, strength of heart contraction, rate of respiration',
            'Raise alertness, cause pupil dilation, piloerection, sweating',
            'Break down glycogen → raise blood glucose; also break down lipids and proteins',
          ],
        },
        {
          heading: 'Adrenal Cortex (outer shell, 3 layers)',
          points: [
            'Secretes corticoids — two families: glucocorticoids + mineralocorticoids',
            'Glucocorticoids (main = cortisol): carbohydrate metabolism; gluconeogenesis, lipolysis, proteolysis; anti-inflammatory; suppress immunity; stimulate RBC production',
            'Mineralocorticoids (main = aldosterone): balance water + electrolytes at renal tubules (Na⁺ & water reabsorbed, K⁺ & phosphate excreted)',
            'Also secretes small amounts of androgenic steroids',
            'Underproduction → altered carbohydrate metabolism → weakness/fatigue = Addison\'s disease',
          ],
        },
        {
          heading: 'And the Thymus (separate gland)',
          points: [
            'Secretes peptide hormones called thymosins',
            'Thymosins → differentiation of T-lymphocytes (cell-mediated immunity)',
            'Thymosins → promote antibody production (humoral immunity)',
            'Degenerates in old age → fewer thymosins → weaker immune responses',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — hormone-to-part matching ──────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student writes four statements while revising the adrenal gland. Exactly one is correct as NCERT states it. Which one?",
      options: [
        "Adrenaline and noradrenaline are secreted by the adrenal cortex and are called catecholamines.",
        "Cortisol is a mineralocorticoid and its main job is reabsorbing Na⁺ and water at the renal tubules.",
        "Aldosterone acts mainly at the renal tubules, reabsorbing Na⁺ and water while excreting K⁺ and phosphate ions.",
        "Glucocorticoids balance water and electrolytes, while mineralocorticoids handle carbohydrate metabolism.",
      ],
      reveal: "Statement 3 is correct: aldosterone is the main mineralocorticoid, it acts at the renal tubules, and it reabsorbs Na⁺ and water while excreting K⁺ and phosphate. Statement 1 is wrong because catecholamines come from the adrenal **medulla**, not the cortex. Statement 2 swaps the labels — cortisol is a **glucocorticoid** (carbohydrate metabolism), not a mineralocorticoid; reabsorbing Na⁺ and water is aldosterone's job. Statement 4 has the two families exactly backwards: glucocorticoids handle carbohydrate metabolism, mineralocorticoids handle water and electrolytes.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Thymus → thymosins** → (i) differentiation of **T-lymphocytes** (cell-mediated immunity) and (ii) **antibody production** (humoral immunity). Thymus **degenerates in old age** → weaker immunity.\n- **Adrenal medulla** (central) → **adrenaline + noradrenaline** = **catecholamines** = **fight or flight** / emergency hormones. Raise heart rate, respiration, alertness; break down glycogen → raise blood glucose.\n- **Adrenal cortex** (outer, 3 layers) → **corticoids**:\n  - **Glucocorticoids** (main = **cortisol**): carbohydrate metabolism; **gluconeogenesis, lipolysis, proteolysis**; **anti-inflammatory**; suppress immunity; stimulate RBC production.\n  - **Mineralocorticoids** (main = **aldosterone**): act at **renal tubules**; **reabsorb Na⁺ and water**, **excrete K⁺ and phosphate**.\n- **Addison's disease** = **underproduction by the adrenal cortex** → weakness and fatigue.",
    },
    // ── 11 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Medulla vs cortex is the trap:** the **medulla** (core) makes the fast catecholamines; the **cortex** (shell) makes the slower corticoids. If a question says \"fight or flight,\" the answer is always the **medulla**.\n\n**Cortisol vs aldosterone — don't swap them:** **cortisol** is the main **glucocorticoid** (carbohydrate metabolism, anti-inflammatory); **aldosterone** is the main **mineralocorticoid** (Na⁺ and water reabsorption at the renal tubules).\n\n**Classic NEET question:** \"The 'fight or flight' hormones are secreted by the adrenal ___\" → **medulla**. And: \"The main mineralocorticoid in the human body is ___\" → **aldosterone**. Addison's disease is caused by **adrenal cortex** underproduction — never the medulla.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know the two guardian glands — the thymus that trained your immune system and the adrenal glands that run your emergency response and your salt-and-sugar balance. Next, you'll meet the pancreas and the gonads — the glands that manage your blood sugar day to day and drive reproduction.",
    },
    // ── 13 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Thymosins, secreted by the thymus, are directly responsible for which of the following?",
          options: [
            "Reabsorption of Na⁺ and water at the renal tubules",
            "Differentiation of T-lymphocytes and promotion of antibody production",
            "Rapid raising of blood glucose during an emergency",
            "Anti-inflammatory reactions and stimulation of RBC production",
          ],
          correct_index: 1,
          explanation: "NCERT states thymosins drive the differentiation of T-lymphocytes (cell-mediated immunity) and promote antibody production (humoral immunity). Na⁺/water reabsorption is aldosterone's job; the emergency glucose spike is the catecholamines' job; anti-inflammatory action and RBC stimulation belong to cortisol — none of these come from the thymus.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which hormones are the 'Fight or Flight' hormones, and which part of the adrenal gland secretes them?",
          options: [
            "Cortisol and aldosterone, secreted by the adrenal cortex",
            "Adrenaline and noradrenaline, secreted by the adrenal cortex",
            "Adrenaline and noradrenaline, secreted by the adrenal medulla",
            "Thymosins and cortisol, secreted by the adrenal medulla",
          ],
          correct_index: 2,
          explanation: "The 'Fight or Flight' hormones are adrenaline (epinephrine) and noradrenaline (norepinephrine) — the catecholamines — and they come from the centrally located adrenal medulla. Option 2 names the right hormones but the wrong tissue (cortex). Cortisol and aldosterone are corticoids from the cortex, and thymosins come from the thymus, so those options are out.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Aldosterone, the main mineralocorticoid, acts mainly at the renal tubules to do what?",
          options: [
            "Reabsorb Na⁺ and water, and excrete K⁺ and phosphate ions",
            "Reabsorb K⁺ and phosphate ions, and excrete Na⁺ and water",
            "Stimulate gluconeogenesis, lipolysis and proteolysis",
            "Break down glycogen to raise the glucose concentration in blood",
          ],
          correct_index: 0,
          explanation: "Aldosterone stimulates reabsorption of Na⁺ and water while excreting K⁺ and phosphate ions, which maintains electrolytes, body fluid volume, osmotic pressure and blood pressure. Option 2 reverses exactly what is reabsorbed vs excreted. Option 3 describes glucocorticoids (cortisol), and option 4 describes the catecholamines — not aldosterone.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Addison's disease is caused by which of the following?",
          options: [
            "Overproduction of catecholamines by the adrenal medulla",
            "Degeneration of the thymus and reduced thymosin levels",
            "Underproduction of hormones by the adrenal cortex, altering carbohydrate metabolism",
            "Overproduction of aldosterone leading to excess Na⁺ reabsorption",
          ],
          correct_index: 2,
          explanation: "NCERT is specific: Addison's disease results from underproduction of hormones by the adrenal cortex, which alters carbohydrate metabolism and causes acute weakness and fatigue. It is not a medulla problem, not a thymus problem, and not an overproduction problem — the trap options each move the fault to the wrong gland or the wrong direction.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
