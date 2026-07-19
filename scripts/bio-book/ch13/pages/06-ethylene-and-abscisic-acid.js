'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'ethylene-and-abscisic-acid',
  title: 'Ethylene & Abscisic Acid — the Ripening & Stress Hormones',
  subtitle: "The last two of the five plant hormones do the jobs a plant needs most at the end of a season — one is a gas that ripens fruit and drops old leaves, the other shuts the plant down to survive drought. Learn exactly where they agree and where they fight.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'plant-growth-regulators'],
  glossary: [
    { term: 'ethylene', definition: 'A simple gaseous plant growth regulator synthesised in large amounts by senescing tissues and ripening fruits; promotes fruit ripening, senescence and abscission.' },
    { term: 'senescence', definition: 'The natural ageing of plant organs (leaves, flowers) that leads to their decline and eventual shedding. Ethylene promotes it.' },
    { term: 'abscission', definition: 'The shedding of plant organs — especially leaves and flowers — from the plant body. Ethylene promotes it.' },
    { term: 'respiratory climactic', definition: 'The sharp rise in a fruit’s respiration rate during ripening, driven by ethylene.' },
    { term: 'apical hook', definition: 'The bent, hook-shaped tip formed in a dicot seedling as it pushes up through soil; ethylene induces its formation.' },
    { term: 'ethephon', definition: 'The most widely used source of ethylene in farming — an aqueous compound that is absorbed and transported within the plant and releases ethylene slowly.' },
    { term: 'abscisic acid (ABA)', definition: 'A general plant growth inhibitor and inhibitor of metabolism; closes stomata and raises stress tolerance, so it is called the stress hormone. It induces dormancy and acts as an antagonist to gibberellins.' },
    { term: 'dormancy', definition: 'A resting state in which a seed or bud stays inactive. ABA induces it; ethylene breaks it.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark orchard scene at dusk: one branch heavy with ripe fruit, a few yellowed leaves drifting down, and a single leaf tightly curled against a dry wind',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet orchard at dusk seen against a deep near-black sky. On the left, one low branch hangs heavy with softly glowing ripe fruit; in the middle, two or three yellowed leaves drift gently downward through the still air; on the right, a single small plant holds its leaves tightly curled inward against a faint dry wind, as if bracing. Warm amber light pools only around the ripening fruit, everything else in cool deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Ripe Apple Ripens the Whole Basket',
      markdown: "Ethylene is the only one of the five plant hormones that is a **gas**. That single fact explains an old kitchen trick: a ripe fruit gives off ethylene into the air around it, and that gas makes the fruits next to it ripen faster too. This is exactly why farmers reach for it — ethylene ripens fruit, and it is **one of the most widely used plant growth regulators in agriculture**.",
    },
    // ── 2 · Core concept — the last two hormones ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You have already met three plant growth regulators that mostly **build the plant up** — auxins, gibberellins and cytokinins, the growth **promoters**. The last two are different in job. **Ethylene** governs the endgame of a fruit or a leaf: **ripening, ageing and dropping off**. **Abscisic acid** does the opposite of growing — it **slows the plant down** to survive hard times like drought. Learning these two well is where the whole chapter comes together, because a plant’s life is not only about growing; it is also about ripening, resting and enduring stress.",
    },
    // ── 3 · Heading — Ethylene ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Ethylene — the Gas That Ripens, Ages and Sheds',
      objective: "By the end of this you can list what ethylene does in a plant, name the respiratory climactic, and say which crops ethephon is used on.",
    },
    // ── 4 · Text — what ethylene is and does ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Ethylene is a simple gaseous PGR.** A plant makes it in **large amounts** from two kinds of tissue: tissues that are **ageing (senescing)** and **fruits that are ripening**. Its effects run right across the plant:\n\n- In young **dicot seedlings** it causes **horizontal growth**, **swelling of the axis** (the stem thickens) and the bent **apical hook** that protects the growing tip as it pushes up through soil.\n- It promotes **senescence and abscission** — the ageing and then the **shedding** of plant organs, especially **leaves and flowers**.\n- It is **highly effective in fruit ripening**, and while a fruit ripens ethylene **raises its respiration rate**. This rise in respiration during ripening has a name you must remember: the **respiratory climactic**.\n\nEthylene also **breaks seed and bud dormancy** — it wakes resting seeds and buds up. It **initiates germination in peanut seeds** and the **sprouting of potato tubers**. In **deep-water rice** it drives **rapid internode and petiole elongation** so the leaves and upper shoot stay **above the rising water**. And it **promotes root growth and root hair formation**, which increases the surface a plant has for absorbing water and minerals.",
    },
    // ── 5 · Interactive image — ethylene's effects ────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A single plant diagram showing ethylene’s effects: a dicot seedling with an apical hook, a ripe fruit with an arrow marking rising respiration, and a yellowed leaf being shed at the base',
      caption: '📸 Tap each dot to see one job ethylene does across the plant.',
      generation_prompt: "Scientific textbook illustration showing the effects of ethylene on a plant. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. On the left, a young dicot seedling emerging from brown soil with its shoot tip bent into a clear hook shape (green stem, brown soil). In the centre, a round ripe fruit shown in warm ripe colour with small upward arrows around it suggesting rising respiration. On the right and lower area, a yellowing leaf (fading green to brown) detaching at a marked separation zone at the base of its stalk. Include fine root hairs on the lower roots. Green = living/growing tissue, brown/tan = ageing/soil, warm tone = ripe fruit. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.28, label: 'Apical hook', detail: "In a dicot seedling ethylene forms this bent hook at the shoot tip, protecting the delicate growing point as the seedling pushes up through the soil.", icon: 'circle' },
        { id: uuid(), x: 0.20, y: 0.62, label: 'Root growth & root hairs', detail: "Ethylene promotes root growth and the formation of root hairs, increasing the surface area over which the plant can absorb water and minerals.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.42, label: 'Fruit ripening', detail: "Ethylene is highly effective in ripening fruit. Senescing tissues and ripening fruits also make ethylene in large amounts themselves.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.20, label: 'Respiratory climactic', detail: "As a fruit ripens, ethylene raises its respiration rate. This rise in respiration during ripening is called the respiratory climactic.", icon: 'circle' },
        { id: uuid(), x: 0.84, y: 0.55, label: 'Senescence & abscission', detail: "Ethylene promotes the ageing (senescence) and then the shedding (abscission) of plant organs, especially leaves and flowers.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — ethephon and farm uses ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Because ethylene regulates so many processes, farmers use it constantly — and the most widely used **source** of ethylene is a compound called **ethephon**. In water, ethephon is **readily absorbed and transported** inside the plant, where it **releases ethylene slowly**. Ethephon **hastens fruit ripening** in **tomatoes and apples**, **accelerates abscission** in flowers and fruits (used to thin cotton, cherry and walnut), and **promotes female flowers in cucumbers**, which raises the yield.\n\nEthylene is also used to **initiate flowering and synchronise fruit-set in pineapples**, and it **induces flowering in mango**. Put all of this together and you can see why it is called one of the most widely used PGRs in agriculture.",
    },
    // ── 7 · Heading — Abscisic acid ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Abscisic Acid — the Brake and the Stress Hormone',
      objective: "By the end of this you can explain why ABA is called the stress hormone, what it does to stomata and seeds, and which hormone it opposes.",
    },
    // ── 8 · Text — ABA ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Abscisic acid (ABA)** was first discovered for its role in **abscission and dormancy**, but it does much more. Where the other hormones push growth forward, ABA is the **brake**: it acts as a **general plant growth inhibitor** and an **inhibitor of plant metabolism** — it slows the plant’s chemistry down.\n\nWhat it actually does:\n\n- It **inhibits seed germination** — it keeps seeds from sprouting.\n- It **stimulates the closure of stomata**, the tiny pores on a leaf. Closing them cuts water loss and **raises the plant’s tolerance to stresses** like drought — which is exactly why ABA is called the **stress hormone**.\n- It is important in **seed development, maturation and dormancy**. By **inducing dormancy**, ABA lets a seed **withstand desiccation** (drying out) and other conditions unfriendly to growth.\n\nOne relationship to lock in: in most situations, **ABA acts as an antagonist to gibberellins (GAs)** — the two pull in opposite directions. Where a gibberellin says “grow, sprout, elongate,” ABA says “wait, rest, hold.”",
    },
    // ── 9 · Comparison card — Ethylene vs ABA ─────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Ethylene vs Abscisic Acid',
      columns: [
        {
          heading: 'Ethylene',
          points: [
            'A simple gaseous PGR (the only gas of the five)',
            'Made in large amounts by senescing tissues and ripening fruits',
            'Promotes fruit ripening; raises respiration during ripening (respiratory climactic)',
            'Promotes senescence and abscission of leaves and flowers',
            'BREAKS seed and bud dormancy — wakes resting seeds/buds up',
            'Source used in farming: ethephon',
          ],
        },
        {
          heading: 'Abscisic acid (ABA)',
          points: [
            'A general plant growth inhibitor and inhibitor of metabolism (the brake)',
            'Discovered for its role in abscission and dormancy',
            'Inhibits seed germination',
            'Stimulates stomatal closure and raises stress tolerance → the stress hormone',
            'INDUCES dormancy — helps seeds withstand desiccation',
            'Acts as an antagonist to gibberellins (GAs)',
          ],
        },
      ],
    },
    // ── 10 · Heading — how the hormones work together ─────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'How the Five Hormones Work Together',
      objective: "By the end of this you can explain that a single plant event is usually run by more than one PGR, and that their roles can add up or cancel out.",
    },
    // ── 11 · Text — PGR interaction ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Here is the idea that ties the whole chapter together: for **any and every phase** of a plant’s growth, differentiation and development, **one or more PGR has a role to play**. They rarely work alone.\n\nThose roles can go in different combinations:\n\n- **Complementary** — two hormones adding to each other, or **antagonistic** — two hormones opposing each other (like ABA against gibberellins).\n- **Individualistic** — a hormone acting on its own, or **synergistic** — hormones working together to give a bigger combined effect.\n\nAnd many key events in a plant’s life are run by **more than one PGR interacting at once** — for example **dormancy in seeds and buds, abscission, senescence and apical dominance**. Remember too that PGRs are only **one kind of intrinsic (internal) control**. They work alongside the plant’s **genomic control** and **extrinsic (outside) factors** such as **temperature and light** — and often those outside factors act **through** the PGRs.",
    },
    // ── 12 · Reasoning prompt — dormancy contrast ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A farmer wants stored potato tubers to sprout, and separately wants a batch of seeds to stay resting so they survive a dry spell. Which hormone does which job?",
      options: [
        "Ethylene breaks dormancy to sprout the tubers; ABA induces dormancy to keep the seeds resting",
        "ABA breaks dormancy to sprout the tubers; ethylene induces dormancy to keep the seeds resting",
        "Ethylene does both — it breaks dormancy in the tubers and also induces it in the seeds",
        "Gibberellin sprouts the tubers; ethylene keeps the seeds resting",
      ],
      reveal: "The first option is correct. Ethylene BREAKS seed and bud dormancy — that is exactly what sprouts resting potato tubers. ABA does the opposite: it INDUCES dormancy, so a seed rests and can withstand desiccation. Option 2 swaps the two hormones — the single most common mix-up on this topic. Option 3 is wrong because ethylene only breaks dormancy, it does not induce it. Option 4 misassigns the resting job to ethylene; inducing dormancy is ABA’s role, not ethylene’s.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Ethylene** = a **gas**; made by **senescing tissues and ripening fruits**; **ripens fruit**; raises respiration during ripening = **respiratory climactic**; promotes **senescence and abscission**; **BREAKS dormancy**; farm source = **ethephon** (ripens tomato/apple, thins crops, promotes female flowers in cucumber).\n- **Abscisic acid (ABA)** = the **growth inhibitor / stress hormone**; **closes stomata** and raises stress tolerance; **inhibits seed germination**; **INDUCES dormancy** (seeds withstand desiccation); **antagonist to gibberellins**.\n- **The one-line contrast NEET loves:** **ethylene BREAKS dormancy, ABA INDUCES dormancy.** Do not swap them.\n- Any plant event is usually run by **more than one PGR** — roles can be **complementary or antagonistic, individualistic or synergistic**.",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Stress hormone = ABA.** The one that closes stomata to save water and helps a plant survive drought is always abscisic acid.\n\n**Fruit ripening = ethylene** (a gas), and the rise in respiration while a fruit ripens is the **respiratory climactic** — that term is a favourite one-word answer.\n\n**The dormancy trap:** ethylene **breaks** dormancy, ABA **induces** dormancy. NEET loves to swap these in a single sentence and see who catches it.\n\n**Classic NEET question:** “The stress hormone that stimulates the closure of stomata is ___.” → **Abscisic acid (ABA)**. And its partner question: “The PGR responsible for fruit ripening is ___.” → **Ethylene**.",
    },
    // ── 15 · Closing synthesis of the whole chapter ───────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "Step back and look at the whole chapter as one story. A plant’s life runs from **growth** — cells increasing in number and size — into **differentiation**, where those cells take on specialised shapes and jobs, and together these add up to **development**, the plant’s entire journey from seed to death. None of that happens on its own. It is orchestrated by the **five plant growth regulators**, working as a team: **auxins, gibberellins and cytokinins** mostly build the plant up, while **ethylene and abscisic acid** carry it through ripening, ageing, rest and stress. They rarely act alone — complementary or antagonistic, individualistic or synergistic — and alongside the plant’s own genes and outside factors like light and temperature, they decide, moment by moment, what the plant becomes. That teamwork is the real answer to the question this chapter opened with: how does a tiny seed know how to grow into a whole plant?",
    },
    // ── 16 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The rise in the rate of respiration that occurs while a fruit is ripening is known as the:",
          options: [
            "Respiratory climactic",
            "Abscission burst",
            "Senescence peak",
            "Dormancy break",
          ],
          correct_index: 0,
          explanation: "Ethylene raises a fruit’s respiration rate during ripening, and NCERT names this rise the respiratory climactic. “Abscission burst” and “senescence peak” are invented terms; “dormancy break” is a real ethylene effect but it describes waking up resting seeds and buds, not the respiration rise during ripening.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which plant growth regulator is called the stress hormone, and why?",
          options: [
            "Ethylene, because it ripens fruit and raises the respiration rate",
            "Abscisic acid, because it stimulates the closure of stomata and increases the plant’s tolerance to stresses",
            "Gibberellin, because it makes stems elongate under drought",
            "Cytokinin, because it delays the ageing of leaves under stress",
          ],
          correct_index: 1,
          explanation: "ABA closes stomata, which cuts water loss and raises stress tolerance, so NCERT calls it the stress hormone. Ethylene ripens fruit but has nothing to do with the stress-hormone label. Gibberellin and cytokinin are growth-related hormones and neither is named the stress hormone.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A student writes: “Ethylene induces dormancy, while ABA breaks it.” What is wrong with this statement?",
          options: [
            "Nothing — the statement is correct as written",
            "Only the ethylene half is wrong; ABA does break dormancy",
            "The two hormones are swapped: ethylene BREAKS seed and bud dormancy, whereas ABA INDUCES dormancy",
            "Both hormones actually induce dormancy, so neither breaks it",
          ],
          correct_index: 2,
          explanation: "The roles are reversed. Ethylene breaks seed and bud dormancy (it sprouts potato tubers and germinates peanut seeds), and ABA induces dormancy so seeds can withstand desiccation. This exact swap is the most common way the topic is tested wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about how the plant growth regulators act is consistent with NCERT?",
          options: [
            "Each PGR always acts alone, controlling exactly one event by itself",
            "For every phase of growth, differentiation and development, one or more PGR has a role, and their roles can be complementary or antagonistic, individualistic or synergistic",
            "Only ethylene and ABA interact; auxins, gibberellins and cytokinins never work together",
            "Extrinsic factors like temperature and light act completely separately from the PGRs, never through them",
          ],
          correct_index: 1,
          explanation: "NCERT states that every phase of growth, differentiation and development involves one or more PGR, with roles that can be complementary or antagonistic and individualistic or synergistic. Option 1 wrongly claims they always act alone; option 3 wrongly limits interaction to two hormones; option 4 is wrong because outside factors such as temperature and light often act through the PGRs, not separately from them.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
