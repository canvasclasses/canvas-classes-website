'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'double-circulation',
  title: 'Double Circulation & Blood Vessels',
  subtitle: "Your blood doesn't wander — it runs a fixed two-loop route. One loop drops off at the lungs to grab oxygen, the other delivers that oxygen to the whole body. Learn which chamber launches each loop and you've locked in the highest-yield NEET facts of this chapter.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'double-circulation'],
  glossary: [
    { term: 'tunica intima', definition: 'The innermost layer of an artery or vein — a lining of squamous endothelium that the blood actually flows against.' },
    { term: 'tunica media', definition: 'The middle layer of an artery or vein, made of smooth muscle and elastic fibres. It is comparatively thin in veins.' },
    { term: 'tunica externa', definition: 'The outermost layer of an artery or vein — fibrous connective tissue with collagen fibres.' },
    { term: 'pulmonary circulation', definition: 'The loop in which the right ventricle pumps deoxygenated blood through the pulmonary artery to the lungs, and oxygenated blood returns through the pulmonary veins to the left atrium.' },
    { term: 'systemic circulation', definition: 'The loop in which the left ventricle pumps oxygenated blood through the aorta to the body tissues, and deoxygenated blood returns through the vena cava to the right atrium.' },
    { term: 'vena cava', definition: 'The large veins that collect deoxygenated blood from the body (via venules and veins) and empty it into the right atrium.' },
    { term: 'hepatic portal system', definition: 'A special vascular connection between the digestive tract and the liver. Its hepatic portal vein carries blood from the intestine to the liver before that blood is delivered to the systemic circulation.' },
    { term: 'coronary system', definition: 'A special system of blood vessels present exclusively for the circulation of blood to and from the cardiac musculature (the heart muscle itself).' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A stylised human torso in silhouette against darkness, with two glowing looping pathways of blood — one small loop near the chest, one large loop reaching down through the body',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human torso shown in dark silhouette against a deep near-black background (#0a0a0a base tones). Two softly glowing looping pathways of flowing blood are suggested inside the torso: one smaller loop curving up toward the chest and shoulders, and one much larger loop sweeping down through the whole body, hinting at two separate circuits without becoming a literal labelled diagram. The upper loop glows a cooler blue where it leaves the chest and warms to red as it returns; the lower loop glows warm red leaving the chest and cools to blue returning. Painterly, atmospheric illustration style, deep shadows filling the frame, subtle warm and cool highlights, no text, no labels, no diagram markings, no faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Blood Never Takes a Shortcut',
      markdown: "Here's something strange about the blood inside you: it is not free to go wherever it likes. It runs along **one fixed route**, the same path every single beat, through a network of tubes called **blood vessels**. And that route isn't one big loop — it's **two** loops joined at the heart. One loop exists only to visit the lungs and pick up oxygen. The other exists to carry that oxygen out to every tissue you have. Miss which chamber starts which loop, and you've missed the most-tested idea in this whole chapter.",
    },
    // ── 2 · Core concept — blood vessels & the three tunica layers ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Blood flows **strictly by a fixed route** through **blood vessels** — the **arteries** and **veins**. If you cut across any artery or vein and look at its wall, you find the same **three layers** every time, stacked from the inside out:\n\n- **Tunica intima** — the **inner lining**, made of **squamous endothelium**. This is the surface the blood actually touches as it flows.\n- **Tunica media** — the **middle layer**, made of **smooth muscle and elastic fibres**.\n- **Tunica externa** — the **outer layer**, made of **fibrous connective tissue with collagen fibres**.\n\nArteries and veins are built from the same three layers, but not in the same proportions. The one difference NEET keeps asking about: the **tunica media is comparatively thin in veins**. An artery has to withstand blood being pumped out under pressure, so its muscular middle layer is thicker; a vein carries blood back at low pressure, so its middle layer is slimmer.",
    },
    // ── 3 · Heading — the two circuits ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Pulmonary vs Systemic Circulation',
      objective: "By the end of this you can trace both loops from the chamber that starts them, name the vessel each uses, and say whether the blood in it is oxygenated or deoxygenated.",
    },
    // ── 4 · Text — the two loops ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The heart runs two separate loops at the same time. Each one starts from a **ventricle** — the heart's pumping chambers — and ends back in an **atrium**.\n\n**Pulmonary circulation** is the short trip to the lungs. The **right ventricle** pumps **deoxygenated** blood into the **pulmonary artery**. That blood is passed on to the **lungs**, where it drops off carbon dioxide and picks up oxygen. Now **oxygenated**, it is carried back by the **pulmonary veins** into the **left atrium**. Right ventricle → lungs → left atrium: that's the whole loop.\n\n**Systemic circulation** is the long trip to the rest of you. The **left ventricle** pumps **oxygenated** blood into the **aorta**. From the aorta the blood spreads out through a network of **arteries, arterioles and capillaries** to reach the **tissues**. There it hands over its oxygen; now **deoxygenated**, it is collected by a system of **venules, veins and the vena cava** and emptied into the **right atrium**. This is the loop that actually keeps your body alive — it **delivers nutrients, O₂ and other essential substances to the tissues**, and carries **CO₂ and other harmful substances away** for elimination.",
    },
    // ── 5 · Interactive image — Figure 15.4 schematic ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Schematic plan of double circulation in the human body: the right ventricle sends blood to the lungs and back to the left atrium (pulmonary loop), while the left ventricle sends blood to the body tissues and back to the right atrium (systemic loop), with the hepatic portal vein linking the intestine to the liver',
      caption: '📸 Tap each dot to explore the fixed route your blood takes — follow the pulmonary loop to the lungs and the systemic loop to the body.',
      generation_prompt: "Scientific textbook illustration of the schematic plan of human double circulation (Figure 15.4 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. In the centre, a simple heart showing four chambers (left atrium and left ventricle on one side, right atrium and right ventricle on the other). Above the heart, a pair of lungs. Below and around, the body tissues suggested as a block, plus the intestine and liver. Draw two loops: a PULMONARY loop from the right ventricle up to the lungs and back to the left atrium — blue tubing (deoxygenated) going from right ventricle to lungs, red tubing (oxygenated) returning from lungs to left atrium. A SYSTEMIC loop from the left ventricle out to the body tissues and back to the right atrium — red tubing (oxygenated) from left ventricle through the aorta to the tissues, blue tubing (deoxygenated) returning through the vena cava to the right atrium. Show the hepatic portal vein as a vessel running from the intestine to the liver. Use functional colours: red = oxygenated blood, blue = deoxygenated blood. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.60, y: 0.55, label: 'Right ventricle', detail: "The starting chamber of the **pulmonary loop**. It pumps **deoxygenated** blood out into the pulmonary artery.", icon: 'circle' },
        { id: uuid(), x: 0.45, y: 0.30, label: 'Pulmonary artery → Lungs', detail: "Carries **deoxygenated** blood from the right ventricle to the **lungs**, where CO₂ is dropped off and oxygen is picked up.", icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.50, label: 'Pulmonary veins → Left atrium', detail: "Now **oxygenated**, blood returns from the lungs through the pulmonary veins into the **left atrium**. This completes the pulmonary circulation.", icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.62, label: 'Left ventricle → Aorta', detail: "The starting chamber of the **systemic loop**. It pumps **oxygenated** blood into the **aorta**, the body's main artery.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.80, label: 'Body tissues', detail: "Arteries, arterioles and capillaries deliver **oxygenated** blood to the tissues. Nutrients and O₂ are handed over; CO₂ and wastes are collected. Blood leaves here **deoxygenated**.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.72, label: 'Vena cava → Right atrium', detail: "Venules, veins and the **vena cava** collect the **deoxygenated** blood from the tissues and empty it into the **right atrium**, completing systemic circulation.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.85, label: 'Hepatic portal vein', detail: "A special connection: it carries blood from the **intestine to the liver** first, before that blood is delivered on to the systemic circulation.", icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — pulmonary vs systemic ───────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Pulmonary vs Systemic Circulation',
      columns: [
        {
          heading: 'Pulmonary circulation',
          points: [
            'Starts from the right ventricle',
            'Blood leaves deoxygenated, through the pulmonary artery',
            'Destination: the lungs (pick up O₂, drop off CO₂)',
            'Blood returns oxygenated, through the pulmonary veins',
            'Ends back in the left atrium',
            'The short loop — heart to lungs and back',
          ],
        },
        {
          heading: 'Systemic circulation',
          points: [
            'Starts from the left ventricle',
            'Blood leaves oxygenated, through the aorta',
            'Destination: the body tissues (deliver O₂ and nutrients)',
            'Blood returns deoxygenated, through the vena cava',
            'Ends back in the right atrium',
            'The long loop — heart to the whole body and back',
          ],
        },
      ],
    },
    // ── 7 · Comparison card — artery vs vein ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 7,
      title: 'Artery vs Vein',
      columns: [
        {
          heading: 'Artery',
          points: [
            'Same three layers: tunica intima, media, externa',
            'Tunica media (smooth muscle + elastic fibres) is comparatively thick',
            'Built to handle blood pumped out under higher pressure',
          ],
        },
        {
          heading: 'Vein',
          points: [
            'Same three layers: tunica intima, media, externa',
            'Tunica media is comparatively thin',
            'Carries blood back at lower pressure',
          ],
        },
      ],
    },
    // ── 8 · Heading — special connections ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Two Special Detours: The Hepatic Portal & Coronary Systems',
      objective: "By the end of this you can say what the hepatic portal vein connects and why the coronary system exists — two facts NEET pulls straight from the NCERT line.",
    },
    // ── 9 · Text — hepatic portal & coronary ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The two big loops aren't the whole story — the body has two special vascular connections worth knowing by name.\n\nThe **hepatic portal system** is a unique connection between the **digestive tract and the liver**. Its main vessel, the **hepatic portal vein**, carries blood from the **intestine to the liver first**, before that blood is delivered on into the systemic circulation. In other words, blood coming from the intestine doesn't go straight back to the general circulation — it makes a compulsory stop at the liver on the way.\n\nThe **coronary system** is a special system of blood vessels present in the body **exclusively for the circulation of blood to and from the cardiac musculature** — the heart muscle itself. The heart is a hard-working muscle that needs its own dedicated blood supply, and that's exactly what the coronary vessels provide.",
    },
    // ── 10 · Reasoning prompt — vessel/route check ────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A student is tracing a drop of blood that has just been pumped out of the right ventricle. Which single statement about this drop is correct?",
      options: [
        "It is oxygenated blood, and it has just entered the aorta on its way to the body tissues.",
        "It is deoxygenated blood, and it is travelling through the pulmonary artery towards the lungs.",
        "It is oxygenated blood, and it is returning through the pulmonary veins towards the left atrium.",
        "It is deoxygenated blood, and it is being collected by the vena cava on its way to the right atrium.",
      ],
      reveal: "The correct statement is the second one. The right ventricle pumps deoxygenated blood into the pulmonary artery, which carries it to the lungs — that's the start of the pulmonary circulation. The first option describes the left ventricle's job (oxygenated blood into the aorta), which is the tempting trap because both ventricles pump — but only the left one sends oxygenated blood to the body. The third option describes blood returning from the lungs, which enters the left atrium, not something the right ventricle pumps out. The fourth describes deoxygenated blood being collected at the end of systemic circulation, not blood freshly pumped by the right ventricle.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Three layers of every artery and vein** (inside → out): **tunica intima** (squamous endothelium lining) → **tunica media** (smooth muscle + elastic fibres) → **tunica externa** (fibrous connective tissue with collagen). The **tunica media is thin in veins**.\n- **Pulmonary circulation:** **right ventricle → pulmonary artery (deoxygenated) → lungs → pulmonary veins (oxygenated) → left atrium.**\n- **Systemic circulation:** **left ventricle → aorta (oxygenated) → body tissues → vena cava (deoxygenated) → right atrium.**\n- **Hepatic portal vein** = carries blood from the **intestine → liver** (before it joins systemic circulation).\n- **Coronary system** = vessels exclusively for blood **to and from the heart muscle** (cardiac musculature).",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Pulmonary artery = the exception NEET loves:** it is an *artery* but it carries **deoxygenated** blood. Pulmonary veins are the mirror exception — *veins* carrying **oxygenated** blood. Don't let the words 'artery' and 'vein' fool you into assuming oxygen status.\n\n**Keep the chamber-to-loop pairing straight:** **right ventricle → lungs (pulmonary)**, **left ventricle → body (systemic)**. Swapping these two is the single most common way this gets tested wrong.\n\n**Classic NEET question:** \"The hepatic portal vein connects ___.\" → the **intestine to the liver**. (And \"The pulmonary artery carries ___ blood\" → **deoxygenated**.)",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You can now trace both loops of blood, name the layers of every vessel, and place the two special detours. Next, you'll see how the body **controls** all of this — how the heart's own activity is regulated, and what happens when circulation goes wrong in the common disorders NEET asks about.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In pulmonary circulation, which chamber pumps the blood out, and in what state is that blood?",
          options: [
            "The left ventricle pumps out oxygenated blood into the pulmonary artery",
            "The right ventricle pumps out deoxygenated blood into the pulmonary artery",
            "The right atrium pumps out deoxygenated blood into the pulmonary veins",
            "The left atrium pumps out oxygenated blood into the aorta",
          ],
          correct_index: 1,
          explanation: "Pulmonary circulation starts at the right ventricle, which pumps deoxygenated blood into the pulmonary artery towards the lungs. Option 1 swaps in the left ventricle, which actually starts systemic circulation with oxygenated blood into the aorta. The atria (options 3 and 4) receive blood; they are not the chambers that pump blood out into these arteries.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which vessel returns oxygenated blood from the lungs, and to which chamber does it deliver it?",
          options: [
            "The pulmonary veins return oxygenated blood to the left atrium",
            "The pulmonary artery returns oxygenated blood to the left atrium",
            "The vena cava returns oxygenated blood to the right atrium",
            "The aorta returns oxygenated blood to the left ventricle",
          ],
          correct_index: 0,
          explanation: "Oxygenated blood leaving the lungs is carried by the pulmonary veins into the left atrium — that completes the pulmonary loop. Option 2 names the wrong vessel (the pulmonary artery carries deoxygenated blood away from the heart, not oxygenated blood back). The vena cava carries deoxygenated blood to the right atrium, and the aorta carries blood away from the left ventricle, so options 3 and 4 both invert the direction.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Reading a blood vessel wall from the inside out, what is the correct order of its three layers?",
          options: [
            "Tunica media (smooth muscle) → tunica intima (endothelium) → tunica externa (collagen)",
            "Tunica externa (collagen) → tunica media (smooth muscle) → tunica intima (endothelium)",
            "Tunica intima (endothelium) → tunica media (smooth muscle) → tunica externa (collagen)",
            "Tunica intima (collagen) → tunica externa (endothelium) → tunica media (smooth muscle)",
          ],
          correct_index: 2,
          explanation: "From the inside out, the order is tunica intima (the inner squamous endothelium lining the blood touches) → tunica media (the middle smooth muscle and elastic fibre layer) → tunica externa (the outer fibrous collagen layer). Options 1 and 2 reverse or scramble that order, and option 4 also mismatches each layer with the wrong tissue (collagen belongs to the externa, endothelium to the intima).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pair correctly states what the hepatic portal system and the coronary system each do?",
          options: [
            "The hepatic portal vein carries blood from the intestine to the liver; the coronary system circulates blood to and from the heart muscle",
            "The hepatic portal vein carries blood from the liver to the heart; the coronary system supplies blood only to the lungs",
            "The hepatic portal vein carries blood from the intestine directly into the aorta; the coronary system supplies the intestine",
            "The hepatic portal vein carries blood from the heart to the intestine; the coronary system circulates blood to and from the liver",
          ],
          correct_index: 0,
          explanation: "NCERT states it plainly: the hepatic portal vein carries blood from the intestine to the liver (before that blood joins the systemic circulation), and the coronary system exists exclusively for circulation of blood to and from the cardiac musculature — the heart muscle. Every other option scrambles at least one of these two facts, usually by reversing the intestine-to-liver direction or by attaching the coronary system to the wrong organ.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
