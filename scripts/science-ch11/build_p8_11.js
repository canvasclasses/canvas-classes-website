'use strict';
/**
 * Ch.11 pages 8-11: male-reproductive-system, female-reproductive-system,
 * fertilisation-in-humans, menstrual-cycle.
 * Source: iesc111.pdf §11.5.2 (p219), §11.5.3 (p219-220), §11.5.4/§11.5.5 (p220),
 * §11.5.6 + Fig 11.21 (p221). Age-appropriate, NCERT-faithful, respectful tone.
 * Run: node scripts/science-ch11/build_p8_11.js [--dry]
 */
const { img, txt, h, h3, cur, callout, cmp, table, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 8 — Male Reproductive System ─────────────────────────────────────────
const p8 = {
  slug: 'male-reproductive-system',
  subtitle: 'Why the body keeps one important organ outside, where most organs are kept safely inside',
  blocks: [
    cur(
      'Almost every important organ in your body is tucked safely deep inside — your heart, lungs, and liver are all protected within. But the organ that makes sperm sits outside the main body, in a thin pouch of skin, far more exposed than the rest. Why would the body leave something this important out in the open instead of guarding it inside?',
      'It is not careless design. The clue is temperature.',
      'The answer says a lot about how fussy the process of making sperm really is. Let us look at the whole system and what each part does.'
    ),
    img(
      'A clear labelled diagram of the human male reproductive system showing testis, scrotum, vas deferens, urethra, prostate gland, seminal vesicle and penis',
      'Wide 16:5 banner, dark background. A clean, respectful medical-textbook diagram (side view) of the human male reproductive system, with neat label lines pointing to the testis, scrotum, vas deferens, urethra, prostate gland, seminal vesicle and penis. Simple, clinical, educational style with soft muted colours. No text other than what a standard biology diagram needs.'
    ),
    callout('fun_fact', 'The Smallest Cell in Your Body',
`A sperm cell is the **smallest cell in the human body** — so tiny that millions of them could fit on the full stop at the end of this sentence. Each one is little more than a **head** packed with genetic instructions and a long **tail** for swimming. It has been stripped down to the bare minimum needed for a single, important journey.`),
    h('The Job: Making and Delivering Sperm', 'See which organ makes sperm and how sperm leave the body.'),
    txt(
`The male reproductive system has two jobs: to **make** the male germ cells (**sperm**), and to **deliver** them to the female body. Sperm are produced in two oval organs called the **testes**, which hang in a pouch of skin called the **scrotum**, outside the main body.`),
    h('Why Outside the Body?'),
    txt(
`Here is the reason for that unusual location. The scrotum keeps the testes **slightly cooler** than the rest of the body — and sperm form properly only at that cooler temperature. Inside the warm body, sperm production would not work well.

The testes have a second job too: they release a **hormone** (a chemical messenger) that controls sperm production and brings about the changes of puberty in boys, such as a deepening voice.`),
    h('The Sperm\'s Route Out'),
    txt(
`From the testes, sperm travel along a long tube called the **vas deferens**, which joins the **urethra** — a passage that carries both urine and sperm, but never at the same time. Along the way, glands called the **seminal vesicles** and the **prostate** add fluids that nourish the sperm and keep them active and swimming.`),
    table('Parts of the male reproductive system',
      ['Part', 'What it does'],
      [
        ['Testes', 'Make sperm; release a hormone for puberty changes'],
        ['Scrotum', 'Holds the testes; keeps them slightly cool'],
        ['Vas deferens', 'Carries sperm away from the testes'],
        ['Urethra', 'Shared passage carrying urine and sperm out'],
        ['Seminal vesicles & prostate', 'Add fluids that feed and activate the sperm'],
      ]),
    reason('logical',
      'Sperm must swim a long way inside the female body to reach an egg, but on their own they would soon run out of energy. Just before sperm leave, glands like the prostate and seminal vesicles mix fluids into them. What is the most likely job of these fluids?',
      [
        'To make the sperm heavier so they sink',
        'To feed the sperm and keep them active for the long swim ahead',
        'To turn the sperm into eggs',
        'To stop the sperm from moving until they are needed',
      ], 1,
      'Sperm have a demanding journey and very little of their own fuel. The added fluids act like food and a support drink — nourishing the sperm and keeping them moving so they have a chance of reaching the egg. Making them heavier (A) or stopping them (D) would only get in the way.',
      2),
    callout('threads_of_curiosity', 'One Organ, Two Very Different Jobs',
`The same testes that make sperm also release a hormone — and it is this hormone that deepens a boy\'s voice and brings the other changes of growing up. So one organ quietly does two very different things at once: making the cells of reproduction, and shaping the body into an adult. Why might the body link "becoming able to reproduce" with "starting to look grown up" at the very same time?`),
    quiz([
      q('Sperm are produced in the —',
        ['prostate gland', 'testes', 'urethra', 'vas deferens'], 1,
        'The testes make sperm. The other three are real parts of the system, but they only carry sperm or add fluid — they do not make it. That is the trap: knowing which part does the actual producing.',
        1),
      q('Why does the scrotum hold the testes outside the main body?',
        [
          'To keep them warmer than the rest of the body',
          'Because there is simply no room for them inside the body',
          'To keep them slightly cooler than the body, which sperm formation needs',
          'To protect them completely from any injury',
        ], 2,
        'Sperm form properly only at a slightly cool temperature, so the testes sit outside, where the scrotum can keep them cooler than the warm interior. Option A reverses this, and the location actually leaves them more exposed, not better protected (D).',
        2),
      q('The urethra in males carries both urine and sperm, yet this causes no problem. Why not?',
        [
          'They are released at different times, so the two never mix in the tube',
          'Urine and sperm are really the same fluid',
          'Sperm destroy any urine they come across',
          'The body grows a second tube whenever it is needed',
        ], 0,
        'One passage can safely do two jobs because urine and sperm pass through it at different moments — they are never released together. They are not the same fluid (B), and the body does not build a spare tube (D).',
        3),
    ]),
  ],
};

// ── PAGE 9 — Female Reproductive System ───────────────────────────────────────
const p9 = {
  slug: 'female-reproductive-system',
  subtitle: 'A newborn girl already carries the start of every egg she will ever have',
  blocks: [
    cur(
      'A newborn baby girl already carries, inside her tiny ovaries, the beginnings of every egg she will ever have — millions of them, formed before she herself was even born. In a sense, the very start of her future children was packed away before she could even walk. How can a newborn already hold the seeds of the next generation?',
      'Eggs are not made fresh each time, the way sperm are. They are stored from the very beginning.',
      'The female reproductive system is built not just to make eggs, but to grow and protect a new life. Let us see how it is put together.'
    ),
    img(
      'A clear labelled diagram of the human female reproductive system showing the ovaries, fallopian tubes (oviducts), uterus, cervix and vagina',
      'Wide 16:5 banner, dark background. A clean, respectful medical-textbook diagram (front view) of the human female reproductive system, with neat label lines pointing to the two ovaries, the fallopian tubes (oviducts), the uterus, the cervix and the vagina. Simple, clinical, educational style with soft muted colours. No extra text.'
    ),
    callout('fun_fact', 'The Largest Cell in Your Body',
`If the sperm is the smallest cell in the human body, the **egg** is the **largest** — just big enough to be seen as a tiny dot even without a microscope. The sperm carries a long tail for travelling; the egg is packed with stored food and material to start a new life. Two cells with the same purpose, built in completely opposite ways.`),
    h('The Job: Eggs, Hormones, and a Home for New Life', 'Learn the main parts of the female system and what each one does.'),
    txt(
`The female reproductive system has a pair of **ovaries**, which produce the female germ cells (**eggs**) and also release **hormones** that bring about the changes of puberty. Connected to the ovaries are the **oviducts** (also called fallopian tubes), which lead to the **uterus** — a muscular, bag-like organ where a baby (a **foetus**) grows. The uterus opens into the **vagina** through a narrow passage called the **cervix**.`),
    h('A Guided Tour of the Parts'),
    txt(
`Follow the path a single egg takes. It begins in an **ovary**, is released, and is gathered into an **oviduct**, the tube where it may meet a sperm. From there the path leads to the **uterus**, the safe, stretchy chamber where a baby can grow for nine months. At the lower end of the uterus is the **cervix**, a narrow doorway, and beyond it the **vagina**, which opens to the outside.`),
    table('Parts of the female reproductive system',
      ['Part', 'What it does'],
      [
        ['Ovaries', 'Make eggs; release hormones'],
        ['Oviducts (fallopian tubes)', 'Carry the egg towards the uterus; usual site of fertilisation'],
        ['Uterus', 'Muscular chamber where the foetus develops'],
        ['Cervix', 'Narrow passage between the uterus and the vagina'],
        ['Vagina', 'Passage leading to the outside of the body'],
      ]),
    cmp('Two gametes, built in opposite ways', [
      { heading: 'Sperm (male)', points: ['Very small', 'Made in millions', 'Carries no stored food', 'Actively swims'] },
      { heading: 'Egg (female)', points: ['Large', 'Only a few are released', 'Packed with stored food', 'Does not move on its own'] },
    ]),
    reason('spatial',
      'The uterus is a small, muscular, bag-like organ. During pregnancy it stretches to many times its normal size, and during birth it squeezes powerfully. Why is it so useful that the uterus is made of muscle?',
      [
        'Muscle lets it stretch to hold a growing baby, then contract to push the baby out',
        'Muscle is where the eggs are actually made',
        'Muscle keeps the uterus a fixed size at all times',
        'Muscle is what produces the female hormones',
      ], 0,
      'Muscle can both stretch and squeeze. That is exactly what the uterus needs: it must expand hugely to make room for a growing baby, and then contract strongly during birth to push the baby out. Eggs are made in the ovaries (B), and hormones come from the ovaries too (D) — not from the uterine muscle.',
      3),
    callout('threads_of_curiosity', 'One Egg at a Time',
`Out of the millions of eggs a girl is born with, usually just **one** is released each month, starting at puberty. Why dole them out one at a time across thirty or forty years, instead of all at once? The answer is tied to a steady monthly rhythm in the body — and that rhythm is exactly what the next page is about.`),
    quiz([
      q('The female gametes (eggs) are produced in the —',
        ['uterus', 'ovaries', 'cervix', 'vagina'], 1,
        'Eggs are made in the ovaries. The uterus is where a baby grows, the cervix is a narrow passage, and the vagina opens to the outside — none of them make eggs. Pinning down the producer is the point here.',
        1),
      q('In which part of the female reproductive system does a baby (foetus) develop?',
        ['Ovary', 'Oviduct', 'Uterus', 'Cervix'], 2,
        'A baby develops in the uterus, the muscular chamber built to stretch and protect it. The ovary makes eggs, the oviduct carries the egg, and the cervix is just the narrow doorway below the uterus.',
        2),
      q('The oviducts connect the ovaries to the uterus. Given that an egg is released from an ovary and a baby grows in the uterus, what is the most likely role of the oviduct?',
        [
          'To carry the egg from the ovary towards the uterus',
          'To make the eggs in the first place',
          'To store urine before it leaves the body',
          'To produce the female hormones',
        ], 0,
        'Sitting between the egg-making ovary and the baby-growing uterus, the oviduct\'s natural job is to carry the egg across that gap — and it is also where a sperm usually meets the egg. Making eggs and hormones is the ovary\'s work (B, D), and urine has nothing to do with this system (C).',
        3),
    ]),
  ],
};

// ── PAGE 10 — Fertilisation in Humans ─────────────────────────────────────────
const p10 = {
  slug: 'fertilisation-in-humans',
  subtitle: 'How two half-sets of instructions meet to make a brand-new person',
  blocks: [
    cur(
      'When a single sperm finally meets an egg, a brand-new cell forms — one that is not the mother and not the father, but a completely new individual that has never existed before anywhere on Earth. And surprisingly, this meeting does not happen in the uterus where the baby will grow, but in a narrow tube on the way there. What really happens in that moment?',
      'Remember that each gamete carries only half a set of chromosomes.',
      'That single new cell is called a zygote, and from it an entire person will grow. Let us follow the steps that lead to it.'
    ),
    img(
      'A single sperm fusing with a large egg to form a zygote, then the zygote dividing as it travels down the oviduct to implant in the uterus',
      'Wide 16:5 banner, dark background. Left: a respectful diagram of one sperm meeting a large round egg, forming a single new cell labelled as a zygote. Middle to right: the zygote shown dividing into 2, then 4, then more cells as it travels along the oviduct toward the uterus, ending with it settling into the thick uterus lining. Clean, clinical, educational style, soft colours. No extra text.'
    ),
    callout('fun_fact', 'Millions Set Out, One Arrives',
`When sperm are released, **millions** set out together, but usually only **one** fuses with the egg. The instant it does, the egg seals its surface so that no other sperm can enter. After all that competition, the start of a new life comes down to a single arrival — and a door that closes behind it.`),
    h('How Gametes Are Made: Gametogenesis', 'Connect meiosis to how sperm and eggs are formed.'),
    txt(
`The making of gametes is called **gametogenesis**, and it happens in the testes and the ovaries by the special division you met earlier — **meiosis**. Meiosis halves the chromosome number: ordinary human cells have **46**, but sperm and eggs have only **23**. This is the whole point — when a sperm (23) and an egg (23) combine, the new cell has **46** again, exactly like the parents.

In males, gametogenesis makes huge numbers of tiny, swimming sperm. In females, it usually makes a single large egg.`),
    h('Ovulation: One Egg a Month'),
    txt(
`At birth, a girl\'s ovaries already hold millions of immature eggs. From puberty onward, usually **one egg matures and is released each month** — this release is called **ovulation**. In the days before it, the uterus begins to prepare, its inner lining growing thick. The released egg is gathered into the **oviduct**.`),
    h('The Meeting, and the Journey to the Uterus'),
    txt(
`If sperm are present, they swim up through the reproductive tract, and some may reach the egg in the oviduct. If one sperm fuses with the egg, a **zygote** forms — this fusion is **fertilisation**. The zygote then divides again and again (by mitosis) as it slowly travels down to the uterus. There it **implants** itself into the thick, blood-rich lining, which will nourish it. This implantation is the true beginning of **pregnancy**.`),
    table('The journey from egg to pregnancy',
      ['Step', 'What happens'],
      [
        ['1. Ovulation', 'A mature egg is released from the ovary'],
        ['2. Into the oviduct', 'The egg is gathered into the oviduct'],
        ['3. Fertilisation', 'A sperm fuses with the egg, forming a zygote'],
        ['4. Dividing', 'The zygote divides as it travels to the uterus'],
        ['5. Implantation', 'It settles into the uterus lining — pregnancy begins'],
      ]),
    reason('quantitative',
      'A human body cell has 46 chromosomes, yet a sperm and an egg each carry only 23. Why is it essential that the gametes have half the number, instead of the full 46?',
      [
        'So the zygote ends up with 46, the same as the parents, instead of doubling to 92',
        'So that the baby will be smaller than its parents',
        'Because 23 is the largest number a cell is able to hold',
        'So that the sperm can swim faster than the egg',
      ], 0,
      'A zygote adds the two gametes\' chromosomes together. If each gamete carried 46, the zygote would have 92 — and the number would double every generation. By halving first (to 23 each), the zygote lands back at exactly 46, the normal human number. Chromosome count has nothing to do with body size (B) or swimming speed (D).',
      3),
    callout('threads_of_curiosity', 'Two People From One Egg',
`Sometimes, very early on, a dividing zygote splits cleanly into two, and each half grows into a complete person. These are **identical twins** — two people from a single fertilised egg, sharing the exact same genes. Most other brothers and sisters, though, grow from different eggs and different sperm. So why do identical twins look so alike, while ordinary siblings often do not?`),
    quiz([
      q('The release of a mature egg from the ovary, usually about once a month, is called —',
        ['fertilisation', 'ovulation', 'implantation', 'menstruation'], 1,
        'Ovulation is the release of the egg. The others are different events: fertilisation is sperm meeting egg, implantation is the zygote settling in the uterus, and menstruation is the shedding of the lining. They are easy to confuse, so match each name to its event.',
        1),
      q('In humans, where does fertilisation — the fusing of sperm and egg — usually take place?',
        [
          'In the oviduct (fallopian tube)',
          'In the ovary',
          'In the uterus',
          'In the vagina',
        ], 0,
        'Fertilisation usually happens in the oviduct, where the travelling egg meets the sperm. Many people assume it is the uterus (C) — but the uterus is where the zygote implants and grows later, not where sperm and egg first meet.',
        2),
      q('After fertilisation, the zygote divides as it travels and then implants in the uterus lining. Why is implanting in that thick, blood-rich lining important?',
        [
          'It hides the zygote from the mother\'s body',
          'It stops the zygote from dividing any further',
          'The thick, blood-rich lining provides nourishment for the developing baby',
          'The lining turns the zygote back into an egg',
        ], 2,
        'The lining is rich in blood vessels, so it can feed the developing baby — which is exactly why the uterus prepared it in advance. The zygote keeps dividing after implanting (so B is wrong), and nothing turns it back into an egg (D).',
        3),
    ]),
  ],
};

// ── PAGE 11 — The Menstrual Cycle ─────────────────────────────────────────────
const p11 = {
  slug: 'menstrual-cycle',
  subtitle: 'Why the body builds a nursery every month — and clears it when no baby arrives',
  blocks: [
    cur(
      'Every single month, a girl\'s body quietly builds a soft, blood-rich nursery inside the uterus, getting it ready for a baby that, most months, never arrives. And when no baby comes, the body carefully takes the nursery down again and starts the whole thing over. Why would the body go to all this trouble, month after month, for something that usually does not happen?',
      'The "nursery" is the same uterus lining that would have fed a fertilised egg.',
      'This monthly build-and-reset is the menstrual cycle. Far from being something to hide, it is a clear sign of a healthy body at work.'
    ),
    img(
      'A circular diagram of a 28-day menstrual cycle showing menstruation, the lining rebuilding, ovulation around day 14, and the lining thickening again',
      'Wide 16:5 banner, dark background. A clean, respectful circular (wheel) diagram of a 28-day menstrual cycle, divided into labelled stages: Days 1-5 menstruation (lining sheds), Days 6-14 lining rebuilds (egg matures), Day 14 ovulation (egg released), Days 15-28 lining thickens. Simple, educational, calm colours. No extra text beyond the stage labels a standard diagram needs.'
    ),
    callout('fun_fact', 'Nothing to Hide',
`Across her life, a woman may have around **400** periods. For a long time the topic was wrapped in silence and even shame — but a period is simply a sign that a healthy reproductive system is working exactly as it should. It is biology doing its job, and there is nothing about it that needs to be hidden.`),
    h('What Happens When the Egg Is Not Fertilised', 'Connect ovulation, the uterus lining, and a period.'),
    txt(
`Most months, the egg released at ovulation is **not** fertilised. It survives only about a day and then breaks down. Now the thick uterus lining — carefully built to feed a fertilised egg — is no longer needed. So the body sheds it. This lining, along with a little blood, leaves the body through the vagina. This shedding is called **menstruation**, or a period, and it usually lasts **3 to 7 days**.`),
    h('A Monthly Cycle'),
    txt(
`This sequence — the lining builds up, an egg is released, and the lining is shed if no pregnancy occurs — repeats roughly every **28 days** (it can range from 21 to 35). The cycle begins at **puberty**, around the age of 10 to 14, and continues until **menopause**, at around age 50.`),
    { type: 'timeline', orientation: 'horizontal', title: 'A typical 28-day cycle', events: [
      { id: 'a', label: 'Days 1–5: Menstruation', detail: 'The uterus lining is shed' },
      { id: 'b', label: 'Days 6–14: Lining rebuilds', detail: 'A new egg matures in the ovary' },
      { id: 'c', label: 'Day 14: Ovulation', detail: 'A mature egg is released' },
      { id: 'd', label: 'Days 15–28: Lining thickens', detail: 'If no fertilisation, it breaks down and the cycle repeats' },
    ] },
    reason('logical',
      'A woman\'s periods stop while she is pregnant, and start again only after the baby is born. Using what you know about why menstruation happens, explain why a period does not occur during pregnancy.',
      [
        'Because the ovaries stop making eggs forever',
        'Because the uterus lining is now needed to nourish the baby, so it is not shed',
        'Because the body runs out of blood during pregnancy',
        'Because a new egg is fertilised every single month',
      ], 1,
      'Menstruation is the shedding of an unused lining. During pregnancy, that lining is very much in use — it is nourishing the developing baby — so there is nothing to shed, and periods pause. The ovaries do not stop forever (A), and the body does not run out of blood (C); the cycle simply resumes after birth.',
      3),
    callout('threads_of_curiosity', 'Who Decides a Baby\'s Sex?',
`Every person carries two sex chromosomes: females have **XX** and males have **XY**. The mother always passes on an **X**. The father passes on either an **X** (giving a girl, XX) or a **Y** (giving a boy, XY). Now look carefully at that: since the mother can only ever give an X, who actually decides whether a baby is a boy or a girl?`),
    quiz([
      q('Menstruation is the shedding of the —',
        [
          'egg released from the ovary',
          'thickened lining of the uterus, along with some blood',
          'outer layer of the vagina',
          'unused sperm cells',
        ], 1,
        'A period is the shedding of the uterus lining (with some blood) when no pregnancy occurs. It is not the egg itself being shed — that is a common mix-up with ovulation — and it has nothing to do with the vagina\'s wall or with sperm.',
        1),
      q('Rina\'s periods come every 28 days, and her last period began on the 5th of March. Around which date is her next period most likely to start?',
        ['12th March', '19th March', '2nd April', '5th May'], 2,
        'A 28-day cycle means about 28 days from the start of one period to the next. Counting 28 days on from the 5th of March lands near the 2nd of April. The 12th and 19th are far too soon (less than a cycle), and the 5th of May is more than two cycles away.',
        2),
      q('In the second half of the cycle, the uterus lining grows thick and rich in blood vessels. What is this preparation for?',
        [
          'To get ready to receive and nourish a fertilised egg',
          'To store extra eggs for later months',
          'To make the released egg travel faster',
          'To produce more sperm',
        ], 0,
        'The thick, blood-rich lining is a nursery prepared in advance, in case a fertilised egg arrives and needs feeding. The ovaries store the eggs, not the lining (B); the lining does not move the egg (C); and the female body does not make sperm at all (D).',
        3),
    ]),
  ],
};

applyPages([p8, p9, p10, p11]);
