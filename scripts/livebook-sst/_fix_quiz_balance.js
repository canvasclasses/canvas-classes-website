'use strict';
// One-time fix: the initial Ch1 quiz authoring put the correct answer at option B
// 89% of the time, with severe length-tell (correct answer far longer than the
// distractors) — exactly the guessable pattern §3.6.1 exists to prevent. This
// rewrites each question's distractors to comparable length/detail (real traps,
// not filler) and reorders options so the key spreads across A/B/C/D. Uses
// book-writer.savePage, replacing ONLY each page's inline_quiz `questions` field
// (same block id, same everything else) — no block removed/added, so the
// content-loss guard passes cleanly with no special override needed.

const bw = require('../lib/book-writer');

// slug -> new questions array (options reordered/lengthened, correct_index updated)
const FIXES = {
  'what-is-social-science': [
    {
      question: 'Based on this page, what is Social Science, in simple words?',
      options: [
        'The systematic study of human society — how people live together, govern themselves, produce what they need, and change over time',
        'The study of important historical dates, wars and the rulers who fought them, treated as a list of events to remember',
        "The study of the physical earth's rocks, rivers and landforms, with people and their choices left out of the picture",
        'The study of the natural laws that govern matter and energy, the same way Physics or Chemistry would explain them',
      ],
      correct_index: 0,
      difficulty_level: 1,
    },
    {
      question:
        "A drought hits a district: crops fail, farmers' incomes drop, some families migrate to cities, and the government announces relief funds. Which of these best matches what Social Science would say about this one event?",
      options: [
        'Only Economics matters here, since falling incomes and relief spending are the only real consequences worth studying',
        'Several disciplines together — environment, economy, politics, society and culture all shape what happens in a single event like this',
        'Only Geography matters here, since a drought is purely a physical, environmental event with no human decisions involved',
        'None of them — a drought is pure chance, and chance events can never be explained through any systematic study',
      ],
      correct_index: 1,
      difficulty_level: 2,
    },
    {
      question:
        "Two students argue about a new highway planned through their town. One says, 'This is purely an engineering decision — just build the road.' What is the strongest reason the other student is right to call this a Social Science question too?",
      options: [
        'Building roads always needs official government permission, and any process requiring government paperwork automatically counts as a Social Science question',
        'Engineering and Social Science are really the same subject at heart, simply taught under two different names and given two different timetables',
        "Social Science studies who the road displaces, whose land it crosses, how it changes local trade and travel, and who decided its route — an engineering plan sits inside human choices and consequences",
        'The first student is technically correct, since a road is fundamentally a technical structure and nothing else needs to be considered',
      ],
      correct_index: 2,
      difficulty_level: 3,
    },
  ],
  'indias-roots-in-social-thinking': [
    {
      question: 'What do the Panchamahabhutas describe?',
      options: [
        'A system of taxation ancient Indian kings used to collect revenue from farmers and traders across five regions',
        'A council of five royal advisors who assisted the king in making major administrative decisions',
        'A group of five ancient Indian universities that taught astronomy, mathematics and medicine',
        'The natural world as five interconnected elements — earth, water, fire, air and space — with human life embedded in it',
      ],
      correct_index: 3,
      difficulty_level: 1,
    },
    {
      question:
        'A modern city planner is deciding where to build new housing. She studies the local soil, water supply, and how nearby communities already live and travel — instead of only checking which empty plot is cheapest. Which idea from this page is closest to what she is doing?',
      options: [
        "The Panchamahabhutas' view that environment and human settlement are deeply interconnected, not separate concerns to be studied apart",
        'Vasudhaiva kutumbakam, since thinking about soil and water means she is treating the whole world as one connected family',
        "The Arthashastra's detailed rules on how a kingdom should collect and manage its taxation revenue",
        'None of these ideas apply here — ancient Indian concepts have no real connection to how modern city planning actually works',
      ],
      correct_index: 0,
      difficulty_level: 2,
    },
    {
      question:
        "The Arthashastra discusses taxation, the army, and a ruler's duties all in one text. What does this tell you about how it treats the idea of 'governance'?",
      options: [
        'That governance in ancient India was really only about collecting taxes efficiently from farmers and traders',
        'That governance was treated as one connected responsibility — covering economy, security and ethics together — rather than several unrelated jobs',
        'That the army and the royal treasury were considered completely unrelated departments with no connection to each other',
        'That the text is only of interest to historians today and has no real connection to how societies actually function',
      ],
      correct_index: 1,
      difficulty_level: 3,
    },
  ],
  'four-disciplines-one-society': [
    {
      question: 'Which four disciplines does Grade 9–10 Social Science mainly draw from?',
      options: [
        'Physics, Chemistry, Biology and Geography',
        'Sociology, Philosophy, Anthropology and Psychology',
        'Geography, History, Political Science and Economics',
        'History, Literature, Art and Music',
      ],
      correct_index: 2,
      difficulty_level: 1,
    },
    {
      question:
        'A new expressway is built through farmland. It displaces some families, raises land prices, and creates a political debate about compensation. Which of these best matches how this page says Social Science would approach it?',
      options: [
        'Assign it entirely to Economics, since in the end only the land prices and the compensation payments to farmers really matter in a case like this',
        'Ignore it altogether — large infrastructure projects like an expressway are considered completely outside the proper scope of Social Science',
        'Assign it entirely to Political Science, since it was a single government decision that caused the entire expressway project to happen in the first place',
        'Treat it as one event that needs Geography (the land), Economics (prices and compensation), Political Science (the debate and decision) and Society (the displaced families) working together',
      ],
      correct_index: 3,
      difficulty_level: 2,
    },
    {
      question:
        'The Cyclone Fani example shows disaster response working because geography, political science, economics and society lined up together. What is the strongest reasoning-based takeaway from this?',
      options: [
        "That leaving out any one discipline's piece of the plan — tracking, command, funding, or trusted local networks — risks the whole response failing",
        'That disaster response is really just a geography problem at heart, since storms and cyclones are purely natural, physical events',
        'That political decisions and government orders alone are always enough by themselves to save lives in any disaster',
        'That economics has nothing meaningful to do with disaster response, since no buying or selling actually happens during an evacuation',
      ],
      correct_index: 0,
      difficulty_level: 3,
    },
  ],
  'geography-the-study-of-place': [
    {
      question: 'According to this page, what does Geography study?',
      options: [
        'Only the memorised names and exact locations of countries, cities, rivers and mountain ranges, without asking why they matter',
        "The location and distribution of places, objects and people, and the relationship between human societies and their surroundings, over both space and time",
        "Only the physical rocks, soil and landforms of the Earth's surface, treated with no connection to the people living on them",
        'Only the historical events that happened to occur in a particular location, with no separate spatial or environmental focus',
      ],
      correct_index: 1,
      difficulty_level: 1,
    },
    {
      question:
        'A geographer studying a coastal town looks at its harbour depth, its trade history with other countries, and how its economy has shifted from fishing to shipping. Which tools or ideas from this page would help her most?',
      options: [
        "Maps and GIS alone are enough for her work, since for a geographer only the physical shape and depth of the coastline can really matter",
        'None of these tools really apply here — economic history belongs only to the subject of Economics, and Geography ought to stay separate from it entirely',
        "A combined spatial-and-temporal approach — using maps/GIS for location and physical features, alongside the town's history and economy to explain why it changed over time",
        "Only interviews with the town's current shop owners are needed, since Geography has no real investigative tools of its own to draw on",
      ],
      correct_index: 2,
      difficulty_level: 2,
    },
    {
      question:
        "India's long coastline is given as a reason India became a hub of global interaction. What is the strongest reasoning behind this claim?",
      options: [
        'A long coastline automatically makes any country wealthy and globally important, regardless of anything else happening around it',
        "A long coastline created many points of contact for ships and trade, so geography — a physical, spatial fact — shaped centuries of human interaction with distant regions",
        'Coastlines in general have no real effect on trade routes or interaction between distant countries and civilisations',
        'India\'s long trade history has nothing at all to do with its geography, and the two are simply an unrelated coincidence',
      ],
      correct_index: 1,
      difficulty_level: 3,
    },
  ],
  'history-the-study-of-the-past': [
    {
      question: 'What does modern historiography increasingly rely on, according to this page?',
      options: [
        'Mostly guesswork and popular legend, without needing any real evidence to back it up',
        'Empirical evidence — tools such as carbon-14 dating, human genetics and archaeology',
        'Only official written royal records, while ignoring every other kind of possible evidence',
        'Astrology and prediction, the same way ancient court astrologers once forecast events',
      ],
      correct_index: 1,
      difficulty_level: 1,
    },
    {
      question:
        'Archaeologists find a buried grain store with no written records nearby. Which method described on this page would help them work out roughly how old it is?',
      options: [
        'Reading a nearby itihasa-purana text for the exact year, since stories always carry an exact date',
        'Carbon-14 dating, one of the empirical, scientific methods historians now use to build timelines even without written records',
        'Asking local elders to guess based on family memory alone, since memory is the only source available',
        'There is no way to date it at all without a surviving written record',
      ],
      correct_index: 1,
      difficulty_level: 2,
    },
    {
      question:
        "The itihasa-purana tradition and modern carbon-dated historiography have very different goals. What is the strongest way to describe that difference, based on this page?",
      options: [
        'Yes — only sources that have been scientifically dated and backed by hard, measurable evidence should ever be treated as genuine history at all',
        'No — the moral and philosophical lessons found in old texts like this one are always factually false and can never reflect any real past event',
        "One tradition preserves cultural meaning, identity and enduring values through story; the other builds a precise, evidence-based timeline — different purposes, both genuinely historical",
        'Yes — the itihasa-purana tradition is really a fairly recent invention with no genuine connection to ancient India, and it carries no real historical weight',
      ],
      correct_index: 2,
      difficulty_level: 3,
    },
  ],
  'how-historians-know-the-past': [
    {
      question: 'Which type of historical source includes travelogues, memoirs and genealogical records?',
      options: ['Archaeological sources', 'Epigraphic sources', 'Numismatic sources', 'Literary sources'],
      correct_index: 3,
      difficulty_level: 1,
    },
    {
      question:
        'A team excavates an ancient settlement and finds pottery, tools and building foundations, but no writing of any kind. Which type of source have they found, and what can it still tell them?',
      options: [
        "Archaeological sources — material remains that, studied with scientific instruments and lab testing, reveal how people lived even without any writing",
        'Literary sources — written texts that would let historians read the exact words spoken by the people who once lived there',
        'Numismatic sources — coins that would reveal the exact ruler and the precise founding date of the settlement',
        'Epigraphic sources — stone inscriptions that would name the settlement and its rulers directly, if any had survived',
      ],
      correct_index: 0,
      difficulty_level: 2,
    },
    {
      question:
        'The Tirukkural (a literary source) and the Hampi inscription (an epigraphic source) are both centuries old and still exist today. What is the strongest reasoning-based point this makes about India\'s historical record?',
      options: [
        'That only one single, specific type of historical source could ever have realistically survived from as far back as ancient India',
        "India preserved evidence through more than one durable medium — palm-leaf texts AND stone inscriptions — giving historians multiple, independent ways to verify the same period",
        'That palm-leaf manuscripts and stone inscriptions surviving from roughly this period would always record exactly the same information',
        'That historical sources which have survived from ancient India are, in general, considerably less reliable than similar sources from other countries',
      ],
      correct_index: 1,
      difficulty_level: 3,
    },
  ],
  'political-science-power-and-governance': [
    {
      question: 'What does Political Science study, according to this page?',
      options: [
        'Only the exact dates on which national and state elections happen to be held each year',
        'Governance — how and why power is distributed, decisions are made, and policies are implemented',
        'Only the physical layout and architecture of government buildings and parliament houses',
        'Only the foreign languages that diplomats need to learn for international postings',
      ],
      correct_index: 1,
      difficulty_level: 1,
    },
    {
      question:
        'A village decides, through its own local meeting, where to build a new water tank — without waiting for a state-level order. Which idea from this page does this best demonstrate?',
      options: [
        'That political power exists only inside formal, official state institutions and nowhere else in everyday life',
        'That a small local decision like this has nothing at all to do with the subject of Political Science',
        'That only elected state or national governments have the legal standing to make any decision of this kind',
        'The Panchayati Raj idea that political power also exists in local, grassroots decision-making, not only in formal top-down institutions',
      ],
      correct_index: 3,
      difficulty_level: 2,
    },
    {
      question:
        "The Arthashastra treats taxation, the army and a ruler's ethical duty as one connected subject. What is the strongest reasoning-based conclusion about ancient Indian political thought from this?",
      options: [
        "That power was viewed as a responsibility tied to the people's welfare — not a privilege separated from economics or ethics — which is close to how modern accountable governance is meant to work",
        'That ancient Indian rulers, based only on what this text describes, were mainly concerned with collecting taxes efficiently from their subjects and little else',
        'That the army and military affairs were considered to have no real connection at all to how a kingdom was actually governed on a daily basis',
        'That this particular way of thinking about power and responsibility has no relevance or meaningful connection to how India is governed today',
      ],
      correct_index: 0,
      difficulty_level: 3,
    },
  ],
  'economics-choices-and-resources': [
    {
      question: 'According to this page, what does Economics study?',
      options: [
        'Only the daily ups and downs of stock market prices and how company shares are traded between investors and brokers',
        'How individuals and societies decide to use limited resources to meet their needs, including production, exchange and distribution of goods and services',
        'Only the way a government collects and manages taxes from citizens and businesses across the whole country each year',
        'Only the formal legal agreements that countries sign with each other to allow goods to move freely across their borders',
      ],
      correct_index: 1,
      difficulty_level: 1,
    },
    {
      question:
        "A family has to choose between repairing their roof and paying for extra school tuition this month — they can't afford both. Which economic idea from this page does this best illustrate?",
      options: [
        'That families in this situation never actually have to make any real economic choice at all',
        'That a trade-off like this belongs only to the subject of Political Science, and not to Economics',
        'How individuals decide to use limited resources to meet competing needs — the core question Economics studies',
        'That economic decisions of this kind only ever happen at the level of whole countries, never within a single family',
      ],
      correct_index: 2,
      difficulty_level: 2,
    },
    {
      question:
        "India was a leading global economy for centuries, was disrupted under colonial rule, and has been rebuilding since independence — yet the page says income growth still needs to reach everyone. What is the strongest reasoning-based takeaway from this whole arc?",
      options: [
        'That India\'s economic story is now essentially complete and fully finished, with genuinely nothing meaningful left to address or improve',
        "A country's economic strength can rise, fall and rebuild over time, and even after real progress, whether growth reaches everyone remains an open, ongoing challenge",
        'That colonial disruption had no lasting effect at all on India\'s economy once independence was finally achieved back in 1947',
        'That economic history of this particular kind only matters for very old, distant events, and has no real bearing on present-day policy decisions',
      ],
      correct_index: 1,
      difficulty_level: 3,
    },
  ],
  'why-social-science-matters': [
    {
      question:
        'Based on this chapter, what does it mean to say Social Science connects the past, present and future?',
      options: [
        'That understanding how past decisions shaped the present helps you make more informed choices for the future',
        'That memorising a long list of old historical dates lets you predict future events with real precision',
        'That there is, in the end, no real or meaningful difference between the past, the present and the future',
        'That only History as a subject deals with time at all, while Geography, Political Science and Economics do not',
      ],
      correct_index: 0,
      difficulty_level: 1,
    },
    {
      question:
        "A student wants to understand why her town has a mix of Hindi, Punjabi and English speakers, a busy market street, and an old fort at its centre. Which combination of disciplines from this chapter would help her explain all of it together?",
      options: [
        'History alone is enough to explain everything here, since the town\'s old fort at the centre is really the only thing that matters',
        "A combination — History (the fort and past settlement), Geography (why the town grew where it did), Economics (the market) and the social/cultural factors behind language diversity",
        'None of these disciplines really apply — this is just a collection of random local trivia with no systematic explanation behind any of it',
        'Economics alone is enough to explain everything here, simply because one busy market street happens to be involved in the town',
      ],
      correct_index: 1,
      difficulty_level: 2,
    },
    {
      question:
        "This chapter argues that citizens who understand Social Science can 'participate more responsibly in civic life.' What is the strongest reasoning behind that claim?",
      options: [
        'Because Social Science, in practice, teaches citizens to simply agree with every government decision made on their behalf, without ever asking further questions about it',
        'Because only elected politicians and senior government officials actually need to understand how these four disciplines connect to real decisions',
        'Because understanding how governance, economy, geography and history connect helps a citizen ask better, more informed questions about decisions that affect them — rather than accepting or rejecting them blindly',
        'Because civic life, when you look closely, has essentially nothing meaningful to do with any of these four disciplines or how they connect to each other',
      ],
      correct_index: 2,
      difficulty_level: 3,
    },
  ],
};

async function main() {
  await bw.withDb(async (db) => {
    for (const [slug, newQuestions] of Object.entries(FIXES)) {
      const page = await db.collection('book_pages').findOne({ book_id: 'a60d142c-c96b-48cc-ba72-e68d71d83802', slug });
      if (!page) throw new Error(`page not found: ${slug}`);
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      if (quizIdx === -1) throw new Error(`no inline_quiz on ${slug}`);
      const oldQuiz = page.blocks[quizIdx];
      // Preserve each existing question's own id where possible (same array length/order-independent
      // isn't required — question objects have no `type`, so book-writer's block-id guard ignores them).
      const newQuiz = {
        ...oldQuiz,
        questions: newQuestions.map((q, i) => ({ id: oldQuiz.questions[i]?.id || require('uuid').v4(), ...q })),
      };
      const newBlocks = page.blocks.map((b, i) => (i === quizIdx ? newQuiz : b));
      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: 'Rebalanced quiz options: fixed 89% "B is always correct" + severe length-tell (§3.6.1 gate)',
      });
      console.log(`✓ ${slug} — quiz rebalanced (v${res.version})`);
    }
  });
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
