'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-dihybrid-cross-and-independent-assortment',
  title: 'Two Genes at Once — Dihybrid Cross & Independent Assortment',
  subtitle: "Follow two seed traits through one cross and watch the famous 9:3:3:1 ratio appear — then see why one gene pair sorts itself out with no regard for the other.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['dihybrid-cross', 'independent-assortment', 'mendel', 'principles-of-inheritance-and-variation'],
  glossary: [
    { term: 'dihybrid cross', definition: 'A cross between two plants that differ in two pairs of contrasting traits at once — here seed colour and seed shape.' },
    { term: 'dihybrid', definition: 'An individual carrying two different alleles at each of two genes, such as the F1 plant RrYy. It is a hybrid for two characters.' },
    { term: 'independent assortment', definition: "Mendel's second law: when two pairs of traits are combined in a hybrid, the segregation of one pair of characters is independent of the other pair." },
    { term: '9:3:3:1 ratio', definition: 'The phenotypic ratio seen in the F2 of a dihybrid cross — 9 showing both dominant traits, 3 and 3 showing one dominant and one recessive, and 1 showing both recessive traits.' },
    { term: 'gamete', definition: 'A reproductive cell (pollen or egg) carrying one allele of each gene. A dihybrid RrYy makes four kinds of gamete: RY, Ry, rY and ry.' },
    { term: 'Punnett square', definition: 'A grid used to combine the gamete types from two parents. For a dihybrid cross it has 16 boxes (4 gamete types × 4 gamete types).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Pea pods split open in warm evening light, one row of plump round yellow seeds and one row of shrivelled green seeds resting on dark soil',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet still-life of garden pea pods laid open across a dark surface in warm low evening light. On one side, pods holding smooth, plump, round yellow seeds; on the other, pods holding shrivelled, wrinkled green seeds — the two seed types clearly contrasting in both colour and shape without any text or labels. Soft golden rim light catches the edges of the seeds, deep shadows behind. Painterly, atmospheric, naturalistic botanical illustration style, overall dark background (#0a0a0a base tones), no diagram elements, no labels, no text.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two Questions in One Experiment',
      markdown: "When Mendel crossed a **round-yellow** pea with a **wrinkled-green** pea, he was really asking two questions at the same time: does yellow beat green, *and* does round beat wrinkled — and do the two decisions have anything to do with each other? The beauty of his answer is that the seed colour behaves as if the seed shape doesn't exist, and the seed shape behaves as if the colour doesn't exist. Two traits, sorted out completely separately, inside the very same seeds.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "So far we've followed one trait at a time. Now Mendel raises the stakes: he crosses pea plants that differ in **two characters at once** — a plant with **yellow, round** seeds and a plant with **green, wrinkled** seeds. A cross that tracks two pairs of traits together is called a **dihybrid cross**.\n\nGive the alleles their symbols the way NCERT does: **Y** for dominant yellow colour, **y** for recessive green; **R** for dominant round shape, **r** for recessive wrinkled. The two parents are then **RRYY** (round yellow) and **rryy** (wrinkled green). Each parent makes just one kind of gamete — **RY** from one, **ry** from the other — and when these unite, every F1 plant is **RrYy**. And the F1 seeds are all **yellow and round**. That already tells you which allele wins each contest: **yellow is dominant over green, and round is dominant over wrinkled** — exactly what separate monohybrid crosses had shown.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'From F1 to F2: Where 9:3:3:1 Comes From',
      objective: "By the end of this you can name the four F2 phenotype classes and show why they turn up in a 9:3:3:1 ratio.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Now Mendel self-pollinates the F1 (RrYy × RrYy) and counts the F2 seeds. Look at each trait on its own first. **Colour segregates 3 yellow : 1 green**. **Shape segregates 3 round : 1 wrinkled**. Each trait, taken alone, behaves *exactly* like a plain monohybrid cross — as if the other trait weren't in the picture at all.\n\nPut the two traits back together and four kinds of seed appear in the F2: **round-yellow, wrinkled-yellow, round-green, and wrinkled-green** — in the ratio **9 : 3 : 3 : 1**. The 9 show both dominant traits, the two 3s show one dominant and one recessive, and the lonely 1 shows both recessive traits (wrinkled *and* green). That single 1-in-16 class is the rarest seed in the whole tray.",
    },
    {
      id: uuid(), type: 'worked_example', order: 5, label: 'Deriving the 9:3:3:1 ratio', variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: "The F1 dihybrid RrYy is self-crossed (RrYy × RrYy). Work out the F2 phenotypic ratio for seed shape and seed colour together, without drawing all 16 boxes.",
      solution: "**Step 1 — treat each trait as its own monohybrid cross.**\nSeed shape: Rr × Rr → **3 Round : 1 Wrinkled**.\nSeed colour: Yy × Yy → **3 Yellow : 1 Green**.\n\n**Step 2 — combine the two ratios as a product series**, exactly as NCERT does, because the two traits assort independently:\n(3 Round : 1 Wrinkled) × (3 Yellow : 1 Green)\n\n**Step 3 — multiply the pieces out:**\n- Round × Yellow = 3 × 3 = **9 Round, Yellow**\n- Wrinkled × Yellow = 1 × 3 = **3 Wrinkled, Yellow**\n- Round × Green = 3 × 1 = **3 Round, Green**\n- Wrinkled × Green = 1 × 1 = **1 Wrinkled, Green**\n\n**Result:** 9 : 3 : 3 : 1. The numbers add up to 16 — the same 16 you'd get from a 4-gamete × 4-gamete Punnett square. The single 'Wrinkled, Green' class is the double-recessive corner, seen just once in sixteen.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'A 4 by 4 dihybrid Punnett square with the four gamete types RY, Ry, rY and ry along the top and down the side, and sixteen genotype boxes inside',
      caption: '📸 Tap each dot to read the dihybrid Punnett square — the four gamete types, the corner genotypes, and where the 9:3:3:1 comes from.',
      generation_prompt: "Scientific textbook illustration of a dihybrid Punnett square. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A clean 4×4 grid of 16 boxes with thin white outlines. Along the top edge, four column headers reading the gamete types RY, Ry, rY, ry; along the left edge, four row headers reading the same four gamete types RY, Ry, rY, ry — representing the pollen and eggs of the RrYy F1 plant. Each of the 16 inner boxes contains a four-letter genotype (combinations of R, r, Y, y). Boxes subtly tinted by seed phenotype: warm yellow-round boxes, pale green boxes, muted brown for wrinkled, so the 9:3:3:1 grouping is faintly visible. White text, thin white leader lines, biologically neutral clean layout. No photorealism, no cartoon, no mascots, standard genetics textbook style.",
      hotspots: [
        { id: uuid(), x: 0.58, y: 0.07, label: 'Four gamete types', icon: 'circle',
          detail: 'The F1 RrYy plant makes **four** kinds of gamete — **RY, Ry, rY and ry** — each with a frequency of 1/4 (25%). The same four line the top and the side, which is why the square has 4 × 4 = 16 boxes.' },
        { id: uuid(), x: 0.30, y: 0.30, label: 'RRYY — round, yellow', icon: 'circle',
          detail: 'The top-left corner: RY meeting RY gives **RRYY**, fully homozygous round-yellow. It sits inside the big group of **9** boxes that show both dominant traits.' },
        { id: uuid(), x: 0.52, y: 0.52, label: 'RrYy — the dihybrid again', icon: 'circle',
          detail: 'Several inner boxes rebuild the **RrYy** double-heterozygote — round-yellow in appearance, just like the F1. This is the single most common genotype in the F2 and still counts toward the 9 round-yellow seeds.' },
        { id: uuid(), x: 0.86, y: 0.86, label: 'rryy — wrinkled, green', icon: 'circle',
          detail: 'The bottom-right corner: ry meeting ry gives **rryy**, the double-recessive **wrinkled-green** seed. It appears in only **1** of the 16 boxes — the rarest class, the "1" in 9:3:3:1.' },
        { id: uuid(), x: 0.30, y: 0.86, label: 'The 3 and 3 classes', icon: 'circle',
          detail: 'The off-corner boxes give the two mixed classes — **3 wrinkled-yellow** and **3 round-green** — each with one dominant and one recessive trait. Count the boxes: 9 + 3 + 3 + 1 = 16.' },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: "Mendel's Law of Independent Assortment",
      objective: "By the end of this you can state the Law of Independent Assortment in NCERT's words and explain why a dihybrid makes four gamete types.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Why does the colour behave as if the shape isn't there? Because the two gene pairs sort themselves out **independently**. From this, Mendel drew his second set of generalisations — the **Law of Independent Assortment**: *'when two pairs of traits are combined in a hybrid, segregation of one pair of characters is independent of the other pair of characters.'*\n\nSee it in the gametes of the F1 RrYy. Consider R and r alone: **50% of gametes carry R, 50% carry r**. Now each of those gametes must *also* carry either Y or y — and here's the key point: whether a gamete got R or r says **nothing** about whether it gets Y or y. So half the R-gametes carry Y and half carry y; half the r-gametes carry Y and half carry y. Multiply it out and you get **four gamete types — RY, Ry, rY and ry — each 1/4 of the total**. Those four kinds of pollen and four kinds of egg, combined in the Punnett square's 16 boxes, are what produce the 9:3:3:1 you just derived."
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "The F1 dihybrid RrYy is making gametes. A student argues it can make only two kinds — RY and ry — because those are the exact combinations that came in from the two parents. Where does this reasoning break down?",
      options: [
        "It doesn't break down — a dihybrid really does make only RY and ry gametes.",
        "Because R/r assorts independently of Y/y, an R gamete can pick up either Y or y, so four gamete types form: RY, Ry, rY and ry.",
        "Because a dihybrid actually makes eight kinds of gamete, not two or four.",
        "Because the alleles blend during gamete formation, leaving one 'Ry' type only.",
      ],
      reveal: "Independent assortment is exactly what the student is missing. Segregation of R and r is independent of the segregation of Y and y, so an R-carrying gamete is just as likely to carry Y as y — giving the two new 'recombinant' types Ry and rY on top of the parental RY and ry, for four types in all. The 'only RY and ry' option is the classic trap: it assumes the alleles must travel together the way they entered, which is precisely what independent assortment forbids. Eight types is wrong (that needs three gene pairs, 2³), and Mendel's whole point was that alleles do not blend.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- A **dihybrid cross** tracks **two** trait pairs at once (here colour + shape).\n- F1 of RRYY × rryy is all **RrYy** — round and yellow (both dominants show).\n- A dihybrid **RrYy** makes **four gamete types**: RY, Ry, rY, ry (each 1/4).\n- The dihybrid Punnett square has **16 boxes** (4 × 4).\n- F2 **phenotypic ratio = 9 : 3 : 3 : 1** (9 both-dominant : 3 : 3 : 1 both-recessive).\n- **Law of Independent Assortment:** *segregation of one pair of characters is independent of the other pair.*",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**9:3:3:1 is a phenotypic ratio, not genotypic.** NEET loves to swap it for a monohybrid ratio (3:1) or the monohybrid genotype ratio (1:2:1). If the cross is dihybrid and it asks for *appearance*, the answer is 9:3:3:1.\n\n**Gamete-count trap:** a dihybrid (RrYy) gives **4** gamete types — students who write 2 forgot independent assortment; students who write 16 confused gamete types with the number of Punnett boxes. Rule: number of gamete types = 2ⁿ, where n = number of heterozygous gene pairs.\n\n**The rarest F2 class** is the **double recessive** (wrinkled-green, rryy) — 1 in 16.\n\n**Classic NEET question:** \"State Mendel's Law of Independent Assortment.\" → *When two pairs of traits are combined in a hybrid, segregation of one pair of characters is independent of the other pair of characters.*",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "The dihybrid cross does more than give a tidy ratio — it hints at something physical. If genes sort independently, maybe they ride on structures that also pair up and separate during cell division. That link between Mendel's factors and the chromosomes is where the story goes next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'How many types of gametes does a dihybrid plant with the genotype RrYy produce?',
          options: ['2', '4', '8', '16'],
          correct_index: 1,
          explanation: "RrYy is heterozygous at two gene pairs, so it makes 2² = 4 gamete types: RY, Ry, rY and ry, each one-quarter of the total. '2' is the monohybrid answer; '16' is the number of boxes in the dihybrid Punnett square, not the number of gamete types — a favourite NEET mix-up.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In the F2 of a dihybrid cross, what phenotypic ratio did Mendel observe for the four seed types?',
          options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1 : 1 : 1'],
          correct_index: 2,
          explanation: "The F2 phenotypic ratio of a dihybrid cross is 9 : 3 : 3 : 1. '3 : 1' is the monohybrid phenotypic ratio, '1 : 2 : 1' is the monohybrid genotypic ratio, and '1 : 1 : 1 : 1' is the ratio of the four gamete types (or a dihybrid test-cross ratio) — not the F2 phenotype ratio.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which statement correctly gives Mendel's Law of Independent Assortment?",
          options: [
            'When two pairs of traits are combined in a hybrid, segregation of one pair of characters is independent of the other pair.',
            'Of a pair of contrasting alleles, only one expresses itself in the hybrid and is called dominant.',
            'The two alleles of a character separate during gamete formation without blending.',
            'The two parental traits blend together in the offspring to give an intermediate.',
          ],
          correct_index: 0,
          explanation: "Independent assortment is specifically about two trait pairs sorting separately, which is why option A is correct. Option B is the Law of Dominance and option C is the Law of Segregation — both true Mendelian laws, but different ones. Option D describes blending inheritance, the very idea Mendel's work disproved.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In the F2 of a round-yellow × wrinkled-green dihybrid cross, which seed type is the rarest — appearing in only 1 out of every 16 seeds?',
          options: ['Round, yellow', 'Round, green', 'Wrinkled, yellow', 'Wrinkled, green'],
          correct_index: 3,
          explanation: "The wrinkled-green class is the double recessive (rryy) and forms just 1 of the 16 boxes — the '1' in 9:3:3:1. Round-yellow is the commonest (the '9', both dominants), while round-green and wrinkled-yellow are the two '3' classes with one dominant and one recessive trait each.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
