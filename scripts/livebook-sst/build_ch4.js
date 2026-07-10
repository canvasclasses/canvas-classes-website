'use strict';
// Class 9 Social Science — Chapter 4 "Early Humans and Beginning of Civilisation" (HISTORY).
// Source: ~/Downloads/Class 9 Social science/iest104.pdf (34pp). First History chapter — follows the
// History adaptations in _agents/workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md §6: timelines for
// chronology, evidence-first framing (ties to Ch1 source types), narrative storytelling voice,
// perspective_scenario (not you_solve_it) as the eventual flagship, no physical-process sims.
// Golden rule still applies: RE-TEACH, never reword. English-only, images src:'' + prompt,
// published:false. Idempotent (stable ids); PAGES grows batch by batch.
// BATCH 1 (this file): pages 1–3 (how-we-know, human family tree, the Stone Age).

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CHAPTER_NUMBER = 4;
const HERO_STYLE = 'Dark cinematic background, atmospheric Indian-illustration style, painterly, no text overlay.';

function hero(prompt) { return { id: uuid(), type: 'image', order: 0, src: '', alt: 'Hero banner', caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: `${prompt} ${HERO_STYLE}` }; }
function text(markdown) { return { id: uuid(), type: 'text', order: 0, markdown }; }
function heading(txt, level = 2) { return { id: uuid(), type: 'heading', order: 0, text: txt, level }; }
function callout(variant, title, markdown) { return { id: uuid(), type: 'callout', order: 0, variant, title, markdown }; }
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') { return { id: uuid(), type: 'image', order: 0, src: '', alt, caption, width: 'full', aspect_ratio, generation_prompt: `${generation_prompt} Dark background, orange accent labels, clean technical illustration style.` }; }
function curiosityPrompt(prompt, hint, reveal) { return { id: uuid(), type: 'curiosity_prompt', order: 0, prompt, hint, reveal }; }
function reasoningPrompt(reasoning_type, prompt, options, reveal, difficulty_level) { return { id: uuid(), type: 'reasoning_prompt', order: 0, reasoning_type, prompt, options, reveal, difficulty_level }; }
function guidedReveal(title, intro, steps, outro) { const b = { id: uuid(), type: 'guided_reveal', order: 0, title, steps: steps.map((s) => ({ id: uuid(), kind: 'point', ...s })) }; if (intro !== undefined) b.intro = intro; if (outro !== undefined) b.outro = outro; return b; }
function timeline(title, orientation, events) { return { id: uuid(), type: 'timeline', order: 0, title, orientation, events: events.map((e) => ({ id: uuid(), ...e })) }; }
function comparisonCard(title, columns) { return { id: uuid(), type: 'comparison_card', order: 0, title, columns }; }
function quiz(questions) { return { id: uuid(), type: 'inline_quiz', order: 0, pass_threshold: 0.67, questions: questions.map((q) => ({ id: uuid(), ...q })) }; }
function careerSpotlight(title, intro, careers, closing) { return { id: uuid(), type: 'career_spotlight', order: 0, title, intro, careers: careers.map((c) => ({ id: uuid(), ...c })), closing }; }
function perspectiveScenario(c) {
  return { id: uuid(), type: 'perspective_scenario', order: 0, title: c.title, role_frame: c.role_frame,
    event_context: c.event_context, image_src: '', image_prompt: c.image_prompt, image_caption: c.image_caption,
    source_note: c.source_note, prompt: c.prompt,
    options: c.options.map((o) => ({ id: uuid(), ...o })), synthesis: c.synthesis };
}
function withOrders(blocks, slug) { return blocks.map((b, i) => ({ ...b, order: i, id: `${slug}__b${i}` })); }

// ─────────────────────────────────────────────────────────────────────────────
const p1 = {
  slug: 'a-history-with-no-books',
  title: 'A History With No Books',
  subtitle: "How we can know about people who lived long before anyone could write a single word.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). An archaeological excavation at dusk — a trench in the earth revealing ancient stone tools and bones, archaeologists brushing away soil, layers of history exposed in the dig walls."),
    curiosityPrompt(
      "Almost everything you know about the last few thousand years, somebody wrote down. But human beings existed for *millions* of years before anyone could write a single word. Before reading on — how do you think we can possibly know anything at all about people who left no letters, no books, no records?",
      "They didn't leave words. But they left other things behind.",
      "They left **things** — stone tools, bones, ashes from old fires, paintings on cave walls. Reading those physical clues, instead of reading words, is the detective work of **archaeology**, and it's how we recover a history that was never written down."
    ),
    text(
      "History feels like it's made of written records — dates, names, documents. But writing is only about **5,000 years old**, while our human story stretches back **millions of years**. That means for more than **99% of the time humans have existed, nobody could write anything down.** So how do we know about all those ages before the first word was ever put to clay or stone?"
    ),
    text(
      "The answer is that early people left behind **objects**, not words. **Archaeologists** dig carefully through the layers of the earth and uncover the things our ancestors made and used — **stone tools, bones, pottery, beads, cave paintings** — and read them like a detective reads clues at a scene. They even do **experimental archaeology**: making exact copies of ancient tools and using them, to work out how they were made and what they were for. Piece by piece, these silent objects are made to tell the story of people who never spoke to us in writing.\n\n(You met this same idea in Chapter 1, where historians sorted their evidence into literary, archaeological, epigraphic and numismatic sources. For the ages before writing, it is almost entirely the *archaeological* kind that survives.)"
    ),
    heading('The Great Divide — Before and After Writing'),
    text(
      "The invention of writing splits the whole human story into two very unequal halves. It was such a turning point that the long age *before* it is often called **pre-history**, and the age *after* it — roughly the last 5,000 years — the **historical period**. The difference isn't just about words; it changes how much we can ever know."
    ),
    comparisonCard('Before and After the Invention of Writing', [
      { heading: 'Before Writing', color: '#f59e0b', points: [
        'Covers more than 99% of the human story — from about 3 million years ago until roughly 5,000 years ago.',
        'We rely almost entirely on material remains: tools, bones and other objects.',
        "It is hard to know people's actual thoughts and ideas.",
        'Dates are only approximate — we can rarely pin an event to an exact year.',
      ] },
      { heading: 'After Writing', color: '#34d399', points: [
        'Covers less than 1% of the human story — only the last 5,000 years, including today.',
        'We have both material remains AND written documents to draw on.',
        'Literature records names, events, and social, political and cultural life.',
        'Dates become far more precise, because documents mention specific years for coronations, wars and more.',
      ] },
    ]),
    callout('india_science', 'India\'s Unread Writing — the Sindhu Script',
      "Some of the earliest writing in the world belongs to India's own **Sindhu–Sarasvatī (Harappan) Civilisation** — short inscriptions carved on seals and pottery over 4,000 years ago, sometimes called the **Sindhu lipi**. And here's the mystery: unlike Sumerian **cuneiform** or Egyptian **hieroglyphics**, which scholars have cracked, **the Harappan script has never been deciphered.** We can see the symbols but we still can't *read* them — so one of India's greatest ancient civilisations is, in a sense, still trying to speak to us across the centuries."
    ),
    reasoningPrompt('logical',
      "Archaeologists find an ancient settlement with plenty of stone tools, animal bones and pottery — but not a single scrap of writing. Based on this page, what can they still learn, and what will be hardest to know?",
      [
        "They can reconstruct how people lived — what they ate, the tools they used, how they worked — from the objects; but their actual thoughts, names and exact dates will be very hard to recover without writing",
        "They can learn nothing at all, because history is impossible to study without written records",
        "They can recover the people's exact names and the precise years they lived, just from the pottery",
        "They can only learn about the people's religion, and nothing about their daily life or tools",
      ],
      "Objects are brilliant at revealing *how people lived* — diet, tools, work, settlement. What they can't easily give up are people's inner thoughts, their names, and precise dates — exactly the things writing later unlocks. That's the 'before writing' half of the divide.",
      2
    ),
    quiz([
      { question: "For roughly what share of the human story did people have NO way to write things down?", difficulty_level: 1, correct_index: 2,
        options: [
          "Only the last 5,000 years, a very small slice",
          "Exactly half of all human history",
          "More than 99% of it — writing is only about 5,000 years old",
          "None of it — humans have always been able to write",
        ],
        explanation: "Writing is only ~5,000 years old, so for over 99% of the human story there were no written records." },
      { question: "What is 'experimental archaeology,' as described on this page?", difficulty_level: 2, correct_index: 1,
        options: [
          "Guessing what happened in the past without using any evidence at all",
          "Making and using exact copies of ancient tools to learn how they were made and used",
          "Reading ancient written documents to check them against each other",
          "Digging up a site as fast as possible before recording anything",
        ],
        explanation: "Experimental archaeology means recreating and using ancient tools to understand how early people made and depended on them." },
      { question: "Cuneiform and hieroglyphics have been deciphered, but the Harappan (Sindhu) script has not. Based on this page, what does that mean for us?", difficulty_level: 3, correct_index: 0,
        options: [
          "We can see the Harappan symbols but still cannot read them, so this great Indian civilisation's own words remain a genuine unsolved mystery",
          "The Harappan script is definitely just decoration and was never real writing",
          "We understand the Harappan script perfectly and it tells us the names of all their kings",
          "The Harappan script is younger than cuneiform and so was never worth studying",
        ],
        explanation: "The Harappan script survives on seals and pottery but remains undeciphered — unlike cuneiform and hieroglyphics — so its meaning is still unknown." },
    ]),
  ], 'a-history-with-no-books'),
};

const p2 = {
  slug: 'the-human-family-tree',
  title: 'The Human Family Tree',
  subtitle: "How our ancestors changed over millions of years — and how they walked out of Africa to fill the world.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A line of early human ancestors evolving across a savanna at dawn — from a small stooping australopithecine to an upright, tool-carrying modern human — silhouetted against a golden sky."),
    curiosityPrompt(
      "You didn't appear on Earth fully formed — and neither did humanity. If you could trace your family tree back not hundreds, but *millions* of years, what do you think your earliest 'relatives' would have looked like, and how would they have lived?",
      "Think smaller-brained, but already clever enough to do one world-changing thing with their hands.",
      "Your earliest ancestors were upright-walking, tool-making relatives who lived in Africa millions of years ago. They changed — slowly, over an almost unimaginable stretch of time — into us. Following that gradual change, branch by branch, is what this page is about."
    ),
    text(
      "Human beings are the result of **millions of years of gradual change**, and that change came in two intertwined kinds. **Biological evolution** is the slow shift in bodies and genes — the way early ape-like ancestors called **australopithecines** (from *australis*, 'southern', and *pithecus*, 'primate') changed, over ages, into modern humans, **Homo sapiens**. **Cultural evolution** is what humans *learned* to do to survive — making tools, using fire, sheltering and clothing themselves, and adapting cleverly as the climate shifted through the long **Quaternary Period** (the last 2.6 million years, right up to today)."
    ),
    text(
      "Our ancestors and close relatives are together called **hominins** — and the thing that sets them apart is that they were **tool-makers**. The very first stone tools, made about **3.3 million years ago**, mark the beginning of what scientists call true 'human behaviour,' something no other animal manages. Those tools were so important that they've been called **'extra-corporal limbs'** — extra body parts, letting a hominin cut, dig and pound in ways bare hands never could."
    ),
    heading('Meet the Ancestors'),
    timeline('From Homo habilis to Homo sapiens', 'vertical', [
      { label: 'Homo habilis — the "handy man"', detail: "Lived in Africa (Olduvai Gorge, Tanzania and Kenya) around 2 million years ago. Made simple chopper stone tools — among the earliest tool-makers." },
      { label: 'Homo erectus — the great traveller', detail: "An upright ancestor from around 2 million years ago who made better tools — handaxes and cleavers — and became the first hominin to walk out of Africa, spreading across Asia and Europe." },
      { label: 'Homo neanderthalensis', detail: "Lived in Europe and South-West Asia until about 40,000 years ago. Made refined Middle Palaeolithic flake tools, but eventually died out." },
      { label: 'Homo sapiens — us', detail: "Evolved in Africa around 300,000 years ago. The only human species alive today, and the one that went on to develop complex tools, art and, much later, writing." },
    ]),
    heading('Out of Africa'),
    text(
      "Almost all scientists agree that our earliest ancestors evolved in **Africa**, and then began to spread across the world. The first to leave was **Homo erectus**, walking out around **2 million years ago** and reaching far into Asia and Europe over the next million and a half years. Much later, around **125,000 years ago**, a fresh wave set out — this time of early **Homo sapiens**, our own kind, who had appeared in Africa around 300,000 years ago. From that African cradle, *Homo sapiens* eventually spread to every corner of the Earth — the only human species left standing."
    ),
    image(
      'Map of early human dispersal out of Africa',
      '📸 Out of Africa — how early humans spread across the world',
      "A world map showing the early dispersal of humans out of Africa, with arrows tracing routes from East Africa (Olduvai Gorge) up through the Nile Valley and the Levant, then branching across Asia to India, China and Australia, and into Europe. Mark key sites and label the routes as early Homo dispersal."
    ),
    reasoningPrompt('logical',
      "Looking at the sequence from Homo habilis to Homo sapiens, a student notices the tools get more and more sophisticated at each stage. Based on this page, what does that best illustrate?",
      [
        "Cultural evolution — as ancestors advanced, what they could make and do improved, from simple choppers to handaxes to refined flake tools and beyond",
        "That every human species made exactly the same tools, so nothing really changed over time",
        "That tools have nothing to do with human ancestors and appeared by accident",
        "That Homo sapiens made the very first tools, and all earlier species had none",
      ],
      "The rising tool sophistication across the sequence is cultural evolution in action — each stage *learned* to make and do more, from Homo habilis's choppers to Homo sapiens's complex technology. (Biological evolution changed their bodies; cultural evolution changed their skills.)",
      2
    ),
    quiz([
      { question: "Which is the only human species still living on Earth today?", difficulty_level: 1, correct_index: 3,
        options: [
          "Homo habilis, the handy man",
          "Homo erectus, the first to leave Africa",
          "Homo neanderthalensis, of Europe and South-West Asia",
          "Homo sapiens — modern humans, us",
        ],
        explanation: "Homo sapiens is the only surviving human species; the others died out." },
      { question: "What is the key difference between biological and cultural evolution, as described here?", difficulty_level: 2, correct_index: 0,
        options: [
          "Biological evolution is the slow change in bodies and genes; cultural evolution is what humans learned to do — tools, fire, adapting to survive",
          "Biological evolution is about tools, while cultural evolution is about the shape of the skull",
          "They are two names for exactly the same process of making stone tools",
          "Biological evolution happened only in Africa, and cultural evolution only in Europe",
        ],
        explanation: "Biological = physical/genetic change over time; cultural = the learned skills and adaptations humans developed to survive." },
      { question: "Which hominin was the first to migrate out of Africa, and roughly when?", difficulty_level: 2, correct_index: 1,
        options: [
          "Homo sapiens, around 40,000 years ago",
          "Homo erectus, around 2 million years ago",
          "Homo neanderthalensis, around 300,000 years ago",
          "Homo habilis, around 5,000 years ago",
        ],
        explanation: "Homo erectus was the first hominin to leave Africa, around 2 million years ago." },
    ]),
  ], 'the-human-family-tree'),
};

const p3 = {
  slug: 'the-stone-age',
  title: 'The Stone Age',
  subtitle: "How historians organise three million years with no kings and no countries — by the tools people made.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A sweep of stone tools laid out in a line from crude to refined — rough choppers, then shaped handaxes, then tiny delicate microliths and a polished Neolithic axe — against dark earth, telling the story of improving skill."),
    curiosityPrompt(
      "How do you organise a story that lasts *three million years*? You can't use kings or countries or dates — for almost all of it, there were none. So historians reached for the one thing that kept changing and improving the whole way through. Before reading on — what single thing do you think they used to divide up early human history?",
      "It's the same thing that made hominins special in the first place.",
      "They used **tools** — and especially the materials tools were made from. Because toolmaking steadily advanced, historians carve early human history into ages named after those tools: the **Stone Age**, then the ages of metal. That framework is what this page lays out."
    ),
    text(
      "With no written records and no kingdoms to mark the years, historians divide early human history by **technology** — mainly the tools people made and the way they got their food. The earliest and by far the longest stretch is the **Stone Age**, named because tools were made of stone (*palaeo* means 'old' and *lithic* means 'stone,' so *Palaeolithic* is the 'Old Stone Age'). It is split into three stages, after which humans learned to work **metals**, opening the ages of copper, bronze and iron."
    ),
    timeline('The Ages of Early Human History', 'horizontal', [
      { label: 'Palaeolithic (Old Stone Age)', detail: 'A hunting-and-gathering life, using simple, rough stone tools. By far the longest period.' },
      { label: 'Mesolithic', detail: 'A transitional stage using tiny "microlithic" (small stone) tools, between hunting-gathering and farming.' },
      { label: 'Neolithic (New Stone Age)', detail: 'The shift to farming and settled village life — domesticating animals and plants, and using polished stone tools.' },
      { label: 'Chalcolithic (Copper–Stone Age)', detail: 'Copper tools used alongside stone — the first metalworking (extracting and shaping metal).' },
      { label: 'Bronze Age', detail: 'Bronze (copper mixed with tin) is made; trade, towns and the first great civilisations expand.' },
      { label: 'Iron Age', detail: 'Iron is smelted and worked into stronger tools and weapons, supporting more advanced societies.' },
    ]),
    heading('The Turning Point — the Neolithic Revolution'),
    text(
      "One change in that long list mattered more than all the others: the **Neolithic Revolution**, when humans shifted from *hunting and gathering* their food to *growing and raising* it. It sounds simple, but it remade human life from the ground up — people stopped wandering after food and settled into **villages**, learned to store a surplus, and set in motion the chain of events that would one day lead to towns, cities and civilisations. We'll follow that revolution closely in the pages ahead."
    ),
    guidedReveal(
      'The Three Stages of the Stone Age', 'The Stone Age alone spans most of the human story — in three stages:',
      [
        { kicker: 'Old Stone Age', headline: 'Palaeolithic', body: "The longest stage by far. People lived entirely by hunting animals and gathering wild plants, using large, roughly-shaped stone tools like handaxes and cleavers." },
        { kicker: 'Middle', headline: 'Mesolithic', body: "A transitional stage, as the climate warmed. People made tiny, finely-worked stone tools called microliths, fished, and began to settle in richer landscapes — but hadn't yet started farming." },
        { kicker: 'New Stone Age', headline: 'Neolithic', body: "The great shift to farming. People domesticated animals and plants, built the first villages, made polished stone tools and pottery — the beginning of settled life." },
      ]
    ),
    callout('threads_of_curiosity', 'Why Call It a "Revolution"?',
      "A revolution usually means a fast, dramatic overthrow — yet the shift to farming took *thousands* of years and happened at different times in different places. So why call it a revolution? Because of how *completely* it changed human life: once people could grow their own food, almost everything else followed — permanent homes, storing surplus, larger populations, and eventually kings, taxes and cities. Few changes in the whole human story reshaped the world more. What do you think early people *gained* — and what might they have *lost* — by giving up the wandering hunter's life?"
    ),
    reasoningPrompt('logical',
      "A historian labels a period the 'Bronze Age.' Based on this page, what does that name actually tell you about the people who lived then?",
      [
        "That their toolmaking had advanced to making bronze (copper mixed with tin) — and, along with it, expanding trade, towns and early civilisations",
        "That they had no tools at all and lived exactly as Palaeolithic people did",
        "That the period is named after a king called Bronze who ruled at the time",
        "That they had already invented writing and left detailed written records",
      ],
      "The ages are named for their toolmaking technology. 'Bronze Age' means people were making bronze — a mark of advanced metalworking that came bundled with growing trade, towns and the first civilisations.",
      2
    ),
    quiz([
      { question: "On what basis do historians divide up early human history?", difficulty_level: 1, correct_index: 1,
        options: [
          "By the kings and empires that ruled each period",
          "By technology — mainly the tools people made and how they got their food",
          "By the written records people left behind at the time",
          "By the exact calendar years, which were carefully recorded",
        ],
        explanation: "With no kings or writing for most of it, historians divide early history by technology — the tools and food-getting methods." },
      { question: "Which change does the page identify as the single biggest turning point in early human history?", difficulty_level: 2, correct_index: 2,
        options: [
          "The invention of the bow and arrow during the Palaeolithic",
          "The first migration of Homo erectus out of Africa",
          "The Neolithic Revolution — the shift from hunting-gathering to farming and settled village life",
          "The discovery of iron during the Iron Age",
        ],
        explanation: "The Neolithic Revolution — the move to farming and settled villages — is framed as the great turning point that led toward towns and cities." },
      { question: "The Neolithic is called a 'revolution' even though it took thousands of years. Based on this page, what best justifies that word?", difficulty_level: 3, correct_index: 0,
        options: [
          "It changed human life so completely — settled villages, stored surplus, bigger populations — that it set the whole path toward towns and cities",
          "It happened overnight, faster than any other change in history",
          "It was led by a single famous revolutionary leader",
          "It only affected the kinds of stone tools people made, and nothing else",
        ],
        explanation: "It's called a revolution for the *depth* of its impact, not its speed — farming remade how humans lived and opened the road to cities." },
    ]),
  ], 'the-stone-age'),
};

const p4 = {
  slug: 'the-first-hunters',
  title: 'The First Hunters — Life in the Old Stone Age',
  subtitle: "How the earliest people in India survived by hunting and gathering — and the first sparks of art and imagination.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A Palaeolithic hunting scene at dawn on the Indian subcontinent — a small band of early humans with stone-tipped spears stalking deer across a rocky grassland, a rock shelter in the background."),
    curiosityPrompt(
      "Imagine surviving with no farms, no shops, no houses — everything you eat you must find or catch, and every tool you own you must chip from a stone. Before reading on: what do you think would matter most to a person living this way, and how might a single well-made stone tool change their life?",
      "Think about a sharp edge — for cutting, digging, scraping — that your bare hands could never make.",
      "For a hunter-gatherer, a good stone tool was everything: it could butcher an animal, dig up roots, scrape a hide for warmth, or crack a bone for the rich marrow inside. This page is about the people who lived by hunting and gathering — the **Palaeolithic**, or Old Stone Age — including India's very first inhabitants."
    ),
    text(
      "For almost the whole of human history, people lived by **hunting animals and gathering wild plants** — the way of life of the **Palaeolithic**, the Old Stone Age. In the Indian subcontinent, this story reaches astonishingly far back: the **oldest human settlements date to about 2 million years ago.** At **Attirampakkam** in Tamil Nadu, tools have been dated to roughly 1.5–1.7 million years ago, and at **Isampur** in Karnataka to about 1.2 million years ago — real places you can point to on a map where India's first people once worked."
    ),
    image(
      'Map of major early human sites in the Indian subcontinent',
      '📸 Where India\'s earliest people lived',
      "A map of the Indian subcontinent marking major early human (Palaeolithic, Mesolithic and Neolithic) sites — including Attirampakkam (Tamil Nadu), Isampur (Karnataka), Bhimbetka (Madhya Pradesh), Mehrgarh, and others — with a legend distinguishing the site types."
    ),
    text(
      "At these sites, archaeologists have found animal fossils together with tools of quartzite and limestone — big **handaxes** and **cleavers**, and smaller **scrapers** and **choppers**. Each had a job: to chop animal meat, dig out tubers, scrape skins clean, and cleave bones to reach the protein-rich **marrow** inside. Over time the toolmaking grew cleverer — people made smaller, sharper tools like scrapers, borers and **points**, which they fixed to sticks as spears and projectiles, hunting more efficiently. Later still came the **bow and arrow** and tiny, razor-sharp **microblades** struck from glassy stone."
    ),
    heading('The First Sparks of Imagination'),
    text(
      "The Old Stone Age wasn't only about survival. These were the first people to show what makes humans truly human: **imagination**. They developed **symbolic communication**, painted the walls of caves and rock shelters, decorated their own bodies with pigment, and made the first **beads** from stone, bone and shell. A person carefully drilling a bead or painting a running deer wasn't hunting or eating — they were creating, and expressing something. That spark is one of the oldest threads connecting them to you."
    ),
    guidedReveal(
      'A Toolkit That Kept Improving', 'Even in the Stone Age, technology advanced steadily:',
      [
        { kicker: 'earliest', headline: 'Handaxes & Cleavers', body: "Large, sturdy tools of quartzite and limestone — for chopping meat, digging tubers and cleaving bones to reach the marrow. The heavy-duty gear of the earliest hunters." },
        { kicker: 'refined', headline: 'Scrapers, Borers & Points', body: "Smaller, more specialised tools — scrapers for cleaning hides, borers for drilling, and sharp points fixed onto spears to hunt from a safer distance." },
        { kicker: 'advanced', headline: 'Bow, Arrow & Microblades', body: "The bow and arrow, plus tiny razor-sharp microblades set into handles — letting people hunt small, fast game with far greater skill." },
      ]
    ),
    reasoningPrompt('logical',
      "Archaeologists at an Old Stone Age site find carefully drilled beads of bone and shell, and traces of pigment, alongside the hunting tools. Based on this page, what is the most important thing these beads and pigments reveal?",
      [
        "That these early humans had imagination and made art and ornaments — expressing themselves, not just surviving — which is a distinctly human trait",
        "That the beads were actually a type of hunting weapon used against large animals",
        "That the site must belong to the modern period, since only modern people make jewellery",
        "That the people had already invented farming and no longer needed to hunt",
      ],
      "Beads and pigments aren't about food or survival — they're about *expression*. They show these early humans had imagination and a symbolic, artistic mind, one of the deepest markers of being human.",
      2
    ),
    quiz([
      { question: "How did people live during the Palaeolithic (Old Stone Age)?", difficulty_level: 1, correct_index: 0,
        options: [
          "By hunting animals and gathering wild plants, using stone tools",
          "By farming crops and raising domesticated animals in villages",
          "By trading goods between large cities using metal coins",
          "By mining and smelting iron to make weapons",
        ],
        explanation: "The Palaeolithic was a hunting-and-gathering way of life using stone tools." },
      { question: "Attirampakkam and Isampur are important because they show what?", difficulty_level: 2, correct_index: 1,
        options: [
          "That farming began in India earlier than anywhere else on Earth",
          "That the Indian subcontinent had human settlements reaching back over a million years",
          "That the first Indian cities were built during the Old Stone Age",
          "That writing was invented in India during the Palaeolithic",
        ],
        explanation: "Attirampakkam (~1.5–1.7 mya) and Isampur (~1.2 mya) show extremely ancient human presence in India." },
      { question: "Why does the page treat cave paintings and beads as so significant, beyond the hunting tools?", difficulty_level: 3, correct_index: 2,
        options: [
          "Because they were the sharpest tools used for hunting large animals",
          "Because they prove these people had already invented writing",
          "Because they reveal imagination and self-expression — a distinctly human ability that survival alone doesn't require",
          "Because they show the people had stopped hunting entirely",
        ],
        explanation: "Art and ornament reflect imagination and symbolic thought — a defining human trait, separate from mere survival." },
    ]),
  ], 'the-first-hunters'),
};

const p5 = {
  slug: 'the-mesolithic-and-the-first-art',
  title: 'A Warmer World — the Mesolithic',
  subtitle: "When the ice retreated, life bloomed, and humans painted their world onto the walls of Bhimbetka.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A Mesolithic rock shelter in central India glowing at sunset, its walls covered in ochre-red paintings of hunters, dancers and animals, a small group of people gathered below with tiny stone-tipped tools and fishing gear."),
    curiosityPrompt(
      "Around 12,000 years ago, the Earth quietly warmed, the great ice sheets shrank, and forests and grasslands spread across lands that had been frozen. Before reading on: how do you think a warmer, greener, richer world would have changed the lives of people who lived entirely off the land?",
      "More plants and animals means more food — and what does more food usually lead to?",
      "A warmer world meant far more food — small game, fish, and wild grains everywhere — and that abundance triggered the **first population explosion** in human history. This richer, in-between age, after the Old Stone Age but before farming, is the **Mesolithic**, and it's also when human art truly blossomed."
    ),
    text(
      "About **12,000 years ago**, Earth's climate became warmer. The ice retreated, and forests and grasslands spread into places that had been locked under ice. This new, greener world offered a much wider variety of resources — small game animals, fish, and edible wild grains. With so much more food available, the human population grew as never before: the world saw its **first-ever population explosion.**"
    ),
    text(
      "People adapted with a new toolkit of tiny stone tools called **microliths** — small, sharp blades often set into wooden or bone handles. **Fishing** became a mainstay of life, from both the sea and freshwater. This in-between age — no longer purely Old Stone Age hunters, not yet farmers — is called the **Mesolithic** (the Middle Stone Age)."
    ),
    heading('The First Art Galleries'),
    text(
      "With life a little more settled and secure, people began to occupy **caves and rock shelters** — and to decorate them. Mesolithic art *flourished*. The single greatest treasure of this age in India is **Bhimbetka**, in Madhya Pradesh: a **UNESCO World Heritage Site** with **hundreds of painted rock shelters**, their walls alive with ochre-red scenes of hunting, dancing, animals and daily life, painted by people who lived there across the Mesolithic and even earlier. Standing before them today, you are looking at some of the oldest art in India — a message, in pictures, from tens of thousands of years ago."
    ),
    callout('india_science', 'Bhimbetka — A Message in Pictures',
      "The rock shelters of **Bhimbetka**, near Bhopal, hold one of the largest and oldest collections of prehistoric art in the world — hundreds of shelters painted over an astonishing span of time. The scenes show hunters with bows, herds of animals, group dances and everyday moments. Because these people left no writing, these paintings *are* their story — which is exactly why archaeologists (and you) can still 'read' how they lived, purely from the pictures they left on the stone."
    ),
    reasoningPrompt('logical',
      "The page links the warming climate around 12,000 years ago to the first population explosion in human history. Based on the page, what is the chain of cause and effect?",
      [
        "A warmer climate expanded forests and grasslands, which offered more food (small game, fish, wild grains), and more food allowed the human population to grow rapidly",
        "A warmer climate melted all the rivers, forcing people to invent farming immediately to survive",
        "A warmer climate made hunting impossible, so people had far fewer children",
        "The population grew first, and only afterwards did the climate happen to warm up",
      ],
      "It's a clear chain: warming → forests and grasslands spread → more food (game, fish, grains) → the population could grow rapidly. Abundance drove the first population explosion.",
      2
    ),
    quiz([
      { question: "What major environmental change marks the start of the Mesolithic, about 12,000 years ago?", difficulty_level: 1, correct_index: 1,
        options: [
          "A sudden ice age that froze most of the Earth",
          "A warming climate, with forests and grasslands expanding as the ice retreated",
          "A series of massive volcanic eruptions worldwide",
          "The invention of farming and the first cities",
        ],
        explanation: "The Mesolithic began as the climate warmed ~12,000 years ago and forests and grasslands spread." },
      { question: "What is Bhimbetka, and why does it matter?", difficulty_level: 2, correct_index: 0,
        options: [
          "A UNESCO World Heritage Site in Madhya Pradesh with hundreds of painted rock shelters — some of India's oldest art",
          "The first farming village ever discovered in India",
          "An ancient city of the Sindhu–Sarasvatī Civilisation",
          "A cave where the earliest metal tools were found",
        ],
        explanation: "Bhimbetka is a World Heritage Site with hundreds of painted rock shelters — a priceless record of prehistoric life and art." },
      { question: "The page calls Bhimbetka's paintings a 'message in pictures.' Based on this page, what is the strongest reasoning behind that phrase?", difficulty_level: 3, correct_index: 2,
        options: [
          "Because the paintings contain a secret written code historians have decoded",
          "Because the paintings were made specifically to be seen by people in the future",
          "Because these people left no writing, so the paintings are how we can still learn how they lived — evidence read from images, not words",
          "Because the paintings show the same scenes as modern Indian cities",
        ],
        explanation: "With no writing to rely on, the paintings themselves are the evidence — a story of Mesolithic life told entirely in images." },
    ]),
  ], 'the-mesolithic-and-the-first-art'),
};

const p6 = {
  slug: 'the-neolithic-revolution',
  title: 'The Neolithic Revolution',
  subtitle: "The single most important change in the human story: the day people stopped chasing their food and started growing it.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A dawn scene at an early Neolithic village — round mud huts, a field of early millet, people tending goats and cattle, a woman shaping a clay pot, polished stone tools resting nearby — the first settled farming life."),
    curiosityPrompt(
      "For hundreds of thousands of years, humans chased their food — following herds, searching for wild plants, always on the move. Then some people did something that changed everything: instead of *finding* food, they started *making* it. Before reading on: how do you think a family's whole life would change the day they could grow their food in one spot instead of wandering to find it?",
      "If your food no longer moves, does your home need to?",
      "Once you can grow your own food in one place, you no longer have to wander — you can build a permanent home, store extra food for later, and live beside others doing the same. That single shift, from finding food to producing it, is the **Neolithic Revolution**, and it set humanity on the road to villages, towns and cities."
    ),
    text(
      "As hunter-gatherers grew familiar with the seasons and with different plants and animals, a slow but world-changing shift began: the move to a **food-producing** way of life, known as the **Neolithic Revolution** (the New Stone Age). Its hallmark was **domestication** — bringing selected **animals and plants under human control**, and, over generations, breeding new and better varieties through cultivation and animal husbandry. For the first time, humans were not just taking what nature offered; they were *shaping* it."
    ),
    text(
      "Everything followed from that. Where Old Stone Age people had made tools to *catch* food, Neolithic farmers made tools to *produce and process* it — including **polished stone tools** — and they created **earthenware pottery** in many shapes to cook and store their harvest. Above all, they built the **first village settlements**, putting down roots in one place. Those first villages were the seed of everything to come: they laid the foundations for the great **urban revolution** — the rise of towns and cities — that this book turns to next."
    ),
    heading('Not Everywhere at Once'),
    text(
      "Here's something that surprises people: the Neolithic Revolution did **not** happen everywhere at the same time, or with the same crops. It began independently in different regions, each domesticating whatever grew well there. Understanding that this great change unfolded gradually, in many places, is part of understanding how connected — and how varied — the early human world really was."
    ),
    timeline('Where Farming Began — and With What', 'horizontal', [
      { label: 'West Asia', detail: 'One of the earliest hearths of farming — domesticating wheat and barley, with early pottery, livestock and settled villages.' },
      { label: 'West Africa', detail: 'Farming centred on pearl millet, alongside livestock and settled life.' },
      { label: 'India (peninsular)', detail: 'Early farmers here domesticated millets, keeping livestock and building settled villages.' },
      { label: 'India — Ganga Plains', detail: 'The great rice-growing tradition took root here, with cultivation, pottery and agricultural settlements.' },
      { label: 'North & South China', detail: 'Millets in the north and rice along the Yangtze in the south — two more independent cradles of farming.' },
    ]),
    callout('threads_of_curiosity', 'The Biggest Trade-Off in History',
      "Farming gave humans enormous power — stored food, growing populations, permanent homes, and eventually cities. But it asked for something in return: farmers had to work harder and longer than hunter-gatherers, tie themselves to one piece of land, and risk everything on a good harvest. Some historians even argue early farmers were *less* healthy and free than the hunters before them. So was the Neolithic Revolution purely a step forward — or a bargain, with real costs alongside its gifts? What do you think a family gained, and what did they give up?"
    ),
    reasoningPrompt('logical',
      "The chart shows farming beginning at different times and with different crops across the world — wheat in West Asia, millets in India, rice in the Ganga Plains and South China. Based on this page, what does that best tell us?",
      [
        "The Neolithic Revolution wasn't a single event spreading from one place, but arose independently in several regions, each domesticating the plants that grew well locally",
        "Farming was invented once in West Asia and then simply copied everywhere else at the exact same time",
        "Only India ever developed farming, and all other regions remained hunter-gatherers",
        "The different crops prove that farming never really happened and people kept hunting",
      ],
      "Different crops, different regions, different times — that pattern shows farming emerged *independently* in several places, each people domesticating whatever suited their land. It wasn't one invention spreading from a single spot.",
      2
    ),
    quiz([
      { question: "What was the defining hallmark of the Neolithic Revolution?", difficulty_level: 1, correct_index: 2,
        options: [
          "The invention of iron tools and weapons",
          "The building of the first great cities and writing",
          "The domestication of animals and plants — producing food instead of only hunting and gathering it",
          "The first migration of humans out of Africa",
        ],
        explanation: "The Neolithic Revolution's hallmark was domestication — bringing plants and animals under human control to produce food." },
      { question: "How did the tools of Neolithic farmers differ in purpose from those of Old Stone Age hunters?", difficulty_level: 2, correct_index: 0,
        options: [
          "Hunters made tools to catch food; Neolithic farmers made polished tools and pottery to produce, process and store it",
          "Neolithic farmers used no tools at all, relying only on their hands",
          "Hunters made pottery, while Neolithic farmers made only handaxes",
          "There was no difference — both groups made and used identical tools",
        ],
        explanation: "The shift from catching food to producing it changed the toolkit — polished tools and pottery for farming, processing and storage." },
      { question: "Farming began at different times and with different crops around the world. Based on this page, what is the strongest conclusion?", difficulty_level: 3, correct_index: 1,
        options: [
          "Farming spread instantly from a single origin to the whole world at once",
          "The Neolithic Revolution arose independently in several regions, each domesticating locally suited crops — a gradual, many-centred change",
          "Only regions with rice ever became true farmers",
          "The chart proves farming was less important than hunting",
        ],
        explanation: "The varied crops, places and times show farming emerged independently in multiple cradles — not a single event spreading outward." },
    ]),
  ], 'the-neolithic-revolution'),
};

const p7 = {
  slug: 'the-first-indian-villages',
  title: "India's First Villages",
  subtitle: "From the mud-brick homes of Mehrgarh to the first sparks of the metal age — the road that led to India's first cities.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). An early Neolithic Indian farming village at dawn — clusters of flat-roofed mud-brick houses, grain stores, people tending wheat fields and humped zebu cattle, low hills behind."),
    curiosityPrompt(
      "Every great city in India's history began as something far humbler: a village of a few mud houses and a field of grain. Before reading on — what do you think a family would need to *master* first, before a scattering of farming villages could ever grow into a mighty civilisation of planned cities?",
      "Think about food you can store, animals you can keep, and a new material harder than stone.",
      "They needed to grow *surplus* food, tame animals, and — crucially — learn to work **metal**. India's earliest farmers did all three, and this page follows them from the oldest village yet found to the doorstep of the Bronze Age."
    ),
    text(
      "After the Neolithic Revolution reached the Indian subcontinent, farming spread — but not everywhere at once. The northwest led the way, and the oldest Neolithic site we know of is **Mehrgarh**, on the Bolan River (in present-day Pakistan), dating back to about **7000 BCE**. It was the earliest farming village in the region, and its people had already worked out a settled life: they built **sun-dried brick houses** and **granaries** to store grain, buried their dead with care, and made **ornaments from semi-precious stones** like lapis lazuli, carnelian and shell. They grew **wheat and barley**, and raised sheep, goats and Indian cattle — especially the humped **zebu bull**."
    ),
    text(
      "Then came the leap that changed everything: the people of Mehrgarh were among the **first in the region to make copper objects**, around **4000 BCE**. Working metal — even soft copper — pushed them out of the pure Stone Age and into the **Chalcolithic** (the Copper–Stone Age). This, in turn, laid the foundation for the great Bronze Age **Sindhu–Sarasvatī Civilisation** that would rise around 3500 BCE. By about **2500 BCE**, most of the subcontinent was dotted with Neolithic farming communities, herding cattle and sheep and growing cereals, millets and pulses — the quiet groundwork on which India's first cities would be built."
    ),
    callout('india_science', 'A Farming Trick Nearly 5,000 Years Old',
      "At **Kalibangan** (in Rajasthan), archaeologists uncovered a ploughed field from Early Harappan times — and its furrows run in *two directions*, crossing at right angles. That criss-cross pattern is the sign of **double cropping**: growing two different crops in the same field at once. It's essentially the same **Rabi and Kharif** cropping system Indian farmers still use today — a piece of agricultural wisdom nearly 5,000 years old, still feeding the country."
    ),
    guidedReveal(
      'What Made Mehrgarh a Home, Not a Camp', 'The marks of a truly settled village, all present at Mehrgarh:',
      [
        { kicker: 'shelter', headline: 'Brick Houses & Granaries', body: "Sun-dried mud-brick homes to live in, and granaries to *store* the harvest — you only build storage when you plan to stay and have surplus to keep." },
        { kicker: 'food', headline: 'Crops & Herds', body: "Wheat and barley in the fields; sheep, goats and the humped zebu cattle in the pens. Food was now produced and controlled, not just found." },
        { kicker: 'craft', headline: 'Ornaments & Trade', body: "Beads of lapis lazuli, carnelian and shell — some from far away — showing craft skill and the first threads of long-distance exchange." },
        { kicker: 'metal', headline: 'The First Copper', body: "Working copper by ~4000 BCE tipped them into the Chalcolithic age — the technological step that made the coming Bronze Age civilisation possible." },
      ]
    ),
    reasoningPrompt('logical',
      "Mehrgarh's people went from stone tools to farming to working copper. Based on this page, why does that last step — making copper objects — matter so much for what came next?",
      [
        "Working copper pushed them out of the pure Stone Age into the Chalcolithic, the technological step that laid the foundation for the Bronze Age Sindhu–Sarasvatī Civilisation",
        "Copper let them stop farming entirely and return to hunting and gathering",
        "Copper objects were the first form of written records in India",
        "Making copper meant they no longer needed to live in villages or store food",
      ],
      "Mastering metal — even soft copper — was the bridge from the Stone Age to the metal ages. That Chalcolithic step is exactly what set up the Bronze Age Sindhu–Sarasvatī cities that follow.",
      2
    ),
    quiz([
      { question: "What is Mehrgarh, and why is it important?", difficulty_level: 1, correct_index: 0,
        options: [
          "The oldest known Neolithic farming village in the region (~7000 BCE), with brick houses, granaries and early crops and herds",
          "The largest city of the Mature Harappan civilisation",
          "A cave site famous for its Mesolithic rock paintings",
          "The place where writing was first invented in India",
        ],
        explanation: "Mehrgarh (~7000 BCE) is the earliest Neolithic farming village in the region — brick houses, granaries, wheat/barley and herded animals." },
      { question: "The ploughed field at Kalibangan, with furrows crossing at right angles, is evidence of what?", difficulty_level: 2, correct_index: 1,
        options: [
          "That Harappans had not yet learned to farm at all",
          "Double cropping — growing two crops in one field, much like today's Rabi and Kharif system",
          "That the field was used only for grazing cattle, never for crops",
          "That writing was used to plan the fields",
        ],
        explanation: "Cross-furrows show double cropping — essentially the Rabi/Kharif system still used in India today." },
      { question: "How did the making of copper objects at Mehrgarh set the stage for what followed?", difficulty_level: 3, correct_index: 2,
        options: [
          "It ended farming and returned people to hunting",
          "It had no effect, since copper was too soft to be useful",
          "It moved them into the Chalcolithic (Copper–Stone Age), the step that laid the foundation for the Bronze Age Sindhu–Sarasvatī Civilisation",
          "It immediately created the first cities overnight",
        ],
        explanation: "Copper-working began the metal age (Chalcolithic), the technological foundation for the coming Bronze Age civilisation." },
    ]),
  ], 'the-first-indian-villages'),
};

const p8 = {
  slug: 'the-sindhu-sarasvati-civilisation',
  title: 'The Sindhu–Sarasvatī Civilisation',
  subtitle: "How India's farming villages grew into some of the world's first great planned cities.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A reconstructed Mature Harappan city at golden hour — grid-planned streets of fired-brick buildings, a great bath, a raised citadel, people at market with pottery and bead stalls, a river beyond."),
    curiosityPrompt(
      "Imagine a city built 4,500 years ago with straight, planned streets, brick houses, covered drains, public wells, and standard weights used in every marketplace — all without a single king's name surviving to us. Before reading on: what does it take for scattered farming villages to become a civilisation of cities *this* organised?",
      "Think about what you need before thousands of strangers can live, trade and cooperate in one place.",
      "It takes surplus food, skilled crafts, brisk trade, shared rules — like standard weights — and clever management of water. The Sindhu–Sarasvatī (Harappan) people mastered all of it, building one of the world's first great urban civilisations. This page is their story."
    ),
    text(
      "The Early Harappan settlements grew up from about **4000 BCE** along the **Indus and the Ghaggar–Sarasvatī** river basins. Over many centuries these villages quietly gained the skills of a civilisation: they mastered **copper**, produced fine **pottery, beads and shell bangles**, began building **perimeter walls** around settlements, started using **seals**, and even took the first steps toward **writing**. All of this steadily matured until, by about **2600 BCE**, it flowered into the **Mature Harappan** phase — the full **Sindhu–Sarasvatī Civilisation**, with great cities like **Harappa, Mohenjo-daro, Dholavira, Rakhigarhi, Kalibangan and Lothal**."
    ),
    timeline('The Phases of the Sindhu–Sarasvatī Civilisation', 'horizontal', [
      { label: 'Early Harappan (from ~3300 BCE)', detail: 'Villages master copper, pottery, beads, seals and the first writing along the Indus and Ghaggar–Sarasvatī rivers — the roots of the civilisation.' },
      { label: 'Mature Harappan (~2600 BCE)', detail: 'The great planned cities flower — Harappa, Mohenjo-daro, Dholavira and more — with crafts, trade, seals, a script, and standard weights.' },
      { label: 'Late Harappan (~1300 BCE)', detail: 'The cities gradually decline and de-urbanise as people shift toward rural life — the puzzle explored later in this chapter.' },
    ]),
    text(
      "What set the Harappans apart was not war or grand kings, but **organisation and skill**. Their cities were **carefully planned**. Their craftspeople turned out beautiful pottery, copper objects, shell work and semi-precious beads. They carved **seals** and used a **script** — one we still cannot read. Above all, they used a **standard system of weights and measures**: neat cubical stone weights following a binary pattern (1, 2, 4, 8, 16…) for small amounts and multiples of ten for large ones. Standard weights sound dull — but they are the fingerprint of a society organised enough for **fair, large-scale trade** across huge distances."
    ),
    callout('india_science', 'Masters of Water',
      "The Harappans were geniuses at managing water. Early Harappans built check dams called **gabarbands** across small streams to catch water for farming. At **Dholavira** (in Kachchh, Gujarat) they diverted two seasonal streams into a series of huge interconnected reservoirs cut from stone and mud-brick — some carved right into the bedrock — to store every drop within the city walls. And at **Lothal** they built an enormous **dockyard** of burnt brick, connecting the city to sea trade. Four thousand years ago, Indian engineers were already solving problems of water and trade that cities still wrestle with today."
    ),
    guidedReveal(
      'The Signs of a Harappan City', 'What archaeologists look for to know they have found a Harappan city:',
      [
        { kicker: 'planning', headline: 'Planned Streets & Drains', body: "Cities laid out with order — straight streets, brick houses, covered drains and public wells — not a tangle that just grew by accident." },
        { kicker: 'crafts', headline: 'Fine Crafts', body: "Skilled pottery, copper objects, shell bangles and beautiful semi-precious stone beads, traded far and wide." },
        { kicker: 'writing', headline: 'Seals & the Script', body: "Carved seals and short inscriptions in the Harappan script — a genuine writing system that, uniquely, remains undeciphered to this day." },
        { kicker: 'trade', headline: 'Standard Weights', body: "Cubical stone weights in a fixed binary system — proof of organised, honest, long-distance trade across the whole civilisation." },
        { kicker: 'water', headline: 'Water Engineering', body: "Reservoirs, check dams and dockyards (Dholavira, Lothal) — mastery of storing and moving water that kept the cities alive." },
      ]
    ),
    reasoningPrompt('logical',
      "The Harappans used the same cubical stone weights, in the same binary system, at cities hundreds of kilometres apart. Based on this page, what is the strongest thing this tells us about their civilisation?",
      [
        "That it was organised and connected enough to agree on shared standards, allowing fair, large-scale trade across huge distances",
        "That each city was completely isolated and had nothing to do with the others",
        "That the Harappans had no interest in trade or crafts at all",
        "That the weights were purely decorative and never actually used",
      ],
      "Shared, standard weights across distant cities mean the civilisation had agreed rules and enough coordination for reliable long-distance trade — a hallmark of a genuinely organised society, not scattered, unconnected towns.",
      2
    ),
    quiz([
      { question: "Around when did the Mature Harappan (Sindhu–Sarasvatī) phase of great planned cities flower?", difficulty_level: 1, correct_index: 2,
        options: [
          "Around 7000 BCE, at the very start of farming",
          "Only in the last 500 years",
          "Around 2600 BCE",
          "Around 1300 BCE, as the cities were ending",
        ],
        explanation: "The Mature Harappan phase — the great planned cities — flowered around 2600 BCE." },
      { question: "The Harappan cities are remembered less for kings and wars and more for what?", difficulty_level: 2, correct_index: 0,
        options: [
          "Careful city planning, fine crafts, seals and a script, standard weights, and brilliant water management",
          "Enormous armies and famous conquering emperors",
          "Gold coins stamped with the faces of their rulers",
          "Giant stone pyramids built as royal tombs",
        ],
        explanation: "The Harappans stand out for organisation and skill — planning, crafts, seals/script, standard weights and water engineering — not military conquest." },
      { question: "Dholavira's reservoirs and Lothal's dockyard are given as examples of what Harappan strength?", difficulty_level: 3, correct_index: 1,
        options: [
          "Their skill at making war on neighbouring cities",
          "Their mastery of managing and moving water — for farming, storage and sea trade",
          "Their invention of a fully deciphered writing system",
          "Their use of iron tools long before anyone else",
        ],
        explanation: "Dholavira (reservoirs) and Lothal (dockyard) showcase Harappan genius at water management and trade infrastructure." },
    ]),
  ], 'the-sindhu-sarasvati-civilisation'),
};

const p9 = {
  slug: 'cities-along-the-great-rivers',
  title: 'Cities Along the Great Rivers',
  subtitle: "At almost the same moment in history, four great civilisations rose — each on a river, each unaware of the others.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A triptych of three ancient river civilisations blending across the banner — a Mesopotamian ziggurat by the Euphrates, an Egyptian pyramid beside the Nile, and a stretch of the Great Wall over the hills of China."),
    curiosityPrompt(
      "At roughly the same time the Harappan cities were thriving, three *other* great civilisations were rising far away — in West Asia, in Egypt, and in China. None of them knew the others existed. Yet all four chose the same kind of place to build. Before reading on: what single feature do you think all four had in common?",
      "It's the same thing that made India's own first cities possible — look at where they all sit.",
      "Every one of them rose in the valley of a great **river**. Rivers gave water to drink and farm with, fertile silt to grow surplus food, and routes to trade along — the exact recipe for a civilisation. That four peoples discovered this *independently* is one of history's most striking patterns."
    ),
    text(
      "While the Sindhu–Sarasvatī Civilisation flourished along the Indus and Ghaggar–Sarasvatī, three other great Bronze Age civilisations were rising on their own rivers: **Mesopotamia**, between the **Euphrates and Tigris** in West Asia; **Egypt**, along the **Nile**; and **China**, along the **Huang He (Yellow River)** and the Yangtze. Rivers weren't a coincidence — they were the foundation. They watered crops, their yearly floods spread fertile silt for rich harvests, and they served as highways for trade. Give people a great river and a surplus of food, and cities can follow."
    ),
    comparisonCard('Three Great River Civilisations', [
      { heading: 'Mesopotamia', color: '#818cf8', points: [
        'Rivers: the Euphrates and Tigris (West Asia — today mainly Iraq).',
        'Built the first city-states: Sumer, Ur, Babylon, ruled from stepped temple-towers called ziggurats.',
        'Invented cuneiform (~3300 BCE) — the world\'s first writing, pressed into clay tablets.',
        'Gave us the Code of Hammurabi (early written laws), the wheeled cart, and counting in 60s — our 60-minute hour and 360° circle.',
      ] },
      { heading: 'Egypt', color: '#fbbf24', points: [
        'River: the Nile, whose yearly flood left rich black soil (kemet).',
        'Ruled by pharaohs, who built pyramids as tombs and preserved bodies by mummification.',
        'Wrote in hieroglyphics — long unreadable, until the Rosetta Stone cracked the code in 1822.',
        'Kept records on papyrus, and worked out a 365-day calendar from the flooding of the Nile.',
      ] },
      { heading: 'China', color: '#34d399', points: [
        'Rivers: the Huang He (Yellow River) and the Yangtze.',
        'Ruled by dynasties — the Shang and Zhou (Bronze Age), then the Qin, which gave "China" its name, and the Han.',
        'Its earliest records are "oracle bones" — animal bones and shells cracked by heat and read for the future.',
        'Famous for jade and bronze craft, the Great Wall, and silk — which later flowed west along the Silk Route.',
      ] },
    ]),
    text(
      "Look across the three and something remarkable stands out: each, on its own, invented **writing**, built great **monuments**, developed **laws and government**, and organised a complex society — yet none copied the others. The same human story unfolded four separate times, on four separate rivers. It's powerful evidence that when people gain settled farming and surplus food, cities and civilisation tend to follow — wherever in the world they are."
    ),
    reasoningPrompt('logical',
      "All four early civilisations — Harappan, Mesopotamian, Egyptian and Chinese — arose in river valleys. Based on this page, what is the strongest reason rivers were so essential?",
      [
        "Rivers gave drinking water, yearly floods that spread fertile silt for surplus crops, and routes for trade — the exact conditions cities need to grow",
        "Rivers were the only places cool enough for humans to survive at all",
        "Rivers made writing unnecessary, so civilisations there did not need records",
        "Rivers kept the four civilisations in constant contact, so they copied each other's ideas",
      ],
      "Rivers delivered the three essentials: water, fertile flood-silt for surplus food, and trade routes. Surplus food frees people from farming to become builders, traders and rulers — so cities follow. (And these four rose *independently*, not by copying.)",
      2
    ),
    quiz([
      { question: "What did all four early civilisations — Harappan, Mesopotamian, Egyptian and Chinese — have in common?", difficulty_level: 1, correct_index: 1,
        options: [
          "They were all ruled by the same emperor",
          "They each arose in the fertile valley of a great river",
          "They all used the same written script",
          "They were all located on the same continent",
        ],
        explanation: "All four rose in fertile river valleys — the shared foundation of early civilisation." },
      { question: "Which achievement is correctly matched to its civilisation?", difficulty_level: 2, correct_index: 3,
        options: [
          "Egypt — invented cuneiform, the first writing",
          "China — built the pyramids as royal tombs",
          "Mesopotamia — famous for silk and the Great Wall",
          "Mesopotamia — created cuneiform, ziggurats and the Code of Hammurabi",
        ],
        explanation: "Cuneiform (first writing), ziggurats and the Code of Hammurabi are all Mesopotamian; silk/Great Wall are Chinese and pyramids are Egyptian." },
      { question: "The four civilisations invented writing, monuments and government separately, without copying each other. What is the strongest conclusion?", difficulty_level: 3, correct_index: 2,
        options: [
          "That only one of them really invented these things and the rest are myths",
          "That they must secretly have been in constant contact all along",
          "That when people gain settled farming and surplus food, cities and civilisation tend to follow anywhere — a repeating human pattern",
          "That civilisation can only ever appear in one place on Earth",
        ],
        explanation: "The same story unfolding independently four times shows civilisation is a repeatable human pattern that follows settled farming and surplus food." },
    ]),
  ], 'cities-along-the-great-rivers'),
};

const p10 = {
  slug: 'when-worlds-connected-and-faded',
  title: 'When Worlds Connected — and Faded',
  subtitle: "The ancient world was already linked by trade — and then, mysteriously, the Harappan cities emptied.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). An ancient sea-trade scene — a Harappan boat laden with beads, ivory and copper crossing toward Mesopotamian shores at dusk, distant ziggurats on the horizon, a sense of two worlds meeting."),
    curiosityPrompt(
      "Four great civilisations, rising on four rivers, none knowing the others existed — or so it seems. But archaeologists have found Indian goods in the ruins of West Asian cities, and West Asian records that name a distant trading land. Before reading on: do you think these ancient worlds were truly cut off from one another, or already quietly connected?",
      "Follow the beads, the ivory and the copper — where do they turn up?",
      "They were already **connected** — by trade across land and sea, thousands of years ago. The Harappans traded with Mesopotamia, and later Chinese silk flowed west along the famous Silk Route. The ancient world had its own early 'globalisation,' long before the word existed."
    ),
    text(
      "Though these civilisations grew independently, they didn't stay sealed off. The Harappans were busy sea-traders: **Mesopotamian cuneiform records name distant lands** they traded with — **Meluhha** (which scholars widely identify with the Sindhu–Sarasvatī Civilisation), **Dilmun** (today's Bahrain) and **Magan** (today's Oman). From India went **semi-precious stone beads, ivory, timber, gold dust and probably copper**. Much later, China's prized **silk** travelled west along the overland routes that came to be called the **Silk Route**. The ancient world, in other words, was already stitched together by trade."
    ),
    callout('india_science', 'India\'s Name in the World\'s First Writing',
      "Think about what **Meluhha** means. More than 4,000 years ago, scribes in Mesopotamia — using the world's first writing — recorded the name of a rich trading land across the sea, and that land was almost certainly **India's own Sindhu–Sarasvatī Civilisation**. India was known, named and valued as a trading partner in the earliest written records on Earth. The Harappans may be silent to us (their own script is still unread), but their neighbours wrote them into history."
    ),
    heading('And Then the Great Cities Emptied'),
    text(
      "Here is the deepest mystery of the chapter. After centuries of glory, the great Harappan cities gradually emptied out — by around **1900 to 1300 BCE**, the planned streets fell silent and the people drifted away. For a long time, some believed a violent invasion had destroyed them, but that idea is now **firmly rejected**: archaeologists found *no* evidence of massacres or conquered cities, only the ordinary remains of a fading population. So if it wasn't an invasion, what *did* happen? That question is still argued over by historians today."
    ),
    perspectiveScenario({
      title: 'Why Did the Harappan Cities Fade Away?',
      role_frame: "You're a historian at a conference, listening to four respected colleagues each argue a different explanation for the end of the Sindhu–Sarasvatī cities. None can prove their case beyond doubt.",
      event_context:
        "By around 1900–1300 BCE, the great Mature Harappan cities — Mohenjo-daro, Harappa, Dholavira and the rest — were abandoned or shrank into villages. The old theory of a violent 'invasion' has been discarded: there is no evidence of massacre or conquest. What replaced it is not one answer but several competing explanations — and the Harappans' own undeciphered script keeps a crucial piece of the story locked away.",
      image_prompt:
        "A clean infographic map of the Harappan region showing the Indus and drying Ghaggar–Sarasvatī rivers, abandoned city symbols (Mohenjo-daro, Harappa, Dholavira), and four small labelled icons around the edge for the four theories: weakening monsoon, drying river, trade collapse, gradual de-urbanisation/eastward migration. Dark background, orange accent labels, clean technical illustration style.",
      image_caption: "Four theories for the fading of the Harappan cities (illustrative infographic).",
      source_note:
        "Grounded in current scholarship on the Harappan decline: a weakening south-west monsoon and increasing aridity after ~2000–1900 BCE; the drying/shrinking of the monsoon-fed Ghaggar–Hakra (Sarasvatī) river along which many settlements lay; disruption of long-distance trade with Mesopotamia; and the modern consensus (e.g. historian Upinder Singh) that this was a gradual de-urbanisation and eastward shift to rural life, NOT a sudden violent collapse. The 19th-century 'Aryan invasion' explanation is now discredited (no archaeological evidence of massacre).",
      prompt: "Which explanation do you find most convincing — and, honestly, what does your chosen theory struggle to explain on its own?",
      options: [
        {
          label: "The climate changed — a weakening monsoon dried out the land",
          real_position: "The view of many climate scientists, supported by oxygen-isotope and monsoon studies",
          perspective: "After about 2000 BCE the **south-west monsoon weakened** and the region grew more arid. Less reliable rain meant failing harvests and no surplus to feed large cities — so, slowly, the cities could no longer sustain themselves. *Its limit:* climate alone doesn't explain why *some* areas were abandoned while people thrived elsewhere.",
        },
        {
          label: "The Sarasvatī (Ghaggar–Hakra) river dried up",
          real_position: "The view of geologists and archaeologists studying the ancient river system",
          perspective: "A great many Harappan towns sat along the **Ghaggar–Hakra (Sarasvatī)**, a river fed by the monsoon rather than Himalayan snow. As the rains weakened, it **shrank to seasonal trickles** and shifted its course — and the settlements that depended on it had to move or die. *Its limit:* cities on the Indus, which kept flowing, also declined, so the river can't be the whole answer.",
        },
        {
          label: "Their trade networks collapsed",
          real_position: "The view of historians who study the Harappan economy",
          perspective: "Harappan cities were powered by **long-distance trade** — beads, copper and more, exchanged as far as Mesopotamia. When that trade faltered (partly as Mesopotamia had its own troubles), the cities lost the wealth that held them together, and urban life unravelled. *Its limit:* trade decline may be as much a *symptom* of the crisis as its cause.",
        },
        {
          label: "It wasn't a 'collapse' at all — people gradually moved on",
          real_position: "The modern scholarly consensus (e.g. historian Upinder Singh's 'de-urbanisation')",
          perspective: "Perhaps we're asking the wrong question. There was **no dramatic collapse** — instead a slow **de-urbanisation**: as conditions changed, people quietly left the big cities, moved **eastward**, and returned to village and rural life, carrying their culture with them. The civilisation didn't die so much as *transform*. *Its limit:* this reframes the ending, but still leans on climate and rivers to explain *why* people moved.",
        },
      ],
      synthesis:
        "Notice that these aren't really four rival answers — most historians today think the truth is a **combination**: a weakening monsoon dried the rivers, which strained farming and trade, and people responded not by dying out but by gradually leaving the cities for the countryside. It was a slow fading, not a sudden fall. And the final pieces of the puzzle may lie in the Harappans' own writing — which, as you learned on the very first page of this chapter, we still cannot read. Some of history's greatest questions stay genuinely open.",
    }),
    quiz([
      { question: "What did the Mesopotamians most likely call the Sindhu–Sarasvatī (Harappan) Civilisation in their trade records?", difficulty_level: 1, correct_index: 0,
        options: [
          "Meluhha",
          "Mesopotamia",
          "Magan",
          "Sumer",
        ],
        explanation: "Meluhha in Mesopotamian records is widely identified with the Sindhu–Sarasvatī Civilisation (Dilmun = Bahrain, Magan = Oman)." },
      { question: "Why is the old theory that a violent invasion destroyed the Harappan cities now rejected?", difficulty_level: 2, correct_index: 2,
        options: [
          "Because the cities were never actually abandoned at all",
          "Because written records clearly name the invaders",
          "Because archaeologists found no evidence of massacres or conquered cities — only the ordinary remains of a fading population",
          "Because the invasion happened too recently to count as history",
        ],
        explanation: "No archaeological evidence of massacre or conquest was ever found, so the invasion theory was discarded." },
      { question: "Most historians today explain the end of the Harappan cities as what?", difficulty_level: 3, correct_index: 1,
        options: [
          "A single, sudden catastrophe with one clear cause",
          "A gradual fading — a combination of a weakening monsoon, drying rivers and trade decline, with people slowly de-urbanising and moving east",
          "A deliberate decision by the Harappans to burn their own cities",
          "An event that has been completely and finally explained, with no open questions",
        ],
        explanation: "The consensus is a gradual, multi-cause de-urbanisation — a slow fade, not a sudden collapse — with the full answer still partly locked in the unread script." },
    ]),
  ], 'when-worlds-connected-and-faded'),
};

const p11 = {
  slug: 'early-humans-toolkit',
  title: 'Early Humans — Toolkit',
  subtitle: "The whole journey, from a chipped stone to a planned city — and the people whose job is to uncover it.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A sweeping montage across the banner — a hand chipping a stone tool, a Bhimbetka cave painting, a Neolithic village, and a Harappan city — the human journey from Stone Age to civilisation."),
    curiosityPrompt(
      "In this chapter you've travelled roughly three million years — from a hand chipping the first stone tool, to painters at Bhimbetka, to the planned streets of a Harappan city. Before you close it: of that entire journey, which single leap forward do you think changed human life the most, and why?"
    ),
    text(
      "Step back and look at the whole arc. For over **99% of our story** there was no writing, so we know it only through what people left behind — tools, bones, cave art — read by **archaeology**. Our ancestors **evolved in Africa** and spread across the world. Through the long **Palaeolithic** they lived as hunter-gatherers; in the **Mesolithic** the climate warmed and life bloomed; then the **Neolithic Revolution** turned them into farmers living in **villages**. Working copper opened the **Chalcolithic**, and out of it rose the great **Bronze Age civilisations** — the Sindhu–Sarasvatī, Mesopotamia, Egypt and China — each on a river, each inventing writing, cities and government on its own. That is the road from a chipped stone to a planned city."
    ),
    guidedReveal(
      'The Whole Chapter in Six Steps', 'Three million years, boiled down to its turning points:',
      [
        { kicker: '1', headline: 'Evidence, not books', body: "For almost all of human history there was no writing — we know it through archaeology: the tools, bones and art people left behind." },
        { kicker: '2', headline: 'Out of Africa', body: "Our ancestors evolved in Africa and gradually spread across the whole world, changing over millions of years into modern humans." },
        { kicker: '3', headline: 'Hunter-gatherers', body: "Through the long Palaeolithic and the warmer Mesolithic, people lived by hunting and gathering — and made the first art." },
        { kicker: '4', headline: 'The farming revolution', body: "The Neolithic Revolution: people began producing food, settling into villages, and domesticating plants and animals." },
        { kicker: '5', headline: 'Into metal', body: "Working copper opened the Chalcolithic — the technological step toward the Bronze Age." },
        { kicker: '6', headline: 'The first cities', body: "Great Bronze Age civilisations rose independently on rivers — Sindhu–Sarasvatī, Mesopotamia, Egypt, China — with cities, writing and government." },
      ]
    ),
    careerSpotlight(
      'Who Uncovers the Deep Past?',
      'The story in this chapter is somebody\'s life\'s work — here are a few real careers built on it:',
      [
        { role: 'Archaeologist', description: "Excavates ancient sites and reads the tools, bones and buildings people left behind — the detective of the deep past you met on page one." },
        { role: 'Historian', description: "Pieces together the human story from evidence and records, weighing competing theories (like the debate over why the Harappan cities faded)." },
        { role: 'Epigraphist', description: "Studies and deciphers ancient scripts and inscriptions — the very kind of specialist who may one day finally read the Harappan seals." },
        { role: 'Museum Curator / Conservator', description: "Preserves fragile ancient objects and shares them with the public, keeping the deep past alive and understandable for everyone." },
      ],
      'Every one of these careers begins with the same spark this chapter aimed to light: curiosity about where we came from.'
    ),
    reasoningPrompt('logical',
      "This chapter shows the Sindhu–Sarasvatī, Mesopotamian, Egyptian and Chinese civilisations each inventing cities, writing and government on their own. Based on the whole chapter, what is the strongest overall lesson?",
      [
        "Civilisation is a repeatable human achievement — given settled farming and surplus food (usually beside a river), people build cities and complex societies independently, again and again",
        "Only one true civilisation ever existed, and the others merely copied it",
        "Civilisations can appear without any farming, food surplus or settled life",
        "The four civilisations prove that history never really changes over time",
      ],
      "The same leap — farming and surplus → cities, writing and government — happened four separate times without copying. That shows civilisation is a repeatable human pattern, not a one-off accident.",
      2
    ),
    quiz([
      { question: "For most of human history, how do we know what happened, given there were no written records?", difficulty_level: 1, correct_index: 0,
        options: [
          "Through archaeology — the tools, bones, and art that people left behind",
          "Through detailed written diaries kept by early humans",
          "Through photographs taken at the time",
          "We cannot know anything about it at all",
        ],
        explanation: "The pre-writing past is known mainly through archaeological evidence — the objects people left behind." },
      { question: "Which change does the chapter treat as the great turning point from wandering to settled life?", difficulty_level: 1, correct_index: 2,
        options: [
          "The first migration out of Africa",
          "The building of the Great Wall of China",
          "The Neolithic Revolution — the shift to farming and village life",
          "The invention of iron tools",
        ],
        explanation: "The Neolithic Revolution (farming + villages) is the pivot from a wandering to a settled way of life." },
      { question: "The four great Bronze Age civilisations arose independently. What did they most strikingly share?", difficulty_level: 2, correct_index: 1,
        options: [
          "The same ruler and the same written script",
          "A fertile river valley, and — invented separately — cities, writing and organised government",
          "A single shared religion spread by trade",
          "The complete absence of any farming or trade",
        ],
        explanation: "Each rose on a river and independently developed cities, writing and government — the same pattern, four separate times." },
      { question: "Why do historians still argue about why the Harappan cities faded — and what keeps a piece of the answer locked away?", difficulty_level: 3, correct_index: 3,
        options: [
          "Because no one has ever studied the Harappan cities",
          "Because the cities are still inhabited today",
          "Because a violent invasion clearly destroyed them, and that is proven",
          "Because several causes (climate, drying rivers, trade) likely combined into a slow fade — and the Harappans' own script remains undeciphered",
        ],
        explanation: "The decline was a gradual, multi-cause de-urbanisation, and the still-unread Harappan script keeps part of the story hidden — so the debate stays open." },
    ]),
  ], 'early-humans-toolkit'),
};

const PAGES = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, { ignoreUndefined: true });
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const book = await books.findOne({ _id: BOOK_ID });
    if (!book) throw new Error(`Book ${BOOK_ID} not found`);
    const chapter = (book.chapters || []).find((c) => c.number === CHAPTER_NUMBER);
    if (!chapter) throw new Error(`Chapter ${CHAPTER_NUMBER} not found`);
    const newPageIds = [];
    let skipped = 0;
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      const existing = await pagesCol.findOne({ book_id: BOOK_ID, slug: p.slug });
      if (existing) { console.log(`⏭  "${p.slug}" exists — skipping.`); skipped++; continue; }
      const _id = uuid();
      await pagesCol.insertOne({
        _id, book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: i + 1,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        hinglish_blocks: [], tags: [], published: false,
        reading_time_min: bw.computeReadingTime(p.blocks), content_types: bw.computeContentTypes(p.blocks),
        page_type: 'lesson', deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      });
      newPageIds.push(_id);
      console.log(`✓ Inserted page ${i + 1} "${p.slug}" (${p.blocks.length} blocks).`);
    }
    if (newPageIds.length) {
      await books.updateOne({ _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
        { $push: { 'chapters.$.page_ids': { $each: newPageIds } }, $set: { updated_at: new Date() } });
      console.log(`✓ Wired ${newPageIds.length} page_ids into chapter ${CHAPTER_NUMBER}.`);
    }
    console.log(`\n✅ Done. Inserted ${newPageIds.length}, skipped ${skipped}.`);
  } finally { await client.close(); }
}
main().catch((err) => { console.error('❌', err); process.exit(1); });
