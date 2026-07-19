'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'respiratory-balance-sheet',
  title: 'The Respiratory Balance Sheet — 38 ATP',
  subtitle: "Count every ATP one glucose gives you — glycolysis, the link step, Krebs, and the ETS — and you land on 38. But that neat number only exists on paper: it needs four assumptions a real cell never actually keeps.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'atp-balance-sheet'],
  glossary: [
    { term: 'respiratory balance sheet', definition: 'The step-by-step tally of how much ATP one glucose molecule yields when it is completely oxidised — glycolysis plus the link reaction plus the TCA cycle plus the ETS, added up to a net gain of 38 ATP.' },
    { term: 'net gain of ATP', definition: 'The ATP left over per glucose after subtracting the ATP spent to start the pathway — 38 ATP for aerobic respiration, only 2 ATP for fermentation.' },
    { term: 'theoretical exercise', definition: 'A calculation that is correct only under stated assumptions. The 38-ATP figure is one of these — useful for appreciating the cell\'s efficiency, but not exactly what a living cell produces moment to moment.' },
    { term: 'oxidative phosphorylation', definition: 'The making of ATP in the mitochondria using the energy released as NADH and FADH₂ are oxidised through the electron transport system.' },
    { term: 'fermentation', definition: 'The incomplete, anaerobic breakdown of glucose only as far as pyruvic acid (and then to lactic acid or ethanol), giving a net gain of just 2 ATP per glucose.' },
    { term: 'aerobic respiration', definition: 'The complete oxygen-dependent degradation of glucose all the way to CO₂ and H₂O, generating many more ATP than fermentation — a net 38 per glucose under the balance-sheet assumptions.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim study desk at night with an old ledger book open, faint glowing coin-like tokens stacked in neat columns beside it, suggesting energy being counted',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An old leather-bound ledger book lies open on a dark wooden desk at night, softly lit by a single warm lamp at the edge of the frame. Beside the ledger, faint softly glowing translucent coin-like tokens are stacked in a few neat rising columns, as if energy were being counted and tallied into balance, without any numbers, text, or literal diagram. Deep shadows fill most of the frame, with subtle warm highlights on the ledger's worn cover and brass desk fittings. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Number That Only Exists On Paper',
      markdown: "You have probably already memorised it: **one glucose gives 38 ATP**. It is the single most quoted number in this whole chapter. But here is the honest part NCERT tells you and most students skip — that exact figure is a **theoretical exercise**. No living cell actually sits there producing a tidy 38. The number is real only *if* four things are true at once, and inside a real cell those four things are almost never all true together. On this page you'll earn the 38 yourself, stage by stage, and see exactly which assumptions it quietly rests on.",
    },
    // ── 2 · Core concept — why the 38 is only a theoretical exercise ───────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "It **is** possible to calculate the **net gain of ATP** for every glucose molecule that gets oxidised. You add up what each stage contributes and you get a clean total. The trouble is what that clean total assumes about the cell.\n\nIn a real, living system, the pathways don't wait politely in line. **All pathways work at the same time**, not one after another. **Substrates enter and leave** the pathways as and when the cell needs them. **ATP gets spent** the moment it's needed rather than piling up to be counted. And **enzyme rates are controlled** by many means at once. So the balance-sheet number stays a **theoretical exercise** — genuinely useful for appreciating how efficient the living system is at extracting and storing energy, but not a live readout of what any one cell is doing right now.",
    },
    // ── 3 · Heading — the four assumptions ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Assumptions the 38 Rests On',
      objective: "By the end of this you can list the four assumptions the balance sheet needs, and explain why each one fails in a real cell.",
    },
    // ── 4 · Text — the four assumptions ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The calculation only works if you grant it these four assumptions:\n\n1. **A sequential, orderly pathway.** One substrate forms the next, with **glycolysis, then the TCA cycle, then the ETS** following one after another in a neat line.\n2. **The glycolytic NADH gets into the mitochondria.** The **NADH made in glycolysis is transferred into the mitochondria** and undergoes **oxidative phosphorylation** there — so it can be cashed in for ATP like the NADH made inside the mitochondria.\n3. **Nothing is siphoned off.** **None of the intermediates** in the pathway are pulled out to build some other compound. Every carbon stays on the energy-extraction track.\n4. **Only glucose is being respired.** **No other substrate** sneaks in at any of the in-between stages — glucose is the one and only fuel.\n\nGrant all four and the arithmetic gives a **net gain of 38 ATP** per glucose in aerobic respiration. Break any one of them — which a real cell does constantly — and the neat 38 stops being exact.",
    },
    // ── 5 · Heading — the 38-ATP tally ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Adding It Up — Where the 38 Comes From',
      objective: "By the end of this you can rebuild the 38-ATP total yourself, converting each stage's NADH and FADH₂ into ATP.",
    },
    // ── 6 · Text — how the tally works ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The balance sheet has two kinds of ATP in it. Some ATP is made **directly** during a reaction. The rest is made **indirectly**: the **NADH** and **FADH₂** carried out of each stage are handed to the electron transport system, where — under assumption 2 above — each **NADH** is worth about **3 ATP** and each **FADH₂** about **2 ATP**.\n\nSo you tally each stage's direct ATP, its NADH, and its FADH₂, convert the carriers at 3 and 2 each, and add everything up. Follow the last column down and it lands exactly on the number you already knew: **38**.",
    },
    // ── 7 · Table — the 38-ATP balance sheet ──────────────────────────────────
    {
      id: uuid(), type: 'table', order: 7,
      caption: 'The respiratory balance sheet — each stage of one glucose, and the ATP it contributes (NADH counted at 3 ATP, FADH₂ at 2 ATP, per the assumptions)',
      headers: ['Stage', 'Direct ATP', 'NADH (×3)', 'FADH₂ (×2)', 'ATP subtotal'],
      rows: [
        ['Glycolysis (glucose → 2 pyruvate)', '2', '2', '0', '8'],
        ['Link reaction (2 pyruvate → 2 acetyl CoA)', '0', '2', '0', '6'],
        ['TCA / Krebs cycle (2 turns)', '2', '6', '2', '24'],
        ['Net gain per glucose', '4', '10', '2', '38'],
      ],
    },
    // ── 8 · Heading — fermentation vs aerobic respiration ─────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Fermentation vs Aerobic Respiration',
      objective: "By the end of this you can state the three ways fermentation and aerobic respiration differ — breakdown, ATP yield, and how fast NADH is re-oxidised.",
    },
    // ── 9 · Text — the three differences ──────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Put the two side by side and NCERT draws three clean lines between them.\n\nFirst, how far the glucose is taken apart: **fermentation** only **partially** breaks glucose down (it stops at pyruvic acid), while **aerobic respiration** degrades it **completely** to **CO₂ and H₂O**. Second, the payout: fermentation gives a net gain of just **two ATP** per glucose, whereas aerobic respiration generates **many more** — the 38 you just tallied. Third, the housekeeping step of turning **NADH back into NAD⁺**: this happens **slowly** in fermentation, but the same reaction is **very vigorous** in aerobic respiration.",
    },
    // ── 10 · Comparison card — fermentation vs aerobic respiration ─────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Fermentation vs Aerobic Respiration',
      columns: [
        {
          heading: 'Fermentation (anaerobic)',
          points: [
            'Breakdown: only a partial breakdown of glucose — stops at pyruvic acid',
            'ATP yield: net gain of only 2 ATP per glucose',
            'NADH → NAD⁺ re-oxidation: happens slowly',
          ],
        },
        {
          heading: 'Aerobic respiration',
          points: [
            'Breakdown: glucose is completely degraded to CO₂ and H₂O',
            'ATP yield: many more ATP — a net 38 per glucose under the balance-sheet assumptions',
            'NADH → NAD⁺ re-oxidation: very vigorous',
          ],
        },
      ],
    },
    // ── 11 · Reasoning prompt — which assumption / why theoretical ────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A classmate insists the 38-ATP figure is exactly what every plant cell produces from each glucose, all the time. Using what NCERT actually says, which statement best explains why the 38 is a theoretical value and not a live one?",
      options: [
        "In a real cell all the pathways run at the same time and intermediates are pulled out or added as needed, so the tidy 38 only holds under assumptions a living system doesn't really keep",
        "The mitochondria destroy some ATP after counting it, so a cell always ends up with fewer than 38",
        "Glucose is never fully oxidised in any cell, so aerobic respiration can never reach 38 ATP",
        "The 38 is measured only in fermentation, where glucose is broken down partially",
      ],
      reveal: "Option 1 is right, and it names exactly what NCERT says: the balance sheet assumes a neat sequential pathway with nothing withdrawn and only glucose respired, but in a living system all pathways work simultaneously, substrates enter and leave as needed, and ATP is used as needed — so 38 is a theoretical exercise, not a live readout. Option 2 invents ATP being 'destroyed after counting,' which NCERT never says. Option 3 contradicts the chapter — aerobic respiration is precisely the complete oxidation that yields the 38. Option 4 confuses the two processes: fermentation is the partial breakdown that yields only 2 ATP, not 38.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Net gain = 38 ATP** per glucose in aerobic respiration — but only as a **theoretical exercise**.\n- It holds only under **four assumptions**: (1) a sequential, orderly pathway (glycolysis → TCA → ETS); (2) glycolytic NADH is transferred into the mitochondria for oxidative phosphorylation; (3) no intermediates are withdrawn to make other compounds; (4) only glucose is respired, nothing else enters midway.\n- **Why it's only theoretical:** in a real cell all pathways run at once, substrates enter and leave as needed, ATP is used as needed, and enzyme rates are regulated — so the assumptions rarely all hold.\n- **Fermentation:** partial breakdown → net **2 ATP** → NADH re-oxidised **slowly**.\n- **Aerobic respiration:** complete breakdown to CO₂ + H₂O → **many more ATP (net 38)** → NADH re-oxidised **vigorously**.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Know the two headline numbers cold:** aerobic respiration = net **38 ATP** per glucose; fermentation = net **2 ATP** per glucose. Mixing these up is the most common slip on this topic.\n\n**The assumptions are examinable, not just the total.** NEET loves to test which condition the 38-ATP calculation *requires* — the favourite being that the **NADH from glycolysis is transferred into the mitochondria** for oxidative phosphorylation. If glycolytic NADH stayed in the cytoplasm, the tally would drop.\n\n**Classic NEET question:** \"The net gain of ATP per glucose molecule during aerobic respiration is ___.\" → **38.** And its partner: \"Fermentation yields a net gain of ___ ATP per glucose.\" → **2.**",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So the 38-ATP balance sheet is a clean piece of accounting that quietly assumes glucose is the only fuel and no carbon ever leaves the track. Real cells break both assumptions on purpose — they pull intermediates out to build other molecules, and they burn fats and proteins too. Next you'll see how the respiratory pathway doubles as a building pathway (the **amphibolic pathway**), and how the **respiratory quotient** reveals which fuel a cell is actually burning.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What is the net gain of ATP when one molecule of glucose is completely oxidised in aerobic respiration, under the balance-sheet assumptions?",
          options: [
            "2 ATP",
            "12 ATP",
            "36 ATP",
            "38 ATP",
          ],
          correct_index: 3,
          explanation: "NCERT states there can be a net gain of 38 ATP molecules during aerobic respiration of one glucose molecule. 2 ATP is the fermentation figure, not the aerobic one. 12 and 36 are near-miss numbers designed to catch a half-remembered tally — the chapter's stated total is 38.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Why does NCERT call the 38-ATP figure a theoretical exercise rather than an exact value for a living cell?",
          options: [
            "Because in a real cell all the pathways work simultaneously, substrates enter and leave as needed, and ATP is used as needed — so the assumptions behind the calculation don't really hold",
            "Because cells actually make far more than 38 ATP and the number is rounded down for simplicity",
            "Because the calculation was never tested and biologists only guess at the value",
            "Because only glucose can be respired, so the figure applies to no real organism",
          ],
          correct_index: 0,
          explanation: "The chapter is explicit: the 38 depends on assumptions that aren't valid in a living system, where all pathways run at once, substrates are withdrawn and added as needed, and ATP is spent as needed. Option 2 reverses the point — the assumptions tend to make the theoretical figure an overestimate, not a rounded-down one. Option 3 is wrong: the calculation is well defined, just idealised. Option 4 misreads 'only glucose is respired,' which is one of the assumptions, not a fact about all organisms.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of these is one of the four assumptions the 38-ATP calculation depends on?",
          options: [
            "The NADH synthesised in glycolysis is transferred into the mitochondria and undergoes oxidative phosphorylation",
            "Several intermediates are withdrawn from the pathway to build amino acids and fats",
            "Fats and proteins enter the pathway alongside glucose at intermediate stages",
            "Glycolysis, the TCA cycle and the ETS all run at exactly the same time rather than in sequence",
          ],
          correct_index: 0,
          explanation: "Assumption 2 is exactly that the glycolytic NADH is transferred into the mitochondria for oxidative phosphorylation. Options 2 and 3 are the opposite of the assumptions — the calculation assumes no intermediates are withdrawn and that only glucose is respired. Option 4 also inverts an assumption: the balance sheet assumes a sequential, orderly pathway (one stage after another), while running simultaneously is what actually happens in a real cell and is why the figure stays theoretical.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Comparing fermentation with aerobic respiration, which statement is correct?",
          options: [
            "Fermentation completely degrades glucose to CO₂ and H₂O, while aerobic respiration only partially breaks it down",
            "Fermentation gives a net gain of 38 ATP, while aerobic respiration gives only 2 ATP per glucose",
            "Fermentation only partially breaks down glucose and nets 2 ATP, and NADH is re-oxidised to NAD⁺ slowly, whereas aerobic respiration degrades glucose completely, yields many more ATP, and re-oxidises NADH vigorously",
            "In both fermentation and aerobic respiration, NADH is oxidised to NAD⁺ equally vigorously",
          ],
          correct_index: 2,
          explanation: "Option 3 states all three NCERT differences correctly: fermentation is partial (2 ATP, slow NADH re-oxidation); aerobic is complete (many more ATP, vigorous NADH re-oxidation). Option 1 swaps the two processes — it's aerobic respiration that fully degrades glucose to CO₂ and H₂O. Option 2 swaps the ATP figures. Option 4 is wrong because the re-oxidation of NADH is slow in fermentation but vigorous in aerobic respiration, not equal.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
