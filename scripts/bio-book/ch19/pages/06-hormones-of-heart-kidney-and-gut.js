'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'hormones-of-heart-kidney-and-gut',
  title: 'Hormones from the Heart, Kidney & Gut',
  subtitle: "Not every hormone comes from a gland. Your heart, your kidneys and the lining of your gut quietly make hormones too — and NEET loves asking exactly which organ makes which one.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'non-endocrine-hormones'],
  glossary: [
    { term: 'atrial natriuretic factor (ANF)', definition: 'A peptide hormone secreted by the atrial wall of the heart that decreases blood pressure. When blood pressure rises, ANF is released and widens the blood vessels, bringing the pressure back down.' },
    { term: 'atrial wall', definition: 'The muscular wall of the atria (the upper chambers of the heart). It is the part of the heart that secretes the hormone ANF.' },
    { term: 'juxtaglomerular cells', definition: 'Specialised cells of the kidney that produce the peptide hormone erythropoietin.' },
    { term: 'erythropoietin', definition: 'A peptide hormone made by the juxtaglomerular cells of the kidney that stimulates erythropoiesis — the formation of red blood cells (RBCs).' },
    { term: 'erythropoiesis', definition: 'The formation of red blood cells (RBCs). It is stimulated by the hormone erythropoietin.' },
    { term: 'gastrin', definition: 'A peptide hormone from endocrine cells of the gastrointestinal tract. It acts on the gastric glands and stimulates the secretion of hydrochloric acid and pepsinogen.' },
    { term: 'secretin', definition: 'A peptide hormone of the gastrointestinal tract. It acts on the exocrine pancreas and stimulates the secretion of water and bicarbonate ions.' },
    { term: 'cholecystokinin (CCK)', definition: 'A gastrointestinal peptide hormone that acts on both the pancreas and the gall bladder, stimulating the secretion of pancreatic enzymes and bile juice respectively.' },
    { term: 'gastric inhibitory peptide (GIP)', definition: 'A peptide hormone of the gastrointestinal tract that inhibits gastric secretion and motility.' },
    { term: 'growth factors', definition: 'Hormones secreted by several non-endocrine tissues that are essential for the normal growth of tissues and their repair/regeneration.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim anatomical study showing a heart, a kidney and a length of intestine glowing softly against darkness, connected by faint threads of light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Three human organs — a heart, a single kidney, and a coiled length of intestine — float in a dark, near-black space (#0a0a0a base tones), each softly self-illuminated as if lit from within. Faint threads of warm light drift outward from each organ into the surrounding darkness, hinting that each one is quietly sending out chemical messengers, without any literal labels or diagram elements. Deep shadows fill the rest of the frame, with subtle warm and red highlights on the organs. Painterly, atmospheric illustration style, dark background throughout, no text, no labels, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Heart Is Also a Gland',
      markdown: "You have spent this chapter learning about the pituitary, thyroid, adrenal and the rest — the organs whose *whole job* is to make hormones. But your **heart** — the pump you never think about — also makes a hormone. So does your **kidney**. So does the lining of your **stomach and intestine**. These organs have a main day job, and secreting a hormone is their quiet side job.",
    },
    // ── 2 · Core concept — not only glands make hormones ─────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By now you know the **endocrine glands** and their hormones. But hormones are **also secreted by some tissues that are not endocrine glands** at all. These organs already do a big job — pumping blood, filtering waste, digesting food — and on the side, certain cells inside them release hormones into the blood.\n\nOn this page you will meet these part-time hormone makers: the **heart**, the **kidney**, and the **gastrointestinal (GI) tract**. For NEET, the trick is simply matching each organ to the hormone it makes and what that hormone does — so keep those three pairings sharp as you read.",
    },
    // ── 3 · Heading — heart & kidney ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Heart and the Kidney',
      objective: "By the end of this you can name the hormone your heart makes and what it does to blood pressure, and the hormone your kidney makes and what it does to your blood.",
    },
    // ── 4 · Text — ANF + erythropoietin ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **atrial wall of the heart** — the wall of its upper chambers — secretes a very important peptide hormone called **atrial natriuretic factor (ANF)**, and its job is to **decrease blood pressure**. Picture the feedback: when your **blood pressure rises too high**, ANF is secreted. ANF then causes the **blood vessels to dilate** (widen). Wider vessels give the blood more room, so the pressure drops back down. It is a built-in brake on high blood pressure, and the brake sits inside the heart itself.\n\nThe **kidney** does something completely different. Its **juxtaglomerular cells** produce a peptide hormone called **erythropoietin**, which **stimulates erythropoiesis** — the **formation of red blood cells (RBCs)**. So the same organ that filters your blood also tells your body to make more of the red cells that carry oxygen in it.\n\nNotice both are **peptide hormones**, but they pull in different directions — one lowers a pressure, the other raises a cell count. Tap the diagram below to place each source and its effect.",
    },
    // ── 5 · Interactive image — non-gland hormone sources ────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A simple body outline showing the heart, one kidney and the stomach-intestine, each marked with the hormone it secretes and what that hormone does',
      caption: '📸 Tap each dot to see which non-gland organ makes which hormone — and what that hormone does.',
      generation_prompt: "Scientific textbook illustration of the non-endocrine hormone-secreting organs of the human body. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a simple faint white body outline (torso), with three organs clearly drawn and placed anatomically: a heart in the chest with its upper atrial wall emphasised, a single kidney lower and to the side, and the stomach connected to a coiled small intestine in the belly. Clean white outlines, biologically accurate proportions. Use functional colours: pink/magenta for the heart soft tissue, brownish-red for the kidney, tan for the stomach and intestine. Labels in white text with thin white leader lines pointing to each organ. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.28, label: 'Atrial wall of the heart → ANF', detail: "The **atrial wall** secretes **atrial natriuretic factor (ANF)**, a peptide hormone that **decreases blood pressure**.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.40, label: 'ANF → dilates blood vessels', detail: "When **blood pressure rises**, ANF is secreted and causes **dilation of the blood vessels**, which reduces the blood pressure.", icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.55, label: 'Juxtaglomerular cells of kidney → erythropoietin', detail: "The **juxtaglomerular cells** of the kidney produce **erythropoietin**, a peptide hormone that stimulates **erythropoiesis (formation of RBCs)**.", icon: 'circle' },
        { id: uuid(), x: 0.44, y: 0.62, label: 'Stomach → gastrin', detail: "Endocrine cells of the gastrointestinal tract secrete **gastrin**, which acts on the **gastric glands** to stimulate **hydrochloric acid and pepsinogen** secretion.", icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.72, label: 'Gut → secretin, CCK & GIP', detail: "**Secretin** stimulates the exocrine pancreas to release **water and bicarbonate ions**; **CCK** acts on the **pancreas and gall bladder** for **pancreatic enzymes and bile**; **GIP** **inhibits gastric secretion and motility**.", icon: 'circle' },
      ],
    },
    // ── 6 · Reasoning prompt — mid-page check ────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A patient's blood pressure suddenly spikes. Which single event is the body's own hormonal response that will bring it back down, according to NCERT?",
      options: [
        "The kidney releases erythropoietin, which widens the blood vessels and lowers the pressure",
        "The atrial wall of the heart secretes ANF, which dilates the blood vessels and reduces the pressure",
        "Gastrin is secreted, which relaxes the blood vessels and drops the pressure",
        "The atrial wall secretes ANF, which stimulates the formation of extra RBCs to absorb the pressure",
      ],
      reveal: "The correct answer is the second option. NCERT states plainly: when blood pressure is increased, the atrial wall's ANF is secreted, it causes dilation (widening) of the blood vessels, and this reduces the blood pressure. The first option names the wrong hormone — erythropoietin comes from the kidney and makes RBCs, it has nothing to do with vessel width. The third option misuses gastrin, which acts on the gastric glands for acid and pepsinogen, not on blood vessels. The fourth option starts right (ANF from the atrial wall) but then swaps in erythropoietin's job — ANF lowers pressure by dilating vessels, it does not make RBCs.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — the gut hormones ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Four Hormones of the Gut',
      objective: "By the end of this you can list the four GI-tract hormones and say, for each one, which organ it acts on and what it makes that organ do.",
    },
    // ── 8 · Text — the four GI hormones ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Endocrine cells present in different parts of the gastrointestinal tract** secrete **four major peptide hormones**: **gastrin**, **secretin**, **cholecystokinin (CCK)** and **gastric inhibitory peptide (GIP)**. Each one nudges a different part of digestion:\n\n- **Gastrin** acts on the **gastric glands** and stimulates the secretion of **hydrochloric acid (HCl) and pepsinogen** — the stomach's acid-and-enzyme starter kit.\n- **Secretin** acts on the **exocrine pancreas** and stimulates the secretion of **water and bicarbonate ions** — this is what neutralises the acid arriving from the stomach.\n- **CCK** acts on **both the pancreas and the gall bladder**, stimulating **pancreatic enzymes** from the pancreas and **bile juice** from the gall bladder, respectively.\n- **GIP** does the opposite of gastrin: it **inhibits gastric secretion and motility** — it puts the brakes on the stomach.\n\nBeyond these, **several other non-endocrine tissues secrete hormones called growth factors**, which are essential for the **normal growth of tissues and their repair/regeneration**. The table below lines up every source with its effect — this is the exact matching NEET tests.",
    },
    // ── 9 · Table — every non-gland hormone, source → target → effect ────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'Every non-gland hormone: which organ makes it, what it acts on, and its effect',
      headers: ['Hormone', 'Made by / acts on', 'Effect'],
      rows: [
        ['ANF (atrial natriuretic factor)', 'Atrial wall of the heart', 'Decreases blood pressure by dilating blood vessels'],
        ['Erythropoietin', 'Juxtaglomerular cells of the kidney', 'Stimulates erythropoiesis (formation of RBCs)'],
        ['Gastrin', 'Gut → acts on gastric glands', 'Stimulates secretion of HCl and pepsinogen'],
        ['Secretin', 'Gut → acts on exocrine pancreas', 'Stimulates secretion of water and bicarbonate ions'],
        ['Cholecystokinin (CCK)', 'Gut → acts on pancreas and gall bladder', 'Stimulates pancreatic enzymes and bile juice'],
        ['Gastric inhibitory peptide (GIP)', 'Gut endocrine cells', 'Inhibits gastric secretion and motility'],
      ],
    },
    // ── 10 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **ANF** — from the **atrial wall** of the heart → **lowers blood pressure** by **dilating blood vessels**.\n- **Erythropoietin** — from the **juxtaglomerular cells of the kidney** → stimulates **erythropoiesis (RBC formation)**.\n- **Gastrin** → gastric glands → **HCl + pepsinogen**.\n- **Secretin** → exocrine pancreas → **water + bicarbonate ions**.\n- **CCK** → pancreas + gall bladder → **pancreatic enzymes + bile**.\n- **GIP** → **inhibits gastric secretion and motility** (the odd one out — it inhibits).\n- All of these are **peptide hormones**. **Growth factors** from non-endocrine tissues drive normal tissue growth and repair/regeneration.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Erythropoietin:** made by the **juxtaglomerular cells of the kidney** — NEET often hides this by naming the *cells* instead of the *organ*, or by swapping it with the liver. Kidney → RBCs.\n\n**ANF:** the one heart hormone — **atrial wall** → **lowers blood pressure**. If a question says a hormone from the heart *raises* pressure, it's wrong; ANF only lowers it.\n\n**GIP is the trap in the gut set.** Gastrin, secretin and CCK all *stimulate* something; **GIP inhibits** gastric secretion and motility. Questions asking \"which GI hormone inhibits?\" want GIP.\n\n**Classic NEET question:** \"Erythropoietin, which stimulates RBC formation, is secreted by the ___\" → **the kidney (juxtaglomerular cells)**. And: \"The hormone that lowers blood pressure secreted by the heart is ___\" → **ANF**.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know that hormones don't come only from glands — the heart, kidney and gut make them too, and you can match each source to its effect. But here's the deeper question: once a hormone reaches its target organ, how does it actually *work* on that organ? That's the mechanism of hormone action, and it's next.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which hormone is secreted by the atrial wall of the heart, and what does it do?",
          options: [
            "Erythropoietin, which stimulates the formation of red blood cells",
            "Atrial natriuretic factor (ANF), which decreases blood pressure by dilating the blood vessels",
            "Gastrin, which stimulates the secretion of hydrochloric acid and pepsinogen",
            "Atrial natriuretic factor (ANF), which increases blood pressure by narrowing the blood vessels",
          ],
          correct_index: 1,
          explanation: "The atrial wall of the heart secretes ANF, and NCERT is specific about its action — it decreases blood pressure by causing the blood vessels to dilate. Erythropoietin is the kidney's hormone and makes RBCs, and gastrin is a gut hormone for acid and pepsinogen, so those options name the wrong source entirely. The last option gets the hormone right but reverses its effect: ANF lowers pressure by widening vessels, it does not raise it by narrowing them.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Erythropoietin, which stimulates erythropoiesis, is produced by which cells?",
          options: [
            "The endocrine cells of the gastrointestinal tract",
            "The atrial wall of the heart",
            "The juxtaglomerular cells of the kidney",
            "The exocrine cells of the pancreas",
          ],
          correct_index: 2,
          explanation: "NCERT states that the juxtaglomerular cells of the kidney produce erythropoietin, which stimulates erythropoiesis (formation of RBCs). The GI-tract endocrine cells make the four gut hormones, the atrial wall makes ANF, and the pancreas is a target of gut hormones rather than the source of erythropoietin — so each of those is the wrong source.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which gut hormone acts on both the pancreas and the gall bladder?",
          options: [
            "Gastrin, stimulating hydrochloric acid and pepsinogen",
            "Secretin, stimulating water and bicarbonate ions",
            "Gastric inhibitory peptide (GIP), inhibiting gastric secretion and motility",
            "Cholecystokinin (CCK), stimulating pancreatic enzymes and bile juice",
          ],
          correct_index: 3,
          explanation: "CCK is the one that acts on two organs at once — the pancreas (for pancreatic enzymes) and the gall bladder (for bile juice). Gastrin acts on the gastric glands, secretin acts on the exocrine pancreas alone, and GIP inhibits gastric secretion and motility, so none of them targets both the pancreas and the gall bladder the way CCK does.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Three of the four gut hormones stimulate a secretion. Which one instead inhibits, and what does it inhibit?",
          options: [
            "GIP — it inhibits gastric secretion and motility",
            "Secretin — it inhibits the release of water and bicarbonate ions",
            "Gastrin — it inhibits hydrochloric acid and pepsinogen",
            "CCK — it inhibits pancreatic enzymes and bile",
          ],
          correct_index: 0,
          explanation: "Gastrin, secretin and CCK each stimulate a secretion; gastric inhibitory peptide (GIP) is the outlier — it inhibits gastric secretion and motility. The other three options describe the exact opposite of what those hormones actually do: gastrin stimulates HCl and pepsinogen, secretin stimulates water and bicarbonate, and CCK stimulates pancreatic enzymes and bile, none of them inhibiting anything.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
