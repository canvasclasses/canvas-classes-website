'use strict';
// Class 9 Social Science — Chapter 3 "Atmosphere and Climate" — build script.
// Source: ~/Downloads/Class 9 Social science/iest103.pdf (read in full, pp.39–60).
// Plan approved 2026-07-10 (_agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md). Follows the finalized
// _agents/workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md — golden rule: RE-TEACH (mechanism + analogy),
// never reword NCERT. Locked: English-only, images src:'' + generation_prompt, published:false.
// Idempotent: re-running skips pages already inserted, so PAGES grows batch by batch.
// BATCH 1 (this file): pages 1–2. Pages 3–10 appended in later batches.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CHAPTER_NUMBER = 3;

const HERO_STYLE =
  'Dark cinematic background, atmospheric Indian-illustration style, painterly, no text overlay.';

function hero(prompt) {
  return { id: uuid(), type: 'image', order: 0, src: '', alt: 'Hero banner', caption: '',
    width: 'full', aspect_ratio: '16:5', generation_prompt: `${prompt} ${HERO_STYLE}` };
}
function text(markdown) { return { id: uuid(), type: 'text', order: 0, markdown }; }
function heading(txt, level = 2) { return { id: uuid(), type: 'heading', order: 0, text: txt, level }; }
function callout(variant, title, markdown) { return { id: uuid(), type: 'callout', order: 0, variant, title, markdown }; }
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') {
  return { id: uuid(), type: 'image', order: 0, src: '', alt, caption, width: 'full', aspect_ratio,
    generation_prompt: `${generation_prompt} Dark background, orange accent labels, clean technical illustration style.` };
}
function curiosityPrompt(prompt, hint, reveal) { return { id: uuid(), type: 'curiosity_prompt', order: 0, prompt, hint, reveal }; }
function reasoningPrompt(reasoning_type, prompt, options, reveal, difficulty_level) {
  return { id: uuid(), type: 'reasoning_prompt', order: 0, reasoning_type, prompt, options, reveal, difficulty_level };
}
function guidedReveal(title, intro, steps, outro) {
  return { id: uuid(), type: 'guided_reveal', order: 0, title, intro,
    steps: steps.map((s) => ({ id: uuid(), kind: 'point', ...s })), outro };
}
function quiz(questions) {
  return { id: uuid(), type: 'inline_quiz', order: 0, pass_threshold: 0.67,
    questions: questions.map((q) => ({ id: uuid(), ...q })) };
}
function table(caption, headers, rows) { return { id: uuid(), type: 'table', order: 0, caption, headers, rows }; }
function heroReal(prompt) {
  return { id: uuid(), type: 'image', order: 0, src: '', alt: 'Hero banner', caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt: `${prompt} Photorealistic documentary style, sombre tones, no people shown in distress (respectful for a Class 9 reader), with a clean infographic data panel overlaid.` };
}
function youSolveIt(c) {
  return { id: uuid(), type: 'you_solve_it', order: 0, title: c.title, problem: c.problem, why_hard: c.why_hard,
    image_src: '', image_prompt: c.image_prompt, image_caption: c.image_caption, source_note: c.source_note,
    solutions: c.solutions.map((s) => ({ id: uuid(), ...s })), prompt: c.prompt, reality_check: c.reality_check };
}
function careerSpotlight(title, intro, careers, closing) {
  return { id: uuid(), type: 'career_spotlight', order: 0, title, intro, careers: careers.map((c) => ({ id: uuid(), ...c })), closing };
}
// Stable top-level block ids (slug + index) so re-running the build doesn't churn ids
// and trip the content-loss guard on a resync.
function withOrders(blocks, slug) { return blocks.map((b, i) => ({ ...b, order: i, id: `${slug}__b${i}` })); }

// ─────────────────────────────────────────────────────────────────────────────
const p1 = {
  slug: 'the-blanket-of-air',
  title: 'The Blanket of Air',
  subtitle: "What the atmosphere is, why it keeps this planet alive, and what a single breath is actually made of.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). The thin blue glow of Earth\'s atmosphere seen from the edge of space at dawn, a soft luminous band wrapping the curve of the planet against the black of space.'),
    curiosityPrompt(
      "The Moon sits almost exactly as far from the Sun as we do — yet its daytime surface roasts to about 120 °C, its nights plunge to around −130 °C, and nothing lives there. Earth, right beside it, stays gentle enough for life. Before reading on: what single thing does Earth have that the Moon doesn't — the thing making all that difference?",
      "Look up. It's the thing you're breathing right now, and you can't even see it.",
      "It's the **atmosphere** — the blanket of air wrapped around our planet. The Moon has almost none, so it can neither shield its surface by day nor hold in warmth at night. That thin skin of air is the whole difference between a living world and a dead rock."
    ),
    text(
      "Look up on a clear day and you see blue sky, drifting clouds, sunshine, a breeze on your face. All of it comes from one thing: a deep ocean of air wrapped around the entire planet, called the **atmosphere**. It's held in place by **gravity** — the same pull that keeps your feet on the ground also stops this air from drifting off into space.\n\nThe atmosphere isn't just *there*; it quietly does at least four jobs that keep us alive. It gives us the **air we breathe**. It acts like a **sunscreen**, soaking up the Sun's most harmful ultraviolet rays before they reach us. It acts like a **blanket**, trapping just enough of the Sun's warmth to stop the planet freezing over (exactly the trick the airless Moon can't manage). And it is the **stage for all our weather** — every cloud, every monsoon, every breeze happens inside it."
    ),
    heading('What a Breath of Air Is Actually Made Of'),
    text(
      "Take a breath. Most of what just filled your lungs isn't even the part keeping you alive. Air is overwhelmingly **nitrogen — about 78%** — and only about **21% oxygen**, the gas your body actually uses. That leaves barely 1% for everything else: a whisker of **argon** (0.93%), a tiny **0.04% of carbon dioxide**, and mere traces of other gases.\n\nDon't let those tiny numbers fool you, though. That sliver of carbon dioxide is what green plants breathe in to make their food, and it's a key thread in the 'blanket' that keeps Earth warm. Drifting through it all is a small, ever-shifting amount of **water vapour** (roughly 0.1% to 0.4%) — invisible, yet the raw material of every cloud and every raindrop — along with fine **dust** that those droplets need to form around."
    ),
    image(
      'Pie chart of the composition of the atmosphere',
      '📸 What air is made of — by proportion',
      "A clean ring/pie chart showing the composition of dry air wrapped around a small illustration of the Earth: Nitrogen 78%, Oxygen 21%, Argon 0.93%, Carbon Dioxide 0.04%, other gases 0.03%. Label each slice with its gas name and percentage."
    ),
    guidedReveal(
      'Inside a Single Breath of Air', 'Tap through what the air around you is really made of:',
      [
        { kicker: '78%', headline: 'Nitrogen', body: "By far the most of the air — but it's calm and unreactive, so it mostly acts as a steady background. Plants can't grab it straight from the air, yet it's essential to soil and living things (you met this in Grade 8 Science)." },
        { kicker: '21%', headline: 'Oxygen', body: "Only a fifth of the air — yet it's the part your body, and every flame, actually needs. No oxygen, no breathing and no burning." },
        { kicker: '0.04%', headline: 'Carbon Dioxide', body: "A tiny trace that punches far above its weight: plants breathe it in to make food, and it helps trap the Sun's warmth like a blanket. Add too much, though, and that blanket starts to overheat the planet." },
        { kicker: '0.1–0.4%', headline: 'Water Vapour', body: "Water in gas form, always changing in amount. Invisible while it floats — but cool it down and it becomes the clouds, fog and rain that drive our weather." },
        { kicker: 'traces', headline: 'Dust & Other Gases', body: "Specks of dust plus gases like argon, neon and ozone in tiny amounts. The dust matters more than it sounds — water vapour needs a speck to cling to before it can grow into a raindrop." },
      ]
    ),
    callout('bridging_science', 'The 0.04% That Runs the Planet',
      "It seems impossible that a gas making up just **four parts in ten thousand** of the air could matter much. Yet that 0.04% of carbon dioxide is exactly what every green plant pulls from the air to grow the food you eat, and it's a big reason Earth stays warm enough to live on at all. It's also why humans adding *more* of it — by burning coal, oil and gas — can tip the whole climate out of balance, a story this chapter comes back to at the end."
    ),
    reasoningPrompt('logical',
      "The Moon sits about the same distance from the Sun as Earth, yet its surface roasts by day and freezes by night while Earth stays mild. Based on this page, what is the best single-sentence explanation?",
      [
        "The Moon has almost no atmosphere, so it can neither shield its surface from the Sun's rays by day nor hold in warmth at night — the very jobs Earth's blanket of air does for us",
        "The Moon is actually far more distant from the Sun than Earth, so it simply receives much less heat across a full day",
        "The Moon spins so much faster than Earth that its surface never has time to settle at a comfortable temperature",
        "The Moon is made of a rock that cannot store any heat at all, unlike the soil and water found on Earth",
      ],
      "The page's whole point is that the atmosphere does two temperature jobs at once — blocking the Sun's harshest rays by day and trapping warmth at night. With almost no air, the Moon can do neither, so it swings between extremes. Its distance from the Sun is nearly the same as Earth's.",
      2
    ),
    quiz([
      { question: "Which two gases make up the overwhelming majority of the air we breathe?", difficulty_level: 1, correct_index: 0,
        options: [
          "Nitrogen and oxygen, which together account for about 99% of the air",
          "Oxygen and carbon dioxide, the two gases most directly involved in breathing and plant growth",
          "Carbon dioxide and water vapour, the two gases most responsible for clouds and warmth",
          "Argon and helium, the light gases that slowly drift upward through the atmosphere",
        ],
        explanation: "Air is about 78% nitrogen and 21% oxygen — together roughly 99% — leaving barely 1% for everything else." },
      { question: "A gardener says, 'Carbon dioxide is only 0.04% of the air, so it can't possibly matter to my plants.' Why is she wrong, based on this page?", difficulty_level: 2, correct_index: 1,
        options: [
          "Carbon dioxide is actually the second most common gas in the air, so her percentage is far too low",
          "Even at that tiny fraction, carbon dioxide is the exact gas green plants take from the air to make their food, so life depends on it",
          "Carbon dioxide is the main gas plants release at night, so removing it would only help them grow faster",
          "Plants ignore carbon dioxide entirely and instead absorb the nitrogen that makes up most of the air",
        ],
        explanation: "The page stresses that despite being only 0.04%, carbon dioxide is what plants breathe in to make food — a tiny fraction doing an essential job." },
      { question: "The airless, temperature-extreme Moon is used as a comparison. What does it best demonstrate about the atmosphere's jobs?", difficulty_level: 3, correct_index: 2,
        options: [
          "That the shielding and warming jobs cancel each other out, so a planet is better off with no atmosphere",
          "That only the shielding job matters, since the Moon's daytime heat is its single real problem",
          "That when a world loses its atmosphere it loses both protections at once, swinging between roasting days and freezing nights",
          "That an atmosphere mainly affects weather and has little to do with a planet's temperature",
        ],
        explanation: "The Moon shows both jobs failing together: no sunscreen by day, no blanket by night, so it swings to both extremes." },
    ]),
  ], 'the-blanket-of-air'),
};

const p2 = {
  slug: 'layers-of-the-atmosphere',
  title: 'Layers of the Atmosphere',
  subtitle: "Rise from the ground to the edge of space and the air changes in five distinct stages.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A tall side-on view of Earth\'s atmosphere from the ground to space at twilight: snowy mountains and clouds at the bottom, a jet, a burning meteor higher up, and shimmering green aurora with a satellite near the top against the stars.'),
    curiosityPrompt(
      "A passenger jet cruises about 10 km up. A shooting star burns up around 70 km up. The shimmering auroras dance near 100 km up. A satellite orbits far higher still. Before reading on — if you rose straight up from the ground to space, what do you think would change about the air around you along the way?",
      "Think about two things you can't see but would definitely feel: how thick the air is, and how hot or cold it gets.",
      "The air doesn't stay the same as you climb — it grows thinner and thinner, while the temperature rises and falls in a surprising pattern. Those two changes carve the atmosphere into five distinct **layers**, each with its own character — which is exactly what this page is about."
    ),
    text(
      "If you could ride a balloon straight up from the ground to the edge of space, the air wouldn't just quietly fade away. It would change in stages — growing thinner the higher you go (because gravity packs the air most tightly near the ground), while the temperature swings up and down in a surprising pattern. Scientists use those changes to divide the atmosphere into **five layers**. Starting at the ground and heading up, they are the **troposphere, stratosphere, mesosphere, thermosphere** and **exosphere**."
    ),
    image(
      'Labelled diagram of the five layers of the atmosphere',
      '📸 The five layers, from the ground to space',
      "A tall vertical cross-section of Earth's atmosphere from the ground up to space, showing five labelled bands with their heights: Troposphere (0–12 km, with clouds and a plane), Stratosphere (to ~50 km, with the ozone layer), Mesosphere (to ~80 km, with a burning meteor), Thermosphere (80–700 km, with aurora and a satellite), and Exosphere (fading into space). Include a temperature-versus-height curve running up the side.",
      '4:3'
    ),
    guidedReveal(
      'Climbing Through the Five Layers', 'Rise up through the atmosphere one layer at a time:',
      [
        { kicker: '0–12 km', headline: 'Troposphere — where weather lives', body: "The bottom layer, and the one that matters most to us: it holds the air we breathe, almost all the water vapour, and nearly every cloud, rain shower and storm. Here temperature *drops* the higher you go — which is why tall mountain peaks are cold and snow-capped." },
        { kicker: 'to ~50 km', headline: 'Stratosphere — calm, and our sunscreen', body: "Above the weather, the air is calm and clear, which is exactly why jet aircraft love to cruise here. It also holds the precious **ozone layer**, which soaks up the Sun's harmful ultraviolet rays before they can reach the ground." },
        { kicker: 'to ~80 km', headline: 'Mesosphere — the meteor shield', body: "Higher still, and cold again — temperature drops through this layer too. This is where most **meteors** (\"shooting stars\") burn up in a streak of light, grinding against the air before they can ever strike the ground." },
        { kicker: '80–700 km', headline: 'Thermosphere — hot, and full of signals', body: "Here temperature shoots *up*, because the thin gas soaks up the Sun's X-rays and ultraviolet rays. Part of it — the **ionosphere** — bounces radio waves back to Earth (handy for long-distance radio), and this is the layer where the glowing **auroras** appear." },
        { kicker: 'fades to space', headline: 'Exosphere — the edge of space', body: "The topmost, wispiest layer, where the air is so thin it barely counts as air at all. The lightest gases, hydrogen and helium, slowly leak from here out into outer space." },
      ]
    ),
    callout('note', 'A Pattern Worth Noticing',
      "Here's the neat twist in the five layers: temperature doesn't simply keep falling as you rise. It **falls** in the troposphere, **rises** in the stratosphere (where ozone soaks up sunlight), **falls again** in the mesosphere, then **rises sharply** in the thermosphere. So temperature drops with height in *only two* of the layers — the troposphere and the mesosphere."
    ),
    callout('threads_of_curiosity', 'What Paints the Sky at the Poles',
      "High in the thermosphere, near the North and South Poles, the sky sometimes erupts in curtains of green, pink and violet light — the **auroras**. They happen when a stream of charged particles from the Sun (the 'solar wind') slams into the gases up there, making each gas glow its own colour, like a giant natural neon sign. In the north it's the *Aurora Borealis*; in the south, the *Aurora Australis*. Why do you think different gases might glow in different colours?"
    ),
    reasoningPrompt('logical',
      "A weather balloon reports that almost all the clouds, rain and storms it detected were packed into the lowest ~12 km of the atmosphere. Based on this page, which layer was it measuring, and why does weather crowd there?",
      [
        "The troposphere — it's the bottom layer that holds nearly all the air's water vapour, the raw material clouds and rain are made from",
        "The stratosphere — its calm, clear air is where clouds form most easily without being disturbed",
        "The mesosphere — the burning of meteors there releases the water that later falls as rain",
        "The thermosphere — its high temperatures push water vapour upward until it gathers into storm clouds",
      ],
      "Weather needs water vapour, and the page says almost all of it — plus nearly all clouds and storms — sits in the troposphere, the bottom layer. The higher layers are far too thin and dry; the calm stratosphere is precisely why planes fly *above* the weather.",
      2
    ),
    quiz([
      { question: "In which layer of the atmosphere does nearly all of our weather — clouds, rain and storms — take place?", difficulty_level: 1, correct_index: 0,
        options: [
          "The troposphere, the lowest layer, which holds most of the air's water vapour",
          "The stratosphere, the calm layer where aeroplanes prefer to cruise",
          "The thermosphere, the hot upper layer where the auroras appear",
          "The exosphere, the outermost layer at the very edge of space",
        ],
        explanation: "The troposphere holds almost all the water vapour and nearly all clouds and storms — it's where weather happens." },
      { question: "A pilot chooses to fly her jet in the stratosphere rather than lower down. Based on this page, what is the strongest reason for that choice?", difficulty_level: 2, correct_index: 1,
        options: [
          "The stratosphere is the only layer warm enough for a jet engine to run efficiently",
          "The stratosphere sits above almost all the clouds and storms, so its air is calm and clear for a smooth flight",
          "The stratosphere has the thickest air, giving the wings the most lift to stay up",
          "The stratosphere is where radio waves bounce, so the plane can stay in contact with the ground",
        ],
        explanation: "The page notes the stratosphere is calm and clear — free of the weather below — which is why planes cruise there." },
      { question: "Temperature falls in the troposphere, rises in the stratosphere, falls in the mesosphere, then rises again in the thermosphere. What does this back-and-forth best show?", difficulty_level: 3, correct_index: 2,
        options: [
          "That the layers are defined mainly by their height in kilometres, and temperature is just a coincidence",
          "That temperature always falls as you go higher, so any rise must be a measurement error",
          "That each layer is marked out by its own distinct temperature behaviour, not by one steady trend all the way up",
          "That only the two layers where temperature falls are true layers, and the rest are empty space",
        ],
        explanation: "The layers are defined by changes in temperature (and density) with height — each has its own behaviour, which is why the trend reverses between layers." },
    ]),
  ], 'layers-of-the-atmosphere'),
};

const p3 = {
  slug: 'weather-climate-and-temperature',
  title: 'Weather, Climate and Temperature',
  subtitle: "The difference between today's sky and a place's lifelong character — and why the equator roasts while the poles freeze.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A split sky over an Indian landscape: storm clouds and rain on one side, clear sunny blue on the other, suggesting how weather shifts day to day."),
    curiosityPrompt(
      "One friend says 'India is a hot country.' Another says 'it's freezing in Delhi this morning.' Both are completely right at the same time. Before reading on — how can a country be 'hot' and 'freezing' in the same breath without either person being wrong?",
      "One is describing a single morning; the other is describing decades.",
      "One friend is describing the **weather** — what the sky is doing *right now*. The other is describing the **climate** — what a place is *usually* like across many years. They're two different timescales, and telling them apart is exactly what this page is about."
    ),
    text(
      "**Weather** is the mood of the atmosphere at a single moment — is it hot or cold, wet or dry, still or windy, *today*? It can flip within hours: a bright morning can turn into a rainy afternoon. **Climate** is the long-term *character* of a place — the average of all its weather stitched together over a long stretch, usually **thirty years or more**.\n\nHere's an easy way to hold the two apart: weather is a person's **mood** on a given day, while climate is their **personality**. A cheerful person can still have a bad morning (weather), but over years you learn what they're *generally* like (climate). So 'Delhi is cold this morning' is weather; 'India has a hot climate' is the decades-long pattern."
    ),
    heading('Temperature — Why the Equator Roasts and the Poles Freeze'),
    text(
      "The single biggest driver of temperature is **insolation** — the incoming solar energy the Earth catches from the Sun. But that energy isn't shared out evenly, and the reason is pure geometry.\n\nNear the **equator**, the Sun sits almost straight overhead, so its rays strike the ground *head-on* — concentrated onto a small patch, like the tight, bright circle of a torch shone straight down. Near the **poles**, the same rays arrive at a steep slant and smear across a much larger area, like that torch beam tilted low — the same light, spread thin and weak. So insolation is strongest at the equator and weakest at the poles, and temperature follows: **it steadily drops as you travel from the equator toward either pole.**"
    ),
    image(
      'Diagram of the temperature zones of the Earth',
      '📸 The Earth\'s three temperature zones',
      "A diagram of the Earth showing sunlight striking the equator head-on and the poles at a slant, with the three temperature zones marked by latitude: the Torrid Zone (between the Tropic of Cancer and Tropic of Capricorn), the two Temperate Zones (tropics to the polar circles), and the two Frigid Zones (polar circles to the poles). Label the Equator, Tropic of Cancer, Tropic of Capricorn, Arctic Circle and Antarctic Circle."
    ),
    guidedReveal(
      'The Three Temperature Zones', 'Because insolation fades from the equator to the poles, the Earth falls into three broad heat belts:',
      [
        { kicker: 'hottest', headline: 'The Torrid Zone', body: "The belt straddling the equator, between the Tropic of Cancer and the Tropic of Capricorn. The Sun is overhead here, so it's the hottest zone — most of India lies in it." },
        { kicker: 'mild', headline: 'The Temperate Zones', body: "The two middle belts, between the tropics and the polar circles. Sunlight arrives at a gentler angle, giving milder temperatures and the clearest four-season pattern." },
        { kicker: 'coldest', headline: 'The Frigid Zones', body: "The two caps around the North and South Poles, beyond the polar circles. Sunlight is always weak and slanted here, so these are the coldest zones on Earth." },
      ]
    ),
    callout('india_science', 'Where India Sits',
      "Look at a globe and you'll see the **Tropic of Cancer** slicing right through the middle of India — roughly through Gujarat, Madhya Pradesh, Jharkhand and West Bengal. That means most of the country sits in the scorching **Torrid Zone**, while the north edges into the Temperate Zone. It's a big reason India runs hot for most of the year — and why the arrival of the cooling monsoon, later in this chapter, matters so enormously."
    ),
    reasoningPrompt('logical',
      "Two cities sit at sea level on the same day. City A is near the equator; City B is far to the north near the Arctic Circle. Based on this page, why is City A almost certainly warmer — even though both receive sunlight?",
      [
        "At the equator the Sun's rays strike nearly head-on and stay concentrated, while near the Arctic they arrive at a steep slant and spread thin — so City A collects far more heat per patch of ground",
        "City B is simply much farther from the Sun than City A, so less sunlight reaches it in the first place",
        "City A has a thicker atmosphere that traps more of the Sun's heat than City B's thinner air",
        "Cities near the equator always sit at a lower altitude, and lower places are automatically warmer",
      ],
      "The page's key idea is the *angle* of sunlight. Head-on rays at the equator stay concentrated and intense; slanted rays near the poles smear over a wide area and weaken. Distance from the Sun is nearly identical for both — it's the angle that decides the heat.",
      2
    ),
    quiz([
      { question: "Which statement describes climate rather than weather?", difficulty_level: 1, correct_index: 2,
        options: [
          "It started raining heavily in Mumbai this afternoon",
          "A cold wind is making today feel chilly in Shimla",
          "India, on the whole, has a hot tropical climate averaged over decades",
          "The sky cleared up and turned sunny an hour ago",
        ],
        explanation: "Climate is the long-term average (decades); the other three describe a single day's conditions, which is weather." },
      { question: "A student notices the tropics are far hotter than the polar regions. Based on this page, what is the correct explanation?", difficulty_level: 2, correct_index: 0,
        options: [
          "Near the equator the Sun's rays strike head-on and stay concentrated, while near the poles they hit at a slant and spread thin and weak",
          "The tropics are physically much closer to the Sun than the poles are",
          "The polar regions receive no sunlight at all across the whole year",
          "Hot air from factories and cities collects only around the equator",
        ],
        explanation: "It's the angle of insolation: concentrated head-on rays at the equator, weak slanted rays at the poles." },
      { question: "Most of India lies in the Torrid Zone. Based on this page, what does that best explain about the country?", difficulty_level: 3, correct_index: 1,
        options: [
          "That India experiences no seasonal change in temperature at all through the year",
          "That India tends to run hot for much of the year, making the cooling monsoon especially important",
          "That India is colder than temperate countries because the Torrid Zone blocks sunlight",
          "That India's temperature is decided entirely by its altitude, not its latitude",
        ],
        explanation: "The Torrid Zone is the hottest belt, so sitting in it keeps India hot for much of the year — which is why the monsoon's relief matters so much." },
    ]),
  ], 'weather-climate-and-temperature'),
};

const p4 = {
  slug: 'humidity-and-precipitation',
  title: 'Humidity and Precipitation',
  subtitle: "The invisible water in the air — and the moment the sky can hold it no longer.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). Heavy monsoon rain falling over lush green fields and a village in India, water streaming off rooftops, dramatic grey clouds above."),
    curiosityPrompt(
      "On some hot days you sweat buckets yet still feel sticky and miserable; on other days that are just as hot, you feel perfectly fine. Before reading on — what invisible thing in the air do you think is making the difference?",
      "It's water — but not water you can see.",
      "The difference is **humidity** — how much invisible water vapour is packed into the air. When the air is already full of moisture, your sweat can't evaporate, so it just sits on your skin and you feel hot and sticky. That invisible water, and what happens when the sky is stuffed too full of it, is what this page is about."
    ),
    text(
      "**Humidity** is the amount of **water vapour** — water in its invisible gas form — floating in the air. It gets there whenever water evaporates from oceans, rivers, lakes, soil and even plants.\n\nHere's the part that decides how a day *feels*: **warm air can hold much more water vapour than cool air.** On a hot, humid day the air is already crammed with moisture, so the sweat on your skin has nowhere to evaporate to — and since evaporating sweat is exactly how your body cools itself, you end up feeling hotter and stickier than the thermometer alone suggests. That's why a muggy 32 °C can feel far worse than a dry 32 °C."
    ),
    heading('Precipitation — When the Sky Can Hold No More'),
    text(
      "Air can only hold so much water vapour. When it becomes **saturated** — completely full — the extra vapour has to go somewhere, so it **condenses** back into tiny liquid droplets, forming clouds. This most often happens when air *cools*, because cool air holds less: imagine slowly squeezing a soaked sponge — at some point the water has nowhere to go but out.\n\nWhen those droplets grow heavy enough, gravity pulls them down as **precipitation**. Depending on the temperature they fall as **rain** (liquid), **snow** (ice crystals), **sleet** (a slushy mix) or **hail** (hard ice balls). How much falls on a place depends on the **winds**, the **mountains** that force air upward, and the **season**. And it matters far beyond a wet afternoon: rain is where most of our rivers, reservoirs and even underground water ultimately come from."
    ),
    guidedReveal(
      'Four Ways the Sky Sends Water Down', 'Once droplets grow heavy enough to fall, the temperature decides their form:',
      [
        { kicker: 'liquid', headline: 'Rain', body: "The most common form — droplets that stay liquid all the way down. It's what fills India's rivers, wells and reservoirs, and it gently lowers the temperature of a place." },
        { kicker: 'frozen', headline: 'Snow', body: "When the air is cold enough, vapour freezes straight into delicate ice crystals that drift down as snow — common high in the Himalaya." },
        { kicker: 'slushy', headline: 'Sleet', body: "A half-and-half mix of rain and partly-melted snow, formed when falling snow passes through a warmer layer of air on the way down." },
        { kicker: 'icy', headline: 'Hail', body: "Hard balls of ice, tossed up and down inside a storm cloud, gathering frozen layer on layer until they're heavy enough to crash to the ground." },
      ]
    ),
    callout('bridging_science', 'Where Your Water Really Comes From',
      "It's easy to think of tap water as coming 'from the pipe,' but trace it back and almost all of it began as **precipitation**. Rain fills the rivers and reservoirs cities drink from, and it soaks down through the soil to top up the **groundwater** that wells and borewells pull from. That's why a weak monsoon isn't just an inconvenience — a year of poor rain can mean empty reservoirs and dropping water tables months later."
    ),
    reasoningPrompt('logical',
      "Two towns record exactly 34 °C at noon. In Town A people feel comfortable; in Town B they feel sweaty and miserable. Based on this page, what is the most likely difference?",
      [
        "The air in Town B holds far more water vapour (higher humidity), so people's sweat can't evaporate and cool them, while Town A's drier air lets sweat evaporate freely",
        "Town B is actually much hotter than the thermometer shows because the thermometer is broken",
        "Town A is closer to the equator, so its people are simply more used to the heat",
        "Town B has no wind at all, which is the only thing that ever makes heat feel worse",
      ],
      "Same temperature, different *humidity*. In humid Town B the air is already saturated, so sweat can't evaporate — and evaporation is how the body cools — leaving people hot and sticky. Dry Town A lets sweat evaporate, so the same heat feels comfortable.",
      2
    ),
    quiz([
      { question: "What exactly is humidity?", difficulty_level: 1, correct_index: 0,
        options: [
          "The amount of invisible water vapour present in the air",
          "The total number of clouds visible in the sky at one time",
          "The speed at which rain falls during a storm",
          "The temperature of the air on a hot afternoon",
        ],
        explanation: "Humidity is the quantity of water vapour (water as an invisible gas) held in the air." },
      { question: "A mass of warm, moisture-filled air rises up a mountainside and cools. Based on this page, what is most likely to happen next?", difficulty_level: 2, correct_index: 1,
        options: [
          "The cooling air will absorb even more water vapour and the sky will clear",
          "Because cool air holds less vapour, the air becomes saturated, the vapour condenses, and precipitation is likely",
          "The water vapour will instantly turn into hail regardless of the temperature",
          "Nothing will change, because temperature has no effect on how much vapour air can hold",
        ],
        explanation: "Cooling air holds less vapour, so it saturates and condenses — the classic recipe for cloud and rain, especially over mountains." },
      { question: "Why does the page say a weak monsoon can cause water shortages months later, not just on rainy days?", difficulty_level: 3, correct_index: 2,
        options: [
          "Because rain physically pushes water out of the ground and into the sea",
          "Because humidity alone, without rain, is enough to fill every reservoir",
          "Because precipitation is the ultimate source that fills rivers and reservoirs and recharges underground water",
          "Because snow is the only form of precipitation that reaches the water supply",
        ],
        explanation: "Precipitation is where rivers, reservoirs and groundwater ultimately come from — so poor rain drains the whole supply chain, with effects felt long afterward." },
    ]),
  ], 'humidity-and-precipitation'),
};

const p5 = {
  slug: 'air-pressure-and-winds',
  title: 'Air Pressure and Winds',
  subtitle: "Air has weight and pushes on everything — and when it moves to even out that push, we call it wind.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). Wind sweeping across a coastal Indian landscape at dusk — palm trees bending, waves whipped up, a row of wind turbines on the horizon."),
    curiosityPrompt(
      "Stand on a beach in the afternoon and a cool breeze blows in from the sea. Come back at night and the wind has quietly reversed — now it blows from the land out to sea. Before reading on — what do you think flips the wind's direction between day and night?",
      "It comes down to which surface — land or water — heats up and cools down faster.",
      "The flip happens because **land heats and cools far faster than water**, which changes where the air is warm and light versus cool and heavy — and wind always flows from heavy (high-pressure) air toward light (low-pressure) air. By the end of this page that day-and-night reversal will make complete sense."
    ),
    text(
      "It doesn't feel like it, but the air above you has **weight** — a whole atmosphere's worth pressing down. That push is **air pressure** (or atmospheric pressure). It's greatest at **sea level**, where the most air is stacked overhead, and it drops the higher you climb, because there's less air above you.\n\nPressure also changes from place to place across the surface, and temperature is the reason. Where the ground is **hot**, the air warms, becomes light and **rises**, leaving a **low-pressure** area behind (often cloudy and unsettled). Where the ground is **cold**, the air cools, grows heavy and **sinks**, piling up into a **high-pressure** area (usually clear and calm). And nature always tries to balance things out — so air flows from the high-pressure zone toward the low-pressure zone, like air rushing out of a blown-up balloon the instant you let go."
    ),
    heading('Wind — Air on the Move'),
    text(
      "That flow of air from high pressure to low pressure *is* **wind**. The bigger the pressure difference, the harder it rushes — a gentle breeze when the difference is small, a roaring gale when it's large.\n\nOne rule catches everybody out: **winds are named after the direction they blow *from*, not toward.** A wind arriving from the west is a 'westerly'; one coming from the sea is a 'sea breeze.' Their strength ranges enormously, from air so still that smoke rises straight up, to storm winds strong enough to flatten buildings."
    ),
    table(
      'Wind speeds and their common effects',
      ['Wind', 'Speed (km/hr)', 'What you notice'],
      [
        ['Calm', '0–1', 'Smoke rises straight up; the air feels completely still.'],
        ['Light breeze', '6–11', 'You feel it on your face; leaves rustle and a light flag stirs.'],
        ['Strong breeze', '39–49', 'Large branches sway; umbrellas become hard to hold.'],
        ['Storm', '103–117', 'Rarely experienced; usually brings widespread damage.'],
      ]
    ),
    heading('The Sea Breeze and the Land Breeze'),
    text(
      "Now back to that flipping beach wind. During the **day**, land heats up much faster than the sea. The hot air over the land rises, creating low pressure there, so the cooler, heavier air sitting over the sea rushes in to fill the gap — a refreshing **sea breeze** blowing *from sea to land*.\n\nAt **night** everything reverses. Land loses its heat much faster than the sea, so now the land is the cooler, high-pressure side and the sea is the warmer, low-pressure side. The wind turns around and blows *from land to sea* — a **land breeze**. Same coast, same air, opposite directions, all because land and water change temperature at different speeds."
    ),
    image(
      'Diagram of the sea breeze and land breeze',
      '📸 Day and night — how the coastal wind flips',
      "A two-panel diagram of a coast. Day panel: sunlit land warmer than the sea, air rising over the land, arrows showing a Sea Breeze blowing from sea to land. Night panel: a moonlit scene with the sea warmer than the cooled land, arrows showing a Land Breeze blowing from land to sea. Label warm/cool areas and the wind direction in each."
    ),
    reasoningPrompt('logical',
      "A weather map shows a hot inland desert (rising air) next to a cool sea (sinking air). Based on this page, which way will the wind most likely blow, and why?",
      [
        "From the cool sea toward the hot desert, because air flows from the high pressure over the cool, sinking-air sea to the low pressure over the hot, rising-air desert",
        "From the hot desert toward the cool sea, because hot air is always pushed outward toward colder places",
        "There will be no wind at all, because wind only forms when both areas are the same temperature",
        "Straight upward into the sky over the desert, because rising hot air carries the wind vertically",
      ],
      "Hot desert = rising air = low pressure; cool sea = sinking air = high pressure. Wind flows high → low, so it blows from the sea to the desert. This is exactly the sea-breeze mechanism scaled up.",
      2
    ),
    quiz([
      { question: "Air always moves between pressure areas in which direction?", difficulty_level: 1, correct_index: 3,
        options: [
          "From low-pressure areas toward high-pressure areas, to fill the heavier region",
          "Straight upward, from the ground into the upper atmosphere",
          "It stays perfectly still until the two pressures are exactly equal",
          "From high-pressure areas toward low-pressure areas, and that flow is what we call wind",
        ],
        explanation: "Wind is air flowing from high pressure to low pressure to even out the difference." },
      { question: "A wind is reported blowing in from the west. Based on this page, what is it correctly called?", difficulty_level: 2, correct_index: 1,
        options: [
          "An easterly, because it is heading toward the east",
          "A westerly, because winds are named for the direction they blow from",
          "A sea breeze, because all named winds come from the sea",
          "A calm, because west winds are always gentle",
        ],
        explanation: "Winds are named for where they come *from* — a wind from the west is a westerly." },
      { question: "Why does the coastal breeze blow from sea to land by day but from land to sea by night?", difficulty_level: 3, correct_index: 0,
        options: [
          "Because land heats and cools faster than the sea, so the low-pressure (warm) side switches from land by day to sea by night, and wind always flows toward the low",
          "Because the Sun physically drags the wind behind it as it crosses the sky",
          "Because the sea is always at higher pressure than the land, at every hour of the day and night",
          "Because ocean tides push the air back and forth twice a day",
        ],
        explanation: "Land changes temperature faster than water, so the warm low-pressure side flips between day and night — and the wind, always flowing toward low pressure, flips with it." },
    ]),
  ], 'air-pressure-and-winds'),
};

const p6 = {
  slug: 'seasons-of-india',
  title: 'Seasons of India',
  subtitle: "Why India's official calendar names four seasons — and your grandparents might name six.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A four-part seasonal montage of the same Indian village: misty winter, blazing dry summer, drenching monsoon, and golden post-monsoon harvest, blending across the banner."),
    curiosityPrompt(
      "India's weather office officially recognises four seasons. But ask your grandparents and they might rattle off six, each with a beautiful name. Before reading on — is one of them simply wrong, or can a country genuinely have two different seasonal calendars at once?",
      "Think about the difference between a modern scientific system and an ancient one built around the Moon and stars.",
      "Neither is wrong — India really does carry **two** seasonal calendars side by side. The weather office (IMD) groups the year into four broad seasons for forecasting; the traditional Indian calendar has long divided it into six poetic *Ṛtus* tied to the sky. This page walks through both."
    ),
    text(
      "Weather changes hour to hour, but zoom out and clear repeating patterns appear across a few weeks or months — spells that are reliably cool, or hot, or wet. Grouping those patterns is what we call **seasons**.\n\nFor forecasting and planning, the **India Meteorological Department (IMD)** recognises **four main seasons** for the country. Because most of India sits in the hot Torrid Zone, these seasons are shaped less by cold-versus-warm and more by the great wet-and-dry rhythm of the monsoon."
    ),
    guidedReveal(
      "India's Four Seasons (IMD)", "Tap through the year as the weather office divides it:",
      [
        { kicker: 'Dec–early Apr', headline: 'Winter', body: "The coolest stretch, with December and January the coldest. The north-west can drop to around 10–15 °C, while the far south stays a mild 20–25 °C — India is simply too tropical for a harsh winter everywhere." },
        { kicker: 'Apr–Jun', headline: 'Summer (Pre-monsoon)', body: "The blazing, dry build-up before the rains. Across most of inland India temperatures climb to a punishing 32–40 °C — the land baking hot, quietly setting the stage for the monsoon." },
        { kicker: 'Jun–Sep', headline: 'Monsoon (Rainy)', body: "The season India waits for: the humid south-west monsoon sweeps up the country from late May–early June, and its rains break the heat and feed the farms. You'll meet the mechanism behind it on the next page." },
        { kicker: 'Oct–Dec', headline: 'Post-monsoon (Retreating)', body: "The rains pull back and the skies clear, especially in the north-west. In the south-east, though, this is when the retreating monsoon delivers much of the year's rain." },
      ]
    ),
    callout('note', 'A Little Extra Up North',
      "This four-season pattern fits most of the country, but the **Himalayan states**, being cooler and more temperate, feel two more distinct seasons the plains barely notice — a crisp **autumn** and a blossoming **spring**."
    ),
    heading('The Older Count — Six Ṛtus'),
    text(
      "Long before weather offices, India's traditional calendar divided the year into **six seasons** called **Ṛtus**, each about two months long. They come from the astronomical split of the year into six parts, and the traditional Indian calendar's months are arranged around them. You'll still hear these names in poetry, festivals and classical music."
    ),
    table(
      'The six traditional Indian seasons (Ṛtus)',
      ['Ṛtu (Season)', 'Indian calendar months', 'Roughly (Gregorian)'],
      [
        ['Vasanta (Spring)', 'Chaitra–Vaiśhākha', 'March–April'],
        ['Grīṣhma (Summer)', 'Jyeṣhṭha–Āṣhāḍha', 'May–June'],
        ['Varṣhā (Monsoon)', 'Śhrāvaṇa–Bhādrapada', 'July–August'],
        ['Śharad (Autumn)', 'Āśhvina–Kārtika', 'September–October'],
        ['Hemanta (Pre-winter)', 'Mārgaśhīrṣha–Pauṣha', 'November–December'],
        ['Śhiśhira (Winter)', 'Māgha–Phālguna', 'January–February'],
      ]
    ),
    callout('india_science', 'Seasons Measured, Seasons Sung',
      "India's link to the seasons runs deep in both science and art. Kauṭilya's ancient **Arthaśhāstra** records careful, almost scientific measurements of **rainfall**, used to plan the kingdom's revenue and famine relief — an early form of climate data. And in **Hindustani classical music**, particular *rāgas* are traditionally tied to particular seasons, so the right melody belongs to the right time of year. Ask an elder or teacher which *rāga* goes with the monsoon — the answer is centuries old."
    ),
    reasoningPrompt('logical',
      "A farmer in inland north India plans the year around 'the baking dry heat, then the rains, then the clear cool months.' Based on this page, why does India's four-season calendar lean on wet-and-dry spells rather than cold-and-warm ones?",
      [
        "Because most of India lies in the hot Torrid Zone, so the year's biggest swing is the monsoon's wet-and-dry rhythm, not a deep freeze-and-thaw",
        "Because India has no temperature changes at all across the entire year",
        "Because the weather office is not allowed to use the word 'winter' officially",
        "Because farmers everywhere ignore temperature and only ever track rainfall",
      ],
      "India is largely tropical (Torrid Zone), so it never gets the deep cold winters of temperate lands. Its defining seasonal swing is instead the arrival and retreat of the monsoon rains — which is why the four seasons are built around wet and dry.",
      2
    ),
    quiz([
      { question: "How many main seasons does the India Meteorological Department (IMD) recognise for the country?", difficulty_level: 1, correct_index: 2,
        options: [
          "Two — simply a wet season and a dry season",
          "Six — the traditional Ṛtus of the Indian calendar",
          "Four — winter, summer, monsoon and post-monsoon",
          "Three — summer, monsoon and winter only",
        ],
        explanation: "The IMD recognises four: winter, summer (pre-monsoon), monsoon, and post-monsoon (retreating)." },
      { question: "A poet writes of 'Varṣhā' bringing the rains in Śhrāvaṇa. Based on this page, what is she referring to?", difficulty_level: 2, correct_index: 0,
        options: [
          "One of the six traditional Ṛtus — the monsoon season — in the traditional Indian calendar",
          "A modern IMD forecasting term for a heavy single storm",
          "A region of India where it never stops raining",
          "A type of rāga played only during winter",
        ],
        explanation: "Varṣhā is the monsoon Ṛtu among the six traditional Indian seasons, falling roughly July–August." },
      { question: "The Himalayan states feel a distinct autumn and spring that the plains barely notice. Based on this page, why?", difficulty_level: 3, correct_index: 1,
        options: [
          "Because the Himalayas receive no monsoon rain, so they need extra seasons to fill the year",
          "Because they are cooler and more temperate, so temperature-driven seasons like autumn and spring show up clearly there",
          "Because the traditional Ṛtu calendar is only used in the mountains",
          "Because the weather office measures the mountains on a completely different calendar",
        ],
        explanation: "Being cooler and temperate, the Himalayan states experience clear temperature-driven autumn and spring, unlike the hot, monsoon-dominated plains." },
    ]),
  ], 'seasons-of-india'),
};

const p7 = {
  slug: 'the-monsoon',
  title: 'The Monsoon',
  subtitle: "The wind that reverses with the seasons — and holds the fate of a billion people's harvests.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). The first monsoon clouds sweeping in over the Western Ghats and green Indian countryside, a wall of dark rain-cloud meeting parched land, birds scattering ahead of it."),
    curiosityPrompt(
      "For months, India bakes under a merciless sun. Then, almost on schedule around June, the sky fills with cloud and rain sweeps up the whole country. Before reading on — what could possibly make an entire ocean's worth of wind reverse its direction and arrive, roughly on time, year after year?",
      "You already met the tiny, everyday version of this at the beach on page 5.",
      "The monsoon is a **seasonal reversal of the winds** — the same land-heats-faster-than-water trick behind the sea breeze, but blown up to the size of a whole subcontinent and a whole season. That reversal, and why India lives and dies by it, is what this page is about."
    ),
    text(
      "The word **monsoon** comes from the Arabic *mausim*, meaning 'season' — a name given by the ancient Arab sailors and traders who first noticed that the winds over the Indian Ocean flip direction with the time of year, and learned to time their voyages to them. A monsoon, then, is simply a **wind system that reverses direction between the seasons**, and India's climate is ruled by it."
    ),
    heading('How the Summer Monsoon Works'),
    text(
      "Remember the sea breeze from page 5? The summer monsoon is that exact idea, scaled up enormously. Through the fierce pre-monsoon summer, the vast **Indian landmass heats up far faster than the surrounding oceans**. The hot air over the land rises, leaving a big zone of **low pressure** stamped across the subcontinent. The Indian Ocean, meanwhile, stays cooler, so it holds **high pressure**.\n\nAnd air always flows from high pressure to low. So moisture-soaked winds come sweeping **off the sea and onto the land** — the **south-west monsoon** — arriving from late May, drenching the country between **June and September**. It's not a gentle beach breeze this time; it's an entire ocean of wet wind pouring inland, and it delivers most of India's yearly rain."
    ),
    image(
      'Diagram of the summer and winter monsoon reversal',
      '📸 The great reversal — summer vs winter monsoon',
      "A two-panel map of India and the Indian Ocean. SUMMER panel: hot landmass marked low pressure, cooler ocean marked high pressure, big blue arrows of the south-west monsoon carrying moisture from sea to land, bringing rain. WINTER panel: cooled landmass marked high pressure, warmer ocean marked low pressure, arrows of the dry north-east monsoon blowing from land to sea, picking up moisture over the Bay of Bengal to rain on the south-east coast. Label pressures and wind directions."
    ),
    heading('The Winter Reversal'),
    text(
      "Come winter, everything swings the other way. Now the land **cools faster** than the ocean, so the high and low pressures swap sides: high pressure sits over the cold land, low pressure over the warmer sea. The wind reverses into the **north-east monsoon**, blowing *from land to sea* — dry, for most of the country.\n\nBut there's a twist. As these winter winds cross the warm **Bay of Bengal**, they soak up moisture, and then dump it on India's **south-east coast** — which is why **Tamil Nadu and coastal Andhra Pradesh** get much of their rain in October–December, out of step with the rest of the country."
    ),
    guidedReveal(
      "India's Two Monsoons", 'One wind system, two opposite seasons:',
      [
        { kicker: 'Jun–Sep', headline: 'South-West (Summer) Monsoon', body: "Hot land pulls moist winds in *from the sea*. This is the big one — it brings most of India's annual rainfall and breaks the summer heat across almost the whole country." },
        { kicker: 'Oct–Feb', headline: 'North-East (Winter) Monsoon', body: "Cool land pushes dry winds out *toward the sea*. Mostly dry — except along the south-east coast (Tamil Nadu, coastal Andhra), where the winds cross the Bay of Bengal and bring rain." },
      ]
    ),
    heading('Why the Monsoon Rules India'),
    text(
      "For India, the monsoon is not just weather — it is the heartbeat of the country. **Most of India's farming depends on monsoon rain** for sowing and growing crops, so a **good monsoon** means full granaries, water in the rivers and reservoirs, and a steady rural economy. A **weak monsoon** can mean drought, crop failure and hardship; **too much** rain can mean devastating floods. Its arrival shapes not only harvests but festivals, prices, jobs and daily life. When people say India waits for the monsoon every year, they mean it quite literally."
    ),
    callout('india_science', 'Reading the Rains — Ancient and Modern',
      "Predicting the monsoon has mattered in India for thousands of years. Because harvests hung on the rains, texts like **Kṛiṣhiparāśhara** and Varāhamihira's **Bṛihatsaṁhitā** described ways to forecast the coming rainfall from the positions of the Moon and the *nakṣhatras* (lunar mansions) — and many Indian farming almanacs still echo these methods. The poet **Kālidāsa**, in his *Meghadūtam* (around the 5th century CE), even traced the path of the monsoon clouds across the land. Today that same quest continues through the **National Monsoon Mission** and **Mission Mausam** (Ministry of Earth Sciences), which build state-of-the-art computer models to predict the monsoon and make India 'Weather Ready.'"
    ),
    reasoningPrompt('logical',
      "A student says, 'The summer monsoon and the afternoon sea breeze are basically the same thing.' Based on this page, is she right — and why?",
      [
        "Yes — both are driven by land heating faster than water, creating low pressure over the warm land that pulls in moist wind from the sea; the monsoon is just that mechanism scaled up to a whole subcontinent and season",
        "No — the sea breeze is caused by pressure differences, but the monsoon is caused entirely by the Earth's rotation instead",
        "No — the monsoon blows from land to sea, the exact opposite of a sea breeze, in every season",
        "Yes — but only because both happen to occur in the month of June each year",
      ],
      "She's right. The summer monsoon runs on the identical sea-breeze mechanism — land heats faster than sea, hot land makes low pressure, moist sea air rushes in — just enlarged from one afternoon on one beach to an entire subcontinent across a whole season.",
      2
    ),
    quiz([
      { question: "What does the word 'monsoon' (from the Arabic mausim) fundamentally describe?", difficulty_level: 1, correct_index: 1,
        options: [
          "A single very heavy rainstorm that strikes without warning",
          "A wind system that reverses its direction between the seasons",
          "The hottest month of the Indian summer before the rains",
          "A type of ocean current flowing around the Indian coast",
        ],
        explanation: "Monsoon means a seasonal reversal of winds — mausim means 'season'." },
      { question: "During the summer monsoon, moist winds blow from the sea onto the land. Based on this page, what sets that up?", difficulty_level: 2, correct_index: 2,
        options: [
          "The ocean heats up faster than the land, creating low pressure over the sea",
          "The Earth's rotation physically drags ocean water onto the shore as rain",
          "The land heats up faster than the sea, forming low pressure over the land that pulls in moist sea winds",
          "Cold winter air over the land pushes the sea winds inland",
        ],
        explanation: "Land heats faster than water in summer → low pressure over land → moist sea winds rush in. It's the sea-breeze mechanism, scaled up." },
      { question: "Tamil Nadu gets much of its rain in October–December, unlike most of India. Based on this page, why?", difficulty_level: 3, correct_index: 0,
        options: [
          "The dry north-east winter monsoon picks up moisture crossing the warm Bay of Bengal and drops it on the south-east coast",
          "The south-west summer monsoon reaches Tamil Nadu several months later than the rest of the country",
          "Tamil Nadu has no summer monsoon at all and depends entirely on local storms",
          "The retreating monsoon reverses the Earth's rotation over the south of India",
        ],
        explanation: "The winter (NE) monsoon is dry overland, but soaks up moisture over the Bay of Bengal and rains it onto the south-east coast — putting Tamil Nadu's rainy season out of step with the rest of India." },
    ]),
  ], 'the-monsoon'),
};

const p8 = {
  slug: 'climate-change-and-carbon-footprint',
  title: 'Climate Change and Your Carbon Footprint',
  subtitle: "The same blanket that keeps Earth warm is being thickened by us — and small daily choices are part of the story.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A split Indian landscape: on one side a shrinking Himalayan glacier and cracked drought earth, on the other a hazy smog-filled city skyline — the visible signs of a changing climate."),
    curiosityPrompt(
      "On page 1 you learned that carbon dioxide — just 0.04% of the air — helps keep Earth warm enough to live on. Now the very same gas is being blamed for dangerously *over*-heating the planet. Before reading on — how can one gas be both a lifesaver and a threat?",
      "Think about the 'blanket' from page 1. What happens if you keep piling on extra blankets?",
      "It comes down to *amount*. A thin blanket of greenhouse gases keeps Earth cosy and alive; but pile on extra — as humans are doing — and the same blanket traps too much heat and the planet overheats. That tipping from 'just right' to 'too much' is what climate change is about."
    ),
    text(
      "**Climate change** means long-term shifts in a place's weather patterns — its temperature, rainfall and winds — measured over decades. Some change is natural, but the rapid change we're seeing today is driven mainly by **human activity**: burning **fossil fuels** (coal, oil, gas) for energy and transport, cutting down forests, and industrial pollution. These release extra **greenhouse gases** — carbon dioxide, methane, nitrous oxide and water vapour — into the atmosphere."
    ),
    heading('The Greenhouse Effect — Too Much of a Good Thing'),
    text(
      "Think back to page 1's 'blanket.' Greenhouse gases work like the glass roof of a greenhouse: they let the Sun's light *in*, but trap the heat so it can't all escape back to space. A *little* of this is essential — without it, Earth would freeze. But by pumping out more and more of these gases, humans are **thickening the blanket**, so more heat gets trapped and average temperatures creep up.\n\nThe results are already showing: **more frequent floods and droughts, glaciers melting, sea levels rising, and biodiversity being lost** as habitats shift faster than life can adapt. And the burden isn't shared evenly — it often falls hardest on those least able to cope, including women, children and the poor."
    ),
    guidedReveal(
      'What a Thicker Blanket Does', 'A few degrees of warming ripples out in serious ways:',
      [
        { kicker: 'water', headline: 'More Floods and Droughts', body: "A warmer atmosphere holds more moisture and behaves more wildly — so rains come in heavier, more destructive bursts in some places, while others bake in longer droughts. India's own monsoon is becoming more erratic." },
        { kicker: 'ice', headline: 'Melting Glaciers, Rising Seas', body: "Himalayan glaciers — the frozen water towers that feed India's great rivers — are shrinking, while melting ice worldwide raises sea levels, threatening low coastal cities and islands." },
        { kicker: 'heat', headline: 'Fiercer Heatwaves', body: "Hotter, longer heatwaves strain health, crops and water supplies, and make the hottest parts of the year genuinely dangerous to work in." },
        { kicker: 'life', headline: 'Loss of Biodiversity', body: "As temperatures and rainfall shift, many plants and animals can't move or adapt fast enough, and species are lost — weakening the natural systems people depend on." },
      ]
    ),
    heading('Your Carbon Footprint'),
    text(
      "Your **carbon footprint** is the total amount of greenhouse gases released because of the way you live — how you travel, the electricity you use, the water you consume, and the waste you create. No single person's footprint changes the climate, but billions of footprints together do — which is also the hopeful part: billions of small changes add up just as surely. Tackling climate change takes big action from governments and industries, but everyday choices are a real part of the story."
    ),
    callout('what_if', 'My Carbon Footprint — An Honest Audit',
      "Score yourself, honestly, across four everyday habits:\n\n> **Transport** — do you mostly walk/cycle (low), use buses/carpool (medium), or take private cars and flights (high)?\n\n> **Electricity** — do you switch off lights and fans when not needed (low), or leave them running (high)?\n\n> **Water** — do you use it sparingly (low), or leave taps running and take long showers (high)?\n\n> **Waste** — do you reuse and recycle and avoid single-use plastic (low), or throw plastic away without a thought (high)?\n\nNow the real question: name **two simple changes** you could genuinely make this month to shrink your footprint — and actually try them."
    ),
    reasoningPrompt('logical',
      "A student argues: 'Carbon dioxide keeps Earth warm and alive, so more of it must be even better for the planet.' Based on this page, what's the flaw in that reasoning?",
      [
        "Greenhouse gases work like a blanket — a little keeps Earth livable, but too much traps excess heat and overheats the planet, driving floods, droughts, melting ice and lost species",
        "Carbon dioxide actually has no effect on temperature at all, so adding more changes nothing",
        "More carbon dioxide would cool the planet down, which is why the climate is warming",
        "The problem is only methane; carbon dioxide can be added safely in any amount",
      ],
      "It's a 'too much of a good thing' trap. The greenhouse effect is essential in moderation, but piling on extra gases thickens the blanket and traps too much heat — so more is not better, it's destabilising.",
      2
    ),
    quiz([
      { question: "What is the main driver of the rapid climate change we are seeing today?", difficulty_level: 1, correct_index: 3,
        options: [
          "The Earth slowly drifting closer to the Sun over the centuries",
          "A natural cooling cycle that repeats every few decades",
          "An increase in the number of volcanic eruptions worldwide",
          "Human activities like burning fossil fuels and cutting forests, which release extra greenhouse gases",
        ],
        explanation: "Today's rapid change is driven mainly by human activity releasing greenhouse gases." },
      { question: "Why does the page compare greenhouse gases to a blanket that can be piled on too thick?", difficulty_level: 2, correct_index: 0,
        options: [
          "Because a little greenhouse gas keeps Earth livably warm, but too much traps excess heat and overheats the planet",
          "Because greenhouse gases physically feel soft and warm like cloth",
          "Because blankets and greenhouse gases are both made of carbon dioxide",
          "Because the blanket only traps heat during the night, like the gases",
        ],
        explanation: "The blanket analogy captures 'too much of a good thing' — essential in small amounts, harmful in excess." },
      { question: "The page says climate change often hits some groups hardest. Based on everything here, what is the strongest reasoning-based takeaway about tackling it?", difficulty_level: 3, correct_index: 2,
        options: [
          "Since one person's footprint is tiny, individual choices are pointless and only governments matter",
          "Since the effects are uneven, the fairest solution is to do nothing and let each region cope alone",
          "It needs big action from governments and industry AND billions of small individual changes, because both the causes and the fixes add up across many people",
          "The only real solution is to move everyone away from coasts and glaciers",
        ],
        explanation: "The causes are collective (billions of footprints) and so are the fixes — meaningful action combines system-level change with widespread individual change." },
    ]),
  ], 'climate-change-and-carbon-footprint'),
};

const p9 = {
  slug: 'punjab-floods-2025',
  title: 'When the Rivers Rose — the Punjab Floods of 2025',
  subtitle: "A real, recent disaster where climate, rivers and human choices collided — and a decision only you can reason through.",
  blocks: withOrders([
    heroReal("The 2025 Punjab floods: brown floodwater spread across submerged paddy fields and a village, rooftops and treetops poking above the water, a breached earthen embankment in the distance under a heavy monsoon sky."),
    curiosityPrompt(
      "In August 2025, Punjab — the land famously watered by five rivers — was drowned by them. It was the state's worst flooding in nearly forty years. Before reading on: a flood this severe is easy to blame on 'too much rain.' But do you think rain alone can explain why the damage was so catastrophic?",
      "Ask not just 'why did it rain so much?' but also 'why did the water do so much harm when it came?'",
      "Rain was only half the story. The 2025 floods were a collision of an extreme, climate-charged monsoon *and* human choices that had quietly made Punjab far more vulnerable to water. Both halves matter — which is exactly what makes preventing the next one so hard."
    ),
    text(
      "In **August 2025**, unusually heavy monsoon rains sent the **Sutlej, Beas, Ravi** and **Ghaggar** rivers surging over their banks. Floodwater spread across more than **1,400 villages** in over a dozen districts — Gurdaspur, Amritsar, Ferozepur, Fazilka and others — in the **worst flooding Punjab had seen in about forty years**. Over **350,000 people** were affected, more than **148,000 hectares** of farmland (much of it standing paddy) went under water, and the floods took over **thirty lives**."
    ),
    heading('Why It Happened — Two Kinds of Causes'),
    text(
      "Investigators traced the disaster to **two kinds of causes working together**.\n\nThe **natural causes** were a supercharged monsoon: the rains ran about **24% above normal**, intensified by **western disturbances** and cyclonic systems dumping extra water — not only on Punjab but on the upstream hills of Himachal Pradesh and Jammu & Kashmir. As those catchments overflowed, big dams like **Bhakra, Pong** and **Ranjit Sagar** had to release surplus water, swelling the rivers further. And a warming climate is making exactly this kind of extreme, erratic downpour more common.\n\nThe **human causes** turned a heavy flood into a catastrophe. Punjab's earthen embankments — the **Dhussi Bandhs** — had not been properly strengthened before the monsoon, and several breached. Worse, people had increasingly **built homes and farmed on the floodplains** — the very land a river needs to spread into safely — and natural drainage had been blocked. Where the water should have spread thin, it instead smashed through weak walls into places people were living."
    ),
    callout('note', 'The Climate Thread',
      "Notice how this whole chapter comes together here. The **monsoon** (this chapter's centrepiece) delivered the water; **climate change** (the previous page) made that monsoon more extreme and less predictable; and **human choices about where to build and how to prepare** decided how much harm the water did. A flood in 2025 is really geography, climate and society knotted into one event."
    ),
    youSolveIt({
      title: 'As the Monsoons Grow Fiercer, How Should Punjab Prepare for the Next Flood?',
      problem:
        "The 2025 floods will not be the last — and with climate change loading the monsoon with heavier, less " +
        "predictable rain, the next one could be worse. Punjab has to decide how to protect its people, its " +
        "farms and its towns from water that is increasingly hard to hold back.",
      why_hard:
        "Here's the trap. You can't stop the rain, and you can't move a whole state. The 2025 disaster wasn't " +
        "caused by any single failure — it was extreme rain, upstream dam releases, weak embankments, *and* " +
        "people living where the water needed to go, all at once. Fix only one of those and the water finds " +
        "the next weak point. And every fix costs money, land or livelihoods that Punjab's farmers can't " +
        "easily spare.",
      image_prompt:
        "A clean map-style infographic of Punjab showing the Sutlej, Beas, Ravi and Ghaggar rivers with the " +
        "upstream dams (Bhakra, Pong, Ranjit Sagar), flood-hit districts shaded, and four small labelled icons " +
        "around the edge for the four options: strengthen embankments, clear floodplains, coordinate dams + early " +
        "warning, build climate resilience. Dark background, orange accent labels, clean technical illustration style.",
      image_caption: "The 2025 Punjab floods and the choices for preventing the next one (illustrative infographic).",
      source_note:
        "Grounded in documented reporting on the August 2025 Punjab floods: ~1,400 villages and 13+ districts " +
        "hit, 350,000+ people affected, 148,000+ ha of farmland submerged, 30+ lives lost — the worst in ~40 " +
        "years. Causes named in analyses: ~24% surplus monsoon rain intensified by western disturbances, surplus " +
        "releases from Bhakra/Pong/Ranjit Sagar dams, unmaintained Dhussi Bandh embankments, and floodplain " +
        "encroachment obstructing natural drainage.",
      solutions: [
        {
          label: "Strengthen and raise the Dhussi Bandh embankments — properly, every year before the monsoon",
          upside: "It directly shields the towns and farms behind the walls, and the 2025 breaches were partly a maintenance failure — so doing it right would genuinely help.",
          tradeoff: "Hundreds of kilometres of earthen embankment are expensive to maintain every single year, and a raised wall that finally *bursts* unleashes a more sudden, violent flood than open water would. It also does nothing about the extreme rain itself.",
        },
        {
          label: "Give the rivers room — clear floodplain encroachments and stop building in the flood zone",
          upside: "It attacks a root cause of the 2025 damage: people living where water must spread. Let the river reclaim its floodplain and floods spread thin, low and far less destructively.",
          tradeoff: "It means relocating families and giving up fertile, valuable farmland that people depend on for their income — a wrenching social and political ask, even when the engineering is sound.",
        },
        {
          label: "Coordinate the dam releases and invest in early warning",
          upside: "Better-timed releases from Bhakra, Pong and Ranjit Sagar, plus accurate forecasts and fast alerts (through Mission Mausam), could avoid sudden surges and give people time to get to safety.",
          tradeoff: "Warnings save lives but not homes or crops — the water still comes. And the dams must juggle flood control against their other jobs of storing water for irrigation and generating power.",
        },
        {
          label: "Build long-term climate resilience — restore drainage and wetlands, plan climate-smart farming",
          upside: "Instead of just walling water out, it adapts Punjab to the new reality of fiercer monsoons: unblocked natural drainage and restored wetlands soak up floods, and resilient crops survive them better.",
          tradeoff: "It's slow, systemic and costly, with results that take years rather than a single season — hard to prioritise when the next monsoon is only months away.",
        },
      ],
      prompt:
        "If the choice were yours, which would you back first to protect the people of Punjab — and what is the " +
        "single strongest objection to your own choice?",
      reality_check:
        "In reality Punjab is using a patchwork of all of these — repairing embankments, debating floodplain " +
        "rules, improving forecasts — yet the hard parts (clearing encroachments, funding year-round maintenance, " +
        "coordinating dams across states) remain unresolved, and a warming climate keeps raising the stakes. " +
        "There is no clean answer, which is the honest lesson: protecting people from a changing climate is not " +
        "one decision but many, argued over by engineers, farmers, governments and scientists — the very kind of " +
        "problem this whole chapter has been preparing you to think about.",
    }),
    quiz([
      { question: "The 2025 Punjab floods are described as having 'two kinds of causes.' What are they?", difficulty_level: 1, correct_index: 1,
        options: [
          "Ocean tides and earthquakes striking the coast at the same time",
          "Natural causes (extreme monsoon rain, western disturbances, dam releases) and human causes (weak embankments, floodplain building, blocked drainage)",
          "Only a single burst of unusually heavy rain, with no other factor involved",
          "A volcanic eruption upstream followed by melting glaciers",
        ],
        explanation: "The page splits it into natural causes (supercharged monsoon + dam releases) and human causes (weak Dhussi Bandhs, floodplain encroachment, blocked drainage)." },
      { question: "Why does the page argue that 'too much rain' alone can't explain the scale of the disaster?", difficulty_level: 2, correct_index: 2,
        options: [
          "Because the rainfall was actually below normal that year",
          "Because rivers cannot flood without an earthquake to start them",
          "Because human choices — unmaintained embankments and building on floodplains — turned a heavy flood into a catastrophe by removing the space and defences the water needed",
          "Because Punjab has no rivers large enough to cause serious flooding",
        ],
        explanation: "The extreme rain met human vulnerability — weak walls and occupied floodplains — which is what multiplied the damage." },
      { question: "The page ties this flood to the whole chapter. What is the strongest reasoning-based takeaway?", difficulty_level: 3, correct_index: 0,
        options: [
          "A single disaster can be geography, climate and human choices knotted together — the monsoon brought the water, climate change made it more extreme, and human decisions shaped the harm",
          "Floods are purely a weather event and have nothing to do with human decisions",
          "Climate change had no role because floods have always happened in Punjab",
          "The only cause that truly mattered was the release of water from the dams",
        ],
        explanation: "The flood is a knot of monsoon (water), climate change (making it extreme) and human choices (deciding the damage) — the chapter's ideas converging in one real event." },
    ]),
  ], 'punjab-floods-2025'),
};

const p10 = {
  slug: 'atmosphere-and-climate-toolkit',
  title: 'Atmosphere and Climate — Toolkit',
  subtitle: "Pulling the whole chapter together, plus one real skill to carry forward: reading a climograph.",
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A sweeping view of the Indian sky through a full day — dawn, blazing noon, gathering monsoon cloud, and starry night — layered across the banner, tying the whole chapter together."),
    curiosityPrompt(
      "You've travelled from the edge of space down through five layers of air, felt the pressure and the wind, followed the monsoon across the country, and watched a real flood unfold. Before you close the chapter — which single idea from all of this surprised you the most, and why?"
    ),
    text(
      "Step back and the whole chapter tells one connected story. A thin **blanket of air**, held by gravity, wraps the Earth in **five layers** and keeps us alive. Within its lowest layer, the interplay of **temperature, humidity, pressure and wind** creates the day-to-day **weather** — and, averaged over decades, the long-term **climate** of a place. India's climate is ruled by the great seasonal reversal of the **monsoon**, which brings the rains its farms depend on. And today, human activity is thickening that blanket, driving **climate change** — whose consequences we saw play out in the Punjab floods of 2025."
    ),
    guidedReveal(
      'The Chapter in Five Ideas', 'The whole of Atmosphere and Climate, boiled down:',
      [
        { kicker: '1', headline: 'The atmosphere is a life-support blanket', body: "A gravity-held ocean of air — mostly nitrogen and oxygen — that we breathe, that shields us from harmful rays, and that keeps the planet warm enough to live on." },
        { kicker: '2', headline: 'It is layered', body: "Five layers from the troposphere (where weather lives) up to the exosphere (the edge of space), each defined by how temperature and density change with height." },
        { kicker: '3', headline: 'Weather vs climate', body: "Weather is the atmosphere's mood today, shaped by temperature, humidity, pressure and wind; climate is a place's decades-long personality." },
        { kicker: '4', headline: 'The monsoon rules India', body: "A seasonal reversal of winds — the sea breeze scaled up to a subcontinent — that delivers most of India's rain and holds its farms' fate." },
        { kicker: '5', headline: 'The climate is changing', body: "Human activity is thickening the greenhouse blanket, making extremes like the 2025 Punjab floods more likely — and preparing for them is a real, unsettled challenge." },
      ]
    ),
    heading('A Skill to Carry Forward — Reading a Climograph'),
    text(
      "Geographers have a neat way to capture a whole place's climate in one picture: a **climograph**. It combines two things on a single chart — a **line** tracing the **average temperature** each month, and **bars** showing the **average rainfall** each month. At a glance you can read a place's story: when it's hottest, when its rains come, and how wet or dry it is overall.\n\nRead a climograph of an Indian city and the monsoon jumps out at you — a tall cluster of rainfall bars from June to September, right where the temperature line dips as the rains cool things down. Learn to read one, and you can understand a place you've never even visited."
    ),
    image(
      'A climograph showing monthly temperature and rainfall',
      '📸 A climograph — a place\'s climate in one chart',
      "A climograph of an Indian city (e.g. Delhi): a red line showing average monthly temperature rising to a peak before the monsoon, and blue bars showing average monthly rainfall with a tall cluster in June–September (the monsoon). Label the temperature axis, the rainfall axis, and the months Jan–Dec."
    ),
    careerSpotlight(
      'Who Works With the Sky and Climate?',
      'The ideas in this chapter are somebody\'s day job — here are a few real ones:',
      [
        { role: 'Meteorologist (IMD)', description: "Forecasts the weather and tracks the monsoon at the India Meteorological Department, issuing the warnings that help farmers, pilots and disaster teams prepare." },
        { role: 'Climatologist', description: "Studies long-term climate patterns and climate change — the decades-and-centuries view — to advise on how the country should adapt." },
        { role: 'Disaster Management Officer (NDMA)', description: "Plans for and responds to floods, cyclones and heatwaves with the National Disaster Management Authority, turning forecasts into evacuations and relief." },
        { role: 'Agricultural Scientist', description: "Breeds climate-smart crops and advises farmers on sowing around the monsoon — putting weather and climate knowledge directly into the food supply." },
      ],
      'None of these are far-off careers — they run on exactly the ideas you just learned.'
    ),
    reasoningPrompt('logical',
      "A brand-new city is planned in a place with a climograph showing a tall cluster of rainfall bars in June–September and a temperature dip at the same time. Based on this chapter, what should the planners most expect — and prepare for?",
      [
        "A strong monsoon season — most of the year's rain arriving June–September — so they must plan drainage, flood protection and water storage around it",
        "A place that receives almost no rain at all, so they should plan for permanent drought only",
        "Rainfall spread evenly through every month of the year, needing no special planning",
        "A cold polar climate, since the temperature dips during the rains",
      ],
      "That rainfall-bar cluster in June–September with a matching temperature dip is the fingerprint of the monsoon. Planners should expect most of the year's water in a few months — so drainage, flood defences and storing that water are the priorities.",
      2
    ),
    quiz([
      { question: "Which layer of the atmosphere holds nearly all our weather?", difficulty_level: 1, correct_index: 0,
        options: [
          "The troposphere, the lowest layer, which holds most of the water vapour",
          "The exosphere, at the very edge of space",
          "The stratosphere, where the ozone layer sits",
          "The thermosphere, where the auroras glow",
        ],
        explanation: "Weather happens in the troposphere — the lowest layer, holding almost all the water vapour." },
      { question: "What is the essential difference between weather and climate?", difficulty_level: 1, correct_index: 2,
        options: [
          "Weather applies to villages while climate applies only to big cities",
          "Weather is measured in Celsius and climate is measured in rainfall",
          "Weather is the atmosphere's condition right now; climate is its average over decades",
          "They mean exactly the same thing and can be used interchangeably",
        ],
        explanation: "Weather = now; climate = the long-term average (decades)." },
      { question: "The summer monsoon works on the same mechanism as which everyday phenomenon from this chapter?", difficulty_level: 2, correct_index: 1,
        options: [
          "A meteor burning up in the mesosphere",
          "The afternoon sea breeze — land heating faster than water, pulling moist sea air inland",
          "The aurora glowing in the thermosphere",
          "A stalactite growing drop by drop in a cave",
        ],
        explanation: "The summer monsoon is the sea-breeze mechanism scaled up to a subcontinent and a season." },
      { question: "The Punjab floods of 2025 are used to show that a disaster can combine several forces. Based on the whole chapter, which combination is correct?", difficulty_level: 3, correct_index: 3,
        options: [
          "Only heavy rain, with no human factor of any kind",
          "Only weak embankments, with the weather playing no role",
          "Earthquakes and ocean tides acting together",
          "The monsoon delivering the water, climate change making it more extreme, and human choices shaping how much harm it caused",
        ],
        explanation: "The chapter frames the flood as monsoon + climate change + human choices knotted together — geography, climate and society in one event." },
    ]),
  ], 'atmosphere-and-climate-toolkit'),
};

const PAGES = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];

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
    if (!chapter) throw new Error(`Chapter ${CHAPTER_NUMBER} not found on book ${BOOK_ID}`);

    const newPageIds = [];
    let skipped = 0;
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      const pageNumber = i + 1;
      const existing = await pagesCol.findOne({ book_id: BOOK_ID, slug: p.slug });
      if (existing) { console.log(`⏭  "${p.slug}" exists — skipping (idempotent).`); skipped++; continue; }
      const _id = uuid();
      const doc = {
        _id, book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: pageNumber,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        hinglish_blocks: [], tags: [], published: false,
        reading_time_min: bw.computeReadingTime(p.blocks),
        content_types: bw.computeContentTypes(p.blocks),
        page_type: 'lesson', deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      };
      await pagesCol.insertOne(doc);
      newPageIds.push(_id);
      console.log(`✓ Inserted page ${pageNumber} "${p.slug}" (${p.blocks.length} blocks).`);
    }
    if (newPageIds.length) {
      await books.updateOne(
        { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
        { $push: { 'chapters.$.page_ids': { $each: newPageIds } }, $set: { updated_at: new Date() } }
      );
      console.log(`✓ Wired ${newPageIds.length} new page_ids into chapter ${CHAPTER_NUMBER}.`);
    }
    console.log(`\n✅ Done. Inserted ${newPageIds.length}, skipped ${skipped}.`);
  } finally {
    await client.close();
  }
}
main().catch((err) => { console.error('❌', err); process.exit(1); });
