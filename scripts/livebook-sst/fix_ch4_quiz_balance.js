'use strict';
// Fix (2026-07-10 audit): Ch4 quiz length-tell. Same as Ch3 — options balanced to a tight length
// band so the correct answer is never a giveaway by length; correct_index spread toward D.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const QUIZ = {
  'a-history-with-no-books': [
    { question: "For roughly what share of the human story could people NOT write anything down?", ci: 3, opts: [
      "Only the last 5,000 years, which is a fairly small slice of it",
      "Exactly half of all of human history, split down the middle",
      "None of it at all — human beings have always been able to write",
      "More than 99% of it, since writing is only about 5,000 years old",
    ], ex: "Writing is only ~5,000 years old, so for over 99% of the story there were no written records." },
    { question: "What is 'experimental archaeology,' as described on this page?", ci: 1, opts: [
      "Guessing what happened in the past without using any evidence at all",
      "Making and using copies of ancient tools to learn how they were made and used",
      "Reading ancient written documents and checking them against one another",
      "Digging up a site as fast as possible before carefully recording anything",
    ], ex: "It means recreating and using ancient tools to understand how early people made and depended on them." },
    { question: "Cuneiform and hieroglyphics are deciphered, but the Harappan script is not. What does that mean?", ci: 0, opts: [
      "We can see the Harappan symbols but still can't read them, so its words stay a mystery",
      "The Harappan script is definitely just decoration and was never real writing at all",
      "We understand the Harappan script perfectly and know the names of all its kings",
      "The Harappan script is far younger than cuneiform and was never worth any study",
    ], ex: "The Harappan script survives on seals but is undeciphered — so its meaning remains unknown." },
  ],
  'the-human-family-tree': [
    { question: "Which is the only human species still living on Earth today?", ci: 3, opts: [
      "Homo habilis, the early 'handy man' of Africa's Olduvai Gorge",
      "Homo erectus, the first of our ancestors to walk out of Africa",
      "Homo neanderthalensis, of Ice-Age Europe and South-West Asia",
      "Homo sapiens — modern humans, which is to say all of us",
    ], ex: "Homo sapiens is the only surviving human species; the others died out." },
    { question: "What is the difference between biological and cultural evolution?", ci: 1, opts: [
      "Biological evolution is about tools, while cultural evolution is about the shape of the skull",
      "Biological is slow change in bodies and genes; cultural is learned skills like tools and fire",
      "They are simply two different names for the very same process of making stone tools",
      "Biological evolution happened only in Africa, and cultural evolution only in Europe",
    ], ex: "Biological = physical/genetic change over time; cultural = the learned skills humans developed to survive." },
    { question: "Which hominin was the first to migrate out of Africa, and roughly when?", ci: 2, opts: [
      "Homo sapiens, spreading out of Africa around 40,000 years ago",
      "Homo neanderthalensis, leaving the continent around 300,000 years ago",
      "Homo erectus, walking out of Africa around 2 million years ago",
      "Homo habilis, migrating out of Africa around 5,000 years ago",
    ], ex: "Homo erectus was the first hominin to leave Africa, around 2 million years ago." },
  ],
  'the-stone-age': [
    { question: "On what basis do historians divide up early human history?", ci: 1, opts: [
      "By the kings and empires said to have ruled each separate period",
      "By technology — mainly the tools people made and how they got food",
      "By the detailed written records that people left behind at the time",
      "By the exact calendar years, which were all carefully recorded then",
    ], ex: "With no kings or writing for most of it, historians divide early history by technology." },
    { question: "Which change does the page call the single biggest turning point in early human history?", ci: 3, opts: [
      "The invention of the bow and arrow during the later Palaeolithic",
      "The first migration of Homo erectus out of the African continent",
      "The discovery and smelting of iron during the later Iron Age",
      "The Neolithic Revolution — the shift from hunting-gathering to settled farming",
    ], ex: "The Neolithic Revolution (farming + villages) is framed as the great turning point toward cities." },
    { question: "Why is the Neolithic called a 'revolution' even though it took thousands of years?", ci: 0, opts: [
      "Because it changed life so completely — villages, surplus, bigger populations, towns",
      "Because it actually happened overnight, faster than any other change in history",
      "Because it was led and organised by a single famous revolutionary leader",
      "Because it only altered the kinds of stone tools people made, and nothing more",
    ], ex: "It's a revolution for the depth of its impact, not its speed — it remade how humans lived." },
  ],
  'the-first-hunters': [
    { question: "How did people live during the Palaeolithic (Old Stone Age)?", ci: 2, opts: [
      "By farming crops and raising domesticated animals in permanent villages",
      "By trading goods between large walled cities using stamped metal coins",
      "By hunting wild animals and gathering wild plants, using stone tools",
      "By mining ores and smelting iron to forge tools and weapons",
    ], ex: "The Palaeolithic was a hunting-and-gathering way of life using stone tools." },
    { question: "Why are Attirampakkam and Isampur important sites?", ci: 1, opts: [
      "They show that farming began in India earlier than anywhere else on Earth",
      "They show India had human settlements reaching back over a million years",
      "They show the first great Indian cities were built during the Old Stone Age",
      "They show that writing was first invented in India during the Palaeolithic",
    ], ex: "Attirampakkam (~1.5–1.7 mya) and Isampur (~1.2 mya) show extremely ancient human presence in India." },
    { question: "Why does the page treat cave paintings and beads as so significant?", ci: 3, opts: [
      "Because they were the sharpest tools available for hunting large game",
      "Because they prove these early people had already invented true writing",
      "Because they show the people had, by then, completely stopped hunting",
      "Because they reveal imagination and self-expression — a distinctly human trait",
    ], ex: "Art and ornament reflect imagination and symbolic thought — a defining human trait beyond survival." },
  ],
  'the-mesolithic-and-the-first-art': [
    { question: "What environmental change marks the start of the Mesolithic, about 12,000 years ago?", ci: 0, opts: [
      "A warming climate, with forests and grasslands spreading as the ice retreated",
      "A sudden new ice age that froze over most of the surface of the Earth",
      "A long series of enormous volcanic eruptions right across the world",
      "The invention of farming and the building of the first walled cities",
    ], ex: "The Mesolithic began as the climate warmed ~12,000 years ago and forests and grasslands spread." },
    { question: "What is Bhimbetka, and why does it matter?", ci: 1, opts: [
      "The first farming village ever to be discovered anywhere in India",
      "A World Heritage Site in Madhya Pradesh with hundreds of painted rock shelters",
      "An ancient walled city of the mature Sindhu–Sarasvatī Civilisation",
      "A deep cave where the earliest metal tools in India were unearthed",
    ], ex: "Bhimbetka is a World Heritage Site with hundreds of painted rock shelters — a record of prehistoric life." },
    { question: "Why does the page call Bhimbetka's paintings a 'message in pictures'?", ci: 2, opts: [
      "Because the paintings contain a secret written code historians have decoded",
      "Because the paintings were made deliberately to be seen by people in the future",
      "Because these people left no writing, so the paintings are how we learn how they lived",
      "Because the paintings show the exact same scenes as India's modern cities",
    ], ex: "With no writing to rely on, the paintings are the evidence — Mesolithic life told entirely in images." },
  ],
  'the-neolithic-revolution': [
    { question: "What was the defining hallmark of the Neolithic Revolution?", ci: 3, opts: [
      "The invention of iron tools and iron weapons for warfare",
      "The building of the first great cities and the first true writing",
      "The very first migration of early humans out of Africa",
      "Domestication — producing food instead of only hunting and gathering it",
    ], ex: "The hallmark was domestication — bringing plants and animals under human control to produce food." },
    { question: "How did the tools of Neolithic farmers differ in purpose from those of Old Stone Age hunters?", ci: 0, opts: [
      "Hunters' tools caught food; Neolithic tools and pottery produced, processed and stored it",
      "Neolithic farmers used no tools at all, relying only on their bare hands",
      "Hunters made all the pottery, while Neolithic farmers made only stone handaxes",
      "There was no difference — both groups made and used exactly identical tools",
    ], ex: "The shift from catching food to producing it changed the toolkit — polished tools and pottery for farming." },
    { question: "Farming began at different times and with different crops around the world. What does that show?", ci: 1, opts: [
      "That farming spread instantly from one single origin to the whole world at once",
      "That the Neolithic Revolution arose independently in several regions with local crops",
      "That only the regions which grew rice ever became genuine farming societies",
      "That the varied crops prove farming mattered far less than continued hunting",
    ], ex: "Varied crops, places and times show farming emerged independently in multiple cradles — not one spreading event." },
  ],
  'the-first-indian-villages': [
    { question: "What is Mehrgarh, and why is it important?", ci: 2, opts: [
      "The single largest city of the mature Harappan civilisation of the Indus",
      "A cave site made famous by its many Mesolithic rock paintings",
      "The oldest known Neolithic farming village in the region, from about 7000 BCE",
      "The place where the first true writing in India was invented and used",
    ], ex: "Mehrgarh (~7000 BCE) is the earliest Neolithic farming village — brick houses, granaries, crops and herds." },
    { question: "The ploughed field at Kalibangan, with furrows crossing at right angles, is evidence of what?", ci: 3, opts: [
      "That the Harappans had not yet learned how to farm the land at all",
      "That the field was used purely for grazing cattle and never for any crops",
      "That some form of writing was used to lay out and plan the fields",
      "Double cropping — two crops in one field, like today's Rabi and Kharif",
    ], ex: "Cross-furrows show double cropping — essentially the Rabi/Kharif system still used in India today." },
    { question: "How did the making of copper objects at Mehrgarh set the stage for what followed?", ci: 0, opts: [
      "It began the metal age (Chalcolithic), the step toward the Bronze Age civilisation",
      "It ended farming altogether and returned the people to hunting and gathering",
      "It served as the first form of written record-keeping in early India",
      "It immediately created the first great planned cities almost overnight",
    ], ex: "Copper-working began the Chalcolithic — the technological foundation for the Bronze Age civilisation." },
  ],
  'the-sindhu-sarasvati-civilisation': [
    { question: "Around when did the Mature Harappan phase of great planned cities flower?", ci: 2, opts: [
      "Around 7000 BCE, at the very earliest beginnings of settled farming",
      "Around 1300 BCE, at the point when the great cities were already ending",
      "Around 2600 BCE, when the cities reached their organised, planned height",
      "Only within the last 500 years, in comparatively recent historical times",
    ], ex: "The Mature Harappan phase — the great planned cities — flowered around 2600 BCE." },
    { question: "The Harappan cities are remembered less for kings and wars and more for what?", ci: 0, opts: [
      "City planning, fine crafts, seals and a script, standard weights, water engineering",
      "Enormous conquering armies and a long line of famous warrior emperors",
      "Gold coins stamped with the faces and names of their powerful rulers",
      "Giant stone pyramids raised over the country as royal burial tombs",
    ], ex: "The Harappans stand out for organisation and skill — not military conquest." },
    { question: "Dholavira's reservoirs and Lothal's dockyard are examples of what Harappan strength?", ci: 1, opts: [
      "Their skill at waging war against rival neighbouring city-states",
      "Their mastery of managing and moving water — for farming, storage and sea trade",
      "Their invention of a fully readable, completely deciphered writing system",
      "Their use of iron tools and iron weapons long before anyone else did",
    ], ex: "Dholavira (reservoirs) and Lothal (dockyard) showcase Harappan genius at water management and trade." },
  ],
  'cities-along-the-great-rivers': [
    { question: "What did all four early civilisations — Harappan, Mesopotamian, Egyptian, Chinese — share?", ci: 3, opts: [
      "They were every one of them ruled by a single shared emperor",
      "They all wrote using exactly the same script and writing system",
      "They were all located together on one and the same continent",
      "They each arose in the fertile valley of a great river",
    ], ex: "All four rose in fertile river valleys — the shared foundation of early civilisation." },
    { question: "Which achievement is correctly matched to its civilisation?", ci: 0, opts: [
      "Mesopotamia — invented cuneiform, built ziggurats, made the Code of Hammurabi",
      "Egypt — invented cuneiform, the very first system of writing on clay",
      "China — famous for building the pyramids as tombs for its kings",
      "Mesopotamia — best known for producing silk and building the Great Wall",
    ], ex: "Cuneiform, ziggurats and the Code of Hammurabi are Mesopotamian; silk/Great Wall are Chinese; pyramids Egyptian." },
    { question: "The four civilisations invented writing and government separately. What is the strongest conclusion?", ci: 1, opts: [
      "That only one of them truly invented these things and the rest are just myths",
      "That civilisation is a repeatable human pattern that follows settled farming and surplus food",
      "That they must secretly have been in constant contact with each other all along",
      "That civilisation can only ever appear in one single place on the whole Earth",
    ], ex: "The same story unfolding independently four times shows civilisation is a repeatable human pattern." },
  ],
  'when-worlds-connected-and-faded': [
    { question: "What did the Mesopotamians most likely call the Sindhu–Sarasvatī Civilisation in their records?", ci: 2, opts: [
      "Sumer, the same name they used for their own southern homeland",
      "Magan, the land identified today with the Oman peninsula",
      "Meluhha, a rich trading land reached across the sea",
      "Dilmun, the trading island identified today with Bahrain",
    ], ex: "Meluhha in Mesopotamian records is widely identified with the Sindhu–Sarasvatī Civilisation." },
    { question: "Why is the old theory that a violent invasion destroyed the Harappan cities now rejected?", ci: 0, opts: [
      "Because no evidence of massacres or conquered cities was ever found — only a fading population",
      "Because the Harappan cities were never actually abandoned by their people at all",
      "Because surviving written records clearly name the invaders and their leaders",
      "Because the supposed invasion happened far too recently to really count as history",
    ], ex: "No archaeological evidence of massacre or conquest was ever found, so the invasion theory was discarded." },
    { question: "How do most historians today explain the end of the Harappan cities?", ci: 3, opts: [
      "As a single, sudden catastrophe traced to one clear and certain cause",
      "As a deliberate choice by the Harappans to burn down their own cities",
      "As an event now completely and finally explained, with no open questions left",
      "As a gradual fade — weakening monsoon, drying rivers and trade decline combined",
    ], ex: "The consensus is a gradual, multi-cause de-urbanisation — a slow fade, not a sudden collapse." },
  ],
  'early-humans-toolkit': [
    { question: "For most of human history, with no written records, how do we know what happened?", ci: 1, opts: [
      "Through the detailed written diaries kept by early human beings",
      "Through archaeology — the tools, bones and art that people left behind",
      "Through old photographs that were taken at the time of the events",
      "We genuinely cannot know anything at all about that whole period",
    ], ex: "The pre-writing past is known mainly through archaeological evidence." },
    { question: "Which change does the chapter treat as the great turning point from wandering to settled life?", ci: 2, opts: [
      "The very first migration of early humans out of the African continent",
      "The building of the Great Wall across the northern frontier of China",
      "The Neolithic Revolution — the shift to farming and settled village life",
      "The discovery of iron and the forging of the first iron tools",
    ], ex: "The Neolithic Revolution (farming + villages) is the pivot from a wandering to a settled way of life." },
    { question: "The four great Bronze Age civilisations arose independently. What did they most strikingly share?", ci: 0, opts: [
      "A fertile river valley, and — invented separately — cities, writing and government",
      "The same single ruler and the same shared system of writing",
      "One shared religion that was spread between them by long-distance trade",
      "The complete absence of any farming, trade or settled village life",
    ], ex: "Each rose on a river and independently developed cities, writing and government." },
    { question: "Why do historians still argue about the fading of the Harappan cities?", ci: 3, opts: [
      "Because absolutely no one has ever properly studied the Harappan cities",
      "Because those ancient cities are, in fact, still fully inhabited today",
      "Because a violent invasion clearly destroyed them, and this is now proven",
      "Because several causes likely combined into a slow fade — and the script stays unread",
    ], ex: "The decline was a gradual, multi-cause de-urbanisation, and the unread script keeps part of the story hidden." },
  ],
};

async function main() {
  await bw.withDb(async (db) => {
    for (const [slug, questions] of Object.entries(QUIZ)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      if (!page) throw new Error('page not found: ' + slug);
      const qBlock = page.blocks.find((b) => b.type === 'inline_quiz');
      if (!qBlock) throw new Error('no quiz on ' + slug);
      const newQs = questions.map((q, i) => {
        const lens = q.opts.map((o) => o.length);
        const others = lens.filter((_, idx) => idx !== q.ci);
        const ratio = lens[q.ci] / (others.reduce((a, b) => a + b, 0) / others.length);
        if (ratio > 1.3 || ratio < 0.77) console.log(`  ⚠ ${slug} q${i + 1} imbalanced (ratio ${ratio.toFixed(2)})`);
        return { id: (qBlock.questions[i] && qBlock.questions[i].id) || `${slug}-q${i}`, question: q.question, options: q.opts, correct_index: q.ci, explanation: q.ex, difficulty_level: i === 0 ? 1 : i === 1 ? 2 : 3 };
      });
      const blocks = page.blocks.map((b) => (b === qBlock ? { ...b, questions: newQs } : b));
      const res = await bw.savePage(db, { slug }, blocks, { author: 'agent', summary: 'Quiz rebalance (audit): balanced option lengths + spread correct_index.' });
      console.log(`✓ ${slug} — quiz rebalanced (${newQs.length} Qs, v${res.version || '?'})`);
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
