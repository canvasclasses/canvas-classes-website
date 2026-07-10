'use strict';
// Class 9 Social Science — Chapter 1 "Understanding Social Science" — build all 9 pages.
// Source: ~/Downloads/Class 9 Social science/iest101.pdf (read in full before authoring).
// Plan approved in _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md.
// Locked settings: English-only (hinglish_blocks: []), images src:'' + generation_prompt,
// published: false. New pages only — brand-new inserts, not touching any existing content.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CHAPTER_NUMBER = 1;

const HERO_STYLE =
  'Dark cinematic background, atmospheric Indian-illustration style, painterly, no text overlay.';

function hero(prompt) {
  return {
    id: uuid(),
    type: 'image',
    order: 0,
    src: '',
    alt: 'Hero banner',
    caption: '',
    width: 'full',
    aspect_ratio: '16:5',
    generation_prompt: `${prompt} ${HERO_STYLE}`,
  };
}
function text(markdown) {
  return { id: uuid(), type: 'text', order: 0, markdown };
}
function heading(txt, level = 2) {
  return { id: uuid(), type: 'heading', order: 0, text: txt, level };
}
function callout(variant, title, markdown) {
  return { id: uuid(), type: 'callout', order: 0, variant, title, markdown };
}
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') {
  return {
    id: uuid(),
    type: 'image',
    order: 0,
    src: '',
    alt,
    caption,
    width: 'full',
    aspect_ratio,
    generation_prompt: `${generation_prompt} Dark background, orange accent labels, clean technical illustration style.`,
  };
}
function curiosityPrompt(prompt, hint, reveal) {
  return { id: uuid(), type: 'curiosity_prompt', order: 0, prompt, hint, reveal };
}
function reasoningPrompt(reasoning_type, prompt, options, reveal, difficulty_level) {
  return { id: uuid(), type: 'reasoning_prompt', order: 0, reasoning_type, prompt, options, reveal, difficulty_level };
}
function table(caption, headers, rows) {
  return { id: uuid(), type: 'table', order: 0, caption, headers, rows };
}
function meetAThinker(fields) {
  return { id: uuid(), type: 'meet_a_scientist', order: 0, portrait_src: '', ...fields };
}
function quiz(questions) {
  return {
    id: uuid(),
    type: 'inline_quiz',
    order: 0,
    pass_threshold: 0.67,
    questions: questions.map((q) => ({ id: uuid(), ...q })),
  };
}
function withOrders(blocks) {
  return blocks.map((b, i) => ({ ...b, order: i }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — what-is-social-science
// ─────────────────────────────────────────────────────────────────────────────
const p1 = {
  slug: 'what-is-social-science',
  title: 'What Is Social Science, Really?',
  subtitle:
    "Every road, market and rule around you was built by someone's decision — this is the subject that studies those decisions.",
  blocks: withOrders([
    hero(
      "Ultra-wide banner (16:5). An Indian town at dusk seen from a hill — homes, a marketplace, a school, a winding road, farmland, and a distant city skyline all in one frame, lights coming on one by one, connected by a soft glow. Conveys a whole society quietly, invisibly interconnected."
    ),
    curiosityPrompt(
      "Pick one thing you used this morning — your uniform, the milk in your tea, the road you walked on. Before reading further, how many different people, decisions and places do you think it passed through before it reached you?",
      'Think about who grew it, made it, transported it, priced it, and allowed it to be sold or built.',
      "You probably had to stop and actually work that out. That pause — noticing that ordinary things are built from many decisions — is exactly what this page is about."
    ),
    text(
      "In Grades 6 to 8, you explored Social Science through stories of people, places and events. Now it's time to step back and ask what the subject actually means.\n\nHuman beings live in societies and depend on each other constantly. Your life is shaped by the environment around you, the institutions that govern you, the economic activities that meet your needs, and the traditions passed down to you. Social Science is the systematic study of these connections. It doesn't just tell you what happened or where something is located — it explains **why** events happen, how people live together, how environments shape life, how governments function, how economies operate, and how the past and present together shape the world.\n\nPhysics, Chemistry and Biology study the natural world. Social Science studies society itself — institutions, cultures, and the way humans interact."
    ),
    heading('Why Nothing Around You Happens by Chance'),
    text(
      "You wake up in a house built from materials sourced from different places. Your food travelled through many hands before it reached your plate — grown, harvested, transported, priced, and sold. You travel on roads planned by public authorities and study in a school shaped by education policy. Even your electricity was generated far away and delivered through a vast network.\n\nNow look further out. Why do some people live in crowded cities while others live in scattered villages? Why do different communities speak different languages and follow different customs? Why does one region depend on farming while another turns to industry or trade? Why are some places more prone to floods, and why does climate change affect some lives more than others?\n\nQuestions like these show that society does not run by chance. It is shaped by history, geography, institutions, resources, and human choices — and Social Science is how you go looking for the reasons, through observation, evidence and reasoning."
    ),
    reasoningPrompt(
      'logical',
      "Two students are asked why a district keeps flooding every year. One says: 'the river's monsoon discharge exceeds what the channel can carry' — a fact about water and land. The other says: 'the embankments were poorly maintained, homes were built on the floodplain, and warnings didn't reach people in time.' Which explanation is Social Science's job to study, and why?",
      [
        "The first — because rainfall and river discharge are measurable numbers, and numbers make something a Social Science question",
        'The second — because it explains the flood through human decisions, institutions and choices, which is what Social Science studies, while the first explains it through a natural process',
        'Neither — floods are accidents of nature that cannot be explained by any systematic study',
        'Both equally — Social Science and the natural sciences ask exactly the same kind of question, only in different words',
      ],
      "The river's physics stays roughly the same each year, but the human decisions around it don't. Social Science studies how people, institutions and choices shape what happens to a society — even inside a natural event like a flood.",
      2
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      "Somewhere near you, something has changed in the last five years — a road got wider, a shop turned into a mobile-recharge counter, a field became a housing colony. Nobody announced it as a 'Social Science event' at the time. But trace why it happened — a new road plan, a family's changing income, a shift in what people wanted to buy — and you're doing exactly what this subject does. What has changed near you, and who do you think decided it?"
    ),
    quiz([
      {
        question: 'Based on this page, what is Social Science, in simple words?',
        options: [
          'The study of important dates, wars and rulers from the past',
          'The systematic study of human society — how people live, govern, produce and change over time',
          "The study of the physical earth's rocks, rivers and mountains",
          'The study of natural laws that govern matter and energy',
        ],
        correct_index: 1,
        explanation:
          "Social Science studies society as a whole — not just the past (History alone) or the physical earth (Geography alone). It explains why events happen and how people, environment, governance and economy connect.",
        difficulty_level: 1,
      },
      {
        question:
          "A drought hits a district: crops fail, farmers' incomes drop, some families migrate to cities, and the government announces relief funds. Which of these best matches what Social Science would say about this one event?",
        options: [
          'Only Economics matters here, since the story is really about money',
          'Only Geography matters here, since a drought is a physical, environmental event',
          'Several disciplines together — environment, economy, politics, society and culture all shape what happens in a single event like this',
          'None of them — a drought is pure chance and cannot be systematically explained',
        ],
        correct_index: 2,
        explanation:
          'A single event like a drought touches environment, income, government response, migration and culture at once — which is exactly why Social Science studies society through more than one lens.',
        difficulty_level: 2,
      },
      {
        question:
          "Two students argue about a new highway planned through their town. One says, 'This is purely an engineering decision — just build the road.' What is the strongest reason the other student is right to call this a Social Science question too?",
        options: [
          'Social Science studies who the road displaces, whose land it crosses, how it changes local trade and travel, and who decided its route — an engineering plan sits inside human choices and consequences',
          'Building roads always needs government permission, and permissions are Social Science by definition',
          'Engineering and Social Science are actually the same subject taught under different names',
          'The first student is technically correct, and there is no valid counter-argument',
        ],
        correct_index: 0,
        explanation:
          "A road is more than concrete and measurements — it displaces people, reshapes trade, and reflects who had the power to decide its route. That human layer is exactly what Social Science studies.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — indias-roots-in-social-thinking
// ─────────────────────────────────────────────────────────────────────────────
const p2 = {
  slug: 'indias-roots-in-social-thinking',
  title: "India Was Asking These Questions Long Before 'Social Science' Had a Name",
  subtitle:
    'Systematic thinking about society, environment and governance runs through Indian tradition for thousands of years.',
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). An ancient Indian scholar reading palm-leaf manuscripts by oil-lamp light in an open pavilion at dusk, other scholars in quiet discussion nearby, stone pillars in the background.'
    ),
    curiosityPrompt(
      "Long before universities or subject names existed, people in ancient India were already asking: how does the land shape where we settle? Why do we feel connected to people we've never met? How should a ruler treat their people? Do you think questions like these needed a 'Social Science' label to be worth asking seriously?"
    ),
    text(
      "Society has not always looked the way it does today. Over thousands of years, people moved from depending directly on nature to growing crops, domesticating animals, building settlements, and organising systems of governance. Villages grew into towns, towns into cities, and each stage brought new ideas and exchanges.\n\nThis spirit of inquiry has deep roots in India's knowledge traditions. Early thinkers valued discussion, questioning and logical reasoning to understand the world — long before the modern academic disciplines you'll study existed."
    ),
    heading('Reading the World as One System'),
    text(
      'The idea of the **Panchamahabhutas** — the five great elements: earth (Prithvi), water (Apah), fire (Agni), air (Vayu) and space (Akasha) — describes the natural world as one interconnected system, with human life embedded inside it. It helps explain how environment shapes settlement patterns, occupations, architecture, food habits and health practices — an idea that still matters as societies respond to environmental challenges today.'
    ),
    callout(
      'india_science',
      "India's Contribution — One World, One Family",
      "Alongside the Panchamahabhutas sits another idea: **vasudhaiva kutumbakam**, meaning 'the world is one family.' It expresses the interconnectedness of human societies across regions and cultures — the same interdependence modern Social Science studies when it looks at global trade, migration, and shared challenges like climate change."
    ),
    heading('Kautilya and the Study of Governance'),
    text(
      "Early reflections on governance in India linked political authority directly to public welfare and ethical responsibility. The **Arthashastra**, attributed to Kautilya and composed about 2,300 years ago, examined administration, economic management, taxation, and the duties of rulers toward their people.\n\nWorks like this show that systematic thinking about governance and the economy existed long before modern academic disciplines were ever named."
    ),
    meetAThinker({
      name: 'Kautilya (Chanakya)',
      years: 'c. 4th century BCE',
      nationality: 'Indian',
      portrait_prompt:
        'Portrait illustration of an ancient Indian scholar-statesman, formal traditional attire, thoughtful expression, palm-leaf manuscript in hand. Dark neutral background, clean editorial illustration style.',
      contribution:
        'Credited with the **Arthashastra**, a detailed treatise on statecraft covering administration, taxation, the army, and the economy — one of the earliest systematic studies of how a state should actually be run.',
      connection:
        "Every idea on this page about governance, economy and the duties of rulers being connected — not separate subjects — traces back to exactly this kind of thinking.",
      fun_detail:
        "The Arthashastra doesn't stop at ideals — it gets specific, down to how a treasury should be audited and how spies should be trained, which is why historians treat it as a practical manual, not just philosophy.",
      learn_more: '',
    }),
    reasoningPrompt(
      'analogical',
      "The Arthashastra links politics, economics, and a ruler's moral duty (dharma) in one text, instead of treating them as separate subjects. Based on the Panchamahabhutas and the Arthashastra on this page, what does this tell you about how ancient Indian thinkers viewed the study of society?",
      [
        "They saw governance, economy and environment as separate fields that shouldn't be mixed",
        'They treated society as one connected system — governance, economy, ethics and environment all feeding into each other — close to how modern Social Science studies these links today',
        'They were mainly interested in ritual and had little interest in practical administration',
        'They borrowed these ideas from much later European traditions',
      ],
      "The Panchamahabhutas connects environment to daily life; the Arthashastra connects governance to economy and ethics. Neither treats these as separate boxes — which is exactly the connected view Social Science takes today.",
      3
    ),
    callout(
      'what_if',
      'What if…',
      'What if a modern government tried to run entirely on the Arthashastra, without adapting anything for today\'s technology, population size or global trade? What parts do you think would still hold up, and what would clearly need to change?'
    ),
    quiz([
      {
        question: 'What do the Panchamahabhutas describe?',
        options: [
          'A system of taxation used by ancient Indian kings',
          'The natural world as five interconnected elements — earth, water, fire, air and space — with human life embedded in it',
          'A council of five advisors who assisted the king',
          'A set of five ancient Indian universities',
        ],
        correct_index: 1,
        explanation:
          'The Panchamahabhutas is a framework describing nature as one connected system, not a political or administrative structure.',
        difficulty_level: 1,
      },
      {
        question:
          "A modern city planner is deciding where to build new housing. She studies the local soil, water supply, and how nearby communities already live and travel — instead of only checking which empty plot is cheapest. Which idea from this page is closest to what she is doing?",
        options: [
          "Vasudhaiva kutumbakam, since she is thinking about the whole world as one family",
          "The Panchamahabhutas' view that environment and human settlement are deeply connected, not separate concerns",
          "The Arthashastra's rules on taxation",
          'None of these ideas apply to modern city planning',
        ],
        correct_index: 1,
        explanation:
          "Considering soil, water and existing community patterns together — instead of treating land as an empty, disconnected plot — reflects the Panchamahabhutas' view of environment and society as one system.",
        difficulty_level: 2,
      },
      {
        question:
          "The Arthashastra discusses taxation, the army, and a ruler's duties all in one text. What does this tell you about how it treats the idea of 'governance'?",
        options: [
          'That governance is really only about collecting taxes efficiently',
          'That governance was treated as one connected responsibility — covering economy, security and ethics together — rather than several unrelated jobs',
          'That the army and the treasury had nothing to do with each other in ancient India',
          'That the text is only useful to historians and has no connection to how societies actually function',
        ],
        correct_index: 1,
        explanation:
          "By covering taxation, the army and a ruler's duties together, the Arthashastra treats governance as one interconnected responsibility — the same holistic view Political Science takes when it studies power today.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — four-disciplines-one-society
// ─────────────────────────────────────────────────────────────────────────────
const p3 = {
  slug: 'four-disciplines-one-society',
  title: "Social Science Isn't One Subject — It's a Team",
  subtitle: 'One drought. Five different reasons it matters. This page shows why society needs more than one lens.',
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A drought-affected Indian farming landscape at dusk — cracked earth in the foreground, a distant road with a few travelling figures, faint lights of a government building and a town on the horizon, all in one connected frame.'
    ),
    curiosityPrompt(
      "A drought hits a farming district. Crops fail. Before reading on — how many different kinds of problems do you think one drought actually creates, beyond simply 'not enough rain'?"
    ),
    text(
      "Human society is complex, and no single field of study can fully explain it. Take a drought: it affects crops (environment), farmers' incomes (economy), government relief measures (politics), migration to cities (society), and traditional ways of coping with scarcity (culture).\n\nTo understand a situation like this, you have to look at society from more than one angle. Social Science, therefore, is not a single subject but a group of related disciplines, each focusing on a different part of human life. Together, they build a connected understanding."
    ),
    heading('Four Disciplines, One Understanding'),
    text(
      'In Grades 9–10, Social Science draws mainly from four disciplines:\n\n- **Geography** studies the Earth, its environments, and the relationship between people and their surroundings.\n- **History** examines the human past and how societies change over time.\n- **Political Science** analyses systems of governance, power, and the rights and responsibilities of citizens.\n- **Economics** explores how societies produce, distribute and use resources to meet their needs.\n\nOther fields — Sociology, Philosophy, Anthropology and Psychology — are also part of the wider Social Science family, and you\'ll go deeper into them in later grades. Each discipline asks a different question, but together they give a complete picture of society.'
    ),
    reasoningPrompt(
      'logical',
      'A city bans single-use plastic bags. Which of these best explains why Political Science, Economics AND Society/Culture would all have something worth saying about this one law?',
      [
        'Only Political Science matters, since a law was passed',
        'Only Economics matters, since shopkeepers and bag-manufacturers lose business',
        'All of them — the law involves who decided it and how it will be enforced (politics), what it costs producers and shoppers (economics), and how people\'s daily habits and attitudes will need to change (society and culture)',
        "None of them — a plastic ban is purely an environmental issue with no social angle at all",
      ],
      'A single law touches governance, cost and everyday habits at once — which is exactly why one event needs more than one discipline to be understood fully.',
      2
    ),
    callout(
      'bridging_science',
      'Bridging Disciplines and Real Life',
      "When Odisha evacuated over a million people ahead of Cyclone Fani in 2019 with very few lives lost, it worked because several things had to line up together: tracking the storm's path (geography), a clear chain of command to move people fast (political science), funding shelters and relief (economics), and trusted local networks getting the warning to people in time (society). Leave out any one of these, and the plan could have failed."
    ),
    quiz([
      {
        question: 'Which four disciplines does Grade 9–10 Social Science mainly draw from?',
        options: [
          'Geography, History, Political Science and Economics',
          'Physics, Chemistry, Biology and Geography',
          'Sociology, Philosophy, Anthropology and Psychology',
          'History, Literature, Art and Music',
        ],
        correct_index: 0,
        explanation:
          'These four core disciplines are named directly on this page as the main focus for Grades 9–10, while Sociology, Philosophy, Anthropology and Psychology form the wider family studied more deeply later.',
        difficulty_level: 1,
      },
      {
        question:
          "A new expressway is built through farmland. It displaces some families, raises land prices, and creates a political debate about compensation. Which of these best matches how this page says Social Science would approach it?",
        options: [
          'Assign it entirely to Economics, since land and money are involved',
          'Treat it as one event that needs Geography (the land), Economics (prices and compensation), Political Science (the debate and decision) and Society (the displaced families) working together',
          'Ignore it, since infrastructure projects are outside the scope of Social Science',
          'Assign it entirely to Political Science, since a government decision caused it',
        ],
        correct_index: 1,
        explanation:
          'Like the drought example, one event (an expressway) touches several disciplines at once — Social Science studies it as a connected whole, not as one discipline\'s problem alone.',
        difficulty_level: 2,
      },
      {
        question:
          'The Cyclone Fani example shows disaster response working because geography, political science, economics and society lined up together. What is the strongest reasoning-based takeaway from this?',
        options: [
          'That disaster response is really just a geography problem, since storms are natural events',
          'That leaving out any one discipline\'s piece of the plan — tracking, command, funding, or trusted local networks — risks the whole response failing',
          'That political decisions alone are always enough to save lives in a disaster',
          'That economics has nothing to do with disaster response since no one is buying or selling anything',
        ],
        correct_index: 1,
        explanation:
          "The example works precisely because all four pieces held together — it's a reasoning check on why Social Science studies events through multiple disciplines rather than picking just one.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — geography-the-study-of-place
// ─────────────────────────────────────────────────────────────────────────────
const p4 = {
  slug: 'geography-the-study-of-place',
  title: 'Geography — Why Places Are Never Just Dots on a Map',
  subtitle: "Where something is located is never the whole story — geography asks why it's there, and what that means for the people living there.",
  blocks: withOrders([
    hero(
      "Ultra-wide banner (16:5). India's coastline at dusk, seen from above — ships sailing toward distant horizons on both sides, mountains and plains visible inland, suggesting centuries of trade connecting India to Africa, Europe and Southeast Asia."
    ),
    curiosityPrompt(
      'India has one of the longest coastlines in the world. Before reading on — why do you think that single geographic fact could help explain centuries of trade with Africa, Europe and Southeast Asia?'
    ),
    text(
      "Geography studies the location and distribution of places, objects, materials and people, and the relationship between human societies and their surroundings. It looks at both the physical features of the Earth's surface and the human communities that live on it — how people interact with the environment, and how places affect one another over time.\n\nGeography treats the world as a system of interdependencies. It combines a **spatial** perspective — location and its significance — with a **temporal** one — change over time. It draws on natural sciences (Physics, Chemistry, Biology) as well as social sciences (Political Science, Economics, History). That combination is exactly how it answers a question like why India has historically been a hub of global interaction — its long coastline made contact with distant regions possible for centuries."
    ),
    heading('The Tools Geographers Actually Use'),
    text(
      'To investigate these questions, geography uses maps, globes, atlases, Geographical Information Systems (GIS), and infographics, among other instruments. Over the next two years, you\'ll see how these tools sharpen what you can actually learn from a place.'
    ),
    callout(
      'india_science',
      "India's Own Mapping Platform — Bhuvan",
      "NCERT's School Bhuvan portal, built on ISRO's satellite mapping platform, lets you map your own village or city using real geospatial data. You can explore it yourself at bhuvan-app1.nrsc.gov.in/mhrd_ncert — a genuinely Indian tool putting the same kind of geographic analysis professional geographers use into a student's hands."
    ),
    reasoningPrompt(
      'logical',
      "A student says, 'Geography is basically just remembering where cities and rivers are.' Based on what this page says Geography actually studies, what is the strongest correction?",
      [
        "That's basically correct — geography is mainly about memorising locations",
        'Geography does look at where things are, but it goes further — asking why they are there, and how environment and human choices affect each other over time, using tools like maps and satellite data',
        'Geography only studies natural landscapes and never involves people at all',
        'The student is wrong — geography should really be renamed Political Science',
      ],
      "Knowing a location is only the starting point. Geography's real work is asking why that location matters, and how it shapes — and is shaped by — the people living there over time.",
      2
    ),
    text(
      "Over the next two years, you'll study the processes that shape the Earth's surface and different landforms, the atmosphere and climate, oceans, major biomes and India's biosphere reserves, geospatial technologies, life in different regions of India and the world, and how geographical knowledge itself developed over time."
    ),
    quiz([
      {
        question: 'According to this page, what does Geography study?',
        options: [
          'Only the memorised names and locations of countries, cities and rivers',
          "The location and distribution of places, objects and people, and the relationship between human societies and their surroundings, over both space and time",
          'Only the physical rocks, soil and landforms of the Earth, with no connection to people',
          'Only historical events that happened in a particular location',
        ],
        correct_index: 1,
        explanation:
          "Geography combines where something is (spatial) with why it matters and how it changes (temporal) — location and human life together, not memorised facts alone.",
        difficulty_level: 1,
      },
      {
        question:
          'A geographer studying a coastal town looks at its harbour depth, its trade history with other countries, and how its economy has shifted from fishing to shipping. Which tools or ideas from this page would help her most?',
        options: [
          'Maps and GIS alone, since only the physical coastline matters',
          "A combined spatial-and-temporal approach — using maps/GIS for location and physical features, alongside the town's history and economy to explain why it changed over time",
          'None — economic history belongs only to Economics, not Geography',
          'Only interviews with current shop owners, since geography has no tools of its own',
        ],
        correct_index: 1,
        explanation:
          "This is exactly the spatial-plus-temporal, cross-disciplinary approach the page describes — Geography borrows from History and Economics because places and their meaning change over time.",
        difficulty_level: 2,
      },
      {
        question:
          "India's long coastline is given as a reason India became a hub of global interaction. What is the strongest reasoning behind this claim?",
        options: [
          'A long coastline automatically makes a country wealthy, regardless of anything else',
          "A long coastline created many points of contact for ships and trade, so geography — a physical, spatial fact — shaped centuries of human interaction with distant regions",
          "Coastlines have no real effect on trade or interaction between countries",
          'India\'s trade history has nothing to do with its geography at all',
        ],
        correct_index: 1,
        explanation:
          "This is the core idea of geography as this page defines it: a physical feature (a long coastline) directly shaped a long-running human and economic pattern (global trade contact).",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5 — history-the-study-of-the-past
// ─────────────────────────────────────────────────────────────────────────────
const p5 = {
  slug: 'history-the-study-of-the-past',
  title: 'History — How We Know What Happened Before We Were Born',
  subtitle: 'Nobody alive today watched the Indus cities rise — history is the discipline that reconstructs it anyway.',
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A historian examining an old manuscript by lamp-light in a quiet archive at dusk, ancient ruins faintly visible through a window behind them, suggesting the past being carefully reconstructed in the present.'
    ),
    curiosityPrompt(
      'If nobody who lived 2,000 years ago is alive to tell you what happened, how do you think historians can still say anything reliable about that time at all?'
    ),
    text(
      "History is the study of the human past, through which societies try to understand people's experiences, values, and how things changed over time. There are multiple ways to interpret the past and pass cultural values from one generation to the next.\n\nOne of the oldest and most influential traditions of preserving cultural memory in Bharat is the **itihasa-purana** tradition. Through stories, it shares historical information while also giving cultural meaning to events and people — reinforcing enduring ideals and offering a sense of identity and purpose. Different cultures have used different methods this way: some emphasise moral and philosophical insight, others documentary verification."
    ),
    heading('From Stories to Evidence'),
    text(
      "Modern historiography, by contrast, increasingly relies on empirical evidence — using tools such as human genetics, carbon-14 dating, archaeology, and other scientific methods to establish timelines and understand the past more precisely."
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      'A single grain of ancient rice, tested with carbon-14 dating, can tell historians how old a settlement is to within a few decades — without a single written record surviving from that time. What do you think a scientist actually measures inside that grain to work this out?'
    ),
    reasoningPrompt(
      'logical',
      "A text describes a king's reign almost entirely through moral lessons and legendary encounters, with very few exact dates. A separate study analyses coins and inscriptions from the same period to build a precise timeline. Does the first text count as 'not real history'?",
      [
        'Yes — only scientifically dated, evidence-based sources count as history',
        'No — it belongs to a different tradition, one that carries cultural meaning and identity, while the second study uses modern empirical methods to build a precise timeline; both are genuine ways history has been studied',
        'No — because moral lessons in old texts are always factually false',
        'Yes — the itihasa-purana tradition was invented recently and carries no real historical weight',
      ],
      "The page treats itihasa-purana and modern empirical historiography as two different, both-valid traditions — one built for meaning and identity, the other for precise timelines using scientific tools.",
      3
    ),
    text(
      "History writing draws on many kinds of sources — a topic this book takes up in full on the next page. Over the next two years, you'll trace early human history and India's development from the beginnings of civilisation to the present, alongside world landmarks such as the Greco-Roman world, the Reformation, the Renaissance, the Enlightenment and the Industrial Revolution — as well as colonialism and the anti-colonial struggles against it."
    ),
    quiz([
      {
        question: 'What does modern historiography increasingly rely on, according to this page?',
        options: [
          'Guesswork and popular legend alone',
          'Empirical evidence — tools such as carbon-14 dating, human genetics and archaeology',
          'Only written royal records, ignoring all other evidence',
          'Astrology and prediction',
        ],
        correct_index: 1,
        explanation:
          'Modern historiography leans on empirical, scientific evidence to establish timelines — a shift from purely narrative traditions toward measurable methods.',
        difficulty_level: 1,
      },
      {
        question:
          "Archaeologists find a buried grain store with no written records nearby. Which method described on this page would help them work out roughly how old it is?",
        options: [
          'Reading a nearby itihasa-purana text for the exact year',
          'Carbon-14 dating, one of the empirical, scientific methods historians now use to build timelines even without written records',
          'Asking local elders to guess based on family memory alone',
          'There is no way to date it without a written record',
        ],
        correct_index: 1,
        explanation:
          'Carbon-14 dating is exactly the kind of empirical method the page names for building a timeline when written records are absent.',
        difficulty_level: 2,
      },
      {
        question:
          "The itihasa-purana tradition and modern carbon-dated historiography have very different goals. What is the strongest way to describe that difference, based on this page?",
        options: [
          'One is entirely fictional and the other is entirely factual, with nothing in between',
          "One tradition preserves cultural meaning, identity and enduring values through story; the other builds a precise, evidence-based timeline — different purposes, both genuinely historical",
          'They are identical in method and purpose, just written in different languages',
          'Only the empirical method has ever mattered to any society at any point in history',
        ],
        correct_index: 1,
        explanation:
          'The page is explicit that both traditions are real ways of engaging with the past — they simply serve different purposes: meaning-making versus precise timeline-building.',
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 6 — how-historians-know-the-past
// ─────────────────────────────────────────────────────────────────────────────
const p6 = {
  slug: 'how-historians-know-the-past',
  title: 'The Four Kinds of Clues Historians Actually Use',
  subtitle: "A palm-leaf manuscript, a broken clay figurine, a stone inscription, an old coin — each tells historians something the others can't.",
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A warmly lit museum display case at dusk holding an old palm-leaf manuscript, a small terracotta figurine, a stone inscription fragment, and an ancient coin, arranged together as if a historian just laid them out to study.'
    ),
    curiosityPrompt(
      "If you found an old coin buried in your backyard, what do you think it could actually tell a historian, beyond simply 'this is old'?"
    ),
    text(
      "History writing draws on a wide range of sources to understand the social realities of the past. Historians sort this evidence into a few broad types — each revealing something the others can't."
    ),
    table(
      'The Four Types of Historical Evidence',
      ['Type of Source', 'What It Actually Is', 'Example From This Chapter'],
      [
        [
          'Literary sources',
          'Written texts — travelogues, memoirs, letters, family-lineage (genealogical) records, folklore, oral traditions and revenue documents',
          'The Samaveda manuscript (National Museum, New Delhi); the Tirukkural, an ancient Tamil text of ethical wisdom, preserved on palm-leaf',
        ],
        [
          'Archaeological sources',
          'Material remains dug up and studied — monuments, buildings, excavated sites, artefacts, sculptures and paintings, often analysed with scientific instruments and lab testing',
          'A terracotta figurine from the Sindhu-Sarasvati Civilisation; a 12th-century CE sculpture of Vishnu',
        ],
        [
          'Epigraphic sources',
          'Inscriptions — texts, decrees or records carved into durable material like stone, metal plates or rock surfaces',
          "A Brahmi inscription from the Gupta period; a Kannada inscription of Emperor Krishnadeva Raya at Hampi's Prasanna Virupaksha Temple",
        ],
        [
          'Numismatic sources',
          'Coins, currency and medals, studied through their metal content, inscriptions and symbols',
          "A coin issued by King Samudragupta (4th century CE); a Mughal coin from Jahangir's reign showing the zodiac sign Sagittarius",
        ],
      ]
    ),
    image(
      'The four kinds of historical evidence arranged together — manuscript, figurine, inscription, coin',
      '📸 The four kinds of evidence historians read like clues',
      'Museum-display illustration showing four historical artefacts arranged on a dark velvet surface: an open palm-leaf manuscript with visible script, a small weathered terracotta figurine, a fragment of stone carved with inscription characters, and an ancient coin showing a faint profile. Soft focused lamp-light from above. Label: Literary, Archaeological, Epigraphic, Numismatic.',
      '16:9'
    ),
    reasoningPrompt(
      'logical',
      "A historian finds only a single coin from a king's reign — no manuscripts or inscriptions survive from that period. Based on what numismatic sources are described as revealing, what could the historian still learn from that coin alone?",
      [
        "Nothing reliable — a single coin can't tell you anything about a whole reign",
        'Only the exact date a specific battle was fought',
        "Something about the economy, trade, rulers, chronology and culture of that time — numismatic sources are studied through their metal content, inscriptions and symbols",
        "Only the king's personal artistic taste, and nothing else",
      ],
      "Numismatic evidence is read the same way a detective reads a clue — the metal, inscriptions and symbols on one coin can point to economy, rulers, trade routes and even political boundaries.",
      2
    ),
    callout(
      'india_science',
      "India's Living Archive",
      "The Tirukkural survived for centuries on palm-leaf manuscripts, long before printing existed in India. Inscriptions like the one at Hampi's Virupaksha temple still stand in the open air, still readable, centuries after they were carved. India's epigraphic and literary record is one of the richest, longest continuous archives in the world."
    ),
    quiz([
      {
        question: 'Which type of historical source includes travelogues, memoirs and genealogical records?',
        options: ['Archaeological sources', 'Literary sources', 'Epigraphic sources', 'Numismatic sources'],
        correct_index: 1,
        explanation:
          'Literary sources are written texts — travelogues, memoirs, letters, genealogical records, folklore and revenue documents fall under this category.',
        difficulty_level: 1,
      },
      {
        question:
          "A team excavates an ancient settlement and finds pottery, tools and building foundations, but no writing of any kind. Which type of source have they found, and what can it still tell them?",
        options: [
          'Literary sources — they can read the exact words the people spoke',
          "Archaeological sources — material remains that, studied with scientific instruments and lab testing, reveal how people lived even without any writing",
          'Numismatic sources — coins that reveal the exact ruler of the time',
          'Epigraphic sources — inscriptions that name the settlement directly',
        ],
        correct_index: 1,
        explanation:
          'Pottery, tools and building foundations are material remains — archaeological sources — which historians analyse without needing any written text at all.',
        difficulty_level: 2,
      },
      {
        question:
          "The Tirukkural (a literary source) and the Hampi inscription (an epigraphic source) are both centuries old and still exist today. What is the strongest reasoning-based point this makes about India's historical record?",
        options: [
          'That only one type of source can ever survive from ancient India',
          "That India preserved evidence through more than one durable medium — palm-leaf texts AND stone inscriptions — giving historians multiple, independent ways to verify the same period",
          'That palm-leaf and stone inscriptions always say exactly the same thing',
          'That ancient Indian sources are less reliable than sources from other countries',
        ],
        correct_index: 1,
        explanation:
          'Having both literary and epigraphic evidence survive from the same broad era gives historians independent, cross-checkable sources — a genuine strength, not a coincidence.',
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 7 — political-science-power-and-governance
// ─────────────────────────────────────────────────────────────────────────────
const p7 = {
  slug: 'political-science-power-and-governance',
  title: 'Political Science — Who Decides, and Why It Matters',
  subtitle: 'From your gram panchayat to Parliament, someone is deciding how power gets used — this is the discipline that studies that.',
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A Gram Sabha meeting under a large tree in an Indian village at dusk, villagers of different ages seated in a circle discussing, a single lamp lighting the centre — grassroots democracy in action.'
    ),
    curiosityPrompt(
      'Somebody, somewhere, decided the rules your school follows, the taxes your family pays, and who gets to build a road through your neighbourhood. Have you ever wondered how decisions like these actually get made, and who really holds the power to make them?'
    ),
    text(
      "Political Science is the study of governance — how and why power is distributed, decisions are made, and policies are implemented. It examines constitutions, governments and the institutions of the State, alongside social movements, nation-building, foreign policy, and the ways power is exercised, shared and regulated in everyday life."
    ),
    heading("Power Isn't Only in Government Buildings"),
    text(
      "In India's villages, the **Panchayati Raj** system embodies grassroots democracy by giving citizens a direct voice in local development planning. This shows that political power exists not only in formal institutions, but also in social relationships, customs, and ideas of legitimacy. To study politics, then, is to examine society itself — its hierarchies, and its struggles for more effective, accountable governance."
    ),
    heading('Governance Is an Old Indian Question, Not a New One'),
    text(
      'Politics in India was never treated as a separate discipline — it was closely linked to **dharma** (moral duty), **artha** (economic well-being) and **rajadharma** (the duties of the ruler). Early texts like the Vedas, Upanishads and Puranas discuss justice, authority, social order, and the responsibilities of kings and citizens. The Mahabharata and Shukraniti go further into governance, law and ethical leadership, while the **Arthashastra** stands out as a foundational text on politics and administration — detailing how a state should be governed, taxes collected, the army run, and the welfare of the people ensured.'
    ),
    reasoningPrompt(
      'analogical',
      "Ancient Indian political thought linked politics with economics, social life, morality and defence together — power was seen as a responsibility, not just a privilege. Which modern example best reflects that same idea?",
      [
        'A national election held once every five years, decided purely by law',
        'The Panchayati Raj system, where villagers directly participate in deciding local development, connecting governance to real everyday needs',
        'A court passing judgment based only on written statutes',
        'A government press release announcing a new policy',
      ],
      'Panchayati Raj puts governance directly in the hands of the people affected by it — echoing the old idea that power comes with responsibility toward the people it serves, not just formal authority.',
      3
    ),
    callout(
      'bridging_science',
      'Bridging Ideas and Real Life',
      'The Panchayati Raj system — rooted in this old idea of accountable, responsibility-based power — gives millions of Indians a direct say in decisions like water supply, roads and sanitation in their own village. It is a concrete example of ancient political thinking shaping a functioning modern institution.'
    ),
    text(
      'Over the next two years, you\'ll study major concepts in Political Science — democracy, elections, authority, civil society, governance and public policy, and national security and its challenges.'
    ),
    quiz([
      {
        question: 'What does Political Science study, according to this page?',
        options: [
          'Only the exact dates elections are held',
          'Governance — how and why power is distributed, decisions are made, and policies are implemented',
          'Only the physical layout of government buildings',
          'Only foreign languages spoken by diplomats',
        ],
        correct_index: 1,
        explanation:
          'Political Science studies power, decision-making and policy — a broader scope than just elections or buildings.',
        difficulty_level: 1,
      },
      {
        question:
          "A village decides, through its own local meeting, where to build a new water tank — without waiting for a state-level order. Which idea from this page does this best demonstrate?",
        options: [
          'That political power exists only inside formal state institutions',
          'The Panchayati Raj idea that political power also exists in local, grassroots decision-making, not only in formal top-down institutions',
          'That such a decision has nothing to do with Political Science',
          'That only elected state governments can legally make any decision',
        ],
        correct_index: 1,
        explanation:
          'This is exactly the Panchayati Raj principle the page describes — governance happening through grassroots participation, not only through formal state machinery.',
        difficulty_level: 2,
      },
      {
        question:
          "The Arthashastra treats taxation, the army and a ruler's ethical duty as one connected subject. What is the strongest reasoning-based conclusion about ancient Indian political thought from this?",
        options: [
          'That ancient Indian rulers cared only about collecting taxes',
          "That power was viewed as a responsibility tied to the people's welfare — not a privilege separated from economics or ethics — which is close to how modern accountable governance is meant to work",
          'That the army had no connection to how a kingdom was governed',
          'That this way of thinking about power has no relevance to India today',
        ],
        correct_index: 1,
        explanation:
          "Treating taxation, defence and ethics as one connected duty reflects a view of power as responsibility — the same principle that underlies accountable governance today, including institutions like Panchayati Raj.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 8 — economics-choices-and-resources
// ─────────────────────────────────────────────────────────────────────────────
const p8 = {
  slug: 'economics-choices-and-resources',
  title: 'Economics — The Subject of Not Having Enough',
  subtitle: 'You cannot have everything you want with what you have — economics studies how people, families and whole countries handle exactly that problem.',
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A busy Indian marketplace at dusk — vendors, buyers, stacked goods, and a distant port with old ships fading into a modern container port, suggesting a long economic journey across time.'
    ),
    curiosityPrompt(
      "Your family has a fixed amount of money this month, and there are always more things you could buy than money to buy them with. Before reading on — who do you think actually decides what gets bought, and what gets left out?"
    ),
    text(
      "Economics helps you understand how individuals and societies decide to use limited resources to meet their needs. It studies how goods and services are produced, exchanged and distributed, and how these processes shape everyday life — the food you eat, the clothes you wear, the jobs people do, and the services they use.\n\nEconomics explores decision-making by consumers, producers and governments: consumers decide what to buy, producers decide what and how much to produce, and governments frame policies to balance goals like growth, stability, efficiency and fairness. Economics, then, isn't only about numbers and markets — it is also about well-being, equity and justice."
    ),
    heading("India's Long, Uneven Economic Journey"),
    text(
      "India has a rich and dynamic economic history. For centuries, it was one of the world's leading economies and an important centre of trade, industry and maritime activity. Colonial rule disrupted this progress, causing widespread poverty, recurrent famines, and the decline of traditional industries.\n\nAfter independence, India began rebuilding its economy. In recent decades, the country has made real progress — better infrastructure, expanded education and technology, falling poverty, and rising life expectancy. Yet important challenges remain, especially raising incomes and making sure growth reaches every section of society."
    ),
    reasoningPrompt(
      'logical',
      "A country's total production of goods and services rises every year — its economy is growing fast. Based on what this page says about India's post-independence journey, does fast overall growth alone mean Economics' goals have been met?",
      [
        'Yes — once total production rises, there is nothing more for economics to check',
        "No — Economics also asks whether growth reaches all sections of society and improves incomes and well-being broadly, not just whether one total number goes up",
        'No — because growth numbers can never be trusted at all',
        'Yes, but only if the growth happens specifically in agriculture',
      ],
      "The page is explicit that economics cares about equity and justice, not just totals. Growth that doesn't reach most people hasn't achieved what economics is actually trying to measure.",
      2
    ),
    callout(
      'quest_continues',
      'The Quest Continues',
      'Economic development remains a central national goal — and one real, still-open question is how to keep raising incomes and reach every section of society, while keeping growth sustainable enough that it doesn\'t cost future generations their own chance to meet their needs. Economists, policymakers and citizens are still working this out, in India and everywhere else.'
    ),
    text(
      'Over the next two years, you\'ll study the foundations of the Indian economy, markets and prices, financial management and entrepreneurship, economic growth and GDP, international trade, and the Union Budget.'
    ),
    quiz([
      {
        question: 'According to this page, what does Economics study?',
        options: [
          'Only stock market prices',
          'How individuals and societies decide to use limited resources to meet their needs, including production, exchange and distribution of goods and services',
          'Only government tax collection',
          'Only international trade agreements',
        ],
        correct_index: 1,
        explanation:
          'Economics is defined broadly here — resource decisions by consumers, producers and governments, not just markets or taxes alone.',
        difficulty_level: 1,
      },
      {
        question:
          "A family has to choose between repairing their roof and paying for extra school tuition this month — they can't afford both. Which economic idea from this page does this best illustrate?",
        options: [
          'That families never actually have to make economic choices',
          'How individuals decide to use limited resources to meet competing needs — the core question Economics studies',
          'That this decision belongs only to Political Science, not Economics',
          'That economic decisions only happen at the level of whole countries, never within a family',
        ],
        correct_index: 1,
        explanation:
          "A family choosing between two needs with limited money is exactly the kind of resource-allocation decision the page says Economics studies — at any scale, from a household to a nation.",
        difficulty_level: 2,
      },
      {
        question:
          "India was a leading global economy for centuries, was disrupted under colonial rule, and has been rebuilding since independence — yet the page says income growth still needs to reach everyone. What is the strongest reasoning-based takeaway from this whole arc?",
        options: [
          "That India's economic story is now fully finished with nothing left to address",
          "That a country's economic strength can rise, fall and rebuild over time, and that even after real progress, whether growth reaches everyone remains an open, ongoing challenge",
          'That colonial disruption had no lasting effect once independence was achieved',
          'That economic history only matters for very old events, not present-day policy',
        ],
        correct_index: 1,
        explanation:
          'The page traces a real arc — strength, disruption, rebuilding — and closes by naming an unresolved challenge (reaching everyone), showing economics as an ongoing, not finished, project.',
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 9 — why-social-science-matters
// ─────────────────────────────────────────────────────────────────────────────
const p9 = {
  slug: 'why-social-science-matters',
  title: 'Why Any of This Should Matter to You',
  subtitle: "This is the closing page of Chapter 1 — what studying Social Science for the next two years is actually going to do for you.",
  blocks: withOrders([
    hero(
      'Ultra-wide banner (16:5). A young Indian student standing at the edge of a hill at dawn, looking out over a landscape that blends a village, farmland, a city skyline and government buildings in the distance — a hopeful, wide view of the road ahead.'
    ),
    curiosityPrompt(
      "You've now seen what Geography, History, Political Science and Economics each study on their own. Before reading the close of this chapter — name one question about your own town or family that you think you could only answer by combining more than one of these four."
    ),
    text(
      "The house you live in, the water you use, the roads you travel on, the school you attend, the markets you visit, and even the digital spaces you use are all part of systems created and managed by society. Social Science helps you understand how these systems developed, how they function, and how they affect different groups of people.\n\nYou also live among people who may speak different languages, follow different customs, and work in different occupations. Social Science explains these differences as outcomes of geographical, historical, cultural and economic factors — building respect and cooperation between communities, while also helping you see how India's underlying unity holds this diversity together."
    ),
    heading('Citizens, Not Just Students'),
    text(
      "In a democratic society, citizens play an active role in public life. Laws, rights and responsibilities guide how people live together, and understanding how governments function prepares you to participate more responsibly in civic life.\n\nSocial Science also sharpens your ability to think about shared challenges. When you hear about environmental protection, public health, employment, or urban growth, it helps you ask informed questions about causes, effects, and possible solutions — a habit of reasoning that matters for problems affecting society as a whole."
    ),
    reasoningPrompt(
      'logical',
      "This chapter says Social Science connects the past, present and future. Based on everything you've read in this chapter, what does that actually mean in practice?",
      [
        'It means memorising historical dates so you can predict the future exactly',
        'It means understanding how past decisions shaped where things stand now, so you can make more informed choices for what comes next — for yourself and for society',
        'It means the past, present and future are literally the same thing',
        'It means only historians need to think about time — the other three disciplines do not',
      ],
      "Every discipline in this chapter — geography, history, political science, economics — showed how earlier decisions (a coastline used for trade, an old law, a past economic policy) shape the present and open up future choices.",
      3
    ),
    callout(
      'what_if',
      'What if…',
      'What if every citizen in a democracy understood exactly how governance, economy, geography and history connect — not just the people running the government? Do you think decisions would get made differently if more ordinary people asked informed questions before accepting them?'
    ),
    text(
      "As societies change rapidly, the importance of Social Science keeps growing. New technologies, expanding cities, environmental concerns, migration, and global connections are reshaping how people live. In the years ahead, Social Science will help address challenges like climate change, sustainable development, social harmony and the fair use of resources — and guide the responsible use of new technologies."
    ),
    heading('Your Two-Year Journey'),
    text(
      "Over the next two years, this book will take you through all four disciplines in depth — how historical events shaped the modern world, how geography influences human life and economic activity, how political systems and democratic institutions function, and how economies organise production, distribution and development. You'll also look at contemporary challenges: environmental sustainability, social diversity, citizens' rights and responsibilities, and the impact of technology and global connections.\n\nSocial Science is not about memorising dates, maps or definitions — it is about understanding people, places, society, culture and power. This chapter was your starting point; the rest of the book is where you go deeper."
    ),
    quiz([
      {
        question:
          'Based on this chapter, what does it mean to say Social Science connects the past, present and future?',
        options: [
          'That memorising old dates lets you predict future events precisely',
          'That understanding how past decisions shaped the present helps you make more informed choices for the future',
          'That there is no real difference between past, present and future',
          'That only History deals with time, while Geography, Political Science and Economics do not',
        ],
        correct_index: 1,
        explanation:
          'This chapter repeatedly shows the past shaping the present (Arthashastra shaping governance ideas, colonial history shaping today\'s economy) — understanding that link is what helps shape better future choices.',
        difficulty_level: 1,
      },
      {
        question:
          "A student wants to understand why her town has a mix of Hindi, Punjabi and English speakers, a busy market street, and an old fort at its centre. Which combination of disciplines from this chapter would help her explain all of it together?",
        options: [
          'History alone, since only the fort is old',
          "A combination — History (the fort and past settlement), Geography (why the town grew where it did), Economics (the market) and the social/cultural factors behind language diversity",
          'None of them — this is just random local trivia with no systematic explanation',
          'Economics alone, since a market is involved',
        ],
        correct_index: 1,
        explanation:
          'A real town — like the drought or expressway examples earlier in this chapter — is best explained by combining disciplines, not by picking one and ignoring the rest.',
        difficulty_level: 2,
      },
      {
        question:
          "This chapter argues that citizens who understand Social Science can 'participate more responsibly in civic life.' What is the strongest reasoning behind that claim?",
        options: [
          'Because Social Science teaches citizens to agree with every government decision without question',
          'Because understanding how governance, economy, geography and history connect helps a citizen ask better, more informed questions about decisions that affect them — rather than accepting or rejecting them blindly',
          'Because only elected politicians actually need to understand these connections',
          'Because civic life has nothing to do with any of these four disciplines',
        ],
        correct_index: 1,
        explanation:
          "The chapter's 'What if' question makes this point directly: informed citizens ask sharper questions before accepting decisions — that is what 'participating responsibly' means in practice.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

const PAGES = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');

    const book = await books.findOne({ _id: BOOK_ID });
    if (!book) throw new Error(`Book ${BOOK_ID} not found`);
    const chapter = (book.chapters || []).find((c) => c.number === CHAPTER_NUMBER);
    if (!chapter) throw new Error(`Chapter ${CHAPTER_NUMBER} not found on book ${BOOK_ID}`);

    const newPageIds = [];
    let skipped = 0;
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      const pageNumber = i + 1;
      const existing = await pagesCol.findOne({ book_id: BOOK_ID, slug: p.slug });
      if (existing) {
        console.log(`⏭  Page "${p.slug}" already exists — skipping (idempotent).`);
        skipped++;
        continue;
      }
      const _id = uuid();
      const doc = {
        _id,
        book_id: BOOK_ID,
        chapter_number: CHAPTER_NUMBER,
        page_number: pageNumber,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        blocks: p.blocks,
        hinglish_blocks: [],
        tags: [],
        published: false,
        reading_time_min: bw.computeReadingTime(p.blocks),
        content_types: bw.computeContentTypes(p.blocks),
        page_type: 'lesson',
        deleted_at: null,
        deleted_by: null,
        deletion_reason: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await pagesCol.insertOne(doc);
      newPageIds.push(_id);
      console.log(`✓ Inserted page ${pageNumber}/9 "${p.slug}" (${p.blocks.length} blocks).`);
    }

    if (newPageIds.length) {
      await books.updateOne(
        { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
        { $push: { 'chapters.$.page_ids': { $each: newPageIds } }, $set: { updated_at: new Date() } }
      );
      console.log(`✓ Wired ${newPageIds.length} new page_ids into chapter ${CHAPTER_NUMBER}.`);
    }
    console.log(`\n✅ Done. Inserted ${newPageIds.length}, skipped ${skipped} (already present).`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌', err);
  process.exit(1);
});
