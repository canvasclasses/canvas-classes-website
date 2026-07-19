'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'what-is-a-cell-and-cell-theory',
  title: 'What Is a Cell? And Cell Theory',
  subtitle: "One man saw the first living cell under a microscope. Three more scientists spent decades turning that sighting into the two-line law that governs every living thing — memorise it exactly as NEET quotes it.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'cell-theory'],
  glossary: [
    { term: 'cell', definition: 'The fundamental structural and functional unit of all living organisms — the smallest unit that can independently exist and perform every essential function of life.' },
    { term: 'nucleus', definition: 'A structure inside the cell, first discovered by Robert Brown.' },
    { term: 'plasma membrane', definition: "The thin outer layer of an animal cell, first reported by Theodore Schwann in 1839." },
    { term: 'cell wall', definition: 'A structure surrounding plant cells; Theodore Schwann concluded from his study of plant tissues that this is a feature unique to plant cells.' },
    { term: 'cell theory', definition: 'The theory that (i) all living organisms are composed of cells and products of cells, and (ii) all cells arise from pre-existing cells — built by Schleiden and Schwann, given its final form by Virchow.' },
    { term: 'Omnis cellula-e cellula', definition: 'Latin for "every cell from a cell" — the phrase Rudolf Virchow (1855) used to explain that new cells form only by division from pre-existing cells.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'An antique brass microscope on a dark wooden table, lit by a single candle, with a faint glowing impression of a cell above the eyepiece',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single antique brass microscope sits on a dark wooden table, softly lit by one warm candle flame beside it, in an otherwise dim study at night. Faint, softly glowing translucent circular shapes are suggested in the darkness above the eyepiece, like an out-of-focus impression of something being seen for the very first time, without becoming a literal labelled diagram. Deep shadows fill the rest of the frame, with subtle warm highlights on the microscope's brass fittings. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Cell Was Invisible Until One Man Looked',
      markdown: "Every living thing you have ever seen — including the one holding this sentence in front of your eyes right now — is built from a unit that no human being knew existed for most of human history. Nobody could see it, describe it, or even guess it was there, until one person did: **Antonie Von Leeuwenhoek**, who became the first person to see and describe a living cell.",
    },
    // ── 2 · Core concept — what qualifies as a cell ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Take any **unicellular organism** — a single cell living entirely on its own. It doesn't need any other cell to survive. It can do two things by itself: (i) it can **exist independently**, and (ii) it can **perform every essential function of life** — feeding, respiring, reproducing, responding to its surroundings — without help from anything else.\n\nNow imagine breaking that one cell apart, so what's left is less than a complete cell — a stray fragment of it. **Anything less than a complete structure of a cell does not ensure independent living.** A half-cell can't do what a whole cell does. That's exactly why the cell, and nothing smaller than it, gets to be called the **fundamental structural and functional unit of all living organisms** — from a single bacterium to every cell inside your own body.",
    },
    // ── 3 · Heading — history of discovery ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Who First Saw Inside a Living Cell?',
      objective: "By the end of this you can say who saw the first living cell, who found the nucleus inside it, and what instrument made both discoveries possible.",
    },
    // ── 4 · Text — Leeuwenhoek, Brown, microscope ────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Nobody could study something they couldn't see. That changed with **Antonie Von Leeuwenhoek** — he was the first person to actually **see and describe a live cell**. Later, **Robert Brown** looked more closely at what was sitting inside that cell and **discovered the nucleus**.\n\nNeither discovery would have been possible without the instrument behind both of them: the **microscope**. As microscopes kept improving — eventually leading to the **electron microscope** — every structural detail inside the cell that biologists take for granted today became visible for the first time.",
    },
    // ── 5 · Heading — Cell Theory ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Cell Theory — Three Scientists, One Idea, Built Over Two Decades',
      objective: "By the end of this you can state who contributed what to the cell theory, in what order, and recite the modern two-line version exactly.",
    },
    // ── 6 · Text — Schleiden 1838 ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "In **1838**, German botanist **Matthias Schleiden** examined a large number of different **plants** under the microscope. Across every one of them, he found the same pattern: **all plants are composed of different kinds of cells**, and those cells form the plant's **tissues**.",
    },
    // ── 7 · Text — Schwann 1839 ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "At about the same time, German zoologist **Theodore Schwann (1839)** was studying **animal cells** instead. He reported something Schleiden hadn't: animal cells had a **thin outer layer**, which we now call the **plasma membrane**. Because Schwann had also studied **plant tissues**, he could compare the two — and concluded that a **cell wall** is a feature **unique to plant cells**; animal cells don't have one.\n\nPutting these two observations together, Schwann proposed the hypothesis that the bodies of both animals and plants are composed of **cells and products of cells**.",
    },
    // ── 8 · Text — theory formed, the gap, Virchow closes it ──────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Schleiden's plant work and Schwann's animal work, taken together, became the **cell theory**. But there was a hole in it: neither of them could explain **how a new cell actually forms** in the first place.\n\nThat gap stayed open until **1855**, when **Rudolf Virchow** explained that cells **divide**, and new cells form only from **pre-existing cells** — a rule he stated in Latin as ***Omnis cellula-e cellula***, \"every cell from a cell.\" Virchow's addition modified Schleiden and Schwann's hypothesis into the **final shape** of the cell theory — the version still taught today:\n\n(i) All living organisms are composed of cells and products of cells.\n(ii) All cells arise from pre-existing cells.",
    },
    // ── 9 · Reasoning prompt — scientist-attribution check ────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "Read these four statements about the history of cell biology. Exactly one of them mismatches a scientist with a discovery that actually belongs to someone else. Which one?",
      options: [
        "Antonie Von Leeuwenhoek was the first person to see and describe a living cell, and Robert Brown later discovered the nucleus inside it.",
        "Matthias Schleiden studied animal cells in 1838 and used them to report that cells have a thin outer layer called the plasma membrane.",
        "Theodore Schwann concluded, from his study of plant tissues, that a cell wall is a feature unique to plant cells.",
        "Rudolf Virchow explained in 1855 that new cells arise from pre-existing cells through division, giving cell theory its final form.",
      ],
      reveal: "Statement 2 is the mismatch. Matthias Schleiden's 1838 work was on plants, not animals — he's the one who found that plants are built from different kinds of cells that form plant tissues. The 'thin outer layer' finding — what we now call the plasma membrane — belongs to Theodore Schwann, from his 1839 study of animal cells. The other three are correctly matched: Leeuwenhoek did see the first living cell, with Brown finding the nucleus afterward; Schwann's plant-tissue study is exactly how he concluded the cell wall is unique to plants; and Virchow's 1855 explanation is exactly what completed the cell theory.",
      difficulty_level: 2,
    },
    // ── 10 · Table — scientist-to-discovery matching ──────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'Every discovery behind the cell theory, matched to the scientist who made it',
      headers: ['Scientist', 'Year', 'Contribution'],
      rows: [
        ['Antonie Von Leeuwenhoek', '—', 'First saw and described a living cell'],
        ['Robert Brown', '—', 'Discovered the nucleus'],
        ['Matthias Schleiden', '1838', 'Examined many plants; found all plants are built from different kinds of cells forming plant tissues'],
        ['Theodore Schwann', '1839', 'Studied animal cells — found the thin outer layer (plasma membrane); from plant tissues, concluded the cell wall is unique to plants; proposed animals and plants are made of cells and products of cells'],
        ['Rudolf Virchow', '1855', 'Explained new cells form only from pre-existing cells by division (Omnis cellula-e cellula); gave cell theory its final form'],
      ],
    },
    // ── 11 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Modern Cell Theory** (final form, after Virchow):\n  (i) All living organisms are composed of cells and products of cells.\n  (ii) All cells arise from pre-existing cells.\n- **Cell** = the fundamental structural and functional unit of all living organisms — nothing less than a complete cell can exist independently.\n- **Leeuwenhoek** → first saw and described a living cell. **Robert Brown** → discovered the nucleus.\n- **Schleiden (1838)** → studied plants, found they're built from different kinds of cells. **Schwann (1839)** → studied animals, found the plasma membrane; from plant tissues, found the cell wall is plant-only.\n- **Virchow (1855)** → closed the gap Schleiden and Schwann left open: new cells arise from pre-existing cells, not from nothing.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Memorise the modern cell theory verbatim — NEET quotes it directly:** (i) all living organisms are composed of cells and products of cells (ii) all cells arise from pre-existing cells.\n\n**Keep the sequence straight:** Schleiden studied plants (1838) → Schwann studied animals (1839) and the two findings together formed the cell theory → that theory couldn't explain where new cells come from → Virchow (1855) closed exactly that gap. Swapping which scientist studied plants vs animals, or reversing this order, is the single most common way this history gets tested wrong.\n\n**Classic NEET question:** \"Which scientist explained that new cells arise from pre-existing cells?\" → **Rudolf Virchow (1855)** — not Schleiden or Schwann, whose cell theory left this exact question unanswered.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now know what qualifies as a cell, and exactly how the modern cell theory came together, scientist by scientist. Next, you'll open up a real cell itself — starting with the parts every plant and animal cell shares in common.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, what makes a cell the fundamental structural and functional unit of all living organisms?",
          options: [
            "Every cell contains a nucleus, and the nucleus alone can survive independently",
            "Cells are the smallest structures visible under a compound microscope",
            "A unicellular organism can exist independently and perform every essential function of life on its own; nothing less than a complete cell can manage this",
            "Every multicellular organism is built from exactly one specialised cell that does all the work",
          ],
          correct_index: 2,
          explanation: "NCERT's reasoning is specific: a unicellular organism can (i) exist independently and (ii) perform every essential function of life by itself — and anything less than a complete cell fails at both. That's the actual argument for calling the cell the fundamental unit, not anything about the nucleus surviving alone, microscope visibility, or multicellular organisms having one do-everything cell.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Who first saw and described a living cell, and who later discovered the nucleus?",
          options: [
            "Antonie Von Leeuwenhoek first saw and described a living cell; Robert Brown later discovered the nucleus",
            "Robert Brown first saw a living cell; Antonie Von Leeuwenhoek later discovered the nucleus",
            "Matthias Schleiden first saw a living cell; Theodore Schwann later discovered the nucleus",
            "Rudolf Virchow first saw a living cell; Robert Brown later discovered the nucleus",
          ],
          correct_index: 0,
          explanation: "Leeuwenhoek's discovery came first — he was the first to see and describe a living cell. Robert Brown's discovery of the nucleus came later. Swapping these two names, or substituting Schleiden, Schwann, or Virchow — who belong to a different part of this history, the cell theory itself — is the trap here.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement about Theodore Schwann's 1839 work is correct?",
          options: [
            "He discovered the nucleus while examining animal cells under a microscope",
            "He studied plant cells and reported that a cell wall surrounds every plant and animal cell",
            "He proved that new cells arise only from pre-existing cells, completing the cell theory",
            "He studied animal cells and reported a thin outer layer, now known as the plasma membrane; based on plant tissue studies, he concluded the cell wall is unique to plant cells",
          ],
          correct_index: 3,
          explanation: "Schwann's actual 1839 contribution is option 4: animal cells studied for the plasma membrane, plant tissues used separately to conclude the cell wall is a plant-only feature. Option 2 wrongly extends the cell wall to animal cells too. Option 3 is Virchow's 1855 contribution, not Schwann's. Option 1 is Robert Brown's discovery, unrelated to Schwann.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Schleiden and Schwann's cell theory had a gap. What was it, and who closed it?",
          options: [
            "It couldn't explain why plant cells have a cell wall and animal cells don't; Robert Brown closed this gap by discovering the nucleus",
            "It couldn't explain how new cells are formed; Rudolf Virchow closed this gap in 1855 by showing that cells divide and new cells arise from pre-existing cells",
            "It couldn't explain what a cell is made of; Antonie Von Leeuwenhoek closed this gap by describing the first living cell",
            "It couldn't explain the difference between unicellular and multicellular organisms; Matthias Schleiden closed this gap through his 1838 plant studies",
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: Schleiden and Schwann's cell theory did not explain how new cells were formed. Virchow closed exactly that gap in 1855, explaining that cells divide and new cells arise from pre-existing cells (Omnis cellula-e cellula) — this is what gave the cell theory its final, modern form. The other options invent gaps NCERT never describes and misattribute the fix to the wrong scientist.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
