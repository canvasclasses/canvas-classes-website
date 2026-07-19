'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'frog-natural-history-and-morphology',
  title: 'Frog Natural History and Morphology',
  subtitle: "Before you can study one organ inside a frog, you need to know the frog itself — where it lives, why its blood runs cold, and every feature you can see just by looking at it from the outside.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['structural-organisation-in-animals', 'frog', 'morphology'],
  glossary: [
    { term: 'tissue', definition: 'A group of similar cells, along with intercellular substances, organised to perform a specific function.' },
    { term: 'organ', definition: 'A structure, such as the stomach, lung, heart or kidney, formed when tissues organise together in a specific proportion and pattern.' },
    { term: 'organ system', definition: 'Two or more organs working together through physical and/or chemical interaction to perform a common function, e.g. the digestive system or respiratory system.' },
    { term: 'morphology', definition: 'The study of form or externally visible features. In animals, this means the external appearance of organs or body parts.' },
    { term: 'anatomy', definition: 'The study of the morphology of internal organs in animals.' },
    { term: 'poikilotherm', definition: 'An animal without a constant body temperature — its body temperature varies with the temperature of the environment. Also called cold-blooded.' },
    { term: 'camouflage', definition: "A frog's ability to change its colour to hide itself from enemies." },
    { term: 'mimicry', definition: "The protective colouration that lets a frog blend in with its surroundings — NCERT's name for this colour-changing camouflage ability." },
    { term: 'aestivation', definition: 'Summer sleep — frogs take shelter in deep burrows during peak summer to protect themselves from extreme heat.' },
    { term: 'hibernation', definition: 'Winter sleep — frogs take shelter in deep burrows during peak winter to protect themselves from extreme cold.' },
    { term: 'nictitating membrane', definition: "A membrane covering a frog's bulged eyes that protects them while the frog is in water." },
    { term: 'tympanum', definition: "The membranous ear present on either side of a frog's eyes, which receives sound signals." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A frog perched at the edge of still water at dusk, half in dappled grass and half on wet mud, its skin colour blending seamlessly into both surfaces',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single olive-green frog with dark irregular spots sits at the exact edge where dappled green grass meets wet brown mud near a still pond at dusk, its body positioned so the viewer can see how its mottled skin colour blends into both the grass on one side and the mud on the other. Faint water droplets on its smooth, moist-looking skin catch the low warm light. Out-of-focus reeds and still water reflecting a dusk sky in the background. Deep dusk lighting, one soft warm horizon glow, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Frog Never Takes a Sip',
      markdown: "A frog never drinks water — not once, in its entire life. Instead it **absorbs water straight through its skin**. That's exactly why the skin has to stay smooth, slippery and always moist: it isn't just covering the frog, it's doing part of the job your mouth and throat would otherwise have to do.",
    },
    // ── 2 · Core concept — cells to organ systems, why this chapter studies the frog ──
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In earlier chapters you met a huge range of organisms, both unicellular and multicellular. In a **unicellular organism**, a single cell has to do everything — digestion, respiration, reproduction, all of it. In the complex body of a **multicellular animal**, those same basic jobs are carried out by different groups of cells, organised in a well-planned way.\n\nAs you've already learnt, a **group of similar cells, along with intercellular substances, performing a specific function** is called a **tissue**. Here's the surprising part: however complicated an animal looks from the outside, all complex animals are built from only **four basic types of tissue**. These four tissues organise in a specific proportion and pattern to form an **organ** — the stomach, the lung, the heart, the kidney. And when two or more organs work together through physical and/or chemical interaction to perform a common function, they form an **organ system** — the digestive system, the respiratory system, and so on.\n\nCells, tissues, organs and organ systems split up the work between them. That splitting is called **division of labour**, and it's what lets a body made of billions of cells function as one coordinated whole.",
    },
    // ── 3 · Heading — Organ and Organ System ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Organ and Organ System',
      objective: 'By the end of this you can explain how tissues build an organ using the frog heart as the example, and state the difference between morphology and anatomy.',
    },
    // ── 4 · Text — heart example, morphology vs anatomy, why frog ───────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Every organ in the body is made of **one or more types of tissue** — and it's rarely just one. Take the **heart**: it consists of **all four types of tissue at once** — epithelial, connective, muscular and neural — each contributing something the heart cannot function without.\n\nThis chapter introduces you to two related but different studies: **morphology** and **anatomy**. **Morphology** means the study of form, or **externally visible features**. In plants or microbes, that's the whole meaning of the word. In animals, morphology specifically means the **external appearance of the organs or parts of the body** — what you can see just by looking at the animal from outside. **Anatomy**, by contrast, is the word used for the study of the **morphology of internal organs** — what's happening beneath the skin.\n\nYou're going to learn both, morphology and anatomy, using one animal as the worked example: the **frog**, representing vertebrates.",
    },
    // ── 5 · Heading — Frogs ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Frogs — Where They Live and How They Survive',
      objective: 'By the end of this you can define poikilotherm, tell camouflage and mimicry apart from aestivation and hibernation, and place the frog in its class and phylum.',
    },
    // ── 6 · Text — habitat, classification, poikilotherm, camouflage/mimicry, aestivation/hibernation ──
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Frogs can live both on land and in freshwater.** They belong to class **Amphibia**, phylum **Chordata**. The most common species of frog found in India is ***Rana tigrina***.\n\nFrogs **do not have a constant body temperature** — their body temperature varies with the temperature of their surroundings. Animals built this way are called **cold blooded**, or **poikilotherms**.\n\nYou may have noticed a frog changing colour while it moves between grass and dry land — it has the ability to **change colour to hide itself from its enemies**. This is called **camouflage**, and NCERT gives this protective colouration a specific name: **mimicry**.\n\nOne more thing you may have noticed: frogs simply aren't around during **peak summer and peak winter**. During those periods, they take shelter in **deep burrows** to protect themselves from extreme heat and extreme cold. The summer version of this shelter-taking is called **summer sleep**, or **aestivation**. The winter version is called **winter sleep**, or **hibernation**.",
    },
    // ── 7 · Reasoning prompt (mid-page, after poikilotherm/camouflage/aestivation-hibernation) ──
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A frog disappears into a deep burrow during the peak of winter to escape the extreme cold. What is this behaviour called, and how is it different from what a frog does to escape the peak of summer heat?",
      options: [
        "This is aestivation, the winter version of shelter-taking — summer heat is escaped through hibernation instead",
        "This is hibernation, the winter sleep — the same shelter-taking behaviour during peak summer heat is called aestivation, the summer sleep",
        "This is camouflage, because the frog is hiding from a threat by using its burrow the same way it uses colour change to hide from enemies",
        "This is mimicry, since the frog is copying the behaviour of other burrow-dwelling animals to survive the cold",
      ],
      reveal: "Taking shelter in a deep burrow during peak winter is hibernation — winter sleep. The exact same shelter-taking behaviour, but during peak summer heat instead, is aestivation — summer sleep. It's easy to swap these two names because they sound so similar; the season is the only thing that tells them apart. Camouflage and mimicry are a completely different survival tool — they're about changing skin colour to hide from enemies, not about taking shelter from temperature extremes. And mimicry has nothing to do with copying another animal's behaviour here — NCERT uses it specifically as the name for the frog's own protective colour change.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Morphology ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Morphology — The Frog\'s External Features',
      objective: "By the end of this you can label every external feature in Figure 7.1 and state the fore-limb vs hind-limb and male-vs-female differences.",
    },
    // ── 9 · Text — skin, body divisions, eyes, tympanum, limbs ───────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Have you ever touched a frog's skin? It's **smooth and slippery**, because of the mucus on it, and it's **always kept moist**. The **dorsal side** (the back) is generally **olive green with dark irregular spots**; the **ventral side** (the belly) is **uniformly pale yellow**. As you already read, the frog never drinks water — it **absorbs water through its skin** instead.\n\nThe frog's body is divisible into just two parts: **head and trunk**. A **neck and a tail are absent** — there's nothing between the head and the trunk, and nothing trailing behind the trunk. Above the mouth sits a **pair of nostrils**. The eyes are **bulged**, and each is covered by a **nictitating membrane** — a membrane that protects the eye while the frog is in water. On either side of the eyes sits a **membranous tympanum**, the frog's ear, which receives sound signals.\n\nThe frog has two pairs of limbs, and they are not built the same. The **hind limbs end in five digits** and are **larger and more muscular** than the **fore limbs**, which **end in four digits**. Both pairs help the frog **swim, walk, leap and burrow** — and the feet carry **webbed digits**, which is what makes swimming possible.",
    },
    // ── 10 · Interactive image — Figure 7.1 external features ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'A labelled external view of a frog showing its head, trunk, eye, fore limb and hind limb',
      caption: '📸 Tap each part of the frog to see what it does',
      generation_prompt: "Scientific textbook illustration of the external features of a frog (side view, matching NCERT Figure 7.1). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A frog shown from the side in a resting pose, clean white outlines, biologically accurate proportions. Dorsal skin surface shaded with a subtle olive-green tone and irregular darker spots; ventral surface shown pale. Clearly visible bulged eye near the head with a faint outline suggesting the nictitating membrane over it, a small circular tympanum marked just behind and below the eye, a pair of nostrils above the mouth, distinct fore limb ending in four digits tucked near the front of the trunk, and a larger, more muscular hind limb ending in five webbed digits extended toward the back. No neck or tail visible — head blends directly into trunk. Thin white leader lines pointing from head, trunk, eye, tympanum, fore limb, and hind limb to label positions outside the frog's outline (labels added separately by the app, do not render text in the image). No photorealism, no cartoon style, no mascots, matches standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.30, label: 'Head', detail: 'One of only two body divisions in a frog — the other is the trunk. A **neck is absent**, so the head sits directly against the trunk.', icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.45, label: 'Trunk', detail: 'The second and only other body division. A **tail is absent** in the adult frog, so the trunk simply ends — nothing trails behind it.', icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.20, label: 'Eye', detail: 'The eyes are **bulged** and covered by a **nictitating membrane**, which protects them while the frog is in water.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.24, label: 'Tympanum', detail: 'A **membranous ear** present on either side of the eyes. It receives sound signals.', icon: 'circle' },
        { id: uuid(), x: 0.35, y: 0.55, label: 'Fore limb', detail: 'Ends in **four digits**. Smaller and less muscular than the hind limb. Helps in swimming, walking, leaping and burrowing. In males, the first digit carries a **copulatory pad**.', icon: 'circle' },
        { id: uuid(), x: 0.75, y: 0.62, label: 'Hind limb', detail: 'Ends in **five digits** with **webbed** skin between them, which is what lets the frog swim. **Larger and more muscular** than the fore limb.', icon: 'circle' },
      ],
    },
    // ── 11 · Comparison card — male vs female frog ────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'Male Frog vs Female Frog',
      columns: [
        {
          heading: 'Male Frog',
          points: [
            'Has sound-producing vocal sacs',
            'Has a copulatory pad on the first digit of the fore limb',
            'These two features are how you tell a male frog apart externally',
          ],
        },
        {
          heading: 'Female Frog',
          points: [
            'Vocal sacs are absent',
            'Copulatory pad on the first digit of the fore limb is absent',
            'Frogs showing this external difference between the sexes are said to exhibit sexual dimorphism',
          ],
        },
      ],
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Tissue → Organ → Organ System:** a tissue is a group of similar cells + intercellular substances doing one job; an organ is tissues organised in a specific pattern (e.g. heart = epithelial + connective + muscular + neural, all four); an organ system is two or more organs working together (e.g. digestive system).\n- **Morphology** = external appearance of organs/body parts. **Anatomy** = morphology of internal organs.\n- **Poikilotherm** = no constant body temperature, varies with environment.\n- **Camouflage** = ability to change colour to hide from enemies. NCERT names this protective colouration **mimicry**.\n- **Aestivation = summer sleep. Hibernation = winter sleep.** Both are shelter-taking in deep burrows during extreme heat/cold.\n- **Body divisions:** head + trunk only — neck and tail are **absent**.\n- **Hind limb:** 5 digits, larger, more muscular. **Fore limb:** 4 digits, smaller.\n- **Nictitating membrane** protects the eye in water. **Tympanum** is the ear, receives sound.\n- **Male frog only:** vocal sacs + copulatory pad on the first fore-limb digit. Both absent in females.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Aestivation vs hibernation — the classic swap:** these two get mixed up constantly because they're structurally identical (deep burrow, escaping temperature extremes) and differ only in season. **Aestivation = summer sleep. Hibernation = winter sleep.** If a question mentions extreme heat, it's aestivation; extreme cold, it's hibernation.\n\n**Nictitating membrane — frequently tested structural detail:** its function is specifically to **protect the bulged eyes while the frog is in water**. Don't confuse it with the tympanum, which is a completely different structure (the ear, receiving sound) sitting on either side of the eyes, not covering them.\n\n**Digit count is a direct recall fact:** hind limb = **five** digits (larger, muscular). Fore limb = **four** digits (smaller). NEET can ask this as a bare number-matching question.\n\n**Classic NEET question:** \"The structure that protects the frog's eye while in water is the ____.\" → **Nictitating membrane.**",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know the frog from the outside — its skin, its two body divisions, its eyes and ears, and how to tell a male from a female. The body cavity underneath all of this holds a full set of organ systems, working together the same way the heart's four tissues do. That internal picture — the frog's anatomy — is next.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "NCERT states that the frog's heart consists of all four basic tissue types. Which four?",
          options: [
            'Epithelial, connective, muscular and neural',
            'Epithelial, vascular, skeletal and neural',
            'Connective, muscular, glandular and epithelial',
            'Muscular, neural, vascular and connective',
          ],
          correct_index: 0,
          explanation: "NCERT names the heart's four tissues exactly as epithelial, connective, muscular and neural — the same four basic tissue types every complex animal is built from. The other options each swap in a tissue name (vascular, skeletal, glandular) that NCERT does not use in this list.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A frog is described as a poikilotherm. What does this mean?",
          options: [
            'It can change its skin colour to hide from enemies',
            'It has no constant body temperature — its body temperature varies with the surrounding environment',
            'It takes shelter in a burrow during peak summer to escape the heat',
            'It absorbs water directly through its skin instead of drinking it',
          ],
          correct_index: 1,
          explanation: "Poikilotherm specifically means cold-blooded — no constant body temperature, varying with the environment. Changing colour to hide is camouflage/mimicry, a separate feature. Taking shelter from summer heat is aestivation, also separate. Absorbing water through the skin is a feature of the frog's skin, unrelated to body temperature.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which of these correctly distinguishes a frog's hind limb from its fore limb?",
          options: [
            'The hind limb ends in four digits and is smaller than the fore limb, which ends in five digits',
            'Both limbs end in five digits, but only the hind limb has webbed digits for swimming',
            'The hind limb ends in five digits and is larger and more muscular than the fore limb, which ends in four digits',
            'The fore limb is larger and more muscular, ending in five digits, while the hind limb ends in four digits',
          ],
          correct_index: 2,
          explanation: "NCERT is specific: the hind limb ends in five digits and is larger and more muscular, while the fore limb ends in four digits. Swapping which limb has five digits, or claiming both have five digits, contradicts this exact detail — a common way this fact gets tested wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A student finds a frog with a copulatory pad on the first digit of its fore limb and vocal sacs. What can be concluded, and what season-related behaviour is unrelated to this observation?",
          options: [
            "It is a male frog, showing sexual dimorphism — this is unrelated to aestivation, which is about escaping summer heat in a burrow, not about sex-linked features",
            "It is a female frog, since vocal sacs and copulatory pads are how NCERT describes female-only features",
            "It cannot be determined, because vocal sacs and copulatory pads are present in both male and female frogs",
            "It is a male frog, and this directly explains why the frog goes into hibernation every winter",
          ],
          correct_index: 0,
          explanation: "Vocal sacs and a copulatory pad on the first fore-limb digit are male-only features, absent in females — this is sexual dimorphism. Calling these female features is a straight reversal of the NCERT fact. Saying both sexes show them ignores the whole point of sexual dimorphism. And linking sex to hibernation invents a connection NCERT never makes — hibernation is about surviving winter cold, not about which sex a frog is.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
