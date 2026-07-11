'use strict';
/**
 * Creates the `class11-biology` book and builds Chapter 1 (The Living World):
 * a chapter_opener + 2 lesson pages, faithful to the 2023-rationalised NCERT
 * text (verified against the official ncert.nic.in PDF, kebo101.pdf, before
 * writing a word — CLAUDE.md Rule 0).
 *
 * Idempotent: exits without writing if the book already exists.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('./lib/book-writer');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');

  try {
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const existing = await books.findOne({ slug: 'class11-biology' });
    if (existing) {
      console.log('class11-biology already exists — aborting, nothing written.');
      return;
    }

    const bookId = uuid();
    const openerId = uuid();
    const page1Id = uuid();
    const page2Id = uuid();

    // ── Chapter opener ──────────────────────────────────────────────────
    const openerBlocks = [
      {
        id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk cross-section from ocean depths to a starlit mountain peak, life visible at every layer',
        caption: '', width: 'full', aspect_ratio: '21:9',
        generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single continuous vertical cross-section landscape at dusk, viewed from a wide angle: from the ocean depths at the very bottom, rising through a rocky coastline, into a dense forest, up a mountain slope, and finally to a starlit peak at the very top of the frame. Faint silhouettes of a huge range of different organisms are visible at every layer — fish and coral shapes in the deep water, birds mid-flight over the forest canopy, a mammal silhouette on the mountain slope — each barely visible, suggesting quiet abundance rather than being the focal subject. A single soft warm light source at the top of the frame, near the peak, ties every layer together as if all this diversity connects to one point. Deep dusk lighting, painterly illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
      },
      {
        id: uuid(), type: 'text', order: 1,
        markdown: "- Explain what biodiversity actually means, and why the \"1.7–1.8 million known species\" figure keeps growing\n- Write and correctly format any organism's binomial scientific name\n- Explain the difference between identification, nomenclature, classification, and taxonomy\n- Place any organism correctly on the seven-rank taxonomic hierarchy, from Species to Kingdom\n- Read a taxonomy table like Table 1.1 without falling for the classic rank-mix-up trap",
      },
    ];

    const openerDoc = {
      _id: openerId, book_id: bookId, chapter_number: 1, page_number: 0,
      slug: 'chapter-1-overview', title: 'The Living World',
      subtitle: "Millions of species share this planet, and none of them arrived with a name tag. This chapter is how biologists agreed on one language for every living thing — and the exact ladder they use to place any organism from species to kingdom.",
      blocks: openerBlocks, hinglish_blocks: [], tags: ['the-living-world'],
      published: false, page_type: 'chapter_opener',
      reading_time_min: bw.computeReadingTime(openerBlocks),
      content_types: bw.computeContentTypes(openerBlocks),
      video_title: null, readiness: null,
      review: { reviewed: false, reviewed_by: null, reviewed_at: null },
      deleted_at: null, deleted_by: null, deletion_reason: null,
      created_at: new Date(), updated_at: new Date(),
    };

    // ── Page 1 — Diversity in the Living World & Naming Every Living Thing ─
    const page1Blocks = [
      {
        id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk panorama spanning cold mountains, forest, ocean, a lake, desert and a hot spring',
        caption: '', width: 'full', aspect_ratio: '16:5',
        generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk panorama spanning five distinct habitats side by side without hard borders: a snow-dusted cold mountain slope on the far left blending into a dense deciduous forest, opening into a wide ocean horizon with gentle waves, narrowing into a still fresh water lake reflecting the sky, and finally a stretch of desert dunes meeting a steaming hot spring on the far right. Faint silhouettes of animals native to each zone are visible at a distance — a mountain goat, a deer beneath forest canopy, a leaping fish breaking the ocean surface, wading birds at the lake edge, a fox on the dunes — none of them the focal subject, just quiet presences suggesting how much life fills every one of these places. Deep dusk lighting throughout, a single warm horizon glow tying the whole panorama together. Painterly illustration style, atmospheric, dark background overall (#0a0a0a base tones), no text, no labels.",
      },
      {
        id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'More Species Than You\'ve Ever Counted',
        markdown: "Cold mountains. Deciduous forests. Oceans. Fresh water lakes. Deserts. Even hot springs where the water is almost boiling. Every one of these places, however hostile it looks, is home to living organisms found nowhere else. Somewhere between **1.7 and 1.8 million species** have been formally identified and described by scientists so far — and that number keeps climbing every time someone explores a patch of forest or ocean floor that hasn't been studied closely before.",
      },
      {
        id: uuid(), type: 'text', order: 2,
        markdown: "Look around you right now. Potted plants, insects on the windowsill, birds outside, your pet if you have one — each different kind of plant, animal, or organism you can point to represents a **species**. Zoom out from your room to your street, then to your city, then to an entire dense forest, and the range of species you'd encounter keeps growing at every step. That's what biologists mean by **biodiversity** — simply the number and variety of different organisms living on Earth.\n\nHere's the part that surprises most people: even in places humans have walked for centuries, biologists are still finding species nobody has ever formally described. The 1.7–1.8 million figure isn't a final count — it's just how far the cataloguing has gotten so far. The living world is, quite literally, bigger than our list of it.",
      },
      {
        id: uuid(), type: 'heading', order: 3, level: 2,
        text: "Why One Name Isn't Enough — Unless Everyone Agrees On It",
        objective: "By the end of this you'll know exactly why 'aam' won't work in a research paper — and what has to replace it.",
      },
      {
        id: uuid(), type: 'text', order: 4,
        markdown: "Every plant and animal already has a name — usually several. Mango is 'aam' in Hindi, 'mavina' in Kannada, and something else entirely in Tamil, Bengali, or Portuguese. None of these names is wrong. The problem shows up the moment two scientists from different parts of the world try to talk about the exact same organism: a paper published in Kerala and a paper published in Kyoto need to be talking about the identical species, not two organisms that merely sound alike in translation.\n\nThis is where two related but different jobs come in. **Identification** means correctly describing an organism so you know exactly which one you're talking about — you can't name something correctly if you can't first pin down what it actually is. **Nomenclature** is the next step: agreeing on one standardised name for that organism, accepted by biologists everywhere, regardless of what it's called locally. Without nomenclature, biology would be thousands of local vocabularies that don't talk to each other.",
      },
      {
        id: uuid(), type: 'heading', order: 5, level: 2,
        text: "Binomial Nomenclature — One System, Two Words, Every Organism",
        objective: "By the end of this you can write any organism's scientific name correctly — and spot the exact formatting mistake NEET loves to test.",
      },
      {
        id: uuid(), type: 'text', order: 6,
        markdown: "Biologists follow a single, universally accepted naming system called **binomial nomenclature** — given to us by Carolus Linnaeus — where every scientific name has exactly two parts: a **generic name** (the genus) and a **specific epithet** (the species). Take mango: its scientific name is *Mangifera indica*. 'Mangifera' is the genus — it tells you which broader group the organism belongs to. 'indica' is the specific epithet — it narrows that group down to this exact species.\n\nWho decides these rules? For plants, it's the **International Code for Botanical Nomenclature (ICBN)**. For animals, it's the **International Code of Zoological Nomenclature (ICZN)**. Both exist for the same reason: to guarantee that any organism, anywhere in the world, has exactly one accepted scientific name — and that name has never been reused for anything else.",
      },
      {
        id: uuid(), type: 'image', order: 7, src: '', alt: 'Anatomy of a binomial scientific name, using Mangifera indica as the example',
        caption: '📸 Every part of a correctly written binomial name, labelled', width: 'full', aspect_ratio: '16:9',
        generation_prompt: "Scientific textbook illustration showing the anatomy of a binomial name. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Large italicised text reading 'Mangifera indica Linn.' centred in the image, rendered in clean white typography. A white leader line points from the word 'Mangifera' up to a label reading 'GENUS — capitalised, italic'. A white leader line points from the word 'indica' down to a label reading 'SPECIFIC EPITHET — lowercase, italic'. A third, shorter white leader line points from 'Linn.' to a smaller label reading 'author citation — abbreviated name of the scientist who first described it'. No photorealism, no decorative elements, clean minimalist typography-focused composition, matches standard biology textbook illustration conventions.",
      },
      {
        id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'The Four Rules You Cannot Get Wrong',
        markdown: "1. Biological names are written in **Latin** (or Latinised) and always in *italics*.\n2. The **first word is the genus**, the **second word is the specific epithet** — always in that order.\n3. When handwritten, both words are separately **underlined** (italics do this job in print).\n4. The genus starts with a **capital letter**; the specific epithet always starts **lowercase** — even if it's a place name or a person's name.",
      },
      {
        id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
        prompt: "Two research papers, one written in Japan and one in Brazil, both study the exact same species of tree. One paper refers to it by its local Japanese name, the other by its local Portuguese name. A third paper, meant to be read by scientists everywhere, calls it Mangifera indica. Why does only the third paper's name work for a global audience?",
        options: [
          "Latin simply sounds more scientific than any local language, so international journals prefer it stylistically",
          "'Mangifera indica' is the one name every biologist has agreed to use for this exact species, assigned under a fixed international code — it isn't tied to any single country's language",
          "Local names are always incorrect and should never be used in any context",
          "The author of the third paper personally translated both local names into a single new word",
        ],
        reveal: "It's not about Latin sounding impressive — it's about standardisation. 'Mangifera indica' was assigned under the International Code for Botanical Nomenclature, a fixed set of rules every botanist worldwide agrees to follow, so the name means exactly the same species whether you're reading it in Kerala, Kyoto, or Brazil. Local names aren't 'wrong' — a Japanese or Portuguese name is perfectly correct within its own language and place. It just isn't universal, which is the one job a scientific name has to do.",
        difficulty_level: 2,
      },
      {
        id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
        markdown: "**Classic formatting trap:** NCERT itself asks students to spot the correctly written name between 'Mangifera Indica' and 'Mangifera indica' — the answer is always the second one. Capitalising the specific epithet, or lowercasing the genus, is an instant wrong answer on any exam.\n\n**Author citation:** When you see a name like *Mangifera indica* Linn., the abbreviated word after the italicised name is **not part of the scientific name** — it just tells you which scientist first described that species (here, Linnaeus).\n\n**Two different codes, don't mix them up:** ICBN governs plant names, ICZN governs animal names. If a question asks which code applies to a named organism, check whether it's a plant or an animal first.",
      },
      {
        id: uuid(), type: 'text', order: 11,
        markdown: "A name is only a label, though — it doesn't tell you how one organism relates to another. That's the next job: building the actual ladder of categories that sorts every species, from the narrowest group all the way up to Kingdom.",
      },
      {
        id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
        questions: [
          {
            id: uuid(), question: 'Which of these correctly follows the rules of binomial nomenclature for the mango?',
            options: ['mangifera indica', 'Mangifera Indica', 'Mangifera indica', 'MANGIFERA INDICA'],
            correct_index: 2,
            explanation: "Only the genus name is capitalised — the specific epithet always starts lowercase. 'Mangifera' correctly capitalised plus 'indica' correctly lowercase, both italicised, makes this the only rule-following option; dropping the capital on the genus, capitalising the epithet, or writing the whole name in capitals all break the four universal rules.",
            difficulty_level: 1,
          },
          {
            id: uuid(), question: 'A student discovers a new plant species and wants a name that scientists worldwide will recognise as this exact plant and no other. Which requirement of taxonomy does this describe?',
            options: [
              'Classification — grouping the plant into a convenient category based on shared features',
              'Nomenclature — giving the plant one standardised name accepted by biologists everywhere',
              'Identification — correctly describing the plant so everyone knows exactly which organism the name refers to',
              'Systematics — placing the plant within its evolutionary relationships to other organisms',
            ],
            correct_index: 1,
            explanation: "The question describes assigning one universal name — that's nomenclature. Identification is about correctly recognising which organism a name belongs to, not creating the name; classification is about grouping by shared characters, not naming; systematics is about evolutionary relationships. All four are related steps in taxonomy, but only nomenclature is 'giving one name recognised everywhere.'",
            difficulty_level: 2,
          },
          {
            id: uuid(), question: 'NCERT states there are between 1.7 and 1.8 million known and described species on Earth. What does this number actually represent?',
            options: [
              'The total number of species found only in tropical rainforests, the richest habitat',
              'The number of animal species alone, since plants are counted separately',
              'The total number of species that exist on Earth, now fully counted',
              'The number of species officially known and described so far — the true total remains larger and still being discovered',
            ],
            correct_index: 3,
            explanation: "NCERT is explicit that new organisms are still being identified even in already-explored areas, so 1.7–1.8 million is what's been formally described, not a final total. It spans every habitat mentioned — cold mountains, deserts, oceans, hot springs — not just rainforests, and it includes both plants and animals together, not animals alone.",
            difficulty_level: 3,
          },
        ],
      },
    ];

    const page1Doc = {
      _id: page1Id, book_id: bookId, chapter_number: 1, page_number: 1,
      slug: 'diversity-in-the-living-world', title: 'Diversity in the Living World & Naming Every Living Thing',
      subtitle: "1.7 to 1.8 million species have been named so far — and every single one follows the same two-word naming system. Here's why, and how to write it correctly.",
      blocks: page1Blocks, hinglish_blocks: [],
      tags: ['nomenclature', 'binomial-nomenclature', 'biodiversity', 'the-living-world'],
      glossary: [
        { term: 'biodiversity', definition: 'The number and variety of different organisms living on Earth.' },
        { term: 'nomenclature', definition: 'The process of assigning one standardised name to an organism, accepted by biologists everywhere.' },
        { term: 'identification', definition: "Correctly describing an organism so it's clear exactly which organism a name refers to." },
        { term: 'binomial nomenclature', definition: 'The two-word naming system — genus plus specific epithet — used for every scientific name, introduced by Linnaeus.' },
        { term: 'ICBN', definition: 'International Code for Botanical Nomenclature — the rules that govern scientific names for plants.' },
        { term: 'ICZN', definition: 'International Code of Zoological Nomenclature — the rules that govern scientific names for animals.' },
      ],
      published: false, page_type: 'lesson',
      reading_time_min: bw.computeReadingTime(page1Blocks),
      content_types: bw.computeContentTypes(page1Blocks),
      video_title: null, readiness: null,
      review: { reviewed: false, reviewed_by: null, reviewed_at: null },
      deleted_at: null, deleted_by: null, deletion_reason: null,
      created_at: new Date(), updated_at: new Date(),
    };

    // ── Page 2 — Taxonomic Categories: Climbing the Ladder ─────────────────
    const ladderHotspots = [
      { id: uuid(), x: 0.5, y: 0.90, label: 'Species', icon: 'circle',
        detail: 'The narrowest, most specific rank. A group of individual organisms with fundamental similarities. Example: *Homo sapiens* — humans.' },
      { id: uuid(), x: 0.5, y: 0.76, label: 'Genus', icon: 'circle',
        detail: 'A group of closely related species that share more in common with each other than with species outside the group. Example: *Panthera* — lion, tiger, and leopard together.' },
      { id: uuid(), x: 0.5, y: 0.62, label: 'Family', icon: 'circle',
        detail: 'A group of related genera with fewer shared similarities than genus-mates. Example: Felidae — holds both *Panthera* and *Felis* (house cats).' },
      { id: uuid(), x: 0.5, y: 0.48, label: 'Order', icon: 'circle',
        detail: 'An assemblage of families sharing only a few similar characters. Example: Carnivora — holds both family Felidae and family Canidae (dogs).' },
      { id: uuid(), x: 0.5, y: 0.34, label: 'Class', icon: 'circle',
        detail: 'A group of related orders. Example: Mammalia — holds order Carnivora and order Primata (monkeys, gorillas, gibbons) together.' },
      { id: uuid(), x: 0.5, y: 0.20, label: 'Phylum / Division', icon: 'circle',
        detail: "For animals it's called Phylum; for plants, Division. Example: Chordata — every animal with a notochord and a dorsal hollow nerve cord, from fish to mammals." },
      { id: uuid(), x: 0.5, y: 0.06, label: 'Kingdom', icon: 'circle',
        detail: 'The broadest rank of all. Example: Kingdom Animalia holds every animal phylum; Kingdom Plantae holds every plant division.' },
    ];

    const page2Blocks = [
      {
        id: uuid(), type: 'image', order: 0, src: '', alt: 'A rocky mountain trail climbing toward a misty, glowing peak at dusk',
        caption: '', width: 'full', aspect_ratio: '16:5',
        generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A rocky mountain trail seen from a low angle, climbing steeply upward through the frame from bottom-left to a misty, glowing peak at top-right, dusk lighting with a warm amber glow breaking through cloud near the summit. The trail itself is bare of any people, animals, or text — purely a path ascending through darkening rock and thinning mist. Dark, atmospheric, painterly illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
      },
      {
        id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Same Family, Totally Different Animal',
        markdown: "A lion, a tiger, and a leopard belong to the same genus, *Panthera*. Widen the lens slightly and a house cat joins them too — different genus, same family, Felidae. Widen it further and even a dog belongs in the same larger group as all three, once you climb high enough up the ladder. How far you have to climb before two animals 'belong together' is exactly what this page teaches you to read.",
      },
      {
        id: uuid(), type: 'text', order: 2,
        markdown: "Classification is simply the process of sorting organisms into convenient groups based on characters you can actually observe. You already do this without thinking — say 'dog' and everyone pictures an animal with four legs, a tail, and fur; say 'mammal' and the picture widens to include cats, cows, and humans; say 'animal' and it widens again to include birds, fish, and insects. Dogs, mammals, and animals are all real categories — just at different levels of a ladder. Biologists call each of these categories a **taxon** (plural: **taxa**), and the whole ladder — species, genus, family, order, class, phylum or division, and kingdom — is the **taxonomic hierarchy**.\n\nThe entire branch of science built around this — characterising organisms, identifying them, classifying them, and naming them — is called **taxonomy**. A closely related field, **systematics**, goes one step further: it studies how organisms are related to each other through evolution, not just how to sort them into neat boxes. Linnaeus himself titled his foundational work *Systema Naturae* — 'the systematic arrangement of nature.'",
      },
      {
        id: uuid(), type: 'heading', order: 3, level: 2,
        text: 'The Seven Ranks — From the Narrowest Group to the Broadest',
        objective: 'By the end of this you can place any organism correctly in its rank — and explain why the higher you climb, the harder that gets.',
      },
      {
        id: uuid(), type: 'text', order: 4,
        markdown: "Start at the bottom of the ladder. A **species** is a group of individual organisms with fundamental similarities — *Mangifera indica* (mango), *Solanum tuberosum* (potato), and *Panthera leo* (lion) are each their own species, distinguished by clear morphological differences. Human beings belong to the species *sapiens*, in the genus *Homo* — written together as *Homo sapiens*.\n\nA **genus** groups species that share more in common with each other than with species from any other genus. *Panthera* isn't just the lion — it also holds the tiger (*P. tigris*) and the leopard (*P. pardus*), all close relatives. That genus is distinct from *Felis*, the genus that holds the house cat.\n\nStep up again to **family** — a group of related genera sharing fewer similarities than genus-mates do. *Panthera* and *Felis* together fall under family Felidae; dogs fall under a separate family, Canidae. Widen further to **order**, an assemblage of families with only a few shared characters — Felidae and Canidae together make up order Carnivora. Wider still is **class** — order Carnivora and order Primata (monkeys, gorillas, gibbons) both sit inside class Mammalia. Then **phylum** (for animals) or **division** (for plants) — every class built around a notochord and a dorsal hollow nerve cord, from fish to mammals, belongs to phylum Chordata. And at the very top sits **kingdom** — every animal phylum inside Kingdom Animalia, every plant division inside Kingdom Plantae.\n\nNotice the pattern as you climb: species and genus mates share a great many characters, which is why placing an organism at those low ranks is usually a confident, clean call. By the time you reach kingdom, the shared characters have thinned down to the broadest possible traits — which is exactly why working out how different high-level groups relate to each other gets more complicated the higher you go.",
      },
      {
        id: uuid(), type: 'interactive_image', order: 5, src: '',
        alt: 'The taxonomic hierarchy, from Species at the base to Kingdom at the top',
        caption: '📸 Tap each rung to see what defines it, with a real example',
        hotspots: ladderHotspots,
        generation_prompt: "Scientific textbook illustration of a vertical taxonomic hierarchy ladder. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Seven horizontal rungs stacked vertically like a ladder, evenly spaced, connected by a single vertical white line running through the centre of each rung. The bottom rung is the narrowest/smallest in visual width, each rung growing slightly wider than the one below it, until the top rung is the widest — visually representing increasing inclusiveness. Each rung rendered as a simple horizontal bar with clean white outlines, softly lit, no text or labels baked into the image itself. Soft ambient glow increasing slightly toward the top rung to suggest growing scope. No photorealism, no decorative elements, no characters, matches standard biology textbook illustration conventions.",
      },
      {
        id: uuid(), type: 'table', order: 6, caption: 'Table 1.1 — Organisms with Their Taxonomic Categories',
        headers: ['Common Name', 'Biological Name', 'Genus', 'Family', 'Order', 'Class', 'Phylum/Division'],
        rows: [
          ['Man', 'Homo sapiens', 'Homo', 'Hominidae', 'Primata', 'Mammalia', 'Chordata'],
          ['Housefly', 'Musca domestica', 'Musca', 'Muscidae', 'Diptera', 'Insecta', 'Arthropoda'],
          ['Mango', 'Mangifera indica', 'Mangifera', 'Anacardiaceae', 'Sapindales', 'Dicotyledonae', 'Angiospermae'],
          ['Wheat', 'Triticum aestivum', 'Triticum', 'Poaceae', 'Poales', 'Monocotyledonae', 'Angiospermae'],
        ],
      },
      {
        id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
        prompt: 'As you climb from Species toward Kingdom, does each group along the way share MORE or FEWER characteristics — and what does that do to the difficulty of figuring out how different groups at that level relate to each other?',
        options: [
          'More shared characteristics at higher ranks, which makes the highest ranks the easiest to sort out',
          'Fewer shared characteristics at higher ranks, which makes it harder to work out how different groups at that level relate to each other',
          'The number of shared characteristics stays exactly the same at every single rank',
          'Fewer shared characteristics only at the lowest rank, Species, making Species the hardest rank to define',
        ],
        reveal: "Fewer — and that's exactly why it gets harder. Two members of the same genus, like a lion and a tiger, already share a long list of specific characters. Climb all the way to Kingdom, and 'Animalia' only requires the broadest possible animal traits — almost nothing precise left to compare with. That's why species and genus are usually clean, confident calls, while sorting out how entire phyla or kingdoms relate to each other involves weighing far fewer, much broader clues.",
        difficulty_level: 2,
      },
      {
        id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Definitions You Cannot Blur Together',
        markdown: "- **Taxon (plural: taxa):** any single category in the hierarchy — 'Mammalia' is a taxon, so is 'Panthera'.\n- **Taxonomic hierarchy:** the full ladder of ranks together — species up to kingdom.\n- **All organisms have Species as their lowest rank** — plants and animals alike.\n- **Phylum vs. Division:** the same rank, just different words — *Phylum* for animals, *Division* for plants. Both sit between Class and Kingdom.",
      },
      {
        id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
        markdown: "**The classic table-reading trap:** NEET loves asking 'to which order does the housefly belong?' when the table right in front of you also lists its family and class. Read the column header carefully — every rank in the row is technically 'correct' for that organism, just not the one being asked.\n\n**Sequencing questions:** Know the ladder in both directions — ascending (Species → Genus → Family → Order → Class → Phylum/Division → Kingdom) and descending. A question showing you three or four ranks out of order and asking you to fix the sequence is one of NCERT's own exercise formats.\n\n**Systematics ≠ Taxonomy:** taxonomy sorts organisms into categories; systematics studies their evolutionary relationships. They overlap but aren't the same word.",
      },
      {
        id: uuid(), type: 'text', order: 10,
        markdown: "You now have both halves of Chapter 1 — a universal naming system, and the ladder that places every organism in its rank. Next, in Chapter 2, you'll use that same ladder to sort the living world into its five kingdoms.",
      },
      {
        id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.6,
        questions: [
          {
            id: uuid(), question: 'Using Table 1.1, to which order does the housefly belong?',
            options: ['Diptera', 'Muscidae', 'Insecta', 'Arthropoda'],
            correct_index: 0,
            explanation: "Musca domestica's order is Diptera. Muscidae is its family, Insecta its class, and Arthropoda its phylum — all correct ranks for the housefly, just not the order asked here. This is exactly the kind of table mix-up NEET tests.",
            difficulty_level: 1,
          },
          {
            id: uuid(), question: 'Mango and wheat are both placed in Kingdom Plantae and Division Angiospermae. According to Table 1.1, at which rank do they first belong to different groups?',
            options: ['Genus', 'Family', 'Order', 'Class'],
            correct_index: 3,
            explanation: "Both share Kingdom Plantae and Division Angiospermae — identical at those two ranks. The split first appears at Class: mango is Dicotyledonae, wheat is Monocotyledonae. Genus, Family, and Order are already different for the two plants too, but Class comes first in the hierarchy going down from Kingdom, so it's the earliest point where they part ways.",
            difficulty_level: 3,
          },
          {
            id: uuid(), question: 'As you move from Species up to Kingdom in the taxonomic hierarchy, what generally happens to the number of shared characteristics among organisms in each group?',
            options: [
              'It increases steadily, since higher categories are more inclusive',
              'It stays exactly the same at every rank',
              'It decreases, and determining relationships gets more difficult at higher categories',
              'It decreases for plants but stays constant for animals',
            ],
            correct_index: 2,
            explanation: "Lower taxa share many characteristics — species and genus mates are closely alike. Climbing toward Kingdom, each group shares progressively fewer traits, which is exactly why working out relationships between high-level groups is harder than between species or genera.",
            difficulty_level: 1,
          },
          {
            id: uuid(), question: "Lion (Panthera leo), tiger (Panthera tigris), and leopard (Panthera pardus) share the same genus. Which taxonomic category is defined as 'a group of related species sharing more characters with each other than with species from other such groups'?",
            options: ['Family', 'Genus', 'Order', 'Class'],
            correct_index: 1,
            explanation: 'This is the definition of Genus. Family groups related genera (with fewer shared characters than genus-mates), Order groups related families, and Class groups related orders — each one step broader than the last.',
            difficulty_level: 2,
          },
        ],
      },
    ];

    const page2Doc = {
      _id: page2Id, book_id: bookId, chapter_number: 1, page_number: 2,
      slug: 'taxonomic-categories-hierarchy', title: 'Taxonomic Categories — Climbing the Ladder from Species to Kingdom',
      subtitle: 'Every organism on Earth fits somewhere on a seven-step ladder. Learn the ladder once, and you can place any species — and read any taxonomy table — for the rest of your NEET prep.',
      blocks: page2Blocks, hinglish_blocks: [],
      tags: ['taxonomy', 'taxonomic-hierarchy', 'classification', 'the-living-world'],
      glossary: [
        { term: 'taxon', definition: "Any single category or rank in the classification system — for example, 'Mammalia' or 'Panthera'." },
        { term: 'taxonomic hierarchy', definition: 'The full ladder of ranks together, from Species up to Kingdom.' },
        { term: 'taxonomy', definition: 'The branch of science covering characterisation, identification, classification, and naming of organisms.' },
        { term: 'systematics', definition: 'The study of how organisms are related to each other, including their evolutionary relationships.' },
        { term: 'phylum', definition: "The rank between Class and Kingdom for animals — plants use the equivalent term 'Division'." },
      ],
      published: false, page_type: 'lesson',
      reading_time_min: bw.computeReadingTime(page2Blocks),
      content_types: bw.computeContentTypes(page2Blocks),
      video_title: null, readiness: null,
      review: { reviewed: false, reviewed_by: null, reviewed_at: null },
      deleted_at: null, deleted_by: null, deletion_reason: null,
      created_at: new Date(), updated_at: new Date(),
    };

    // ── Book + chapter ──────────────────────────────────────────────────
    const bookDoc = {
      _id: bookId, slug: 'class11-biology', title: 'Class 11 Biology',
      subject: 'biology', grade: 11, board: 'ncert',
      chapters: [
        {
          number: 1, title: 'The Living World', slug: 'the-living-world',
          page_ids: [openerId, page1Id, page2Id],
          description: 'Diversity of life, the rules of binomial nomenclature, and the seven-rank taxonomic hierarchy from species to kingdom.',
          is_published: false,
        },
      ],
      is_published: false,
      created_at: new Date(), updated_at: new Date(),
    };

    await books.insertOne(bookDoc);
    await pages.insertMany([openerDoc, page1Doc, page2Doc]);

    console.log('Created book class11-biology:', bookId);
    console.log('  Chapter 1 — The Living World');
    console.log('    p0 (opener):', openerId, openerDoc.slug);
    console.log('    p1:', page1Id, page1Doc.slug, `(${page1Blocks.length} blocks, ${page1Doc.reading_time_min} min)`);
    console.log('    p2:', page2Id, page2Doc.slug, `(${page2Blocks.length} blocks, ${page2Doc.reading_time_min} min)`);
    console.log('All pages published:false — pending founder review.');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
