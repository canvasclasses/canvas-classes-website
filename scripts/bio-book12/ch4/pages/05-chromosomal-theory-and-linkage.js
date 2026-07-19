'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chromosomal-theory-linkage-and-recombination',
  title: 'Chromosomes Carry the Genes — Linkage & Recombination',
  subtitle: "Mendel's invisible 'factors' turned out to be real, physical things riding on chromosomes — and once genes sit on the same chromosome, they travel together instead of assorting freely.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['chromosomal-theory-of-inheritance', 'linkage', 'recombination', 'morgan', 'principles-of-inheritance'],
  glossary: [
    { term: 'chromosomal theory of inheritance', definition: "Sutton and Boveri's idea that Mendel's 'factors' (genes) are carried on chromosomes, so the behaviour of chromosomes during meiosis explains Mendel's laws of segregation and independent assortment." },
    { term: 'homologous chromosomes', definition: 'The two matching chromosomes of a pair. The two alleles of a gene sit at the same (homologous) position on the two homologous chromosomes.' },
    { term: 'linkage', definition: 'The physical association of two or more genes located on the same chromosome, which makes them tend to be inherited together rather than assort independently.' },
    { term: 'recombination', definition: 'The generation of non-parental (new) combinations of genes. When linked genes are separated, the offspring carry gene combinations not present in either parent.' },
    { term: 'recombinant', definition: 'An offspring or gamete carrying a non-parental combination of linked genes — the product of recombination.' },
    { term: 'gene mapping', definition: 'Using the frequency of recombination between gene pairs on a chromosome as a measure of the distance between them, to work out and "map" their order and position on the chromosome.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single fruit fly in the foreground with faint, glowing paired chromosomes threading through the dark space behind it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single tiny fruit fly (Drosophila) rendered in warm amber tones on the left third, wings catching a faint rim of light, sitting on a slim glass laboratory vial. Sweeping across the rest of the dark frame, faint glowing thread-like paired chromosomes drift and curve through the deep space behind it, softly out of focus, suggesting the hidden machinery of heredity that the fly's breeding revealed. Deep dusk laboratory mood, one warm horizon glow tying the composition together. Painterly, atmospheric illustration style, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Fly That Breeds Faster Than You Can Blink',
      markdown: "Thomas Hunt Morgan didn't reach for peas — he reached for the tiny **fruit fly, *Drosophila melanogaster***. And it was almost the perfect research animal. You could grow it on **simple synthetic medium** in the lab, it finished its **whole life cycle in about two weeks**, and a **single mating produced a large number of progeny flies**. On top of that, the **males and females look clearly different**, and the flies carry **many hereditary variations you can spot under a low-power microscope**. A fast, cheap, high-output genetics machine sitting in a milk bottle — that's how the chromosome theory got tested.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Mendel published his work in **1865**, but it sat ignored until **1900**, when three scientists — **de Vries, Correns and von Tschermak** — independently rediscovered his results. Something else had changed in those years too. Microscopes had improved, and biologists watching cells divide had spotted structures in the nucleus that **doubled and divided just before each cell division**. Because they took up stain and showed up as coloured bodies, these were named **chromosomes**. By **1902** the movement of chromosomes during meiosis had been fully worked out.\n\nNow two pictures existed side by side: Mendel's invisible **'factors'** that segregate and assort, and these visible **chromosomes** that pair up and separate during meiosis. The obvious question was whether these were two descriptions of the *same thing*.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Chromosomal Theory of Inheritance',
      objective: "By the end of this you can explain how the movement of chromosomes in meiosis mirrors Mendel's factors — and name who put the two together.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Walter Sutton and Theodore Boveri** noticed that the **behaviour of chromosomes ran exactly parallel to the behaviour of genes**, and they used chromosome movement to explain Mendel's laws. Line them up and the match is uncanny:\n\n- **Chromosomes occur in pairs. Genes occur in pairs.**\n- At gamete formation, the two chromosomes of a pair **segregate**, so only one of each pair goes into a gamete — exactly what Mendel said his factors do (Law of Segregation).\n- One pair of chromosomes segregates **independently of another pair** — exactly Mendel's Law of Independent Assortment.\n\nThe two alleles of a gene sit at **homologous sites on homologous chromosomes** — the same address on the two matching chromosomes of a pair. So when a pair of chromosomes pairs up and then separates during meiosis, the pair of factors they carry gets segregated right along with them.\n\n**Sutton united the knowledge of chromosomal segregation with Mendelian principles and called it the *chromosomal theory of inheritance*.** The invisible factor now had a physical home.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 5, title: 'Chromosomes vs Genes — Why the Behaviour Matches',
      columns: [
        { heading: 'Chromosomes', points: [
          'Occur in pairs.',
          'Segregate at the time of gamete formation, so only one of each pair is transmitted to a gamete.',
          'One pair of chromosomes segregates independently of another pair.',
          'Visible under the microscope; their movement in meiosis was worked out by 1902.',
        ] },
        { heading: 'Genes (Mendel’s factors)', points: [
          'Occur in pairs (a pair of alleles).',
          'Segregate at gamete formation, so only one of each pair is transmitted to a gamete (Law of Segregation).',
          'Independent pairs segregate independently of each other (Law of Independent Assortment).',
          "Invisible 'factors' Mendel inferred — given a physical basis by the chromosome theory.",
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Linkage and Recombination — When Genes Refuse to Assort Freely',
      objective: "By the end of this you can say why some gene pairs break Mendel's 9:3:3:1 ratio, and how that 'failure' became a tool for mapping genes.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Thomas Hunt Morgan** set out to test the chromosome theory experimentally, running dihybrid crosses in *Drosophila* on genes that were sex-linked. His crosses looked just like Mendel's dihybrid pea crosses. In one, he crossed **yellow-bodied, white-eyed females** with **brown-bodied, red-eyed males** and intercrossed the F1.\n\nBut the F2 refused to behave. **The two genes did not segregate independently**, and the F2 ratio **deviated very significantly from the expected 9:3:3:1**. Morgan knew both genes sat on the **same chromosome (the X chromosome)** — and he saw why the ratio broke: when two genes lie on the same chromosome, the **parental gene combinations are far more common than the non-parental ones**.\n\nHe gave this its name. **Linkage** is the physical association of genes on the same chromosome — they travel together. **Recombination** is the generation of the non-parental combinations — the few offspring where linked genes got separated.\n\nMorgan's group then noticed something finer. Even among genes on the *same* chromosome, the tightness varied. Some were **tightly linked**, showing **very low recombination** — the genes **white** and **yellow** gave only **1.3 per cent** recombination. Others were **loosely linked**, showing much higher recombination — **white** and **miniature wing** gave **37.2 per cent**. His student **Alfred Sturtevant** turned this into a ruler: he used the **frequency of recombination between gene pairs as a measure of the distance between them**, and 'mapped' their positions along the chromosome. Those genetic maps are still the starting point for sequencing whole genomes, as in the Human Genome Sequencing Project.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A pair of homologous chromosomes carrying two linked genes, showing many parental-type gametes and few recombinant gametes',
      caption: '📸 Tap each dot to see how linked genes give mostly parental gametes and only a few recombinants (Figure 4.11)',
      generation_prompt: "Scientific textbook illustration contrasting linked (parental) and recombinant gametes. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, purple fill for the chromosomes (nucleic acid colour). TOP: a single pair of homologous chromosomes drawn as two vertical purple rods side by side; the left rod carries two small labelled gene beads stacked vertically (a dark bead near top, a dark bead lower) and the right rod carries the contrasting alleles at the same two positions, showing the two genes are physically on the same chromosome. MIDDLE-LEFT area: a large bracket labelled region showing FOUR gamete chromosomes where the two genes stay in their original parental pairing (drawn as tall stacks) to indicate 'majority parental type'. MIDDLE-RIGHT area: a small bracket showing only TWO gamete chromosomes where the two genes have been swapped into a new combination via a crossover, to indicate 'few recombinant type'. Show one clear X-shaped crossover point between the two homologous rods at top. Biologically accurate proportions, thin white leader lines, no baked-in text labels. No photorealism, no cartoon, no mascots; standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.16, label: 'Two genes on one chromosome', icon: 'circle',
          detail: 'Both genes sit on the **same chromosome**, at homologous positions on the homologous pair. This physical togetherness is what Morgan called **linkage**.' },
        { id: uuid(), x: 0.52, y: 0.20, label: 'Crossover point', icon: 'circle',
          detail: 'Occasionally the homologous chromosomes exchange segments here. This is the only way the linked genes get separated — and it is the source of the non-parental combinations.' },
        { id: uuid(), x: 0.24, y: 0.66, label: 'Parental gametes (majority)', icon: 'circle',
          detail: 'Most gametes keep the **original parental combination** of the two genes, because linkage carries them into the same gamete together. This is why parental types outnumber the rest.' },
        { id: uuid(), x: 0.76, y: 0.66, label: 'Recombinant gametes (few)', icon: 'circle',
          detail: 'A **small fraction** of gametes carry a **new, non-parental combination** produced by the crossover. These are the **recombinants** — always the minority when genes are linked.' },
        { id: uuid(), x: 0.52, y: 0.88, label: 'Tightly vs loosely linked', icon: 'circle',
          detail: 'Genes close together are **tightly linked** and give few recombinants (white & yellow: 1.3%). Genes far apart are **loosely linked** and give more (white & miniature wing: 37.2%). Recombination frequency tracks the **distance** between them.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In Morgan's crosses, two genes lying on the same chromosome produced far more parental-type offspring than recombinant ones. Why do linked genes give fewer recombinants than genes carried on two different chromosomes?",
      options: [
        "Because linked genes are physically joined on the same chromosome, so they usually pass into the same gamete together, and only occasional recombination separates them",
        "Because genes on the same chromosome can never be separated at all, so recombinants are impossible",
        "Because linked genes are always dominant, and dominant genes cannot recombine",
        "Because two genes on different chromosomes are held together more tightly than two on the same chromosome",
      ],
      reveal: "Linked genes sit on one chromosome, so they tend to travel together into the same gamete — the parental combination dominates and only the occasional crossover makes a recombinant, keeping recombinants in the minority. The tempting trap is 'can never be separated at all': linked genes *can* recombine (that's exactly why white and miniature show 37.2% recombination), just less often than unlinked genes. Dominance has nothing to do with recombination, and genes on *different* chromosomes assort freely, giving *more* new combinations, not fewer.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Chromosomal theory of inheritance** = Sutton & Boveri; chromosome behaviour parallels gene behaviour, and **Sutton** united chromosomal segregation with Mendel's principles.\n- **Linkage** = genes on the **same chromosome** stay together → **parental combinations outnumber non-parental**, and the F2 ratio **deviates from 9:3:3:1**.\n- **Recombination** = production of **non-parental** gene combinations.\n- **Recombination frequency ∝ distance** between genes: **tightly linked = low** recombination (white & yellow, 1.3%); **loosely linked = high** recombination (white & miniature wing, 37.2%).\n- **Alfred Sturtevant** used recombination frequency to **map** gene positions on the chromosome.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Chromosomal theory:** Sutton and Boveri proposed it; **Sutton** is credited with uniting chromosomal segregation with Mendelian principles. NEET swaps in Morgan or Mendel here — don't fall for it.\n\n**Morgan's organism:** *Drosophila melanogaster*. Remember the four 'why it's ideal' points — short (~2-week) life cycle, large progeny from one mating, grows on simple synthetic medium, sexes easily told apart.\n\n**The numbers NEET lifts verbatim:** white & yellow = **1.3%** recombination (tightly linked); white & miniature wing = **37.2%** (loosely linked). And linked genes make the dihybrid F2 **deviate from 9:3:3:1**.\n\n**Classic NEET question:** \"Who used recombination frequency to map genes on a chromosome?\" → **Alfred Sturtevant** (Morgan's student).",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "So genes are not free-floating ideas — they are stretches of chromosome, and their position decides how they are inherited. Next we follow one particular pair of chromosomes that does something no other pair does: it decides whether an offspring is male or female.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Who united the knowledge of chromosomal segregation with Mendelian principles and called it the chromosomal theory of inheritance?',
          options: ['Thomas Hunt Morgan', 'Alfred Sturtevant', 'Walter Sutton (with Theodore Boveri)', 'Gregor Mendel'],
          correct_index: 2,
          explanation: "Sutton and Boveri saw that chromosome behaviour paralleled gene behaviour, and Sutton united chromosomal segregation with Mendelian principles to form the chromosomal theory. Morgan came later and *experimentally verified* the theory; Sturtevant mapped genes; Mendel proposed the original laws but never linked them to chromosomes, which he couldn't see.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Why was Drosophila melanogaster an ideal organism for Morgan’s genetic studies?',
          options: [
            'It has a very long life cycle, so each generation can be studied slowly and carefully',
            'It completes its life cycle in about two weeks and a single mating yields a large number of progeny',
            'It reproduces only asexually, so all offspring are genetically identical',
            'Its males and females look exactly alike, removing sex as a variable',
          ],
          correct_index: 1,
          explanation: "The fruit fly's short (~2-week) life cycle plus large numbers of progeny from a single mating made rapid, high-volume genetics possible. The trap option flips this to a 'long life cycle', which would be a disadvantage. It reproduces sexually (not asexually), and its sexes are *clearly distinguishable* — another feature that helped, not the opposite.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Two genes lie on the same chromosome. Compared with genes on different chromosomes, what will the offspring show?',
          options: [
            'A higher proportion of non-parental (recombinant) combinations than parental ones',
            'A perfect 9:3:3:1 dihybrid ratio, exactly as Mendel predicted',
            'A higher proportion of parental gene combinations than non-parental ones',
            'No offspring at all, because linked genes cannot form gametes',
          ],
          correct_index: 2,
          explanation: "Linked genes travel together, so parental combinations dominate and recombinants stay in the minority — which is exactly why the F2 ratio *deviates* from 9:3:3:1 rather than matching it. The 9:3:3:1 option is the classic trap: that ratio only holds when the two genes assort independently on *different* chromosomes.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Morgan found that white and yellow genes showed only 1.3% recombination, while white and miniature wing showed 37.2%. What does the higher recombination frequency indicate about white and miniature wing?',
          options: [
            'They are located farther apart on the chromosome (loosely linked)',
            'They are located closer together on the chromosome (tightly linked)',
            'They are located on two completely different chromosomes',
            'They are dominant alleles, whereas white and yellow are recessive',
          ],
          correct_index: 0,
          explanation: "Recombination frequency tracks distance: a higher frequency (37.2%) means the genes are farther apart and only loosely linked, so crossovers separate them more often. Sturtevant used exactly this relationship to map genes. 'Closer together' describes the *low* 1.3% pair (white & yellow), and both pairs are on the same chromosome, so 'different chromosomes' is wrong; dominance is unrelated to recombination distance.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
