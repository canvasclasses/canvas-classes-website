'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'microbes-in-sewage-treatment',
  title: 'Cleaning Our Water — Microbes in Sewage Treatment',
  subtitle: "Every city dumps millions of gallons of filthy water every day, yet rivers don't drown in it. This page shows you the invisible clean-up crew — heterotrophic microbes — and the one number, BOD, that tells you how dirty the water still is.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['microbes-in-human-welfare', 'sewage-treatment', 'bod', 'activated-sludge', 'biogas'],
  glossary: [
    { term: 'sewage', definition: 'The large quantity of municipal waste water generated daily in cities and towns. A major part of it is human excreta, so it carries a lot of organic matter and microbes — many of them disease-causing (pathogenic).' },
    { term: 'STP (sewage treatment plant)', definition: 'The plant where sewage is treated by naturally present heterotrophic microbes to make it less polluting before it is released into rivers and streams.' },
    { term: 'primary sludge', definition: 'The solids that settle out during primary (physical) treatment. The liquid left above it is called the effluent.' },
    { term: 'BOD (biochemical oxygen demand)', definition: 'The amount of oxygen that would be consumed if all the organic matter in one litre of water were oxidised by bacteria. Higher BOD means more organic matter — so dirtier, more polluting water.' },
    { term: 'flocs', definition: 'Mesh-like masses of aerobic bacteria associated with fungal filaments that grow in the aeration tank and eat up the organic matter in the effluent.' },
    { term: 'activated sludge', definition: 'The sediment of bacterial flocs that settles in the settling tank after secondary treatment. A small part is recycled as inoculum; the rest goes to the anaerobic sludge digester.' },
    { term: 'biogas', definition: 'The inflammable mixture of gases — mainly methane, with hydrogen sulphide and carbon dioxide — produced by anaerobic bacteria digesting the sludge. It can be used as a source of energy.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk view of a sewage treatment plant beside a river — dark round tanks in sequence with a clear stream of water finally flowing back into the river under a calm sky',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm dusk view of an industrial sewage treatment plant set beside a wide river, seen from a respectful middle distance. In the foreground and midground, a row of large dark circular treatment tanks sits in sequence — the first murky and clouded, the last one holding noticeably clearer water — hinting at water getting cleaner as it moves along the line. From the final tank, a thin ribbon of clearer water flows quietly back into the broad river beyond, which stretches toward the horizon under a soft dusk sky. Deep dusk lighting, painterly and atmospheric, dark overall tones (#0a0a0a base), warm low light catching the water surface. No text, no labels, no arrows, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "The Cleanup No Machine Has Ever Beaten",
      markdown: "Think about where your bathroom water goes after it disappears down the drain. Multiply that by a whole city — millions of gallons of dirty water, thick with human waste, every single day. You cannot just pour that straight into a river; it would poison the fish and the people downstream. So it goes to a treatment plant first. And here's the part that should surprise you: the plant does not clean the water with fancy chemicals or filters alone. The real workers are **microbes** — the same tiny heterotrophs that were already living in the sewage. NCERT says it plainly: this method has been used for over a hundred years, and to this day **no man-made technology has been able to beat microbes at cleaning sewage**.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The waste water generated every day in cities and towns is called **sewage**. A major part of it is **human excreta**, so it carries huge amounts of **organic matter** and **microbes** — and many of those microbes are **pathogenic** (disease-causing). That is exactly why sewage cannot be dumped straight into rivers and streams.\n\nBefore disposal, sewage is sent to a **sewage treatment plant (STP)** to make it less polluting. The clean-up is done by the **heterotrophic microbes** already present in the sewage — the plant just gives them the right conditions to work. The whole treatment happens in **two stages, in order**:\n\n- **Primary treatment** — a *physical* clean-up (remove the solids).\n- **Secondary / biological treatment** — the *microbial* clean-up (eat the dissolved organic matter).\n\nKeep that split — **physical first, biological second** — at the front of your mind; the rest of the page just fills it in.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Primary Treatment — Pulling Out the Solids (Physical)',
      objective: 'By the end of this you can describe primary treatment as pure physical removal, and name what leaves it: primary sludge (solids) and effluent (the liquid on top).',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Primary treatment** is entirely **physical** — no microbes doing any eating yet, just the plant physically pulling particles out of the sewage by **filtration and sedimentation**. It happens in steps:\n\n1. First, **floating debris** is removed by **sequential filtration**.\n2. Then the **grit** — soil and small pebbles — is removed by **sedimentation** (it's heavy, so it settles).\n\nEverything that settles at the bottom forms the **primary sludge**. The liquid floating above it — the watery part still carrying dissolved organic matter — is the **effluent**. That effluent from the primary settling tank is what gets carried forward into secondary treatment. So remember the two things primary treatment produces: **primary sludge (the settled solids)** and **effluent (the liquid on top)**.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Secondary Treatment — The Microbes Eat (Biological), and BOD Drops',
      objective: "By the end of this you can trace the effluent through aeration → flocs → BOD drop → settling → activated sludge → digester → biogas, and say exactly what BOD means.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Secondary treatment** is also called **biological treatment**, because this is where the microbes finally do the work.\n\nThe primary effluent is passed into large **aeration tanks**, where it is constantly **agitated mechanically** and **air is pumped into it**. All that oxygen lets useful **aerobic microbes** grow vigorously into **flocs** — mesh-like masses of bacteria tangled together with fungal filaments. As these flocs grow, they **consume the major part of the organic matter** in the effluent. That eating is the whole point, and it produces one crucial result: it **sharply reduces the BOD** of the effluent.\n\nSo what is BOD? **BOD (biochemical oxygen demand)** is the amount of **oxygen** that would be consumed if all the organic matter in **one litre of water were oxidised by bacteria**. The BOD test measures how fast microbes take up oxygen in a water sample — and that rate depends on how much organic matter is there for them to eat. So **BOD is an indirect measure of the organic matter in the water**. Get the direction right, because NEET tests exactly this: **more organic matter → more oxygen needed → higher BOD → dirtier, more polluting water.** In one line: **the greater the BOD, the greater the polluting potential.** Clean water has a low BOD; filthy sewage has a high BOD.\n\nThe sewage is treated until its BOD drops significantly. Once it does, the effluent moves into a **settling tank**, where the bacterial **flocs** are allowed to **sediment** (settle out). This sediment is called **activated sludge**. Now the sludge splits two ways:\n\n- A **small part** of the activated sludge is **pumped back** into the aeration tank to act as the **inoculum** (the starter culture of microbes for the next batch).\n- The **remaining major part** is pumped into large tanks called **anaerobic sludge digesters**. Here a different set of bacteria — ones that grow **anaerobically** (without oxygen) — digest the bacteria and fungi in the sludge. During this digestion they produce a mixture of gases: **methane, hydrogen sulphide and carbon dioxide**. This mixture is **biogas**, and because it is inflammable it can be burned as a **source of energy**.\n\nThe cleaned effluent from the secondary plant is finally released into rivers and streams. On the next page we stay with these same tireless microbes — but put them to work making our food.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A flow diagram of a sewage treatment plant showing raw sewage entering primary treatment, then the aeration tank, then the settling tank producing activated sludge, with part recycled to aeration and the rest going to an anaerobic sludge digester that gives off biogas, and clean effluent leaving to a river',
      caption: '📸 Tap each dot to follow the sewage from filthy inflow to clean river-bound water (based on NCERT Figure 8.6)',
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.55, label: 'Primary treatment (physical)', icon: 'circle',
          detail: 'Raw **sewage** enters here. This first stage is purely **physical** — floating debris is removed by **sequential filtration** and grit by **sedimentation**. Settled solids form the **primary sludge**; the liquid on top is the **effluent**, which moves on to secondary treatment.' },
        { id: uuid(), x: 0.36, y: 0.42, label: 'Aeration tank (secondary begins)', icon: 'circle',
          detail: 'The primary effluent is **agitated** and **air is pumped in**. This oxygen lets **aerobic microbes** grow into **flocs** — mesh-like masses of bacteria and fungal filaments — that eat the organic matter. This is where the **BOD drops sharply**.' },
        { id: uuid(), x: 0.50, y: 0.60, label: 'Flocs eating organic matter', icon: 'circle',
          detail: '**Flocs** are the working microbes. As they consume the major part of the organic matter in the effluent, the **biochemical oxygen demand (BOD) falls** — the single sign that the water is getting cleaner.' },
        { id: uuid(), x: 0.66, y: 0.42, label: 'Settling tank → activated sludge', icon: 'circle',
          detail: 'The treated effluent flows here and the bacterial **flocs sediment** out. This settled sediment is the **activated sludge**. The clear water above is now low in BOD and ready to leave.' },
        { id: uuid(), x: 0.66, y: 0.72, label: 'Part recycled as inoculum', icon: 'circle',
          detail: 'A **small part** of the activated sludge is **pumped back** into the aeration tank to serve as the **inoculum** — the starter microbes that kick off the next batch of treatment.' },
        { id: uuid(), x: 0.86, y: 0.62, label: 'Anaerobic sludge digester → biogas', icon: 'circle',
          detail: 'The **major part** of the activated sludge goes into **anaerobic sludge digesters**. Here **anaerobic bacteria** digest the sludge and release a mix of **methane, hydrogen sulphide and carbon dioxide** — this inflammable mixture is **biogas**, usable as energy.' },
      ],
      generation_prompt: "Scientific textbook illustration of a sewage treatment plant as a left-to-right process flow, matching NCERT Figure 8.6 (secondary treatment). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and thin white leader lines, no baked-in text labels. From the left: an inflow of murky sewage entering a primary treatment / settling unit (drawn as a rectangular sedimentation tank with settled solids at the bottom); an arrow leads to a large rectangular AERATION TANK shown bubbling with pumped air and containing suspended mesh-like clusters (flocs) drawn as small tangled masses; an arrow leads to a circular SETTLING TANK where flocs sediment at the bottom as activated sludge, with clearer water on top; a return pipe arcs back from the settling tank to the aeration tank (recycled inoculum); a separate pipe carries the rest of the sludge down to a rounded closed ANAEROBIC SLUDGE DIGESTER tank on the right, shown giving off gas (biogas) at its top; a final outflow of clearer water leaves the settling tank toward a small river/stream at the far right. Use blue tones for water, brown/tan for sludge and solids, faint green for microbial flocs, drawn with biologically and mechanically plausible proportions. No photorealism, no cartoon, no mascots, standard textbook process-flow conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A technician tests two water samples. Sample X has a very high BOD; Sample Y has a very low BOD. Which sample is the more polluted, and why?",
      options: [
        "Sample Y — a low BOD means the microbes have already added a lot of oxygen to the water, so it must be dirtier",
        "Sample X — a high BOD means there is a lot of organic matter for bacteria to oxidise, so it demands more oxygen and is more polluting",
        "Both are equally polluted, because BOD only measures temperature, not organic matter",
        "Sample X — a high BOD means the water already holds a lot of dissolved oxygen, which only clean water can do",
      ],
      reveal: "The answer is **Sample X**. **BOD** is the oxygen that bacteria *demand* to oxidise the organic matter in the water. **More organic matter → more oxygen demanded → higher BOD → more polluting.** So a high BOD (Sample X) marks the dirtier water. Option A reverses the logic — low BOD means *little* organic matter, i.e. cleaner water, not dirtier. Option D confuses BOD with dissolved oxygen: BOD is oxygen *demanded* by microbes, not oxygen already present. And BOD has nothing to do with temperature, so C is out. Whenever you see BOD, chant the direction: **high BOD = high pollution.**",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In Before the Exam',
      markdown: "**The two stages, and what each one really is:**\n- **Primary treatment = PHYSICAL** — filtration + sedimentation remove solids. Products: **primary sludge** (settled solids) + **effluent** (liquid on top).\n- **Secondary treatment = BIOLOGICAL** — aerobic microbes grow into **flocs** in the **aeration tank** and eat the organic matter.\n\n**BOD — get the direction right (NEET's favourite trap):**\n> **Higher BOD = more organic matter = dirtier, more polluting water.** Low BOD = clean water.\n> BOD = the oxygen bacteria would consume to oxidise all the organic matter in **1 litre** of water. Secondary treatment's whole job is to **bring the BOD down**.\n\n**The sludge split after settling:**\n- **Small part** of the **activated sludge** → back to the aeration tank as **inoculum**.\n- **Major part** → **anaerobic sludge digester** → anaerobic bacteria → **biogas** (methane + H₂S + CO₂), which is inflammable.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**BOD direction (lifted verbatim):** *\"The greater the BOD of waste water, more is its polluting potential.\"* Learn it in that exact direction — questions flip it to see if you'll wrongly say low BOD = polluted.\n\n**BOD is a *demand*, not a *content*:** it is the oxygen that *would be consumed* if bacteria oxidised the organic matter in 1 litre — not the oxygen already dissolved in the water. Don't confuse BOD with dissolved oxygen.\n\n**Primary = physical, Secondary = biological.** NCERT even calls secondary treatment the *biological* treatment. If a question calls primary treatment 'biological', it's wrong.\n\n**Flocs = bacteria + fungal filaments** (a mesh), formed in the **aeration tank** under pumped air. **Activated sludge** is what these flocs become after they **settle** in the settling tank.\n\n**Classic NEET question:** \"During secondary treatment of sewage, the rising level of BOD indicates what?\" → a **rise in the pollution load / organic matter** of the water (more BOD = more polluting).",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'A sample of sewage water shows a very high BOD value. What does this tell you about the water?',
          options: [
            'It is very clean, because a high BOD means microbes have finished removing the organic matter',
            'It contains a large amount of organic matter and is highly polluting',
            'It is rich in dissolved oxygen and safe to release into a river',
            'It has been fully treated and is ready for the anaerobic digester',
          ],
          correct_index: 1,
          explanation: 'BOD is the oxygen bacteria would consume to oxidise the organic matter in the water, so a high BOD means a lot of organic matter — dirtier, more polluting water. The tempting trap is to read "high BOD" as clean; it is the opposite. High BOD is also not the same as high dissolved oxygen, and untreated high-BOD water is certainly not ready for release.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which of the following correctly describes primary treatment of sewage?',
          options: [
            'Aerobic microbes grow into flocs and consume the organic matter',
            'Anaerobic bacteria digest the sludge to release biogas',
            'It is a physical process that removes solids by filtration and sedimentation',
            'Air is pumped in to reduce the BOD of the effluent',
          ],
          correct_index: 2,
          explanation: 'Primary treatment is purely physical — floating debris is removed by filtration and grit by sedimentation, leaving primary sludge and effluent. The other three options all describe secondary (biological) or digester steps: flocs eating organic matter and air being pumped in are secondary treatment, and biogas formation happens in the anaerobic sludge digester.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'In the aeration tank during secondary treatment, the vigorous growth of useful aerobic microbes into flocs mainly causes:',
          options: [
            'A sharp rise in the BOD of the effluent',
            'The production of biogas from methane and hydrogen sulphide',
            'The removal of grit and floating debris',
            'A sharp reduction in the BOD of the effluent',
          ],
          correct_index: 3,
          explanation: 'The flocs consume the major part of the organic matter in the effluent, which sharply reduces its BOD — that is the goal of secondary treatment. BOD falling (not rising) is the sign of cleaning. Biogas is made later in the anaerobic digester, and grit/debris removal is primary (physical) treatment, not the aeration step.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'After the settling tank, the activated sludge is split. Where does the major part of it go, and what is produced there?',
          options: [
            'Into anaerobic sludge digesters, where anaerobic bacteria produce biogas',
            'Into rivers and streams, where it is oxidised by aerobic microbes',
            'Back to the aeration tank, where it produces the inoculum',
            'Into the primary settling tank, where it forms fresh primary sludge',
          ],
          correct_index: 0,
          explanation: 'The major part of the activated sludge is pumped into anaerobic sludge digesters, where anaerobic bacteria digest it and give off biogas (methane, hydrogen sulphide, carbon dioxide). The small part — not the major part — is what returns to the aeration tank as inoculum, so that option flips the proportion. The sludge is not released into rivers, and it does not go back to form primary sludge.',
          difficulty_level: 2,
        },
      ],
    },
  ],
};
