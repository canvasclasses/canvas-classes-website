'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'coagulation-and-lymph',
  title: 'Coagulation of Blood & Lymph',
  subtitle: "A cut finger stops bleeding on its own because a chain of inactive plasma proteins wakes up in order and weaves a mesh — and the same tissue capillaries that leak this fluid also feed every cell in your body through lymph.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'coagulation', 'lymph'],
  glossary: [
    { term: 'coagulation (clotting)', definition: "Blood's response to an injury or trauma, in which it turns from a flowing liquid into a solid clot to prevent excessive loss of blood from the body." },
    { term: 'clot (coagulum)', definition: 'The dark reddish-brown scum at a wound — a network of threads called fibrins in which the dead and damaged formed elements of blood are trapped.' },
    { term: 'fibrinogen', definition: 'An inactive protein present in the plasma that is converted into fibrin threads by the enzyme thrombin.' },
    { term: 'thrombin', definition: 'The enzyme that converts inactive fibrinogens into fibrins; it is itself formed from inactive prothrombin.' },
    { term: 'prothrombin', definition: 'An inactive substance present in the plasma from which thrombin is formed.' },
    { term: 'thrombokinase', definition: 'An enzyme complex required to form thrombin from prothrombin; it is produced by a series of linked enzymic reactions (a cascade) involving many inactive plasma factors.' },
    { term: 'interstitial fluid (tissue fluid)', definition: 'The fluid released when water and small water-soluble substances move out of tissue capillaries into the spaces between cells; it has the same mineral distribution as plasma.' },
    { term: 'lymph', definition: 'The colourless fluid present in the lymphatic system — it contains specialised lymphocytes, carries nutrients and hormones, and absorbs fats through the lacteals of the intestinal villi.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single drop of deep red blood on a dark surface, with fine thread-like fibres beginning to web across it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single glistening drop of deep crimson blood rests on a dark, near-black surface, and from within it fine, pale thread-like fibres are just beginning to web across the surface, as if something liquid is quietly turning solid. Soft warm rim light catches the edge of the drop; the rest of the frame falls away into deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Why a Small Cut Stops Bleeding on Its Own',
      markdown: "When you cut your finger, the blood does not keep flowing for long — it stops after some time on its own. That dark reddish-brown scum you have seen form over a cut is not the blood drying. It is a **clot**: a real, built-on-the-spot mesh that your blood assembles at the wound to shut the leak and prevent excessive loss of blood from the body.",
    },
    // ── 2 · Core concept — why blood clots ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Blood shows **coagulation** (also called **clotting**) in response to an injury or trauma. Its whole purpose is one thing: **to prevent excessive loss of blood from the body**.\n\nSo what actually forms at the cut? A **clot**, or **coagulum**. Picture a tiny fishing net thrown across the wound. The net itself is made of a network of threads called **fibrins**, and caught inside that net are the **dead and damaged formed elements of blood** — the used-up cells trapped in the mesh. That trapped, meshed material is the reddish-brown scum you see.",
    },
    // ── 3 · Heading — the cascade ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Clotting Cascade — Inactive Proteins Waking Up in Order',
      objective: "By the end of this you can trace, in the right order, how prothrombin becomes thrombin and how thrombin turns fibrinogen into the fibrin mesh — and name what calcium ions and platelets do.",
    },
    // ── 4 · Text — the cascade, worked backward from the mesh ─────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The trick to remembering this is that the whole thing runs on **inactive** ingredients already floating in the plasma, switched on in a set order.\n\nThe fibrin threads don't exist ready-made. They are formed from **fibrinogens** — an inactive protein sitting in the plasma — and the enzyme that switches fibrinogen into fibrin is **thrombin**.\n\nBut thrombin isn't ready-made either. It is formed from another inactive plasma substance, **prothrombin**. To convert prothrombin into thrombin, an enzyme complex called **thrombokinase** is required. And thrombokinase itself is built by a **series of linked enzymic reactions** — a **cascade process** — involving a number of factors that also wait in the plasma in an inactive state.\n\nWhat kicks the whole chain off? An injury stimulates the **platelets** in the blood to release certain factors that activate coagulation. Factors released by the injured **tissues** at the site can also start it. And running quietly through all of it, **calcium ions play a very important role in clotting**.",
    },
    // ── 5 · Interactive image — the cascade ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A flow diagram of the blood clotting cascade running from platelets and injured tissue through thrombokinase and calcium ions to prothrombin, thrombin, fibrinogen and a final fibrin mesh trapping blood cells',
      caption: '📸 Tap each dot to walk the clotting cascade from the injury to the finished fibrin mesh.',
      generation_prompt: "Scientific textbook illustration of the blood clotting (coagulation) cascade as a clean left-to-right flow diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. On the left, a cut with red blood and small pink platelets plus a torn tissue edge feeding into an enzyme-complex node labelled thrombokinase, with small blue dots labelled calcium ions feeding the same step. An arrow leads to a step where inactive prothrombin (shown greyed) is converted to active thrombin. Thrombin's arrow points to a step where inactive fibrinogen (greyed) is converted to red fibrin threads. On the right, those fibrin threads form a woven mesh with several dead and damaged blood cells trapped inside it. Functional colours: red=blood and fibrin, pink=platelets/soft tissue, blue=calcium ions, grey=inactive precursors. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.34, label: 'Injury triggers it', detail: 'An injury or trauma stimulates the **platelets** to release factors that activate coagulation. Factors released by the injured **tissues** at the site can also initiate it.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.62, label: 'Calcium ions', detail: '**Calcium ions play a very important role in clotting** — they are needed for the reactions to run.', icon: 'circle' },
        { id: uuid(), x: 0.34, y: 0.30, label: 'Thrombokinase', detail: 'An enzyme complex formed by a **series of linked enzymic reactions (a cascade)** involving many inactive plasma factors. It is required to convert prothrombin into thrombin.', icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.44, label: 'Prothrombin → Thrombin', detail: 'Inactive **prothrombin** in the plasma is converted into the enzyme **thrombin** (thrombokinase and calcium ions are required for this step).', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.44, label: 'Fibrinogen → Fibrin', detail: 'The enzyme **thrombin** converts inactive **fibrinogens** in the plasma into **fibrin** threads.', icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.50, label: 'The fibrin mesh', detail: 'The **fibrins** form a network of threads — the **clot / coagulum** — in which the **dead and damaged formed elements of blood** are trapped.', icon: 'circle' },
      ],
    },
    // ── 6 · Reasoning prompt — the enzyme that makes fibrin ────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A student says: \"The clot's mesh is made of fibrin, so fibrin must be made directly from prothrombin.\" Which single correction fixes this statement?",
      options: [
        "Fibrin is formed from fibrinogen by the enzyme thrombin — and thrombin, not prothrombin, is the immediate maker of fibrin.",
        "Fibrin is formed directly from prothrombin by the enzyme thrombokinase, with no thrombin step in between.",
        "Fibrin is formed from fibrinogen by the enzyme prothrombin, which is already active in the plasma.",
        "Fibrin is formed from thrombin by the enzyme fibrinogen, which platelets release at the wound.",
      ],
      reveal: "The first option is right. The order is prothrombin → (thrombokinase + calcium ions) → thrombin, and then thrombin → fibrinogen → fibrin. So the enzyme sitting immediately before fibrin is thrombin, made from prothrombin one step earlier — prothrombin never makes fibrin directly. The tempting wrong choice is the second one, which collapses two separate steps into one and skips thrombin entirely; but thrombokinase's job is to make thrombin from prothrombin, not to make fibrin. The other two simply swap the names of the enzyme and its raw material around.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — lymph / tissue fluid ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Lymph — the Fluid That Leaks Out to Feed Your Cells',
      objective: "By the end of this you can explain where tissue fluid comes from, why it forms, what lymph carries, and where the lymphatic system drains it back to.",
    },
    // ── 8 · Text — tissue fluid → lymph ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Your cells don't sit in the blood vessels — so how does blood feed them? Through a fluid that leaks out to reach them.\n\nAs blood passes through the **capillaries** in the tissues, some water along with many small water-soluble substances moves out into the **spaces between the cells**. Notice what stays behind: the **larger proteins** and **most of the formed elements** are too big to slip out, so they remain inside the blood vessels. The fluid that does get released is called the **interstitial fluid** or **tissue fluid**, and it has the **same mineral distribution as plasma**. Every exchange of nutrients and gases between the blood and the cells always happens through this fluid.\n\nThis fluid can't just pool there forever. An elaborate network of vessels — the **lymphatic system** — collects it and drains it back to the major **veins**. Once it is inside that system, the fluid is called **lymph**.\n\n**Lymph** is a **colourless** fluid containing specialised **lymphocytes**, the cells responsible for the body's **immune responses**. It is also an important carrier of **nutrients and hormones**. And there's one job only lymph does: **fats are absorbed through lymph in the lacteals present in the intestinal villi**.",
    },
    // ── 9 · Comparison card — Blood vs Lymph ──────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Blood vs Lymph',
      columns: [
        {
          heading: 'Blood',
          points: [
            'Plasma plus all the formed elements — RBCs are present',
            'Carries the larger plasma proteins',
            'Red in colour (because of the RBCs)',
            'Flows through the arteries, veins and capillaries',
          ],
        },
        {
          heading: 'Lymph',
          points: [
            'Colourless fluid — no RBCs',
            'Mainly contains specialised lymphocytes (for immune responses)',
            'Less protein — the larger proteins were left behind in the vessels',
            'Flows through the lymphatic system, draining back to the major veins',
            'Absorbs fats through the lacteals of the intestinal villi',
          ],
        },
      ],
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **A clot = a fibrin mesh** trapping the dead and damaged formed elements of blood.\n- **Fibrinogen → fibrin**, done by the enzyme **thrombin**.\n- **Prothrombin → thrombin**, and this needs the enzyme complex **thrombokinase** (built by a cascade of inactive plasma factors).\n- **Calcium ions are essential** for clotting; **platelets** and injured **tissues** release the factors that start it.\n- **Lymph** = a **colourless** fluid, mainly **lymphocytes**, formed from leaked tissue fluid, drained back to the major **veins**.\n- **Fats are absorbed via the lacteals** in the intestinal villi — through lymph.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Keep the two conversions in order — this is where marks are lost:** prothrombin → thrombin (needs thrombokinase + calcium ions), then thrombin → converts fibrinogen into fibrin. NEET loves to swap the enzyme with its raw material.\n\n**Tissue fluid = same mineral distribution as plasma**, but the large proteins and formed elements stay in the vessel — that is the exact line NEET tests.\n\n**Classic NEET question:** \"Fibrinogen is converted to fibrin by the enzyme ___\" → **thrombin**. And: \"Fats are absorbed into the ___\" → **lymph, through the lacteals of the intestinal villi**.",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know how blood seals a wound and how lymph feeds and defends your cells. Next, you'll follow the blood itself on its route through the body — the circulatory pathways and the pump that drives them: the human heart.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What is a blood clot (coagulum) actually made of?",
          options: [
            "A network of fibrin threads in which the dead and damaged formed elements of blood are trapped",
            "A sheet of platelets glued together by calcium ions, with no fibrin involved",
            "A network of fibrinogen threads that traps the larger plasma proteins",
            "A layer of dried plasma left behind after the water evaporates from the wound",
          ],
          correct_index: 0,
          explanation: "NCERT states a clot is a network of threads called fibrins in which the dead and damaged formed elements of blood are trapped. The mesh is fibrin (the active form), not fibrinogen (the inactive precursor), and it is genuinely built at the wound — it is not dried plasma or a platelet-only sheet.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which enzyme converts inactive fibrinogens in the plasma into fibrins?",
          options: [
            "Thrombokinase",
            "Prothrombin",
            "Thrombin",
            "Lymphocyte",
          ],
          correct_index: 2,
          explanation: "Fibrins are formed by the conversion of inactive fibrinogens by the enzyme thrombin. Thrombokinase acts one step earlier (it helps make thrombin from prothrombin); prothrombin is the inactive raw material for thrombin, not an enzyme acting on fibrinogen; and a lymphocyte is an immune cell of lymph, unrelated to this step.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "As blood passes through tissue capillaries, what forms the interstitial (tissue) fluid, and what stays behind in the vessels?",
          options: [
            "RBCs and large proteins leak out to form tissue fluid; only water stays behind",
            "Water and small water-soluble substances move out to form tissue fluid; larger proteins and most formed elements stay behind",
            "Only lymphocytes move out to form tissue fluid; plasma stays behind",
            "Fats move out through the lacteals to form tissue fluid; minerals stay behind",
          ],
          correct_index: 1,
          explanation: "NCERT says water and many small water-soluble substances move out into the spaces between cells, leaving the larger proteins and most of the formed elements in the blood vessels — that released fluid is the interstitial (tissue) fluid. RBCs and large proteins do not leak out, and lacteal fat absorption is a separate role of lymph, not how tissue fluid forms.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about lymph is correct?",
          options: [
            "Lymph is red, rich in RBCs, and drains directly into the arteries",
            "Lymph is a colourless fluid with specialised lymphocytes, and fats are absorbed through it in the lacteals of the intestinal villi",
            "Lymph carries the largest plasma proteins that the blood vessels could not hold",
            "Lymph is formed only in the intestinal villi and never leaves them",
          ],
          correct_index: 1,
          explanation: "Lymph is a colourless fluid containing specialised lymphocytes (for immune responses), and fats are absorbed through lymph in the lacteals of the intestinal villi. It has no RBCs (so it isn't red) and drains back to the major veins, not the arteries; the larger proteins are exactly what stayed behind in the blood vessels, so lymph does not carry them.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
