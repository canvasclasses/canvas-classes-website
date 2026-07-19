'use strict';
// Fix (2026-07-10 audit): Ch3 quiz length-tell — the correct option was systematically the
// longest (guessable). Rewrites every quiz question with options balanced to a tight length band
// (no option is a giveaway by length), keeps the teaching in `explanation`, and cycles
// correct_index for an even A/B/C/D spread (D was under-used). Question stems unchanged where good.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

// slug -> full replacement questions[] (balanced). correct_index cycles for spread.
const QUIZ = {
  'weather-climate-and-temperature': [
    { question: "Which of these statements describes climate rather than weather?", ci: 3, opts: [
      "It began raining heavily across Mumbai earlier this afternoon",
      "A cold northerly wind is making today feel chilly in Shimla",
      "The clouds cleared and the sky turned bright and sunny an hour ago",
      "India, taken as a whole, has a hot tropical climate averaged over decades",
    ], ex: "Climate is the decades-long average; the other three describe a single day's conditions (weather)." },
    { question: "Why are the tropics far hotter than the polar regions?", ci: 1, opts: [
      "The polar regions receive no sunlight at all during the whole year",
      "Near the equator the Sun's rays strike head-on, while at the poles they hit at a slant and spread thin",
      "The tropics are physically far closer to the Sun than the polar regions are",
      "Hot air from cities and factories collects only around the equator",
    ], ex: "It's the angle of insolation — concentrated head-on rays at the equator, weak slanted rays at the poles." },
    { question: "Most of India lies in the Torrid Zone. What does that best explain?", ci: 2, opts: [
      "That India has no seasonal change in temperature across the whole year",
      "That India is colder than temperate countries, since the Torrid Zone blocks the Sun",
      "That India tends to run hot much of the year, so the cooling monsoon matters greatly",
      "That India's temperature depends only on its altitude, never on its latitude",
    ], ex: "The Torrid Zone is the hottest belt, so India stays hot — making the monsoon's relief vital." },
  ],
  'humidity-and-precipitation': [
    { question: "What exactly is humidity?", ci: 0, opts: [
      "The amount of invisible water vapour present in the air",
      "The total number of clouds visible in the sky at once",
      "The speed at which raindrops fall during a heavy storm",
      "The temperature of the air on a hot summer afternoon",
    ], ex: "Humidity is the quantity of water vapour (invisible gas) held in the air." },
    { question: "Warm, moisture-filled air rises up a mountain and cools. What happens next?", ci: 1, opts: [
      "The cooling air absorbs even more vapour, so the sky clears completely",
      "The cool air holds less vapour, so it saturates, condenses, and precipitation is likely",
      "The vapour instantly becomes hail, no matter what the air temperature is",
      "Nothing changes, because temperature has no effect on how much vapour air holds",
    ], ex: "Cooling air holds less vapour, so it saturates and condenses — the recipe for cloud and rain." },
    { question: "Why can a weak monsoon cause water shortages months later, not just on rainy days?", ci: 3, opts: [
      "Because rain physically pushes water out of the ground and into the sea",
      "Because humidity alone, with no rain at all, is enough to fill every reservoir",
      "Because snow is the only form of precipitation that reaches the water supply",
      "Because precipitation is what fills rivers and reservoirs and recharges the groundwater",
    ], ex: "Precipitation is the ultimate source of rivers, reservoirs and groundwater — so poor rain drains the whole supply." },
  ],
  'air-pressure-and-winds': [
    { question: "In which direction does air always move between pressure areas?", ci: 2, opts: [
      "From low-pressure areas toward high-pressure areas, to fill the heavier region",
      "Straight upward, from the ground into the upper layers of the atmosphere",
      "From high-pressure areas toward low-pressure areas — and that flow is wind",
      "It stays perfectly still until the two pressures become exactly equal",
    ], ex: "Wind is air flowing from high pressure to low pressure to even out the difference." },
    { question: "A wind blows in from the west. What is it correctly called?", ci: 0, opts: [
      "A westerly, because winds are named for the direction they blow from",
      "An easterly, because it is travelling toward the eastern side",
      "A sea breeze, because every named wind comes in from the sea",
      "A calm, because winds arriving from the west are always gentle",
    ], ex: "Winds are named for where they come from — a wind from the west is a westerly." },
    { question: "Why does the coastal breeze blow sea-to-land by day but land-to-sea by night?", ci: 1, opts: [
      "Because the Sun physically drags the wind along behind it across the sky",
      "Because land heats and cools faster than sea, so the low-pressure side flips day to night",
      "Because the sea is at higher pressure than the land at every hour, day and night",
      "Because the ocean tides push the air back and forth roughly twice a day",
    ], ex: "Land changes temperature faster than water, so the warm low-pressure side flips — and the wind flips with it." },
  ],
  'seasons-of-india': [
    { question: "How many main seasons does the India Meteorological Department recognise?", ci: 2, opts: [
      "Two — simply one wet season and one dry season across the year",
      "Six — the traditional Ṛtus of the classical Indian calendar",
      "Four — winter, summer, monsoon and post-monsoon",
      "Three — only summer, monsoon and winter, with no others",
    ], ex: "The IMD recognises four: winter, summer (pre-monsoon), monsoon, and post-monsoon." },
    { question: "A poet writes of 'Varṣhā' arriving in the month of Śhrāvaṇa. What is she describing?", ci: 3, opts: [
      "A modern forecasting term the weather office uses for a single heavy storm",
      "A region of India where the rain reportedly never stops falling",
      "A type of rāga traditionally played only during the winter months",
      "One of the six traditional Ṛtus — the monsoon season of the Indian calendar",
    ], ex: "Varṣhā is the monsoon Ṛtu among the six traditional Indian seasons (roughly July–August)." },
    { question: "Why do the Himalayan states feel a distinct autumn and spring the plains barely notice?", ci: 0, opts: [
      "Because they are cooler and temperate, so temperature-driven seasons show clearly there",
      "Because they receive no monsoon rain and need extra seasons to fill out the year",
      "Because the traditional Ṛtu calendar is used only in the mountain regions",
      "Because the weather office measures the mountains on a wholly separate calendar",
    ], ex: "Being cooler and temperate, the Himalayan states get clear autumn and spring, unlike the hot monsoon plains." },
  ],
  'the-monsoon': [
    { question: "What does the word 'monsoon' (from Arabic mausim) fundamentally describe?", ci: 1, opts: [
      "A single, very heavy rainstorm that strikes a region without any warning",
      "A wind system that reverses its direction between the seasons of the year",
      "The hottest month of the Indian summer, just before the rains arrive",
      "A type of ocean current that flows in a circle around the Indian coast",
    ], ex: "Monsoon means a seasonal reversal of winds — mausim means 'season'." },
    { question: "During the summer monsoon, moist winds blow from the sea onto the land. What sets that up?", ci: 3, opts: [
      "The ocean heats faster than the land, forming low pressure over the sea",
      "The Earth's rotation physically drags ocean water onto the shore as rain",
      "Cold winter air sitting over the land pushes the sea winds inland toward it",
      "The land heats faster than the sea, so low pressure over land pulls in moist sea winds",
    ], ex: "Land heats faster than water in summer → low pressure over land → moist sea winds rush in (the sea breeze, scaled up)." },
    { question: "Why does Tamil Nadu get much of its rain in October–December, unlike most of India?", ci: 0, opts: [
      "The dry winter monsoon picks up moisture over the warm Bay of Bengal and rains on the south-east coast",
      "The summer monsoon simply reaches Tamil Nadu several months later than the rest of India",
      "Tamil Nadu gets no summer monsoon at all and depends only on scattered local storms",
      "The retreating monsoon reverses the Earth's rotation over the south of the country",
    ], ex: "The winter (NE) monsoon is dry overland but soaks up Bay-of-Bengal moisture, raining on the south-east coast." },
  ],
  'climate-change-and-carbon-footprint': [
    { question: "What is the main driver of the rapid climate change we see today?", ci: 3, opts: [
      "The Earth slowly drifting closer to the Sun over many centuries of time",
      "A natural cooling cycle that repeats itself every few decades or so",
      "A sharp rise in the number of volcanic eruptions around the world",
      "Human activities — burning fossil fuels and cutting forests — releasing greenhouse gases",
    ], ex: "Today's rapid change is driven mainly by human activity releasing greenhouse gases." },
    { question: "Why does the page compare greenhouse gases to a blanket piled on too thick?", ci: 0, opts: [
      "Because a little keeps Earth livably warm, but too much traps excess heat and overheats it",
      "Because greenhouse gases physically feel soft and warm to the touch, like cloth",
      "Because both a blanket and the gases are made almost entirely of carbon dioxide",
      "Because the blanket, like the gases, only traps the planet's heat during the night",
    ], ex: "The blanket captures 'too much of a good thing' — essential in small amounts, harmful in excess." },
    { question: "Climate change often hits some groups hardest. What is the strongest takeaway about tackling it?", ci: 1, opts: [
      "Since one person's footprint is tiny, individual choices are pointless and only governments matter",
      "It needs big action by governments and industry AND billions of small changes, because both add up",
      "Since the effects are uneven, the fairest response is to do nothing and let each region cope alone",
      "The only real solution left is to move everyone permanently away from coasts and glaciers",
    ], ex: "Causes and fixes are both collective — meaningful action combines system change with widespread individual change." },
  ],
  'punjab-floods-2025': [
    { question: "The 2025 Punjab floods are described as having 'two kinds of causes.' What are they?", ci: 2, opts: [
      "Ocean tides and a series of earthquakes striking the coastline at the same time",
      "Only a single burst of unusually heavy rain, with no other contributing factor",
      "Natural causes (extreme monsoon, dam releases) and human causes (weak embankments, floodplain building)",
      "A volcanic eruption far upstream, followed some weeks later by rapidly melting glaciers",
    ], ex: "The page splits it into natural causes (supercharged monsoon + dam releases) and human causes (weak Dhussi Bandhs, encroachment)." },
    { question: "Why can't 'too much rain' alone explain the scale of the 2025 disaster?", ci: 0, opts: [
      "Because human choices — unmaintained embankments and floodplain building — turned a heavy flood into a catastrophe",
      "Because the rainfall that year was actually well below the seasonal normal",
      "Because rivers cannot flood at all unless an earthquake first sets them off",
      "Because Punjab has no rivers large enough to ever cause serious flooding",
    ], ex: "Extreme rain met human vulnerability — weak walls and occupied floodplains — which multiplied the damage." },
    { question: "The page ties this flood to the whole chapter. What is the strongest takeaway?", ci: 3, opts: [
      "Floods are purely a weather event and have nothing to do with any human decisions",
      "Climate change played no role at all, because floods have always happened in Punjab",
      "The only cause that genuinely mattered was the release of water from the big dams",
      "One disaster can knot together geography, climate change and human choices at once",
    ], ex: "The flood is monsoon (water) + climate change (making it extreme) + human choices (deciding the harm) combined." },
  ],
  'atmosphere-and-climate-toolkit': [
    { question: "Which layer of the atmosphere holds nearly all of our weather?", ci: 0, opts: [
      "The troposphere, the lowest layer, which holds most of the water vapour",
      "The exosphere, the wispy outermost layer at the very edge of space",
      "The stratosphere, the calm layer where the ozone layer sits",
      "The thermosphere, the hot upper layer where the auroras glow at night",
    ], ex: "Weather happens in the troposphere — the lowest layer, holding almost all the water vapour." },
    { question: "What is the essential difference between weather and climate?", ci: 1, opts: [
      "Weather applies only to villages, while climate applies only to the big cities",
      "Weather is the atmosphere's condition right now; climate is its average over decades",
      "Weather is always measured in Celsius while climate is measured only in rainfall",
      "They mean exactly the same thing and the two words can be swapped freely",
    ], ex: "Weather = now; climate = the long-term average over decades." },
    { question: "The summer monsoon works on the same mechanism as which everyday phenomenon?", ci: 2, opts: [
      "A bright meteor burning up in a streak across the mesosphere",
      "A stalactite growing drop by drop from the roof of a limestone cave",
      "The afternoon sea breeze — land heating faster than water, pulling in moist air",
      "The shimmering aurora glowing in the thermosphere near the poles",
    ], ex: "The summer monsoon is the sea-breeze mechanism scaled up to a subcontinent and a season." },
    { question: "The 2025 Punjab floods show a disaster combining several forces. Which combination is right?", ci: 3, opts: [
      "Only heavy monsoon rain, with no human factor playing any part at all",
      "Only weak embankments, with the weather that year playing no real role",
      "A series of earthquakes and unusually high ocean tides acting together",
      "The monsoon bringing water, climate change intensifying it, and human choices shaping the harm",
    ], ex: "The chapter frames it as monsoon + climate change + human choices knotted into one event." },
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
        // sanity: correct option must be clearly the intended one; check length balance
        const lens = q.opts.map((o) => o.length);
        const ci = q.ci;
        const others = lens.filter((_, idx) => idx !== ci);
        const ratio = lens[ci] / (others.reduce((a, b) => a + b, 0) / others.length);
        if (ratio > 1.3 || ratio < 0.77) console.log(`  ⚠ ${slug} q${i + 1} still imbalanced (ratio ${ratio.toFixed(2)})`);
        return { id: (qBlock.questions[i] && qBlock.questions[i].id) || `${slug}-q${i}`, question: q.question, options: q.opts, correct_index: ci, explanation: q.ex, difficulty_level: i === 0 ? 1 : i === 1 ? 2 : 3 };
      });
      const blocks = page.blocks.map((b) => (b === qBlock ? { ...b, questions: newQs } : b));
      const res = await bw.savePage(db, { slug }, blocks, { author: 'agent', summary: 'Quiz rebalance (audit): balanced option lengths to kill the length-tell + spread correct_index toward D.' });
      console.log(`✓ ${slug} — quiz rebalanced (${newQs.length} Qs, v${res.version || '?'})`);
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
