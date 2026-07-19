'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'plant-growth-regulators-intro',
  title: 'Plant Growth Regulators — What They Are & How They Were Found',
  subtitle: "Five tiny molecules run every big decision a plant makes — when to grow, when to flower, when to drop its leaves. Learn what chemical family each one belongs to, and the accidental discoveries (a bending grass, a 'foolish' rice seedling, a ripening orange) that revealed them.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'plant-growth-regulators'],
  glossary: [
    { term: 'plant growth regulator (PGR)', definition: 'A small, simple molecule of diverse chemistry that controls growth and development in a plant. Also called a plant growth substance, plant hormone, or phytohormone.' },
    { term: 'growth promoter', definition: 'A PGR involved in growth-promoting activities — cell division, cell enlargement, pattern formation, tropic growth, flowering, fruiting and seed formation. Auxins, gibberellins and cytokinins belong to this group.' },
    { term: 'growth inhibitor', definition: 'A PGR involved in stress responses and growth-inhibiting activities such as dormancy and abscission. Abscisic acid (ABA) belongs to this group; the gaseous PGR ethylene is largely an inhibitor too.' },
    { term: 'phototropism', definition: 'The growth of a plant organ towards a light source coming from one side. Canary grass coleoptiles bending towards unilateral light is the classic example that started the discovery of auxin.' },
    { term: 'coleoptile', definition: 'The protective sheath covering the emerging shoot in grasses (like canary grass and oat). Its tip is the site of the transmittable influence that bends the whole coleoptile towards light.' },
    { term: "'bakanae' (foolish seedling) disease", definition: 'A disease of rice seedlings caused by the fungal pathogen Gibberella fujikuroi; investigating it led to the discovery of gibberellic acid.' },
    { term: 'callus', definition: 'A mass of undifferentiated cells. Tobacco stem callus proliferated only when auxin was supplemented with an extract such as vascular tissue, yeast extract, coconut milk or DNA — the clue that led to cytokinin.' },
    { term: 'abscisic acid (ABA)', definition: 'A growth-inhibiting PGR named after three chemically identical inhibitors — inhibitor-B, abscission II and dormin — were found to be the same substance.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A young grass seedling in near-darkness bending its tip towards a single soft beam of light coming from one side',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single slender grass seedling stands in dark soil in an otherwise dim frame, its slim shoot curving gently towards one soft warm beam of light entering from the left side, like a plant quietly deciding which way to grow. Deep shadows fill the rest of the frame, with subtle warm highlights along the curved stem and a faint glow where the light meets the tip. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Plant Runs on Just Five Chemicals',
      markdown: "A plant can't move, can't talk, and has no brain — yet it makes exact decisions all the time. When to grow taller. When to flower. When to ripen its fruit. When to drop its old leaves and go to sleep for winter. Every one of these decisions is controlled by **five tiny molecules**, and each of the five was discovered completely **by accident** — while scientists were actually looking at a grass bending towards light, a 'foolish' rice seedling, and a basket of ripening oranges.",
    },
    // ── 2 · Core concept — what PGRs are + the five chemical classes ─────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Plant growth regulators (PGRs)** are **small, simple molecules of diverse chemical composition**. \"Diverse\" is the key word — they don't all belong to one chemical family. NCERT lists exactly what each one is made of:\n\n- **Indole compounds** — indole-3-acetic acid, **IAA** (this is **auxin**).\n- **Adenine derivatives** — N⁶-furfurylamino purine, **kinetin** (this is a **cytokinin**).\n- **Carotenoid derivatives** — **abscisic acid, ABA**.\n- **Terpenes** — gibberellic acid, **GA₃** (this is a **gibberellin**).\n- **Gases** — **ethylene, C₂H₄**.\n\nThe same five molecules also go by other names in different books — you'll see them called **plant growth substances**, **plant hormones**, or **phytohormones**. All four terms mean the same thing.",
    },
    // ── 3 · Heading — the two functional groups ──────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Promoters vs Inhibitors — The Two Jobs a PGR Can Have',
      objective: "By the end of this you can sort all five PGRs into growth promoters vs inhibitors, and explain why ethylene is the odd one out.",
    },
    // ── 4 · Text — the functional split ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Based on **what they do inside a living plant**, PGRs fall into **two broad groups**.\n\nThe first group are the **growth promoters**. They drive the plant *forward* — **cell division, cell enlargement, pattern formation, tropic growth, flowering, fruiting and seed formation**. Three PGRs sit here: **auxins, gibberellins and cytokinins**.\n\nThe second group work in the opposite direction — they handle the plant's **responses to wounds and stresses** (both living/biotic and non-living/abiotic), and they run **growth-inhibiting activities like dormancy and abscission** (a plant going to sleep, or shedding its old leaves and fruit). **Abscisic acid (ABA)** belongs to this group.\n\nAnd then there's **ethylene**, the gas. It could fit *either* group — but NCERT is clear that it is **largely an inhibitor** of growth activities, so treat it as an inhibitor unless a question says otherwise. The table below is the whole picture on one screen.",
    },
    // ── 5 · Table — five PGRs & their chemical nature ────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'The five PGRs — chemical family and whether each promotes or inhibits growth',
      headers: ['PGR', 'Chemical class', 'Promoter or inhibitor'],
      rows: [
        ['Auxin (IAA)', 'Indole compound', 'Promoter'],
        ['Gibberellin (GA₃)', 'Terpene', 'Promoter'],
        ['Cytokinin (kinetin)', 'Adenine derivative', 'Promoter'],
        ['Abscisic acid (ABA)', 'Carotenoid derivative', 'Inhibitor'],
        ['Ethylene (C₂H₄)', 'Gas', 'Mainly inhibitor (can fit either group)'],
      ],
    },
    // ── 6 · Reasoning prompt — promoter/inhibitor + chemistry check ──────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A student is sorting the PGRs. Exactly one of these four statements is WRONG about either its chemical family or its promoter/inhibitor job. Which one?",
      options: [
        "Auxin (IAA) is an indole compound and acts as a growth promoter.",
        "Abscisic acid is a carotenoid derivative and acts as a growth inhibitor, controlling dormancy and abscission.",
        "Gibberellin (GA₃) is an adenine derivative and acts as a growth promoter.",
        "Ethylene is a gas and, although it could fit either group, is largely an inhibitor.",
      ],
      reveal: "Statement 3 is wrong. Gibberellin (GA₃) is a **terpene**, not an adenine derivative — the adenine derivative is **kinetin**, a cytokinin. The gibberellin's *job* is stated correctly (it is a promoter), but its chemical family is swapped with cytokinin's, which is the classic trap. The other three are exactly right: auxin is an indole compound and a promoter; ABA is a carotenoid derivative and the inhibitor behind dormancy and abscission; and ethylene is the gas that could fit either group but is largely an inhibitor.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — the accidental discoveries ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Accidental Discoveries — Every PGR Was Found by Luck',
      objective: "By the end of this you can name the scientist and the odd observation that revealed each of the five PGRs.",
    },
    // ── 8 · Text — auxin discovery (Darwin → Went) ───────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Here's the surprising part: the discovery of **each of the five major groups of PGRs was accidental**. Nobody set out to find them.\n\nIt started with **Charles Darwin and his son Francis Darwin**. They noticed that the **coleoptiles of canary grass** — the little sheath around a grass shoot — **bent towards light** when the light came from one side. This growing-towards-light is called **phototropism**. After a series of experiments, they concluded that the **tip of the coleoptile** was the **site of the transmittable influence** — some signal made at the tip travelled down and caused the *whole* coleoptile to bend. Years later, **F.W. Went** actually **isolated auxin** from the **tips of oat coleoptiles**. Tap through the experiment below to see exactly what the Darwins saw.",
    },
    // ── 9 · Interactive image — Darwin/Went coleoptile experiment ────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'Diagram of a grass coleoptile bending towards a light source coming from one side, showing the tip as the source of the bending influence',
      caption: '📸 Tap each dot to explore the classic phototropism experiment that revealed auxin.',
      generation_prompt: "Scientific textbook illustration of the classic coleoptile phototropism experiment (Darwin / Went). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show an upright grass seedling coleoptile — a slender vertical green shoot rising from dark soil — that is curving and bending towards the left, where a set of thin white horizontal arrows enters from the left side to indicate a unilateral light source. Clearly show the rounded tip of the coleoptile at the top, drawn slightly brighter/highlighted, as the site where the growth signal originates. Include a faint dashed line down the shaft suggesting the signal travelling from the tip down one side, causing the bend. Clean white outlines, biologically accurate proportions, green for the living shoot, brown/tan for the soil, white text labels with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.45, label: 'Unilateral light', detail: "Light arriving from **one side only**. This is what the canary grass coleoptile responds to — growing towards it. Growth towards a one-sided light source is called **phototropism**.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.14, label: 'Coleoptile tip', detail: "The **tip** is the key. The Darwins concluded it is the **site of the transmittable influence** — the signal that causes bending is made here, at the very top.", icon: 'circle' },
        { id: uuid(), x: 0.6, y: 0.5, label: 'The signal travels down', detail: "A signal made at the tip moves **down** the coleoptile. That signal was later identified as **auxin**.", icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.78, label: 'The whole coleoptile bends', detail: "Because the signal comes down unevenly, the **entire coleoptile bends towards the light** — even though the light was only sensed at the tip.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.92, label: 'Auxin isolated (Went)', detail: "**F.W. Went** later isolated the actual chemical — **auxin** — from the **tips of oat coleoptiles**, turning the Darwins' observation into a named molecule.", icon: 'circle' },
      ],
    },
    // ── 10 · Text — remaining four discoveries ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The other four PGRs were found the same lucky way:\n\n- **Gibberellin** — rice farmers knew a disease that made seedlings grow tall, spindly and 'foolish': the **'bakanae' (foolish seedling) disease**, caused by the fungus **Gibberella fujikuroi**. **E. Kurosawa (1926)** found the disease symptoms appeared when seedlings were treated with **sterile filtrates of the fungus** — no living fungus needed, just its chemical. That active substance was later identified as **gibberellic acid**.\n- **Cytokinin** — **F. Skoog** and co-workers found that tobacco stem **callus** (a mass of undifferentiated cells) would only multiply if, **on top of auxin**, the medium was supplemented with one of: **vascular tissue extract, yeast extract, coconut milk, or DNA**. **Miller et al. (1955)** later identified and crystallised the active substance and named it **kinetin**.\n- **Abscisic acid (ABA)** — three separate teams found three inhibitors they called **inhibitor-B, abscission II, and dormin**. All three turned out to be **chemically identical**, so they were given one name: **abscisic acid**.\n- **Ethylene** — **H.H. Cousins (1910)** found that **ripened oranges** released a **volatile substance** that **hastened the ripening of stored bananas**. That gas was later identified as **ethylene**.",
    },
    // ── 11 · Table — discovery stories ───────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'How each of the five PGRs was accidentally discovered',
      headers: ['PGR', 'Scientist(s)', 'The observation'],
      rows: [
        ['Auxin', 'Charles & Francis Darwin; isolated by F.W. Went', 'Canary grass coleoptiles bent towards unilateral light (phototropism); the tip was the site of the influence; auxin isolated from oat coleoptile tips'],
        ['Gibberellin', 'E. Kurosawa (1926)', "'Bakanae' (foolish seedling) disease of rice, caused by the fungus Gibberella fujikuroi; symptoms appeared from sterile fungal filtrates"],
        ['Cytokinin', 'F. Skoog; Miller et al. (1955)', 'Tobacco callus multiplied only when auxin was supplemented with vascular tissue/yeast extract/coconut milk/DNA; kinetin identified and crystallised'],
        ['Abscisic acid (ABA)', 'Three independent teams', 'Inhibitor-B, abscission II and dormin all turned out chemically identical → named abscisic acid'],
        ['Ethylene', 'H.H. Cousins (1910)', 'A volatile substance from ripened oranges hastened the ripening of stored bananas → later identified as ethylene'],
      ],
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "**The five PGRs and their chemistry:**\n- **Auxin (IAA)** → indole compound → **promoter**\n- **Gibberellin (GA₃)** → terpene → **promoter**\n- **Cytokinin (kinetin)** → adenine derivative → **promoter**\n- **Abscisic acid (ABA)** → carotenoid derivative → **inhibitor**\n- **Ethylene (C₂H₄)** → gas → **mostly an inhibitor** (could fit either group)\n\n**Promoters = auxin, gibberellin, cytokinin. Inhibitor = ABA. Ethylene = mostly inhibitor.**\n\n**Who discovered what (all accidental):**\n- **Darwin (father & son) → auxin** (phototropism in canary grass; tip is the source). Isolated by **Went** from oat coleoptile tips.\n- **Kurosawa / Gibberella fujikuroi → gibberellin** ('bakanae' foolish-seedling disease of rice).\n- **Skoog / Miller (1955) → cytokinin (kinetin)** (tobacco callus + supplement).\n- **Cousins (1910) → ethylene** (oranges ripening bananas).\n- ABA = inhibitor-B + abscission II + dormin, all the same molecule.",
    },
    // ── 13 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Match the chemistry to the PGR — NEET swaps these constantly:** auxin = indole, gibberellin = terpene, cytokinin (kinetin) = adenine derivative, ABA = carotenoid derivative, ethylene = gas. The favourite trap is calling gibberellin an adenine derivative (that's cytokinin) or ABA a terpene (that's gibberellin).\n\n**Discovery pairs are pure recall marks:** Darwin → auxin (phototropism), Went isolated it; Kurosawa & *Gibberella fujikuroi* → gibberellin; Skoog & Miller → cytokinin/kinetin; Cousins → ethylene.\n\n**Classic NEET question:** \"Auxin was isolated by ___\" → **F.W. Went** (from oat coleoptile tips). And its twin: \"The 'bakanae' (foolish seedling) disease of rice led to the discovery of ___\" → **gibberellins**.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know what the five PGRs are made of, which ones push growth forward and which hold it back, and the accidental story behind each one. Next, you'll go inside the three growth promoters — **auxins, gibberellins and cytokinins** — to see exactly what jobs each one does in the plant.",
    },
    // ── 15 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which PGR is correctly matched with its chemical nature?",
          options: [
            "Gibberellic acid (GA₃) — adenine derivative",
            "Kinetin — indole compound",
            "Abscisic acid (ABA) — carotenoid derivative",
            "Indole-3-acetic acid (IAA) — terpene",
          ],
          correct_index: 2,
          explanation: "NCERT lists ABA as a derivative of carotenoids, so option 3 is correct. The traps: GA₃ is a terpene (not adenine — that's kinetin); kinetin is an adenine derivative (not indole — that's IAA); and IAA is an indole compound (not a terpene). Each wrong option is a real chemical family shuffled onto the wrong molecule.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which set correctly lists only growth-promoting PGRs?",
          options: [
            "Auxins, gibberellins and cytokinins",
            "Auxins, abscisic acid and ethylene",
            "Gibberellins, cytokinins and abscisic acid",
            "Cytokinins, ethylene and abscisic acid",
          ],
          correct_index: 0,
          explanation: "The three growth promoters named by NCERT are auxins, gibberellins and cytokinins — option 1. Every other option sneaks in a member of the second group: abscisic acid is an inhibitor (dormancy, abscission), and ethylene is largely an inhibitor too, so any list containing them is not a pure promoter set.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The observation that canary grass coleoptiles bend towards a light source coming from one side led to the discovery of which PGR?",
          options: [
            "Gibberellin",
            "Auxin",
            "Cytokinin",
            "Ethylene",
          ],
          correct_index: 1,
          explanation: "This phototropism observation by Charles and Francis Darwin — and the finding that the coleoptile tip is the source of the bending influence — is the discovery trail of auxin (later isolated by F.W. Went). Gibberellin came from the 'bakanae' rice disease, cytokinin from tobacco callus experiments, and ethylene from oranges ripening bananas — none involved the bending coleoptile.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The 'bakanae' (foolish seedling) disease of rice, caused by the fungus Gibberella fujikuroi, led to the discovery of which PGR?",
          options: [
            "Abscisic acid",
            "Cytokinin",
            "Gibberellin",
            "Auxin",
          ],
          correct_index: 2,
          explanation: "E. Kurosawa (1926) saw the disease symptoms appear when rice seedlings were treated with sterile filtrates of Gibberella fujikuroi; the active substance was later identified as gibberellic acid — so the answer is gibberellin. Abscisic acid came from three identical inhibitors, cytokinin from tobacco callus plus supplements, and auxin from the Darwins' bending coleoptile.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
