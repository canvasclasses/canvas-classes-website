'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'sex-determination',
  title: 'How Sex Is Determined',
  subtitle: "Whether an offspring turns out male or female is settled by chromosomes — and the exact rule changes from humans to birds to honey bees.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['sex-determination', 'sex-chromosomes', 'heterogamety', 'principles-of-inheritance'],
  glossary: [
    { term: 'autosome', definition: 'A chromosome that is not a sex chromosome. In humans, 22 of the 23 pairs are autosomes and they are exactly the same in both males and females.' },
    { term: 'sex chromosome', definition: 'A chromosome whose makeup decides the sex of the individual — the X and Y in humans, or the Z and W in birds.' },
    { term: 'heterogametic', definition: 'The sex that produces two different kinds of gametes with respect to sex chromosomes (for example, human males make X-bearing and Y-bearing sperm).' },
    { term: 'homogametic', definition: 'The sex that produces only one kind of gamete with respect to sex chromosomes (for example, human females make only X-bearing eggs).' },
    { term: 'haplodiploidy', definition: 'A sex-determination system, as in the honey bee, where sex depends on the number of chromosome sets — diploid individuals become females and haploid individuals become males.' },
    { term: 'parthenogenesis', definition: 'Development of an offspring from an unfertilised egg. In honey bees, an unfertilised egg develops into a male (drone) this way.' },
    { term: 'drone', definition: 'The male honey bee. It is haploid (16 chromosomes), develops from an unfertilised egg, and has no father.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk montage suggesting the different ways sex is set across a grasshopper, a human, a bird and a honey bee',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk scene quietly linking four living things across the frame without hard borders: a grasshopper resting on a grass blade on the far left, a pair of human silhouettes in the near-centre, a hen and rooster among reeds to the right, and a honey bee hovering by a honeycomb on the far right. Soft warm horizon glow tying the whole panorama together, gentle sense that each creature follows its own hidden rule for becoming male or female. Painterly, atmospheric illustration, dark background overall (#0a0a0a base tones), naturalistic, no text, no labels, no diagram elements, no chromosomes drawn.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "The Father Decides — and a Drone Has No Father",
      markdown: "Two facts on this page overturn things people wrongly believe. First: in humans, it is **the father's sperm** that decides whether a baby is a boy or a girl — the mother's egg always carries the same sex chromosome, so she cannot be the one who 'chooses'. Second, from the insect world: a male honey bee, the **drone, has no father at all**. He hatches from an egg that was never fertilised. He can have a grandfather and grandsons, but not a father and not a son.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "For a long time, how an offspring becomes male or female was a real puzzle. The first clue came from insects. In 1891 **Henking** followed a particular nuclear structure through sperm formation in some insects and noticed that **half the sperm carried it and half did not**. He called it the *X body* but couldn't say what it meant. Later work showed his X body was in fact a chromosome — the **X-chromosome**.\n\nThat gave us the two key words. A chromosome whose makeup decides sex is a **sex chromosome**; every other chromosome is an **autosome**. And it gave us a second idea: one sex often makes **two different kinds of gamete** (say, sperm with X and sperm without), while the other sex makes only **one kind**. The sex that makes two kinds is **heterogametic**; the sex that makes one kind is **homogametic**. Hold on to those two words — every system below is just a different answer to *which sex is heterogametic*.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Sex Determination in Humans (XX–XY)',
      objective: "By the end of this you can explain why every pregnancy is a 50:50 chance and why the sperm, not the egg, sets the baby's sex.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Humans are the **XY type**. Of the 23 pairs of chromosomes, **22 pairs are autosomes** — exactly the same in males and females. The last pair is the sex chromosomes: a female has **two X-chromosomes (XX)**, while a male has **one X and one Y**. The Y is distinctly smaller than the X.\n\nNow watch what happens when gametes form. During sperm formation a male makes **two types of sperm** — **50% carry the X-chromosome and 50% carry the Y** (each also carries autosomes). A female, on the other hand, makes only **one type of ovum**, always carrying an **X**. So the mother's contribution is fixed; the variable is which sperm arrives.\n\nThere is an **equal chance** either type of sperm fertilises the egg. If an **X-sperm** wins, the zygote is **XX — a girl**. If a **Y-sperm** wins, it is **XY — a boy**. This is why it is the **genetic makeup of the sperm that determines the sex of the child**, and why every pregnancy carries a **50% probability** of each. NCERT notes plainly that blaming women for the birth of a female child is a false and unjust notion — the mother's egg cannot decide the outcome.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A cross showing an XX mother and an XY father producing X and Y sperm, giving XX daughters and XY sons in equal numbers',
      caption: '📸 Tap each dot to follow how the father’s two sperm types give a 50:50 chance of a boy or a girl',
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.24, label: 'Mother (XX)', icon: 'circle',
          detail: 'The female is **homogametic** — she carries two X-chromosomes and makes only **one kind of ovum**, always with an **X**.' },
        { id: uuid(), x: 0.80, y: 0.24, label: 'Father (XY)', icon: 'circle',
          detail: 'The male is **heterogametic** — one X and one Y. He makes **two kinds of sperm**: 50% carry X, 50% carry Y.' },
        { id: uuid(), x: 0.50, y: 0.52, label: 'The two sperm types', icon: 'circle',
          detail: 'Which sperm fertilises the egg is a coin-toss. The egg’s X is fixed, so the **sperm** is what varies the outcome.' },
        { id: uuid(), x: 0.30, y: 0.80, label: 'Daughter (XX)', icon: 'circle',
          detail: 'Egg (X) + **X-sperm** → **XX**, a female child.' },
        { id: uuid(), x: 0.70, y: 0.80, label: 'Son (XY)', icon: 'circle',
          detail: 'Egg (X) + **Y-sperm** → **XY**, a male child. Both results are equally likely — a **50:50** split.' },
      ],
      generation_prompt: "Scientific textbook illustration of human sex determination as a genetic cross. Flat 2D educational diagram on a dark background (#0a0a0a near-black). At the top, two parent figures: a female labelled area on the left holding a pair of matching X chromosomes (XX), and a male on the right holding one large X and one clearly smaller Y chromosome (XY). Below the female, one egg carrying a single X; below the male, two sperm branching down — one carrying X and one carrying the smaller Y. Leader lines converge to two offspring boxes at the bottom: left box XX, right box XY, drawn in equal size to show a fifty-fifty outcome. Clean white outlines and thin white leader lines, chromosomes tinted purple (nucleic acid), biologically accurate proportions with the Y visibly smaller than the X, no baked-in text labels. No photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Other Systems: XX–XO, ZZ–ZW and the Honey Bee',
      objective: "By the end of this you can say which sex is heterogametic in grasshoppers and in birds, and why the honey bee doesn't fit either mould.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Not every organism runs the human pattern. NCERT gives three more.\n\n**XX–XO type (grasshopper).** Here there is no Y at all. **Every egg carries an X.** Among the sperm, some carry an X and some carry none. An egg fertilised by an **X-sperm becomes a female (XX)**; an egg fertilised by a sperm with **no X becomes a male (XO)** — the male has just a single X. So males and females differ in chromosome number. Like humans, the **male is heterogametic** (it makes two kinds of sperm, with or without X).\n\n**ZZ–ZW type (birds).** Birds flip the roles. The **total chromosome number is the same** in both sexes, but now it is the **female that makes two kinds of gamete**. To keep it distinct from the XY system, the female's two sex chromosomes are named **Z and W**: the **female is ZW** and the **male is ZZ**. Here the **female is heterogametic**.\n\n**Honey bee (haplodiploidy).** The bee ignores X, Y, Z and W completely. Sex depends on the **number of chromosome sets**. A **fertilised egg** (sperm + egg) develops into a **female — a queen or a worker**, which is **diploid with 32 chromosomes**. An **unfertilised egg** develops into a **male — a drone — by parthenogenesis**, and is **haploid with 16 chromosomes**. Because the drone came from an unfertilised egg, he makes sperm by **mitosis**, he has **no father**, cannot have sons, but does have a grandfather and can have grandsons.\n\nNext we turn to how faults in chromosomes and genes lead to genetic disorders.",
    },
    {
      id: uuid(), type: 'table', order: 8,
      caption: '📊 The four sex-determination systems side by side',
      headers: ['System', 'Female', 'Male', 'Heterogametic sex', 'Example organisms'],
      rows: [
        ['XX–XO', 'XX (two X)', 'XO (one X, no Y)', 'Male', 'Grasshopper, many insects'],
        ['XX–XY', 'XX', 'XY (Y is smaller)', 'Male', 'Humans, Drosophila'],
        ['ZZ–ZW', 'ZW', 'ZZ', 'Female', 'Birds'],
        ['Haplodiploidy', 'Diploid, 32 chromosomes (from fertilised egg)', 'Haploid, 16 chromosomes (from unfertilised egg)', 'Neither — sex set by chromosome number, not X/Y', 'Honey bee'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student writes: 'In birds the male is heterogametic, just like in humans.' Where exactly has this student gone wrong?",
      options: [
        "Nowhere — the male is heterogametic in both birds and humans",
        "In birds the female is heterogametic (ZW); in humans it is the male (XY) who is heterogametic",
        "In humans the female is heterogametic (XX) and in birds the male is (ZZ)",
        "Both birds and humans have a female-heterogametic system",
      ],
      reveal: "In humans the male is XY and makes two kinds of sperm, so the male is heterogametic and the female (XX) is homogametic. Birds are the mirror image: the female is ZW and makes two kinds of gamete, so in birds the female is heterogametic while the male (ZZ) is homogametic. The tempting trap is to carry the human rule over to birds unchanged — but the whole reason NCERT uses new letters Z and W is to flag that the heterogametic sex has switched.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These Down',
      markdown: "- **Autosomes** = 22 pairs in humans, identical in both sexes. **Sex chromosomes** = the pair that decides sex.\n- **Male heterogametic:** XX–XO (grasshopper) and XX–XY (humans, Drosophila).\n- **Female heterogametic:** ZZ–ZW (birds) — female is **ZW**, male is **ZZ**.\n- Human **female makes one ovum type (X)**; **male makes X and Y sperm** → the **sperm** sets the sex; **50:50** every pregnancy.\n- **Honey bee:** fertilised egg → **diploid female (32)**; unfertilised egg → **haploid male drone (16)** by **parthenogenesis**; drone has **no father**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Heterogametic sex — the #1 swap trap:** male in XO and XY, **female in ZW**. NEET loves the option that says 'female is heterogametic in humans' or 'male is heterogametic in birds'. Both are wrong.\n\n**ZW vs XY:** female bird is **ZW** (not ZZ); male bird is **ZZ**. Mixing these up is the classic bird question.\n\n**Honey bee numbers:** female = **diploid 32**, male drone = **haploid 16**, from an **unfertilised egg by parthenogenesis**, sperm made by **mitosis**, **no father**.\n\n**Classic NEET question:** \"In which of the following is the female the heterogametic sex?\" → **birds (ZZ–ZW)**. And: \"Who determines the sex of a human child?\" → **the father's sperm (X or Y)**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In human beings, which cell actually determines the sex of the child?',
          options: [
            "The ovum, because it carries the deciding X-chromosome",
            "Both gametes equally, since each carries one sex chromosome",
            "The sperm, because it may carry either an X or a Y",
            "Neither — sex is decided after fertilisation by the autosomes",
          ],
          correct_index: 2,
          explanation: "The ovum always carries an X, so the mother's contribution is fixed. The sperm is the variable one — 50% carry X and 50% carry Y — so it is the genetic makeup of the sperm that decides whether the zygote is XX (girl) or XY (boy). The ovum-based option is the exact false notion NCERT warns against.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In which of the following is the FEMALE the heterogametic sex?',
          options: [
            "Birds (ZZ–ZW system)",
            "Humans (XX–XY system)",
            "Grasshopper (XX–XO system)",
            "Drosophila (XX–XY system)",
          ],
          correct_index: 0,
          explanation: "In birds the female is ZW and produces two kinds of gamete, so she is heterogametic — the male is ZZ (homogametic). In humans, Drosophila and grasshopper it is the male that makes two kinds of gamete, so those three are all male-heterogametic and are the tempting distractors here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A male honey bee (drone) is best described as:',
          options: [
            "Diploid with 32 chromosomes, formed from a fertilised egg",
            "Heterogametic, carrying one Z and one W chromosome",
            "Produced by two X-less sperm fusing together",
            "Haploid with 16 chromosomes, formed from an unfertilised egg by parthenogenesis",
          ],
          correct_index: 3,
          explanation: "The drone develops from an unfertilised egg by parthenogenesis, so it is haploid (16 chromosomes) and has no father. The diploid-32 description belongs to the female (queen/worker). ZW belongs to birds, not bees — the honey bee uses ploidy, not sex chromosomes, so those options are traps borrowed from other systems.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'In the XX–XO system seen in grasshoppers, how does a male differ from a female?',
          options: [
            "The male has XY; the female has XX",
            "The male has a single X and no Y; the female has two X-chromosomes",
            "The male has ZZ; the female has ZW",
            "The male is haploid; the female is diploid",
          ],
          correct_index: 1,
          explanation: "In the XO system there is no Y at all: a female is XX and a male has just one X (written XO). The XY option describes humans, ZZ/ZW describes birds, and haploid/diploid describes the honey bee — each is a real system, but not the grasshopper's.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
