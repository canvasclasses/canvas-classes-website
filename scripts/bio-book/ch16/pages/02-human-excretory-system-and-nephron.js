'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'human-excretory-system-and-nephron',
  title: 'The Human Excretory System & the Nephron',
  subtitle: "Two bean-shaped kidneys, a pair of ureters, a bladder and a urethra clear the waste from your blood — and every drop of that work happens inside one million tiny filters called nephrons. Learn the map of both, exactly as NEET tests it.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'nephron'],
  glossary: [
    { term: 'hilum', definition: 'The notch on the inner concave surface of the kidney through which the ureter, blood vessels and nerves enter and leave.' },
    { term: 'renal pelvis', definition: 'The broad funnel-shaped space just inner to the hilum; its projections are called calyces, and urine drains into it before leaving through the ureter.' },
    { term: 'calyces', definition: 'The cup-like projections of the renal pelvis (singular: calyx) into which the medullary pyramids project and urine is emptied.' },
    { term: 'cortex', definition: 'The outer zone of the kidney. It holds the renal corpuscle, PCT and DCT of every nephron, and extends between the medullary pyramids as the renal columns (Columns of Bertini).' },
    { term: 'medulla', definition: 'The inner zone of the kidney, divided into conical medullary pyramids that project into the calyces. The loop of Henle dips into this zone.' },
    { term: 'nephron', definition: 'The functional (working) unit of the kidney. Each kidney has nearly one million of them; each is made of a glomerulus and a renal tubule.' },
    { term: 'glomerulus', definition: 'A tuft of capillaries formed by the afferent arteriole (a branch of the renal artery). Blood is carried away from it by the efferent arteriole.' },
    { term: 'renal corpuscle', definition: "The glomerulus together with the Bowman's capsule enclosing it. Also called the malpighian body." },
    { term: 'vasa recta', definition: "A minute U-shaped blood vessel that runs parallel to the loop of Henle. It is absent or highly reduced in cortical nephrons." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A pair of reddish-brown bean-shaped kidneys glowing softly in the dark, with faint tubular networks suggested inside',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A pair of reddish-brown, bean-shaped human kidneys float in near-darkness, softly and warmly lit from one side, each glowing gently from within as if backlit. Faint, out-of-focus suggestions of fine branching tubes and blood vessels are hinted inside them, without becoming a literal labelled anatomy diagram. Deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Million Filters in Each Fist-Sized Organ',
      markdown: "Each of your kidneys is only about the size of your fist — **10 to 12 cm long** and **120 to 170 g** in weight. Yet packed inside that small, bean-shaped organ are nearly **one million** microscopic filtering units working around the clock. That's roughly **two million filters** in your body right now, quietly cleaning your blood while you read this sentence.",
    },
    // ── 2 · Core concept — the four parts of the system ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In humans, the excretory system is made of four parts working as one pipeline. First, a pair of **kidneys** — the organs that actually filter the blood and make urine. From each kidney, a tube called the **ureter** carries that urine downward. Both ureters empty into a single **urinary bladder**, which stores the urine. When the bladder is full, urine leaves the body through the **urethra**.\n\nSo the flow is simple to picture: **kidneys make it → ureters carry it → bladder stores it → urethra releases it**. The kidneys do the hard chemical work; the other three parts are just the plumbing that transports and stores what the kidneys produce.",
    },
    // ── 3 · Heading — kidney anatomy ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inside a Kidney — Zones, Pyramids and the Columns of Bertini',
      objective: "By the end of this you can point to the hilum, renal pelvis, calyces, cortex, medulla, medullary pyramids and the Columns of Bertini, and say what each one is.",
    },
    // ── 4 · Text — external shape, hilum, pelvis, calyces ────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A kidney is **reddish-brown** and **bean-shaped**. The two kidneys sit between the levels of the **last thoracic and the third lumbar vertebra**, close to the **dorsal (back) inner wall of the abdominal cavity**. Each adult kidney measures about **10–12 cm long, 5–7 cm wide, 2–3 cm thick**, and weighs **120–170 g**.\n\nA bean has a dent on its inner curve — so does the kidney. That notch on the **inner concave surface** is the **hilum**, and it's the doorway through which the **ureter, blood vessels and nerves enter and leave**. Just inside the hilum is a broad, **funnel-shaped space** called the **renal pelvis**, and the pelvis has cup-like projections called **calyces** (one of them is a *calyx*). Think of the calyces as small cups that collect urine and pour it into the funnel of the pelvis.",
    },
    // ── 5 · Text — capsule, cortex, medulla, pyramids, Columns of Bertini ────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "The whole kidney is wrapped in a **tough outer capsule**. Cut it open and you see **two zones**: an outer **cortex** and an inner **medulla**.\n\nThe medulla isn't one solid mass — it's divided into a few **conical masses called medullary pyramids**, and the tips of these pyramids **project into the calyces** (which is how urine gets emptied into the cups). Between one pyramid and the next, the **cortex dips inward** in strips. These inward extensions of cortex, running between the medullary pyramids, are the **renal columns**, also known as the **Columns of Bertini**. So the cortex isn't only the outer rim — it also reaches down between the pyramids.",
    },
    // ── 6 · Heading — the nephron ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Nephron — the Kidney\'s Working Unit',
      objective: "By the end of this you can trace a nephron from Bowman's capsule to the collecting duct, and name which blood vessel brings blood in and which takes it out.",
    },
    // ── 7 · Text — glomerulus, afferent/efferent, corpuscle, tubule order ────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Each kidney has nearly **one million** complex tubular structures called **nephrons** — these are the **functional units**, the parts that actually do the filtering. Every nephron has **two parts**: the **glomerulus** and the **renal tubule**.\n\nThe **glomerulus** is a **tuft of capillaries** — imagine a tiny ball of tangled blood vessels. It's fed by the **afferent arteriole**, a fine branch of the renal artery that brings blood *in*; blood is then carried *away* by the **efferent arteriole**. (A memory hook: **A**fferent = **A**rrives, **E**fferent = **E**xits.)\n\nThe renal tubule begins as a **double-walled, cup-like structure called Bowman's capsule**, which wraps around the glomerulus. The glomerulus **together with** its Bowman's capsule is called the **malpighian body** or **renal corpuscle**. From there the tubule runs in a fixed order: **proximal convoluted tubule (PCT)** → a hairpin-shaped **Henle's loop** (with a *descending* limb going down and an *ascending* limb coming back up) → **distal convoluted tubule (DCT)**. The DCTs of many nephrons then open into a straight **collecting duct**; many collecting ducts converge and empty into the **renal pelvis** through the **medullary pyramids in the calyces**.\n\nWhere do these parts sit? The **renal corpuscle, PCT and DCT lie in the cortex**, while the **loop of Henle dips down into the medulla**. Explore the diagram below — tap each dot.",
    },
    // ── 8 · Interactive nephron diagram ──────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Diagrammatic representation of a single nephron showing the glomerulus in Bowman\'s capsule, the afferent and efferent arterioles, PCT, loop of Henle, DCT, collecting duct and surrounding capillaries',
      caption: '📸 Tap each dot to explore the nephron — the kidney\'s one-million-strong filtering unit (Figure 16.3 style).',
      generation_prompt: "Scientific textbook illustration of a single human nephron (Figure 16.3 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Show, arranged clearly: a round Bowman's capsule at upper left enclosing a red tuft of capillaries (the glomerulus); a red afferent arteriole entering the capsule and a red efferent arteriole leaving it; a coiled proximal convoluted tubule near the top; a long hairpin-shaped loop of Henle dipping downward with a descending limb and an ascending limb; a coiled distal convoluted tubule; a straight collecting duct on the right into which the tubule drains; and a fine capillary network (peritubular capillaries) with a U-shaped vasa recta running parallel alongside the loop of Henle. Blood vessels in red, tubule outlined in white. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.24, label: "Bowman's capsule + glomerulus", detail: "The **glomerulus** (a tuft of capillaries) sits inside the double-walled, cup-like **Bowman's capsule**. Together they form the **malpighian body / renal corpuscle**, which lies in the cortex.", icon: 'circle' },
        { id: uuid(), x: 0.08, y: 0.16, label: 'Afferent arteriole', detail: "The **afferent arteriole** — a fine branch of the renal artery — brings blood **into** the glomerulus. (Afferent = Arrives.)", icon: 'circle' },
        { id: uuid(), x: 0.34, y: 0.14, label: 'Efferent arteriole', detail: "The **efferent arteriole** carries blood **away** from the glomerulus. (Efferent = Exits.) It goes on to form the peritubular capillaries around the tubule.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.40, label: 'Proximal convoluted tubule (PCT)', detail: "The **PCT** is the highly coiled first part of the renal tubule, straight after Bowman's capsule. It lies in the **cortex**.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.72, label: "Henle's loop (descending + ascending)", detail: "A **hairpin-shaped loop** with a **descending limb** going down and an **ascending limb** coming back up. It **dips into the medulla**.", icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.36, label: 'Distal convoluted tubule (DCT)', detail: "The **DCT** is the coiled region after the ascending limb of Henle's loop. Like the PCT, it lies in the **cortex**.", icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.50, label: 'Collecting duct', detail: "The DCTs of many nephrons open into a straight **collecting duct**. Many of these converge and empty urine into the **renal pelvis** through the medullary pyramids in the calyces.", icon: 'circle' },
        { id: uuid(), x: 0.60, y: 0.74, label: 'Peritubular capillaries / vasa recta', detail: "The efferent arteriole forms a fine capillary network — the **peritubular capillaries** — around the tubule. A minute vessel of this network runs parallel to Henle's loop as the **U-shaped vasa recta**.", icon: 'circle' },
      ],
    },
    // ── 9 · Heading — cortical vs juxtamedullary ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Two Kinds of Nephron — Cortical vs Juxtamedullary',
      objective: "By the end of this you can tell a cortical nephron from a juxtamedullary one by the length of its loop of Henle and whether it has a vasa recta.",
    },
    // ── 10 · Text — the two nephron types + vasa recta ───────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Not every nephron is built the same. The difference is **how far its loop of Henle reaches into the medulla**.\n\nIn **most** nephrons the loop of Henle is **short** and extends only very little into the medulla — these are the **cortical nephrons**. In some nephrons the loop of Henle is **very long** and runs **deep into the medulla** — these are the **juxtamedullary nephrons**.\n\nThis matters for the blood supply too. The efferent arteriole forms the **peritubular capillaries** around the tubule, and a minute vessel of that network runs parallel to Henle's loop as the **U-shaped vasa recta**. Because the vasa recta follows the loop, it is **absent or highly reduced in cortical nephrons** (whose loops barely enter the medulla) and **prominent in juxtamedullary nephrons** (whose long loops run deep).",
    },
    // ── 11 · Comparison card — cortical vs juxtamedullary ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'Cortical vs Juxtamedullary Nephrons',
      columns: [
        { heading: 'Cortical nephron', points: [
          'The majority of nephrons in the kidney',
          'Loop of Henle is short',
          'Loop extends only very little into the medulla',
          'Vasa recta is absent or highly reduced',
        ] },
        { heading: 'Juxtamedullary nephron', points: [
          'Fewer in number (the minority)',
          'Loop of Henle is very long',
          'Loop runs deep into the medulla',
          'Vasa recta is prominent (well developed)',
        ] },
      ],
    },
    // ── 12 · Reasoning prompt — order of nephron parts ───────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "Blood is filtered into Bowman's capsule, and the filtrate then travels through the rest of the renal tubule before reaching the collecting duct. In which order does the filtrate pass through these four parts?",
      options: [
        "Bowman's capsule → proximal convoluted tubule → Henle's loop → distal convoluted tubule",
        "Bowman's capsule → distal convoluted tubule → Henle's loop → proximal convoluted tubule",
        "Bowman's capsule → Henle's loop → proximal convoluted tubule → distal convoluted tubule",
        "Bowman's capsule → proximal convoluted tubule → distal convoluted tubule → Henle's loop",
      ],
      reveal: "The correct order is option 1: **Bowman's capsule → PCT → Henle's loop → DCT**, after which the DCT opens into the collecting duct. The trap in the other options is swapping the two convoluted tubules or moving Henle's loop out of the middle. The word 'proximal' means near (near the Bowman's capsule, so it comes first) and 'distal' means far (farther along, so it comes after the loop). Henle's loop always sits between the PCT and the DCT — it's the hairpin that dips into the medulla and comes back.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Excretory system = kidneys + ureters + urinary bladder + urethra.**\n- **Kidney zones:** outer **cortex**, inner **medulla**; the medulla forms conical **medullary pyramids** that project into the calyces; the cortex dips between the pyramids as the **renal columns (Columns of Bertini)**.\n- **Hilum** = notch where ureter, blood vessels and nerves enter; inside it is the funnel-shaped **renal pelvis** with **calyces**.\n- **Nephron** (≈ **one million** per kidney, the functional unit) = **glomerulus + renal tubule**.\n- **Afferent arteriole brings blood in; efferent arteriole takes it out.** (Afferent = Arrives.)\n- **Bowman's capsule + glomerulus = renal corpuscle (malpighian body).**\n- **Tubule order:** PCT → Henle's loop (descending + ascending) → DCT → collecting duct.\n- **Renal corpuscle, PCT, DCT are in the cortex; the loop of Henle dips into the medulla.**\n- **Cortical** nephron = short loop, vasa recta reduced/absent. **Juxtamedullary** = long loop deep in medulla, prominent vasa recta.",
    },
    // ── 14 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Functional unit of the kidney = the nephron.** NEET lifts this straight from the line \"nearly one million complex tubular structures called nephrons, which are the functional units.\" Don't answer 'kidney' or 'glomerulus' — the functional *unit* is the whole nephron.\n\n**Renal corpuscle = glomerulus + Bowman's capsule.** The renal corpuscle (malpighian body) is not the glomerulus alone — it's the glomerulus **together with** the Bowman's capsule around it.\n\n**Columns of Bertini = cortex reaching between the medullary pyramids.** A favourite trap is calling them part of the medulla; they are renal *columns of cortex*.\n\n**Classic NEET question:** \"The functional unit of the kidney is the ___.\" → **nephron.** And its follow-up: \"The renal corpuscle is made of ___.\" → **glomerulus + Bowman's capsule.**",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now have the full map — the four parts of the excretory system, the zones and pyramids inside a kidney, and every part of the nephron from Bowman's capsule to the collecting duct. Next, you'll watch this machine actually run: how blood turns into urine, step by step, as it moves through the nephron.",
    },
    // ── 16 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which set correctly lists the four parts of the human excretory system?",
          options: [
            "A pair of kidneys, a pair of ureters, a urinary bladder and a urethra",
            "A pair of kidneys, a pair of urethras, a urinary bladder and a ureter",
            "A single kidney, a pair of ureters, a gall bladder and a urethra",
            "A pair of kidneys, a pair of ureters, a urinary bladder and a pair of urethras",
          ],
          correct_index: 0,
          explanation: "NCERT states the system is a pair of kidneys, one pair of ureters, a urinary bladder and a urethra. The tempting trap is option 2, which swaps 'ureter' and 'urethra' — but there are two ureters (one per kidney) and a single urethra. There is no gall bladder in the excretory system (that's part of digestion).",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The renal columns that extend from the cortex between the medullary pyramids are also called:",
          options: [
            "Medullary pyramids",
            "Columns of Bertini",
            "Calyces",
            "Renal pelvis",
          ],
          correct_index: 1,
          explanation: "The cortex dips between the medullary pyramids as renal columns, known as the Columns of Bertini. The pyramids (option 1) are the conical medullary masses those columns run between — not the columns themselves. Calyces and the renal pelvis are urine-collecting spaces near the hilum, not extensions of the cortex.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In a nephron, blood is brought into the glomerulus and carried away from it by, respectively:",
          options: [
            "The efferent arteriole (in) and the afferent arteriole (out)",
            "The renal artery (in) and the vasa recta (out)",
            "The afferent arteriole (in) and the efferent arteriole (out)",
            "The peritubular capillaries (in) and the efferent arteriole (out)",
          ],
          correct_index: 2,
          explanation: "The afferent arteriole (a branch of the renal artery) brings blood into the glomerulus, and the efferent arteriole carries it away — remember Afferent = Arrives. Option 1 reverses the two. The vasa recta and peritubular capillaries form later, from the efferent arteriole, around the tubule — they don't feed the glomerulus directly.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How does a juxtamedullary nephron differ from a cortical nephron?",
          options: [
            "Its loop of Henle is short and its vasa recta is reduced or absent",
            "Its loop of Henle is very long, runs deep into the medulla, and has a prominent vasa recta",
            "It lacks a glomerulus, so filtration happens only in its long loop of Henle",
            "Its renal corpuscle sits in the medulla instead of the cortex",
          ],
          correct_index: 1,
          explanation: "A juxtamedullary nephron has a very long loop of Henle running deep into the medulla, with a prominent (well-developed) vasa recta following it. Option 1 actually describes a cortical nephron (short loop, reduced/absent vasa recta). Every nephron has a glomerulus (option 3 is false), and in all nephrons the renal corpuscle stays in the cortex — only the loop of Henle dips into the medulla (option 4 is false).",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
