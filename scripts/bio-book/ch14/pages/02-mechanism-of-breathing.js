'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mechanism-of-breathing',
  title: 'The Mechanism of Breathing',
  subtitle: "Air doesn't get sucked into your lungs by magic — your diaphragm and rib muscles change the size of your chest, and air simply moves from high pressure to low. Get that one idea and every breathing question becomes obvious.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'inspiration-expiration'],
  glossary: [
    { term: 'breathing', definition: 'The physical movement of air into and out of the lungs, made up of two stages — inspiration (air drawn in) and expiration (air released out).' },
    { term: 'inspiration', definition: 'The stage of breathing in which atmospheric air is drawn into the lungs. It occurs when the intra-pulmonary pressure falls below the atmospheric pressure.' },
    { term: 'expiration', definition: 'The stage of breathing in which the alveolar air is released out of the lungs. It occurs when the intra-pulmonary pressure rises above the atmospheric pressure.' },
    { term: 'intra-pulmonary pressure', definition: 'The pressure of the air inside the lungs. Making it lower than atmospheric pressure pulls air in; making it higher pushes air out.' },
    { term: 'pressure gradient', definition: 'A difference in pressure between the lungs and the atmosphere. Air always moves from the region of higher pressure to the region of lower pressure.' },
    { term: 'diaphragm', definition: 'A dome-shaped muscle at the floor of the thoracic chamber. Its contraction increases the volume of the thoracic chamber along the antero-posterior axis, initiating inspiration.' },
    { term: 'external intercostal muscles', definition: 'Muscles between the ribs whose contraction lifts the ribs and sternum, increasing thoracic volume along the dorso-ventral axis during inspiration.' },
    { term: 'spirometer', definition: 'An instrument used to estimate the volume of air involved in breathing movements; it helps in the clinical assessment of pulmonary functions.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A human chest and rib cage seen in soft light, with a faint impression of the dome-shaped diaphragm rising and falling below the lungs',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A softly lit human chest and rib cage seen from the front in warm, dim light, with a faint translucent impression of a dome-shaped sheet of muscle (the diaphragm) suggested below the lungs, gently flattening and doming as if mid-breath. Subtle sense of air moving, without any literal arrows, labels or diagram text. Deep shadows fill the rest of the frame with soft warm highlights along the ribs. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no people's faces, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Breathe About 20,000 Times a Day Without Deciding To',
      markdown: "A healthy human breathes **12–16 times every minute**. Do the arithmetic across a full day and it lands somewhere near twenty thousand breaths — and you order almost none of them. Your lungs cannot pull in air on their own; they have no muscles of their own to do it. The real work is done by muscles *around* the lungs that quietly change the size of your chest, over and over, while you read this.",
    },
    // ── 2 · Core concept — two stages, pressure gradient ─────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Breathing** has exactly two stages. In **inspiration**, atmospheric air is **drawn in**. In **expiration**, the alveolar air is **released out**. That's the whole cycle — in, then out, repeated.\n\nNow the key question: what actually *moves* the air? Air moves into and out of the lungs by **creating a pressure gradient** between the lungs and the atmosphere. A pressure gradient just means a difference in pressure — and air always flows from where pressure is **higher** to where it is **lower**, on its own. So instead of pumping air like a syringe, your body plays a simpler trick: it changes the pressure *inside* the lungs, and lets the air move itself.\n\nThe pressure of air inside the lungs has a name — the **intra-pulmonary pressure**. Everything about breathing comes down to whether this pressure is below or above the pressure of the atmosphere outside.",
    },
    // ── 3 · Heading — Inspiration ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inspiration — How Air Is Pulled In',
      objective: "By the end of this you can name the two muscle groups that contract during inspiration and trace the chain from muscle contraction all the way to air rushing in.",
    },
    // ── 4 · Text — inspiration mechanism + interactive image ─────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Inspiration** can occur only if the **intra-pulmonary pressure is less than the atmospheric pressure** — that is, there is a **negative pressure** inside the lungs compared to outside. To create that, the body has to make the chest bigger. Two muscle groups do this:\n\n1. **Inspiration is initiated by the contraction of the diaphragm.** The diaphragm is the dome-shaped muscle at the floor of the chest; when it contracts it flattens downward, increasing the volume of the **thoracic chamber** along the **antero-posterior axis** (front-to-back / top-to-bottom).\n2. **The external intercostal muscles** — the muscles between the ribs — then contract and **lift up the ribs and the sternum**, increasing thoracic volume along the **dorso-ventral axis** (back-to-belly).\n\nFollow the chain: the overall increase in thoracic volume causes a similar **increase in pulmonary (lung) volume**. A bigger lung volume **decreases the intra-pulmonary pressure to less than atmospheric** — and that lower pressure inside **forces the air from outside to move into the lungs**. That inward rush of air *is* inspiration.",
    },
    // ── 5 · Interactive image — inspiration vs expiration ────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Two side-by-side diagrams of the chest cavity: on the left inspiration with the diaphragm flattened and ribs lifted and air moving in; on the right expiration with the diaphragm domed and ribs lowered and air moving out',
      caption: '📸 Tap each dot to explore how the diaphragm and rib muscles pull air in and push it out.',
      generation_prompt: "Scientific textbook illustration of the mechanism of breathing, in the style of NCERT Figure 14.2. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Two side-by-side panels of the same thoracic cavity (rib cage, lungs, and diaphragm) shown in clean white outlines with biologically accurate proportions. LEFT PANEL labelled 'Inspiration': the diaphragm is contracted and flattened downward, the ribs and sternum are lifted upward and outward, the lungs are expanded (shown larger), and a white arrow shows air moving IN through the trachea. RIGHT PANEL labelled 'Expiration': the diaphragm is relaxed and domed upward, the ribs and sternum are lowered, the lungs are smaller, and a white arrow shows air moving OUT through the trachea. Lungs in soft pink/magenta (animal soft tissue), diaphragm and rib muscles in a muted pink-red, bones in off-white. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.82, label: 'Diaphragm — contracted (inspiration)', detail: "During inspiration the **diaphragm contracts and flattens downward**. This is what *initiates* inspiration and increases the thoracic volume along the **antero-posterior axis**.", icon: 'circle' },
        { id: uuid(), x: 0.10, y: 0.42, label: 'External intercostals lift the ribs', detail: "Contraction of the **external intercostal muscles** lifts up the **ribs and the sternum**, increasing thoracic volume along the **dorso-ventral axis**.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.30, label: 'Lungs expand — pressure drops', detail: "The increased thoracic volume increases **pulmonary volume**, which lowers the **intra-pulmonary pressure below atmospheric** — a negative pressure inside the lungs.", icon: 'circle' },
        { id: uuid(), x: 0.20, y: 0.10, label: 'Air rushes IN', detail: "Because the pressure inside is now lower than outside, air is **forced from outside into the lungs**. This inward flow is **inspiration**.", icon: 'circle' },
        { id: uuid(), x: 0.84, y: 0.80, label: 'Diaphragm — relaxed (expiration)', detail: "During expiration the **diaphragm relaxes and returns to its domed position**, reducing thoracic volume.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.42, label: 'Ribs and sternum return', detail: "The intercostal muscles relax, so the **ribs and sternum drop back** to their normal positions, shrinking the thoracic (and pulmonary) volume.", icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.10, label: 'Air pushed OUT', detail: "Smaller lung volume raises the **intra-pulmonary pressure to slightly above atmospheric**, which **expels air out** of the lungs. This is **expiration**.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — Expiration ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Expiration — How Air Is Pushed Out',
      objective: "By the end of this you can explain why simply *relaxing* the same muscles is enough to push air back out, and how expiration is the mirror image of inspiration.",
    },
    // ── 7 · Text — expiration mechanism ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Expiration** is the reverse, and it's simpler — for quiet breathing, the muscles don't push, they just **let go**. **Relaxation of the diaphragm and the intercostal muscles** returns the diaphragm and sternum to their **normal positions**. That **reduces the thoracic volume**, and with it the **pulmonary volume**.\n\nSmaller lung volume does the opposite of before: it **increases the intra-pulmonary pressure to slightly above the atmospheric pressure**. With pressure now higher inside than outside, air is **expelled from the lungs** — expiration.\n\nOne more layer: we can **increase the strength of both inspiration and expiration** using **additional muscles in the abdomen**. That's what you use when you take a deep, forceful breath or blow air out hard — but ordinary quiet breathing runs on the diaphragm and intercostals alone.",
    },
    // ── 8 · Comparison card — inspiration vs expiration ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Inspiration vs Expiration',
      columns: [
        {
          heading: 'Inspiration (air in)',
          points: [
            'Diaphragm and external intercostal muscles CONTRACT',
            'Ribs and sternum are lifted up; diaphragm flattens',
            'Thoracic volume INCREASES → pulmonary volume increases',
            'Intra-pulmonary pressure becomes LESS than atmospheric (negative pressure)',
            'Air is forced from outside INTO the lungs',
          ],
        },
        {
          heading: 'Expiration (air out)',
          points: [
            'Diaphragm and intercostal muscles RELAX',
            'Ribs and sternum return to normal; diaphragm domes back up',
            'Thoracic volume DECREASES → pulmonary volume decreases',
            'Intra-pulmonary pressure becomes HIGHER than atmospheric',
            'Air is expelled OUT of the lungs',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — pressure during inspiration ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "During inspiration, the diaphragm and external intercostals contract and the chest expands. What must be true of the intra-pulmonary pressure at that moment for air to actually rush into the lungs?",
      options: [
        "It becomes less than the atmospheric pressure — a negative pressure inside the lungs",
        "It becomes higher than the atmospheric pressure, squeezing air inward",
        "It stays exactly equal to atmospheric pressure while the muscles do the pushing",
        "It rises to slightly above atmospheric pressure, the same as during expiration",
      ],
      reveal: "The first option is correct. When the thoracic volume increases, the pulmonary volume increases too, and a larger volume means the intra-pulmonary pressure DROPS to less than atmospheric — a negative pressure inside the lungs. Air always flows from higher pressure to lower pressure, so it rushes in on its own. The tempting wrong answer is the second one: students remember that 'high pressure pushes air,' but *higher-than-atmospheric* pressure inside the lungs is exactly the expiration condition, and it would push air OUT, not in. Equal pressure (third option) would move no air at all.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Inspiration:** diaphragm + external intercostal muscles **CONTRACT** → thoracic volume **UP** → pulmonary volume up → intra-pulmonary pressure drops **below atmospheric** → air moves **IN**.\n- **Expiration:** those muscles **RELAX** → thoracic volume **DOWN** → pulmonary volume down → intra-pulmonary pressure rises **above atmospheric** → air moves **OUT**.\n- **Diaphragm** increases thoracic volume along the **antero-posterior axis**; **external intercostals** (lifting ribs + sternum) increase it along the **dorso-ventral axis**.\n- **Additional abdominal muscles** can increase the strength of both inspiration and expiration.\n- A healthy human breathes **12–16 times per minute**.\n- Breathing **volumes** are measured with a **spirometer** (clinical assessment of pulmonary function).",
    },
    // ── 11 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Pressure direction is the whole game:** inspiration = intra-pulmonary pressure **less than** atmospheric; expiration = **higher than** atmospheric. NEET loves flipping this to trap you.\n\n**Muscle bookkeeping:** the **diaphragm** works along the **antero-posterior axis**; the **external intercostals** (lifting ribs and sternum) work along the **dorso-ventral axis**. Match each muscle to its axis exactly.\n\n**Classic NEET question:** \"During inspiration, the intra-pulmonary pressure becomes ______ the atmospheric pressure.\" → **less than** (a negative pressure inside the lungs). A common companion question — \"Which muscle's contraction *initiates* inspiration?\" → the **diaphragm**.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "So breathing is really just muscles changing your chest size to flip the pressure inside your lungs — bigger and lower for in, smaller and higher for out. Next, we'll put numbers to those breaths: the **respiratory volumes and capacities** that a spirometer actually measures, and how much air moves with each kind of breath.",
    },
    // ── 13 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Inspiration occurs when the pressure inside the lungs is:",
          options: [
            "Less than the atmospheric pressure (a negative pressure in the lungs)",
            "Higher than the atmospheric pressure",
            "Exactly equal to the atmospheric pressure",
            "Higher than the pressure in the abdominal cavity",
          ],
          correct_index: 0,
          explanation: "Inspiration needs the intra-pulmonary pressure to fall BELOW atmospheric — a negative pressure — so that outside air is forced in. 'Higher than atmospheric' (option 2) is the condition for expiration, when air is pushed out. Equal pressure would move no air, and the abdominal-cavity comparison is not the deciding factor NCERT gives.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which set of events correctly describes inspiration?",
          options: [
            "Diaphragm and intercostals relax → thoracic volume decreases → intra-pulmonary pressure rises → air moves in",
            "Diaphragm and external intercostals contract → thoracic volume increases → intra-pulmonary pressure falls below atmospheric → air moves in",
            "Diaphragm relaxes → ribs are lifted → pulmonary volume decreases → air moves in",
            "External intercostals contract → thoracic volume decreases → intra-pulmonary pressure rises → air moves in",
          ],
          correct_index: 1,
          explanation: "Inspiration is an active, expanding event: the diaphragm and external intercostals CONTRACT, thoracic (and so pulmonary) volume INCREASES, intra-pulmonary pressure FALLS below atmospheric, and air rushes in. Option 1 describes expiration (relaxation, shrinking, rising pressure). Options 3 and 4 mix a relaxation or a volume decrease into inspiration, which contradicts the mechanism.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The contraction of the external intercostal muscles increases the volume of the thoracic chamber by:",
          options: [
            "Flattening the diaphragm along the antero-posterior axis",
            "Pulling the lungs directly outward through their own muscle fibres",
            "Lifting up the ribs and the sternum, increasing volume along the dorso-ventral axis",
            "Contracting the abdominal muscles to push the diaphragm down",
          ],
          correct_index: 2,
          explanation: "The external intercostals lift the ribs and sternum, expanding the chest along the DORSO-VENTRAL axis. Flattening along the antero-posterior axis (option 1) is the diaphragm's job, not the intercostals'. The lungs have no muscles of their own (option 2), and the abdominal muscles (option 4) only add extra strength — they aren't what the external intercostals do.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "On an average, how many times per minute does a healthy human breathe, and what instrument estimates the volume of air involved?",
          options: [
            "12–16 times per minute; measured with a spirometer",
            "20–25 times per minute; measured with a stethoscope",
            "12–16 times per minute; measured with a sphygmomanometer",
            "6–10 times per minute; measured with a spirometer",
          ],
          correct_index: 0,
          explanation: "NCERT states a healthy human breathes 12–16 times per minute, and the volume of air involved in breathing is estimated with a spirometer (used for clinical assessment of pulmonary functions). A stethoscope listens to sounds and a sphygmomanometer measures blood pressure — neither measures breathing volumes — and the 20–25 and 6–10 rates are simply wrong.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
