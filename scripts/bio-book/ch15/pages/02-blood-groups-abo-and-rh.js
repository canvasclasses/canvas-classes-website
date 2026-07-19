'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'blood-groups-abo-and-rh',
  title: 'Blood Groups — ABO & Rh',
  subtitle: "Two tiny markers on the surface of your red blood cells decide whose blood you can safely receive — get the match wrong and the cells clump and die. Learn the ABO table exactly as NEET quotes it, and why an Rh-ve mother's second baby is the one in danger.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'blood-groups'],
  glossary: [
    { term: 'antigen', definition: 'A surface chemical that can induce an immune response. In ABO grouping, two antigens — A and B — may sit on the surface of the red blood cells.' },
    { term: 'antibody', definition: 'A protein produced in response to an antigen. In ABO grouping, the plasma carries natural antibodies (anti-A and/or anti-B) that attack the matching foreign antigen.' },
    { term: 'ABO grouping', definition: 'A system of classifying blood into groups A, B, AB and O based on the presence or absence of the A and B antigens on the red blood cells.' },
    { term: 'universal donor', definition: "A person with group 'O' blood — it carries no A or B antigen, so it can be donated to persons of any other blood group." },
    { term: 'universal recipient', definition: "A person with group 'AB' blood — its plasma has no antibodies, so it can accept blood from AB as well as all the other groups." },
    { term: 'Rh antigen', definition: 'Another antigen on the surface of red blood cells, similar to one present in Rhesus monkeys (hence the name Rh). It is present in nearly 80 per cent of humans.' },
    { term: 'Rh positive / Rh negative', definition: 'A person whose red blood cells carry the Rh antigen is Rh positive (Rh+ve); a person in whom this antigen is absent is Rh negative (Rh-ve).' },
    { term: 'erythroblastosis foetalis', definition: 'A condition where an Rh-ve mother\'s anti-Rh antibodies leak into an Rh+ve foetus and destroy its red blood cells, causing severe anaemia and jaundice — it strikes subsequent pregnancies, not the first.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing bag of donated blood suspended over a dark clinical table, with faint impressions of red blood cells drifting in the shadow around it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single translucent bag of deep-red donated blood hangs on a thin stand, softly backlit in an otherwise dark clinical room at night. Faint, out-of-focus impressions of round red blood cells drift in the shadows around it, suggested rather than drawn as a literal labelled diagram. A tube runs down out of frame. Deep shadows fill the rest of the frame, with quiet warm-red highlights catching the surface of the blood bag. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Why You Can\'t Just Pour In Any Blood',
      markdown: "Everyone's blood looks the same — the same red, in the same veins. Yet during a blood transfusion **any blood cannot be used**. Push in the wrong kind and the red blood cells **clump together and get destroyed**, which can be dangerous or even fatal. The reason comes down to two microscopic markers sitting on the surface of your red blood cells — markers you can't see, but your body can.",
    },
    // ── 2 · Core concept — antigens and antibodies ───────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Human blood differs in certain aspects even though it appears similar, and it can be grouped in various ways. Two of these groupings — the **ABO** and the **Rh** — are used all over the world.\n\n**ABO grouping** is based on the presence or absence of two **surface antigens** on the red blood cells (RBCs), named **A** and **B**. An **antigen** is a chemical that can induce an immune response. Separately, the **plasma** of different people carries two natural **antibodies** — proteins the body produces in response to antigens. The whole ABO system is just a bookkeeping of *which antigen sits on your RBCs* and *which antibody floats in your plasma*.",
    },
    // ── 3 · Heading — ABO grouping ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'ABO Grouping — Four Groups, and Who Can Give to Whom',
      objective: "By the end of this you can fill in Table 15.1 from memory — the antigen, the antibody, and the safe donor group for each of A, B, AB and O.",
    },
    // ── 4 · Text — the four groups + table lead-in ──────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "There are four ABO groups: **A, B, AB and O**. The pattern is neat once you see it — a group carries an antibody against the antigen it *doesn't* have, so it never attacks itself:\n\n- **Group A** has **antigen A** on its RBCs and **anti-B** antibody in its plasma.\n- **Group B** has **antigen B** and **anti-A** antibody.\n- **Group AB** has **both antigens A and B**, and so carries **no antibodies (nil)** — nothing left to react against.\n- **Group O** has **no antigens (nil)**, but its plasma carries **both anti-A and anti-B** antibodies.\n\nDuring a transfusion the donor's blood has to be carefully matched with the recipient's, otherwise the cells **clump (destruction of RBCs)**. The distribution of antigens, antibodies and safe donor groups is laid out in Table 15.1 below.",
    },
    // ── 5 · Table 15.1 ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'Table 15.1 — Blood Groups and Donor Compatibility (NCERT)',
      headers: ['Blood Group', 'Antigens on RBCs', 'Antibodies in Plasma', "Donor's Group"],
      rows: [
        ['A', 'A', 'anti-B', 'A, O'],
        ['B', 'B', 'anti-A', 'B, O'],
        ['AB', 'A, B', 'nil', 'AB, A, B, O'],
        ['O', 'nil', 'anti-A, anti-B', 'O'],
      ],
    },
    // ── 6 · Text — universal donor / recipient ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Read the last column and two special cases jump out. **Group O** carries no antigens, so there is nothing on its RBCs for anyone's plasma to attack — group O blood can be donated to persons with **any** other blood group. That's why group O people are called **universal donors**. At the other end, **Group AB** carries no antibodies in its plasma, so it has nothing to attack incoming blood with — an AB person can accept blood from AB **as well as all the other groups**, which is why they are called **universal recipients**.",
    },
    // ── 7 · Reasoning prompt — universal donor/recipient + O's antibodies ─────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A patient with blood group AB urgently needs a transfusion, and only group O blood is available. Based on the ABO antigen–antibody rules, which single statement correctly explains what happens?",
      options: [
        "It is safe: group O carries no A or B antigen on its RBCs, so the recipient's plasma has nothing to attack — group O is the universal donor.",
        "It is unsafe: group O plasma carries both anti-A and anti-B, so its antibodies will destroy the recipient's own A and B antigens and cause fatal clumping.",
        "It is unsafe: group AB has no antibodies, so it cannot recognise the O blood and the O antigens will clump the AB cells.",
        "It is safe, but only because AB is the universal donor and can give to anyone, including itself.",
      ],
      reveal: "Option 1 is right. The reason O works as a donor is that its RBCs carry no A or B antigen — there is nothing on the donor cells for the recipient's antibodies to latch onto. Option 2 is the tempting trap: it fixates on O's plasma antibodies, but in a transfusion it's the donor's *cells* (their antigens) that must survive the recipient's plasma, and the small volume of donor plasma is not the deciding factor NCERT uses — O is classed as the universal donor precisely because of its 'nil' antigens. Option 3 has the AB rule backwards (AB is the universal *recipient*, and having no antibodies is exactly why it accepts everything), and option 4 wrongly calls AB the universal donor when AB is the universal recipient.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Rh grouping & erythroblastosis foetalis ────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Rh Grouping — and the Danger to the Second Baby',
      objective: "By the end of this you can explain why an Rh-ve mother's first Rh+ve baby is usually safe but the next one is at risk, and how that risk is prevented.",
    },
    // ── 9 · Text — Rh antigen, +ve/-ve, matching ────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "There is another antigen — the **Rh antigen** — on the surface of the RBCs. It is **similar to one present in Rhesus monkeys** (which is where the name *Rh* comes from). This antigen is found in the majority of humans — **nearly 80 per cent**. People who carry it are **Rh positive (Rh+ve)**; those in whom it is absent are **Rh negative (Rh-ve)**.\n\nHere's the catch. If an **Rh-ve person is exposed to Rh+ve blood**, they start forming specific **antibodies against the Rh antigen**. So just like ABO, the **Rh group must also be matched** before any transfusion.",
    },
    // ── 10 · Interactive image — erythroblastosis foetalis ──────────────────
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Diagram of an Rh-negative mother carrying an Rh-positive foetus, showing the placenta separating the two bloods in the first pregnancy and maternal anti-Rh antibodies attacking foetal red blood cells in a subsequent pregnancy',
      caption: '📸 Tap each dot to trace how erythroblastosis foetalis develops — from a safe first pregnancy to the danger in the next.',
      generation_prompt: "Scientific textbook illustration of erythroblastosis foetalis (Rh incompatibility in pregnancy). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a cross-section of a pregnant mother's womb split into two panels: LEFT panel labelled 'First pregnancy' showing an Rh-negative mother and an Rh-positive foetus with a clear placenta barrier keeping the two blood supplies (red blood cells) well separated; a small detail at the bottom showing exposure of maternal blood to a little foetal Rh+ blood during delivery. RIGHT panel labelled 'Subsequent pregnancy' showing maternal anti-Rh antibodies (small Y-shaped markers) crossing into the Rh-positive foetus and attacking/destroying the foetal red blood cells. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Functional colours: red for blood and red blood cells, pink/magenta for maternal and foetal soft tissue, pale blue for the placenta/amniotic region. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.30, label: 'Rh-ve mother', detail: 'The mother is **Rh negative** — her red blood cells carry no Rh antigen. Her body treats Rh+ve blood as foreign.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.62, label: 'Rh+ve foetus', detail: 'The foetus is **Rh positive** — its RBCs carry the Rh antigen, inherited from the father. This is the Rh incompatibility (mismatch) between mother and foetus.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.45, label: 'Placenta (first pregnancy)', detail: 'In the **first pregnancy** the two bloods are **well separated by the placenta**, so the foetal Rh antigens do not get exposed to the mother\'s blood. The first child is usually safe.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.85, label: 'Exposure at delivery', detail: 'During the **delivery of the first child**, small amounts of Rh+ve foetal blood can reach the mother. She then **starts preparing antibodies** against the Rh antigen.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.35, label: 'Maternal anti-Rh antibodies', detail: 'In a **subsequent pregnancy**, the anti-Rh antibodies the mother made earlier can **leak across into the Rh+ve foetus**.', icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.66, label: 'Foetal RBCs destroyed', detail: 'The antibodies **destroy the foetal RBCs**, causing severe **anaemia and jaundice** in the baby — this can be fatal. The condition is called **erythroblastosis foetalis**.', icon: 'circle' },
      ],
    },
    // ── 11 · Text — the mechanism spelled out + prevention ──────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The most important special case of Rh mismatch happens in pregnancy — between the **Rh-ve blood of a mother** and the **Rh+ve blood of her foetus**.\n\nIn the **first pregnancy** the foetus's Rh antigens do **not** reach the mother's blood, because the two bloods are **well separated by the placenta** — so the first child is usually fine. But during the **delivery of that first child**, small amounts of Rh+ve foetal blood can reach the mother, and she **begins making antibodies against the Rh antigen**. In her **subsequent pregnancies**, those anti-Rh antibodies can **leak into the Rh+ve foetus and destroy its RBCs**, causing severe **anaemia and jaundice** — a condition called **erythroblastosis foetalis**, which can be fatal to the foetus.\n\nIt can be prevented by giving **anti-Rh antibodies to the mother immediately after the delivery of the first child**. Next, we'll see what happens when blood needs to stop flowing instead of flowing — clotting (coagulation) and the lymph that circulates alongside it.",
    },
    // ── 12 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **ABO table (memorise it):** A → antigen A, anti-B, receives from A, O · B → antigen B, anti-A, receives from B, O · **AB → antigens A & B, no antibodies (nil), receives from AB, A, B, O** · **O → no antigens (nil), anti-A & anti-B, receives from O only**.\n- **Group O = universal donor** (no antigens → can give to anyone). **Group AB = universal recipient** (no antibodies → can take from anyone).\n- Mismatched transfusion → RBCs **clump and are destroyed**.\n- **Rh antigen** is named after **Rhesus monkeys**; present in **~80%** of people → **Rh+ve**; absent → **Rh-ve**.\n- **Erythroblastosis foetalis** = **Rh-ve mother** + **Rh+ve foetus**. First pregnancy safe (placenta separates the bloods); the mother is sensitised at the **first delivery**; the danger hits **subsequent pregnancies** — foetal RBCs destroyed → **anaemia and jaundice**.\n- **Prevention:** give **anti-Rh antibodies** to the mother **right after the first delivery**.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Universal donor vs universal recipient — never swap them:** **O = universal donor** (nil antigens), **AB = universal recipient** (nil antibodies). NEET loves testing this both ways.\n\n**Which pregnancy is hit?** Erythroblastosis foetalis affects a **subsequent (later) pregnancy** — **not** the first. The first child sensitises the mother at delivery; the *next* Rh+ve foetus is the one whose RBCs get destroyed.\n\n**The Rh number:** the Rh antigen is present in **nearly 80%** of humans, and it's named after **Rhesus monkeys**.\n\n**Classic NEET question:** \"The universal recipient blood group is ___.\" → **AB** (its plasma carries no antibodies). A twin favourite: \"Erythroblastosis foetalis affects which pregnancy?\" → **the subsequent one, not the first.**",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to Table 15.1, which antibodies are present in the plasma of a person with blood group O?",
          options: [
            "No antibodies (nil), because group O has no antigens to react against",
            "Only anti-B antibody, the same as group A",
            "Only anti-A antibody, the same as group B",
            "Both anti-A and anti-B antibodies",
          ],
          correct_index: 3,
          explanation: "Group O has no A or B antigen on its RBCs (nil), but its plasma carries BOTH anti-A and anti-B antibodies — that combination is exactly why O blood attacks nothing of its own yet its cells are safe to give to everyone (universal donor). The 'nil antibodies' answer actually describes group AB, not O; and O carries both antibodies, not just one like A or B.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Why is a person with blood group AB called the 'universal recipient'?",
          options: [
            "Its RBCs carry no antigens, so no other blood group can react against it",
            "Its plasma carries no antibodies, so it can accept blood from AB as well as all the other groups",
            "It carries both anti-A and anti-B antibodies, which neutralise any incoming blood",
            "It can be donated to persons of every other blood group",
          ],
          correct_index: 1,
          explanation: "AB's plasma has NO antibodies (nil), so there is nothing to attack incoming donor cells — it can accept AB, A, B and O. Option 1 describes group O (nil antigens), which is the universal *donor*, not recipient. Option 3 is the opposite of the truth (AB has no antibodies). Option 4 describes being a universal donor — that's O, not AB.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In erythroblastosis foetalis, why is the first Rh+ve child of an Rh-ve mother usually safe, while a subsequent one is at risk?",
          options: [
            "In the first pregnancy the placenta keeps the two bloods well separated; the mother only makes anti-Rh antibodies after the first delivery, so those antibodies threaten the next Rh+ve foetus",
            "The first foetus is always Rh-ve like the mother, so there is no mismatch until a later Rh+ve foetus appears",
            "The mother's anti-Rh antibodies are strongest in the first pregnancy and weaken with each later one",
            "The first child receives anti-Rh antibodies in the womb that protect all later children",
          ],
          correct_index: 0,
          explanation: "NCERT is explicit: in the first pregnancy the placenta keeps the mother's Rh-ve and the foetus's Rh+ve blood well separated, so she isn't sensitised until small amounts of foetal blood reach her during the first delivery. Only then does she make anti-Rh antibodies — which can leak into and destroy the RBCs of an Rh+ve foetus in a later pregnancy. The other options invent a changing foetal Rh type, get the antibody timing backwards, or describe a protection that doesn't happen.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: "The Rh antigen is present on the RBCs of nearly what fraction of humans, and where does its name come from?",
          options: [
            "Nearly 50 per cent of humans; named after the scientist Rh who discovered it",
            "Nearly 20 per cent of humans; named after the Rhesus monkey",
            "Nearly 80 per cent of humans; named after the Rhesus monkey, which carries a similar antigen",
            "Nearly 80 per cent of humans; named after the Rh (right-hand) side of the blood cell",
          ],
          correct_index: 2,
          explanation: "The Rh antigen is found in nearly 80 per cent of humans (who are Rh+ve), and it is named after the Rhesus monkey, which carries a similar antigen. The 50%/20% figures are wrong, and the name comes from the monkey — not from a scientist or from any 'right-hand side' of the cell.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
