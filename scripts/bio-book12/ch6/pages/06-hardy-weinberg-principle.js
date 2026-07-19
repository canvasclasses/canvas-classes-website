'use strict';
/**
 * Class 12 Biology — Chapter 6: Evolution
 * Page 6 (lesson) — The Hardy-Weinberg Principle.
 *
 * Source of truth: NCERT Class 12 Ch.6 (lebo106.txt) §6.7 "Hardy-Weinberg
 * Principle" — allele frequencies stay stable and constant across generations
 * (genetic equilibrium); p + q = 1 and p² + 2pq + q² = 1 (the binomial
 * expansion of (p + q)²), with p² = homozygous dominant, 2pq = heterozygous,
 * q² = homozygous recessive; a disturbance of this equilibrium (change in allele
 * frequency) is interpreted as evolution; the five factors that disturb it —
 * gene migration / gene flow, genetic drift, mutation, genetic recombination,
 * natural selection. Rule 0: every fact here traces to that text; nothing
 * invented. The worked example only applies NCERT's own equation to numbers.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-hardy-weinberg-principle',
  title: 'The Hardy-Weinberg Principle',
  subtitle: "There is a simple piece of algebra that tells you when a population is NOT evolving — and the moment it breaks, evolution is happening. Here is how to read p² + 2pq + q² = 1 and use it.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['evolution', 'hardy-weinberg-principle', 'genetic-equilibrium', 'allele-frequency'],
  glossary: [
    { term: 'allele frequency', definition: 'How common one particular allele of a gene is in a population — measured as a fraction of all the copies of that gene present. All the allele frequencies of a gene add up to 1.' },
    { term: 'gene pool', definition: 'The total of all genes and their alleles present in a population. In a population at equilibrium the gene pool stays constant.' },
    { term: 'genetic equilibrium', definition: 'The state in which allele frequencies in a population stay stable and constant from generation to generation, so the gene pool does not change.' },
    { term: 'Hardy-Weinberg principle', definition: 'The rule, stated with algebra, that allele frequencies in a population are stable and constant across generations — and that any change in them signals evolution.' },
    { term: 'gene flow', definition: 'The addition and loss of alleles that happens when individuals migrate between populations; when this migration happens repeatedly, alleles move (flow) from one population to another.' },
    { term: 'genetic drift', definition: 'A change in allele frequency that happens purely by chance, not by selection. A drastic drift can make the new sample so different that it becomes a separate group (the founder effect).' },
    { term: 'founder effect', definition: 'When a small drifted population differs so much in allele frequency from the original that it behaves as a new group; the drifted individuals are called founders.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A vast crowd of the same species of moth resting across a dark tree trunk at dusk, most one shade, a scattered few a different shade, hinting at hidden proportions in a population',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single large population of one moth species at rest across the bark of a broad dark tree trunk that fills most of the frame, seen at dusk in soft low light. The great majority of the moths are one muted pale-grey shade, blending into the bark; scattered thinly among them, a smaller number of darker charcoal moths stand out just enough to notice. The eye reads it as one population made of two proportions. Naturalistic, painterly and atmospheric, deep dusk lighting, dark background tones overall (#0a0a0a base), soft focus at the edges, no text, no labels, no diagram elements, no numbers.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Evolution Is Just A Number Changing',
      markdown: "Evolution can feel like a huge, slow, invisible thing. But biologists can actually **measure** it, and when they do, it comes down to something small: the **frequency of an allele in a population shifting** from one generation to the next. If in one generation an allele makes up, say, a tenth of all the copies of its gene, and generations later it makes up a fifth, the population has evolved — by that much. The Hardy-Weinberg principle is the tool that puts a number on it.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Genetic Equilibrium — A Population That Stays Put',
      objective: 'By the end of this you can say what genetic equilibrium means and why the allele frequencies of a gene must add up to 1.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Pick any gene in a population. For each of its alleles you can work out a **frequency** — how common that allele is, as a fraction of all the copies of that gene present. The Hardy-Weinberg principle says something almost surprising about that number: in a population, **allele frequencies are stable and stay constant from generation to generation.** The **gene pool** — the total of all genes and their alleles in the population — stays fixed. This steady, unchanging state is called **genetic equilibrium**.\n\nOne rule holds these frequencies together: the **sum of all the allele frequencies of a gene is 1.** Take a gene with two alleles, A and a. Call the frequency of A the letter **p** and the frequency of a the letter **q**. Since between them they account for every copy of that gene, they must add up to the whole:\n\n$$ p + q = 1 $$\n\nThat is the starting line of everything on this page. If you know one frequency, you instantly know the other.",
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'The Hardy-Weinberg Equation — From Alleles To Genotypes',
      objective: 'By the end of this you can write p² + 2pq + q² = 1 and say exactly which genotype each term counts.',
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "In a diploid organism every individual carries **two** copies of the gene, so individuals come in three genotypes: **AA**, **Aa** and **aa**. Hardy and Weinberg worked out how often each of these should appear, using nothing but p and q.\n\nThink about an **AA** individual. For it to be AA, an A allele (frequency **p**) has to land on *both* of its chromosomes. The chance of that is simply the product of the two probabilities — **p × p = p²**. By the same reasoning, an **aa** individual needs an a allele on both chromosomes, giving **q²**. And a heterozygous **Aa** individual can be made two ways (A from one parent and a from the other, or the reverse), which gives **2pq**. Those three genotypes are everyone in the population, so their frequencies must add to 1:\n\n$$ p^2 + 2pq + q^2 = 1 $$\n\nThis is nothing more than the **binomial expansion of (p + q)²** — which makes sense, because (p + q) was 1 to begin with. Here is what each term is counting:",
    },
    {
      id: uuid(), type: 'table', order: 6,
      caption: '📸 The three terms of p² + 2pq + q² = 1, and the genotype each one counts',
      headers: ['Term', 'Genotype', 'What it is'],
      rows: [
        ['p²', 'AA', 'Frequency of homozygous dominant individuals — allele A on both chromosomes.'],
        ['2pq', 'Aa', 'Frequency of heterozygous (carrier) individuals — one A and one a.'],
        ['q²', 'aa', 'Frequency of homozygous recessive individuals — allele a on both chromosomes.'],
      ],
    },
    {
      id: uuid(), type: 'worked_example', order: 7, label: 'Using the equation', variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: "A gene has two alleles, A (dominant) and a (recessive). In a population the recessive allele a has a frequency of q = 0.1. Assuming the population is in Hardy-Weinberg equilibrium, what fraction of the individuals are **carriers** — that is, heterozygous Aa? (Carrier frequency is the 2pq term.)",
      solution: "**Step 1 — get p from p + q = 1.**\nWe are given q = 0.1, so\n$$ p = 1 - q = 1 - 0.1 = 0.9 $$\n\n**Step 2 — the carriers are the 2pq term.**\nHeterozygous (Aa) individuals are counted by 2pq:\n$$ 2pq = 2 \\times 0.9 \\times 0.1 = 0.18 $$\n\nSo **0.18, or 18%, of the population are carriers (Aa).**\n\n**Step 3 — sanity check with the full equation.**\nThe other two groups are p² = 0.9 × 0.9 = **0.81** (AA) and q² = 0.1 × 0.1 = **0.01** (aa). Adding all three:\n$$ 0.81 + 0.18 + 0.01 = 1 $$\nThey sum to 1, exactly as p² + 2pq + q² = 1 demands — so the answer is consistent. The heterozygous carriers (18%) far outnumber the visibly recessive aa individuals (1%), which is why a rare recessive allele can hide in a population for a long time.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Five Factors That Disturb The Equilibrium',
      objective: 'By the end of this you can name the five factors that change allele frequencies, and say why any one of them means evolution is under way.',
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The equation describes a population that is standing still. Real populations often are not — and when the measured frequencies **differ from the expected values**, that difference is exactly the signal of evolutionary change. NCERT lists **five factors** known to disturb Hardy-Weinberg equilibrium:\n\n- **Gene migration / gene flow** — when a section of a population migrates to another place and joins another population, allele frequencies change in *both* the old and the new population. New alleles are added to the new population and lost from the old one. If this migration happens **again and again**, the movement of alleles between populations is called **gene flow**.\n- **Genetic drift** — the same kind of change in allele frequency, but happening purely **by chance** rather than by migration. If a drifted sample ends up so different that it becomes a separate group, its members are the **founders** and the effect is the **founder effect**.\n- **Mutation** — the source of brand-new alleles. Pre-existing advantageous mutations, when selected, show up as new phenotypes, and over generations this can lead to **speciation**.\n- **Genetic recombination** — the reshuffling of alleles that happens **during gametogenesis**, producing new combinations in the next generation.\n- **Natural selection** — heritable variations that allow better survival let those individuals reproduce and leave **more progeny**, so the helpful alleles become more common.\n\nEvery one of these does the same underlying thing: it **changes the frequency of alleles** in the next generation.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A biologist measures a population over several generations and finds that the frequency of one allele keeps shifting away from the value Hardy-Weinberg predicts. What is the correct conclusion?",
      options: [
        'The population is in genetic equilibrium and nothing is happening',
        'The population is evolving — a change in allele frequency is interpreted as evolution',
        'The gene pool of the population is constant',
        'The measurement must be wrong, because allele frequencies can never change',
      ],
      correct_index: 1,
      reveal: "A **disturbance of Hardy-Weinberg equilibrium — a change in the frequency of alleles — is interpreted as evolution.** That is the whole point of the principle: the stable equation is the 'no evolution' baseline, and a departure from it is the measurable footprint of evolutionary change. Option 1 (equilibrium, nothing happening) is the exact opposite of what a *shifting* frequency shows. 'The gene pool is constant' describes equilibrium too, so it also contradicts the observation. And allele frequencies certainly can change — five known factors do exactly that — so dismissing the data is wrong.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In Before You Move On',
      markdown: "- **Genetic equilibrium:** allele frequencies stay **stable and constant across generations**; the gene pool stays fixed.\n- **All allele frequencies of a gene add up to 1:** $ p + q = 1 $.\n- **The genotype equation:** $ p^2 + 2pq + q^2 = 1 $ — the binomial expansion of $(p + q)^2$. Here **p² = AA (homozygous dominant), 2pq = Aa (heterozygous), q² = aa (homozygous recessive).**\n- **A change in allele frequency = evolution.** When measured frequencies differ from expected, that difference measures the evolutionary change.\n- **The five factors that disturb equilibrium:** gene migration / **gene flow**, **genetic drift**, **mutation**, **genetic recombination**, **natural selection**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The equation term-by-term:** NEET repeatedly tests which term maps to which genotype. Fix it hard — **p² = homozygous dominant, 2pq = heterozygous, q² = homozygous recessive.** The heterozygous term is the one students misassign (they forget the factor of 2), so it is a favourite trap.\n\n**The five factors, verbatim:** the list — gene flow, genetic drift, mutation, recombination, natural selection — is lifted straight from NCERT. A common wrong option slips in something like 'genetic equilibrium' or 'binomial expansion' as a sixth 'factor' — those are not factors that disturb equilibrium.\n\n**Classic NEET question:** “A change in allele frequency in a population from the Hardy-Weinberg expected values is interpreted as — ?” → **evolution.**",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So the algebra hands us a clean definition: a population sitting on p² + 2pq + q² = 1 is not evolving, and the moment its numbers drift off that line, one of the five factors is at work. Of those five, natural selection is the one Darwin built his whole theory on — and next we watch it actually reshape a population, sorting variation into the patterns evolution leaves behind.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In the Hardy-Weinberg equation p² + 2pq + q² = 1, what does the term 2pq represent?',
          options: [
            'The frequency of homozygous dominant (AA) individuals',
            'The frequency of heterozygous (Aa) individuals',
            'The frequency of homozygous recessive (aa) individuals',
            'The total number of alleles in the gene pool',
          ],
          correct_index: 1,
          explanation: "2pq counts the **heterozygous (Aa)** individuals — one dominant and one recessive allele, and the factor of 2 is there because Aa can form two ways. The tempting trap is p², which counts homozygous **dominant (AA)** individuals; students who forget which squared term is which pick it. q² is homozygous recessive (aa), and the equation deals in genotype frequencies, not a raw count of alleles.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A population is said to be in genetic equilibrium. Which statement describes it correctly?',
          options: [
            'Its allele frequencies change rapidly every generation',
            'A section of it is constantly migrating to new populations',
            'Its allele frequencies stay stable and constant across generations, and the gene pool remains constant',
            'New alleles are being added by mutation each generation',
          ],
          correct_index: 2,
          explanation: "Genetic equilibrium means allele frequencies are **stable and constant from generation to generation** and the **gene pool remains constant** — that is the definition NCERT gives. The other three all describe forces that *disturb* equilibrium (rapid frequency change, migration/gene flow, mutation), which is the opposite of the equilibrium state.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which of the following is NOT one of the five factors that disturb Hardy-Weinberg equilibrium?',
          options: [
            'Gene flow (gene migration)',
            'Genetic drift',
            'Natural selection',
            'Genetic equilibrium',
          ],
          correct_index: 3,
          explanation: "**Genetic equilibrium** is the stable, undisturbed *state itself* — it is what the five factors break, not a factor that breaks it. The five actual factors are gene migration / gene flow, genetic drift, mutation, genetic recombination and natural selection; gene flow, genetic drift and natural selection in the other options are three of those five, so they belong on the list.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'When a change in allele frequency in a population happens purely by chance rather than by selection, and can make a small drifted group behave as founders of a new population, the factor at work is called:',
          options: [
            'Genetic drift',
            'Natural selection',
            'Gene flow',
            'Genetic recombination',
          ],
          correct_index: 0,
          explanation: "A change in allele frequency **by chance** is **genetic drift**, and when the drifted sample differs so much that it starts a new group, its members are the founders — the founder effect. Natural selection changes frequencies through survival and reproduction, not chance; gene flow needs migration between populations; and genetic recombination reshuffles alleles during gametogenesis. Only drift is the chance-driven factor described here.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
