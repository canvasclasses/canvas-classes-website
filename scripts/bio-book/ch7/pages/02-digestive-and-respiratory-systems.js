'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'digestive-and-respiratory-systems',
  title: "The Frog's Digestive and Respiratory Systems",
  subtitle: "A gut built short on purpose for a carnivore, and two completely different ways to breathe — one through the skin, one through the lungs — and the frog switches between them without missing a beat.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['structural-organisation-in-animals', 'frog', 'digestive-system', 'respiratory-system'],
  glossary: [
    { term: 'alimentary canal', definition: "The continuous digestive tube running from the mouth to the cloaca. In the frog it is short, because a carnivorous diet means the intestine's length is reduced." },
    { term: 'chyme', definition: 'The partially digested food that leaves the stomach and passes into the duodenum, the first part of the small intestine.' },
    { term: 'duodenum', definition: 'The first part of the small intestine. It receives bile from the gall bladder and pancreatic juice from the pancreas, both through a common bile duct.' },
    { term: 'villi (singular: villus)', definition: "Numerous finger-like folds in the intestine's inner wall that absorb digested food; their surface is increased further by even smaller folds called microvilli." },
    { term: 'cloaca', definition: "The single posterior opening through which the frog's digestive tract finally empties to the outside." },
    { term: 'cutaneous respiration', definition: "Breathing through the skin — dissolved oxygen in water is exchanged by diffusion. This is how a submerged frog respires, and it continues even during aestivation and hibernation." },
    { term: 'pulmonary respiration', definition: "Breathing through the lungs — the frog's respiratory method on land, alongside its buccal cavity and skin." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A frog at a pond edge at dusk, half its body submerged in still water and half resting on a wet leaf in open air',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single frog positioned at the exact edge of still pond water at dusk, its lower body and hind legs submerged beneath the water's surface while its head and forelimbs rest on a wet leaf in the open air above. Faint ripples spread out from where its skin meets the waterline. Soft warm dusk light catches the water's surface and the frog's smooth olive-green skin. Out-of-focus reeds frame the edges. Deep dusk lighting, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Gut That Skips the Long Route',
      markdown: "Most textbook animal diagrams show a long, coiled intestine — but a frog's isn't like that. It's carnivorous, and NCERT is direct about what that does to its plumbing: the alimentary canal is **short**, because the length of the intestine itself is **reduced**. Pair that with a set of lungs that only does half the breathing job, and this page covers two systems that both work differently from what you'd expect.",
    },
    // ── 2 · Core concept bridge ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The frog's body cavity holds every organ system with well-developed structure and function. This page covers two of them: how it eats, and how it breathes. Both turn out to be shaped by the same animal living two lives — one in water, one on land.",
    },
    // ── 3 · Heading — Digestive system ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Digestive System — A Short Canal Built for a Carnivore',
      objective: "By the end of this you can trace one bite of food through every organ from mouth to cloaca, and name which gland does what.",
    },
    // ── 4 · Text — anatomical path ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The digestive system has two parts: the **alimentary canal** and the **digestive glands**. Food is captured by the frog's **bilobed tongue**, then travels a fixed route: the **mouth** opens into the **buccal cavity**, which leads to the **oesophagus** through the **pharynx**. The oesophagus is a **short tube** that opens into the **stomach**, which continues as the **intestine**, then the **rectum**, and finally opens to the outside through the **cloaca**.\n\nTwo glands feed into this canal without being part of it. The **liver** secretes **bile**, which is stored in the **gall bladder**. The **pancreas** produces **pancreatic juice**, containing digestive enzymes. Both of these will matter again in a moment — neither of them digests food on its own; they release their secretions further down the canal.",
    },
    // ── 5 · Interactive image — Figure 7.2 ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "Cutaway diagram of a frog's internal organs showing the complete digestive system: oesophagus, liver, gall bladder, stomach, intestine, rectum, and cloaca",
      caption: '📸 Tap each organ, in order, to follow food along the alimentary canal',
      generation_prompt: "Scientific textbook illustration of a frog's internal organs, based on NCERT Figure 7.2. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Side-view cutaway of a frog's body, head at the left, showing only the digestive organs in their real relative positions: a short oesophagus running from the head region into a curved, pale pink stomach in the upper-mid body; a large reddish-brown liver lobe sitting above and partly over the stomach; a small rounded green-tinted gall bladder tucked beneath the liver; a coiled pale-pink intestine occupying the lower-mid body cavity; a short rectum continuing from the intestine toward the rear; and the cloaca as a single small opening at the very posterior tip of the body. Clean white outlines on every organ, biologically accurate proportions, no text or labels baked into the image — this diagram is for tap-to-reveal hotspots. Functional colours: pink/magenta for soft digestive tissue (stomach, intestine, rectum), reddish-brown for the liver, pale green for the gall bladder. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.08, y: 0.32, label: 'Buccal cavity & bilobed tongue', icon: 'circle',
          detail: "Food enters here. The frog's **bilobed tongue** captures the food, and the mouth opens straight into the buccal cavity, which leads on to the pharynx and oesophagus.",
        },
        {
          id: uuid(), x: 0.24, y: 0.20, label: 'Oesophagus', icon: 'circle',
          detail: "A **short tube** connecting the pharynx to the stomach. It is deliberately short — part of the same short-canal design that runs through this whole digestive system.",
        },
        {
          id: uuid(), x: 0.38, y: 0.55, label: 'Stomach', icon: 'circle',
          detail: "Digests food using **HCl and gastric juices** secreted from its own walls. What leaves the stomach is **chyme** — partially digested food — headed for the duodenum.",
        },
        {
          id: uuid(), x: 0.46, y: 0.28, label: 'Liver', icon: 'circle',
          detail: 'Secretes **bile**, which does not act here — it is stored in the gall bladder until the duodenum needs it.',
        },
        {
          id: uuid(), x: 0.49, y: 0.42, label: 'Gall bladder', icon: 'circle',
          detail: "Stores the bile made by the liver, then releases it into the duodenum through a **common bile duct**, shared with the pancreas.",
        },
        {
          id: uuid(), x: 0.66, y: 0.60, label: 'Intestine (starting with the duodenum)', icon: 'circle',
          detail: "The **duodenum**, its first part, receives both bile and pancreatic juice through the common bile duct. **Bile emulsifies fat; pancreatic juice digests carbohydrates and proteins.** Final digestion finishes here, and **villi and microvilli** on the inner wall absorb the digested food.",
        },
        {
          id: uuid(), x: 0.88, y: 0.76, label: 'Rectum & cloaca', icon: 'circle',
          detail: "Undigested solid waste moves into the **rectum**, then passes out of the body through the **cloaca** — the single opening at the end of the whole canal.",
        },
      ],
    },
    // ── 6 · Text — digestion mechanism detail ────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Inside the stomach, **HCl and gastric juices** from the stomach walls break the food down into **chyme** — the partially digested, semi-liquid stage. Chyme moves from the stomach into the **duodenum**, the first part of the small intestine.\n\nThe duodenum is where both glands finally do their job at once: it receives **bile from the gall bladder** and **pancreatic juice from the pancreas**, arriving through a shared **common bile duct**. **Bile emulsifies fat.** **Pancreatic juice digests carbohydrates and proteins.** Each secretion has one clear job, and neither substitutes for the other.\n\n**Final digestion happens in the intestine**, and the digested food is absorbed there by numerous finger-like folds in the intestine's inner wall, called **villi and microvilli** — the microvilli are even smaller folds that increase the absorbing surface further. Whatever solid waste is left undigested moves into the **rectum** and passes out of the body through the **cloaca**.",
    },
    // ── 7 · Reasoning prompt — food path sequence ────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "Trace one bite of food through a frog's alimentary canal, in the exact order it actually travels. Which sequence is correct?",
      options: [
        "Mouth → buccal cavity → pharynx → oesophagus → stomach → intestine → rectum → cloaca",
        "Mouth → buccal cavity → oesophagus → pharynx → stomach → intestine → rectum → cloaca",
        "Mouth → buccal cavity → pharynx → oesophagus → stomach → intestine → cloaca → rectum",
        "Mouth → buccal cavity → pharynx → oesophagus → gall bladder → intestine → rectum → cloaca",
      ],
      correct_index: 0,
      reveal: "The real order is mouth, buccal cavity, pharynx, oesophagus, stomach, intestine, rectum, and finally the cloaca. Swapping the pharynx and oesophagus reverses two organs that come in a fixed order — the oesophagus leads to the stomach through the pharynx, not the other way round. Putting the cloaca before the rectum reverses the last two stops on the canal; the cloaca is always the final opening. And the gall bladder was never part of the main canal at all — it's a gland that releases bile into the duodenum, it doesn't sit on the food's direct path.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Respiratory system ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Respiratory System — Breathing Two Different Ways',
      objective: "By the end of this you can explain cutaneous versus pulmonary respiration, and say exactly when a frog switches from one to the other.",
    },
    // ── 9 · Text — respiratory mechanisms ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Frogs respire on land and in water by **two different methods**. In water, the **skin** acts as an aquatic respiratory organ — this is **cutaneous respiration**, where dissolved oxygen in the water is exchanged through the skin by **diffusion**.\n\nOn land, the **buccal cavity, skin, and lungs** all act as respiratory organs, and respiration by the lungs specifically is called **pulmonary respiration**. The **lungs** are a pair of **elongated, pink, sac-like structures** sitting in the **upper part of the trunk region (thorax)**. Air follows a fixed path: it enters through the **nostrils**, into the **buccal cavity**, and then into the **lungs**.\n\nOne detail worth holding onto: **during aestivation and hibernation, gaseous exchange takes place through the skin.** Even when the frog is dormant and not actively using its lungs, cutaneous respiration keeps it alive.",
    },
    // ── 10 · Comparison card — cutaneous vs pulmonary ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Cutaneous Respiration vs Pulmonary Respiration',
      columns: [
        {
          heading: 'Cutaneous respiration (skin)',
          points: [
            'Skin acts as the aquatic respiratory organ',
            'Dissolved oxygen in the water is exchanged through the skin by diffusion',
            'The method used while the frog is in water',
            'Continues even during aestivation and hibernation — the frog\'s only respiration then',
          ],
        },
        {
          heading: 'Pulmonary respiration (lungs)',
          points: [
            'Lungs act as the respiratory organ, alongside the buccal cavity and skin',
            'Air path: nostrils → buccal cavity → lungs',
            'Lungs are a pair of elongated, pink, sac-like structures in the upper trunk (thorax)',
            'The method used on land',
          ],
        },
      ],
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'The Facts You Cannot Get Wrong',
      markdown: "- The alimentary canal is **short** because frogs are **carnivores** — the intestine's length is reduced.\n- Full path: **mouth → buccal cavity → pharynx → oesophagus → stomach → intestine → rectum → cloaca.**\n- **Liver → bile → stored in gall bladder.** **Pancreas → pancreatic juice.**\n- **Chyme** = partially digested food, passed from stomach to **duodenum**.\n- In the duodenum: **bile emulsifies fat; pancreatic juice digests carbohydrates and proteins** — via a common bile duct.\n- Absorption happens through **villi and microvilli** in the intestine's inner wall.\n- **Cutaneous respiration** (skin, in water) vs **pulmonary respiration** (lungs, on land) — the buccal cavity and skin also help on land.\n- **During aestivation and hibernation, gas exchange happens only through the skin.**",
    },
    // ── 12 · Exam tip ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Dormant, but still breathing:** a frog that looks completely inactive during aestivation or hibernation hasn't stopped respiring — it has simply switched entirely to **cutaneous respiration** through the skin. This is one of NCERT's most frequently tested one-liners, and the trap is assuming a dormant frog isn't exchanging gases at all.\n\n**Bile ≠ pancreatic juice — one line to lock in:** **bile emulsifies fat; pancreatic juice digests carbohydrates and proteins.** Both arrive in the duodenum through the same common bile duct, but they never swap jobs.\n\n**Classic NEET question:** \"Through what mode does a frog respire during hibernation?\" → **Cutaneous respiration (through the skin).**",
    },
    // ── 13 · Bridge to next page ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Food digested, oxygen exchanged — both systems now need a way to move their work around the body. That's next: the frog's three-chambered heart and its closed blood vascular system.",
    },
    // ── 14 · Inline quiz ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why is a frog's alimentary canal short?",
          options: [
            "Because frogs eat only small amounts of food and rapid transit isn't needed",
            "Because frogs are carnivores, and the length of the intestine is reduced",
            "Because frogs are herbivores that digest all their food in the stomach alone",
            "Because the frog has no rectum, so a short canal is enough",
          ],
          correct_index: 1,
          explanation: "NCERT states the alimentary canal is short because frogs are carnivorous, which reduces the length of the intestine. Frogs are carnivores, not herbivores, and they do have a rectum — it's the segment right before the cloaca.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What exactly is chyme, and where does it go next?",
          options: [
            'Bile stored in the gall bladder before it is released into the duodenum',
            'Undigested solid waste on its way into the rectum',
            'Partially digested food, passed from the stomach into the duodenum',
            'Pancreatic juice released directly into the stomach',
          ],
          correct_index: 2,
          explanation: "Chyme is the partially digested food that leaves the stomach and enters the duodenum. Bile is a separate secretion stored in the gall bladder, undigested waste is what's left after the intestine, and pancreatic juice is released into the duodenum, not the stomach.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the duodenum, what job does bile do, and what job does pancreatic juice do?",
          options: [
            'Both bile and pancreatic juice only emulsify fat',
            'Bile absorbs digested food through villi; pancreatic juice produces HCl',
            'Bile digests carbohydrates and proteins; pancreatic juice emulsifies fat',
            'Bile emulsifies fat; pancreatic juice digests carbohydrates and proteins',
          ],
          correct_index: 3,
          explanation: "NCERT assigns each secretion one clear job: bile emulsifies fat, and pancreatic juice digests carbohydrates and proteins. Swapping the two jobs is the classic trap; villi absorption and HCl production are separate processes entirely, handled by the intestine wall and stomach wall respectively.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A frog is fully submerged in pond mud through winter, in a dormant hibernating state. How is it exchanging gases at this point?",
          options: [
            "Entirely through pulmonary respiration via its lungs",
            "Through its nostrils and buccal cavity only",
            "Through cutaneous respiration — dissolved oxygen exchanged through its skin by diffusion",
            "It stops gaseous exchange completely until it becomes active again",
          ],
          correct_index: 2,
          explanation: "NCERT states that during aestivation and hibernation, gaseous exchange happens through the skin — cutaneous respiration. Pulmonary respiration and the nostril-to-lung air path apply only when the frog is active and breathing on land; gas exchange never actually stops.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
