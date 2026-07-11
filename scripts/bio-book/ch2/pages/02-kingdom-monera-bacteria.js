'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'kingdom-monera-bacteria',
  title: 'Kingdom Monera: The Bacteria',
  subtitle: "Bacteria are the whole of Kingdom Monera — the most abundant, most metabolically versatile organisms on Earth, thriving from a handful of soil to boiling hot springs.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['kingdom-monera', 'bacteria', 'archaebacteria', 'biological-classification'],
  glossary: [
    { term: 'halophile', definition: 'An archaebacterium that lives in extremely salty habitats.' },
    { term: 'thermoacidophile', definition: 'An archaebacterium that lives in hot springs — habitats that are both hot and acidic.' },
    { term: 'methanogen', definition: 'An archaebacterium found in marshy areas and in the gut of ruminant animals; it produces methane (biogas) from dung.' },
    { term: 'autotroph', definition: 'An organism that makes its own food from inorganic substances — either by photosynthesis or by chemosynthesis.' },
    { term: 'heterotroph', definition: 'An organism that depends on other organisms or on dead organic matter for its food. Most bacteria are heterotrophs.' },
    { term: 'chemosynthetic', definition: 'Describing an autotroph that builds its food using energy released from chemical reactions rather than from sunlight.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk landscape layering a boiling hot spring, a desert, a snowfield and a deep ocean, each faintly dotted with unseen microbial life',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape stitching together four hostile habitats side by side without hard borders: a steaming, bubbling hot spring on the far left with mist rising, blending into a stretch of cracked desert dunes, opening into a cold snowfield under a fading sky, and finally dropping into the dark depths of a deep ocean on the far right. In each zone, scattered faint clusters of tiny glowing dots suggest microbial life thriving where almost nothing else can — never a focal subject, just a quiet sense that life fills even these punishing places. Deep dusk lighting throughout, a single warm horizon glow tying the whole panorama together. Painterly illustration style, atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Hundreds of Them in a Single Handful',
      markdown: "Scoop up one handful of ordinary soil and you're holding **hundreds of bacteria**. That's before you even go looking for the extreme places — hot springs where the water is near boiling, bone-dry deserts, frozen snow, and the crushing dark of the deep ocean. Bacteria live in all of them, in habitats where very few other life forms could survive even a minute. Wherever you go on this planet, they got there first.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Bacteria are the sole members of Kingdom Monera** — the whole kingdom is bacteria and nothing else. They are the **most abundant micro-organisms** on Earth, and they occur almost everywhere. Ordinary soil is packed with them, but so are the harshest corners of the planet: hot springs, deserts, snow, and deep oceans. Many bacteria don't live free at all — they live **in or on other organisms as parasites**.\n\nSo the first thing to fix in your head is scale. When you picture Monera, don't picture one pond or one patch of soil. Picture every environment you can name, hostile or gentle, each one already colonised by bacteria. Their simple bodies hide just how tough and how widespread they are.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Shapes of Bacteria',
      objective: "By the end of this you can match any bacterial cell to its shape name — and recall the plural NEET likes to swap on you.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'The four bacterial shapes — spherical cocci, rod-shaped bacilli, comma-shaped vibrio, and spiral spirilla',
      caption: '📸 Tap each cell to see its shape name and how to recognise it (Figure 2.1)',
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.40, label: 'Coccus (cocci)', icon: 'circle',
          detail: 'The **spherical** bacterium — a simple round ball. The singular is *Coccus*; when there are many, they are *cocci*.' },
        { id: uuid(), x: 0.40, y: 0.66, label: 'Bacillus (bacilli)', icon: 'circle',
          detail: 'The **rod-shaped** bacterium, like a tiny stick or capsule. Singular *Bacillus*, plural *bacilli*. Some are drawn with a whip-like flagellum for movement or an internal spore.' },
        { id: uuid(), x: 0.82, y: 0.72, label: 'Vibrium (vibrio)', icon: 'circle',
          detail: 'The **comma-shaped** bacterium — a short rod with a single curve, like a comma. Singular *Vibrium*, plural *vibrio*.' },
        { id: uuid(), x: 0.66, y: 0.36, label: 'Spirillum (spirilla)', icon: 'circle',
          detail: 'The **spiral** bacterium — a long cell twisted into a corkscrew or coil. Singular *Spirillum*, plural *spirilla*.' },
      ],
      generation_prompt: "Scientific textbook illustration of the four shapes of bacteria. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Four distinct bacterial cell shapes arranged across the frame with clean white outlines and soft blue-green fill: (1) a cluster of small perfect spheres labelled area for cocci, upper left; (2) a group of short rounded rods for bacilli, lower left, one rod showing a small internal oval spore and one showing a thin whip-like flagellum tail; (3) a single spiral corkscrew-shaped cell for spirilla, upper right, drawn with a smooth continuous coil; (4) a short comma-shaped curved rod for vibrio, lower right. Each shape biologically accurate in proportion, evenly spaced, no baked-in text labels. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'How Bacteria Feed',
      objective: "By the end of this you can sort any bacterium into autotroph or heterotroph — and split autotrophs the way NCERT does.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Here's the surprise about Monera: the bodies are simple, but the **behaviour is complex**. As a group, bacteria show the **most extensive metabolic diversity of any group of organisms** — no other group comes close to the range of ways bacteria get their energy and food.\n\nThat diversity splits into two broad camps. Some bacteria are **autotrophic** — they build their own food from inorganic substances, needing no other living thing to feed them. Autotrophs come in two kinds: **photosynthetic autotrophic** bacteria, which use light, and **chemosynthetic autotrophic** bacteria, which pull energy out of chemical reactions instead. The rest — and this is the **vast majority** — are **heterotrophic**: they depend on other organisms or on dead organic matter for food. So when you think of a 'typical' bacterium, think heterotroph, with the autotrophs as the smaller, specialised minority.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A newly found soil bacterium builds all of its own food from inorganic substances, but it does this in complete darkness, deep underground, using energy released by chemical reactions. Which label fits it?",
      options: [
        "Heterotroph, because any bacterium living in soil must feed on dead organic matter",
        "Photosynthetic autotroph, because making your own food always means using light",
        "Chemosynthetic autotroph, because it makes its own food from inorganic substances using chemical-reaction energy rather than light",
        "It cannot be classified until we know its shape",
      ],
      reveal: "It makes its own food from inorganic substances, so it's an autotroph — that rules out heterotroph straight away. Because it works in complete darkness using chemical energy, not light, it's specifically a chemosynthetic autotroph, not a photosynthetic one. The photosynthetic option is the tempting trap: students assume 'makes its own food' must mean sunlight, but NCERT splits autotrophs into two kinds exactly so you don't. And shape has nothing to do with how a bacterium feeds.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Archaebacteria — Life in Extremes',
      objective: "By the end of this you can name the three archaebacteria by habitat and explain the one structural feature that lets them survive.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Some bacteria are built for punishment. These are the **Archaebacteria**, and they're special because they live in some of the **most harsh habitats** on Earth. NCERT names three, each by where it lives:\n\n- **Halophiles** live in **extremely salty areas** — salt levels that would kill almost anything else.\n- **Thermoacidophiles** live in **hot springs** — water that is both hot and acidic.\n- **Methanogens** live in **marshy areas**.\n\nWhat lets them survive conditions this brutal? Archaebacteria have a **different cell wall structure** from all other bacteria, and that single feature is what's responsible for their survival in extreme conditions. The habitat doesn't make them tough — their wall does.\n\nMethanogens are worth a closer look. They also live in the **gut of ruminant animals** such as cows and buffaloes, and they **produce methane — biogas — from the dung** of these animals. That's the same process behind the biogas plants that turn cattle dung into cooking fuel.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Three Archaebacteria, Locked by Habitat',
      markdown: "- **Halophiles** → extreme **salt**.\n- **Thermoacidophiles** → **hot springs**.\n- **Methanogens** → **marshy areas** and the **gut of ruminants** (cows, buffaloes).\n- Methanogens produce **methane (biogas) from dung**.\n- The one feature behind all their toughness: a **different cell wall structure**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Shapes and their names:** cocci = spherical, bacilli = rod, vibrio = comma, spirilla = spiral. NEET loves to swap one pairing — 'comma-shaped is spirillum' is the classic wrong option. Comma is *Vibrium*; spiral is *Spirillum*.\n\n**Archaebacteria habitats:** match halophile→salty, thermoacidophile→hot spring, methanogen→marshy/ruminant gut. A single mismatched pair is the usual trap.\n\n**Classic NEET question:** \"Methanogens are present in the gut of which animals, and what do they produce?\" → **ruminants such as cows and buffaloes; they produce methane (biogas) from dung.**\n\n**Don't forget the wall:** if asked *why* archaebacteria survive extremes, the answer is their **different cell wall structure** — not the habitat itself.",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "That covers the archaebacteria — the extremophiles of Monera. The rest of the kingdom is the ordinary, everyday bacteria: the eubacteria and the photosynthetic cyanobacteria, which we meet on the next page.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which organisms are the sole members of Kingdom Monera?',
          options: ['Protozoa', 'Bacteria', 'Fungi', 'Algae'],
          correct_index: 1,
          explanation: "Monera is made up entirely of bacteria — nothing else belongs to it. Protozoa and algae are protists (Kingdom Protista), and fungi form their own Kingdom Fungi, so all three are separate kingdoms, not part of Monera.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A bacterium is described as comma-shaped. What is it called?',
          options: ['Coccus', 'Bacillus', 'Vibrium', 'Spirillum'],
          correct_index: 2,
          explanation: "Comma-shaped bacteria are Vibrium (plural vibrio). Coccus is spherical, Bacillus is rod-shaped, and Spirillum is spiral — the spiral shape is the one students most often confuse with the comma, but a comma has a single curve while a spirillum is a full corkscrew.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Most bacteria depend on other organisms or on dead organic matter for their food. What does this make the majority of bacteria?',
          options: [
            'Photosynthetic autotrophs, using light to make food',
            'Chemosynthetic autotrophs, using chemical energy to make food',
            'Heterotrophs, depending on other organisms or dead matter',
            'Parasites only, never free-living',
          ],
          correct_index: 2,
          explanation: "NCERT states the vast majority of bacteria are heterotrophs. Autotrophs — whether photosynthetic or chemosynthetic — make their own food and are the minority. Parasitism is just one heterotrophic lifestyle, not a feeding category on its own, and many heterotrophic bacteria are free-living decomposers rather than parasites.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Methanogens are archaebacteria found in marshy areas and in the gut of ruminants. What are they responsible for producing?',
          options: [
            'Salt crystals in extremely salty water',
            'Methane (biogas) from the dung of ruminant animals',
            'Acid that makes hot springs acidic',
            'Their own food by photosynthesis',
          ],
          correct_index: 1,
          explanation: "Methanogens produce methane — biogas — from the dung of ruminant animals such as cows and buffaloes. Salty habitats are the domain of halophiles and acidic hot springs of thermoacidophiles, so those distractors belong to the other two archaebacteria; methanogens are defined specifically by methane production, not photosynthesis.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
