'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'birth-control-iuds-hormonal-and-surgical',
  title: 'Birth Control II — IUDs, Pills & Sterilisation',
  subtitle: "The barrier methods stop sperm at the door; this page goes inside — a T-shaped device in the uterus, a daily pill that switches ovulation off, and a one-time surgery that cuts the tube for good.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['reproductive-health', 'birth-control', 'contraception', 'iud', 'oral-contraceptive', 'sterilisation'],
  glossary: [
    { term: 'IUD (Intra Uterine Device)', definition: 'A small device inserted by a doctor or trained nurse into the uterus through the vagina to prevent pregnancy. It may be non-medicated, copper-releasing or hormone-releasing.' },
    { term: 'oral contraceptive pill', definition: 'A tablet containing small doses of progestogens, or progestogen-estrogen combinations, taken by mouth to prevent conception — usually daily for 21 days, then a 7-day gap.' },
    { term: 'Saheli', definition: 'A non-steroidal oral contraceptive for females developed at the Central Drug Research Institute (CDRI), Lucknow. It is a "once a week" pill with very few side effects and high contraceptive value.' },
    { term: 'emergency contraception', definition: 'Progestogens or progestogen-estrogen combinations or IUDs given within 72 hours of coitus to avoid a possible pregnancy, for example after rape or casual unprotected intercourse.' },
    { term: 'vasectomy', definition: 'The male sterilisation surgery — a small part of the vas deferens is removed or tied up through a small incision on the scrotum, so sperm cannot pass out.' },
    { term: 'tubectomy', definition: 'The female sterilisation surgery — a small part of the fallopian tube is removed or tied up through a small incision in the abdomen or through the vagina, so the egg cannot pass down.' },
    { term: 'sterilisation', definition: 'A surgical (terminal) contraceptive method that blocks gamete transport to prevent any more pregnancies. It is highly effective but its reversibility is very poor.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A quiet still-life of contraceptive devices resting on a dark surface under a single warm light — a small T-shaped copper device, a blister strip of pills and a thin implant rod',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, respectful still-life arranged on a dark polished surface under a single soft warm overhead light. Left of centre, a small T-shaped copper contraceptive device rests with a fine copper wire coiled around its stem, catching a warm glint. To its right, a slim foil blister strip of round tablets lies at a gentle angle. Further right, a single thin rod-like implant. The objects are spaced calmly with soft shadows and shallow depth of field, evoking careful medical choice rather than clutter. Deep dusk lighting, warm glow tying the scene together, deep near-black background throughout (#0a0a0a base). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Once-A-Week Pill Made in India',
      markdown: "Most contraceptive pills are a daily habit. **Saheli** broke that rule. It's a **'once a week' pill** — you take it once, not every single day — with **very few side effects and a high contraceptive value**. What makes it special for us is where it came from: **Saheli was developed by scientists at the Central Drug Research Institute (CDRI) in Lucknow, India**, and it's **non-steroidal**, which is unusual for a hormonal-era contraceptive. A homegrown pill, on a weekly schedule, that NEET expects you to name.",
    },
    // ── core concept / bridge ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The barrier methods you just met — condoms, diaphragms, caps — all work by **standing between the sperm and the egg** from the outside. This page moves **inside the body**, to three families of methods that act within the uterus, within the hormones, or on the tubes themselves.\n\nKeep NCERT's yardstick for a good contraceptive in your head as we go: it should be **user-friendly, easily available, effective and reversible, with least side-effects**, and it should **not interfere with sexual drive or the sexual act**. That word **reversible** is the one that will separate these methods at the end — an IUD or a pill can be stopped and fertility returns, but surgery is a **terminal** choice.\n\nThe three groups ahead are: **Intra Uterine Devices (IUDs)**, the **hormonal methods** (oral pills, injectables and implants), and the **surgical methods** (sterilisation).",
    },
    // ── heading: IUDs ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'IUDs — A Small Device Inside the Uterus',
      objective: "By the end of this you can name the three kinds of IUD with their examples, and explain how copper ions and released hormones each stop a pregnancy.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "An **Intra Uterine Device (IUD)** is a small object that a **doctor or expert nurse inserts into the uterus through the vagina**. NCERT sorts them into **three kinds**, and the trick is to match each kind to what it releases:\n\n- **Non-medicated IUDs** — release nothing. Example: the **Lippes loop**.\n- **Copper releasing IUDs** — release **copper (Cu) ions**. Examples: **CuT, Cu7, Multiload 375**.\n- **Hormone releasing IUDs** — release **hormones**. Examples: **Progestasert, LNG-20**.\n\nNow the mechanism, which is the same starting point for all of them and then adds on. **Every IUD increases the phagocytosis of sperms within the uterus** — the uterus becomes a hostile place where sperms are engulfed and destroyed. On top of that, the **copper-releasing IUDs release Cu ions that suppress sperm motility and the fertilising capacity of sperms** — the sperm can't swim well and can't fertilise. The **hormone-releasing IUDs go one step further**: they **make the uterus unsuitable for implantation and make the cervix hostile to sperms**.\n\nIUDs are **ideal for women who want to delay pregnancy or space their children**, and they are **one of the most widely accepted methods of contraception in India**.",
    },
    // ── interactive image: IUD in the uterus ─────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Cutaway front view of a T-shaped copper IUD sitting inside the uterine cavity, with copper wire on the stem and threads passing down through the cervix',
      caption: '📸 Tap each dot to see how an IUD sits in the uterus and where it acts (NCERT Fig 3.1)',
      generation_prompt: "Scientific textbook illustration of an intra uterine device (IUD) in place. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions. Show a front cutaway of the female uterus: the pear-shaped uterine cavity opening into the two horns at the top where the fallopian tubes begin, narrowing at the base into the cervix. Inside the cavity sits a T-shaped Copper-T IUD: a vertical stem and two short arms forming the top of the T, positioned so the arms sit high near the tube openings. A fine copper wire is drawn coiled tightly around the vertical stem, tinted warm copper-brown. Two thin threads (the retrieval strings) hang from the base of the stem, passing down through the cervix into the top of the vagina. The uterine wall soft pink/magenta (animal soft tissue), the copper wire warm copper tone. No baked-in text labels, no photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.28, label: 'T-shaped frame', icon: 'circle',
          detail: 'The device is inserted **into the uterus through the vagina** by a doctor or expert nurse. Its very presence **increases phagocytosis of sperms within the uterus** — this is what *every* IUD does, medicated or not (e.g. the non-medicated **Lippes loop**).' },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Copper wire', icon: 'circle',
          detail: 'On **copper-releasing IUDs (CuT, Cu7, Multiload 375)**, the coiled wire releases **Cu ions** that **suppress sperm motility and the fertilising capacity of sperms** — the sperm can no longer swim well or fertilise the egg.' },
        { id: uuid(), x: 0.28, y: 0.22, label: 'Uterine wall', icon: 'circle',
          detail: 'A **hormone-releasing IUD (Progestasert, LNG-20)** releases hormones that make the **uterus unsuitable for implantation**, so even a fertilised egg cannot embed here. This is the extra action on top of phagocytosis.' },
        { id: uuid(), x: 0.5, y: 0.8, label: 'Cervix', icon: 'circle',
          detail: 'Hormone-releasing IUDs also make the **cervix hostile to sperms**, adding a second barrier at the neck of the uterus. IUDs are ideal for women who want to **delay or space** pregnancy and are **among the most accepted methods in India**.' },
      ],
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A woman is fitted with a Progestasert IUD. Apart from the phagocytosis of sperms that every IUD causes, what extra effects does this particular device add — and which action does it NOT rely on?",
      options: [
        "It releases Cu ions that suppress sperm motility and fertilising capacity",
        "It makes the uterus unsuitable for implantation and the cervix hostile to sperms",
        "It permanently blocks the fallopian tube so no egg can pass",
        "It works only by physically blocking the cervix like a diaphragm",
      ],
      correct_index: 1,
      reveal: "Progestasert is a **hormone-releasing IUD**, so on top of the phagocytosis every IUD causes, it **makes the uterus unsuitable for implantation and the cervix hostile to sperms** — those are NCERT's exact added actions for the hormonal type. The tempting trap is the copper option: releasing **Cu ions to suppress sperm motility** is what **copper-releasing IUDs (CuT, Cu7, Multiload)** do, not the hormone-releasing kind. Blocking the fallopian tube is **tubectomy** (surgery), and simply blocking the cervix is a **barrier method** — neither is how an IUD works.",
      difficulty_level: 3,
    },
    // ── heading: hormonal methods ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Hormonal Methods — Pills, Injectables, Implants & the Morning-After',
      objective: "By the end of this you can describe the 21-day pill schedule, how pills stop pregnancy in three ways, and what counts as emergency contraception within 72 hours.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Oral contraceptive pills** are the **oral administration of small doses of either progestogens, or progestogen–estrogen combinations**. They come as **tablets**, which is why everyone just calls them **'pills'**.\n\nThe schedule matters and NEET asks it directly. Pills are **taken daily for 21 days**, **starting preferably within the first five days of the menstrual cycle**. Then comes a **gap of 7 days — during which menstruation occurs** — and the same pattern repeats, cycle after cycle, for as long as the woman wants to prevent conception.\n\nHow do they work? Pills act in **three ways at once**: they **inhibit ovulation** (no egg is released), they **inhibit implantation**, and they **alter the quality of the cervical mucus** so it prevents or retards the entry of sperms. They are **very effective, have lesser side effects, and are well accepted**. The homegrown star here is **Saheli** — a **non-steroidal, 'once a week' pill** with very few side effects and high contraceptive value.\n\nThe **same hormones can also be given as injectables or as implants placed under the skin**. Their **mode of action is similar to the pills**, but their **effective periods are much longer** — you don't have to remember a daily tablet.\n\nOne special use closes this group. **Progestogens, or progestogen–estrogen combinations, or IUDs given within 72 hours of coitus** work very well as **emergency contraceptives** — a way to avoid a possible pregnancy after **rape or casual unprotected intercourse**. The 72-hour window is a favourite exam number.",
    },
    // ── heading: surgical methods ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Surgical Methods — Vasectomy & Tubectomy',
      objective: "By the end of this you can name the male and female sterilisation surgeries, say exactly which tube is cut in each, and explain why they are almost irreversible.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Surgical methods, also called sterilisation**, are a **terminal method** — a permanent choice generally advised when a couple wants **no more pregnancies**. The idea is simple: **surgery blocks gamete transport**, so the sperm and egg can never meet.\n\nThere are two, one for each partner:\n\n- **Vasectomy** — the **male** procedure. A **small part of the vas deferens is removed or tied up**, through a **small incision on the scrotum**. Cut the vas, and sperm can no longer travel out.\n- **Tubectomy** — the **female** procedure. A **small part of the fallopian tube is removed or tied up**, through a **small incision in the abdomen or through the vagina**. Cut the tube, and the egg can no longer pass down to be fertilised.\n\nThese techniques are **highly effective, but their reversibility is very poor** — that is the whole point of calling them 'terminal'. Once done, going back is extremely difficult, which is why they suit couples who are sure their family is complete.\n\nWith the three families now on the table — devices, hormones, surgery — the next page turns to what happens when contraception isn't used in time: the Medical Termination of Pregnancy (MTP) and its rules.",
    },
    // ── comparison card: the three families ──────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11, title: 'IUD vs Hormonal vs Surgical',
      columns: [
        { heading: 'IUDs', points: [
          'Examples: Lippes loop (non-medicated); CuT, Cu7, Multiload 375 (copper); Progestasert, LNG-20 (hormonal)',
          'Mechanism: increase phagocytosis of sperms; Cu ions suppress sperm motility & fertilising capacity; hormonal ones also make the uterus unfit for implantation and the cervix hostile',
          'Reversibility: REVERSIBLE — ideal to delay or space children; can be removed',
        ] },
        { heading: 'Hormonal (pills / injectables / implants)', points: [
          'Examples: progestogen or progestogen–estrogen pills, Saheli (once-a-week, non-steroidal); injectables & implants',
          'Mechanism: inhibit ovulation, inhibit implantation, alter cervical mucus to bar sperm entry',
          'Reversibility: REVERSIBLE — stop taking and fertility returns; implants/injectables last longer than daily pills',
        ] },
        { heading: 'Surgical (sterilisation)', points: [
          'Vasectomy (male): part of vas deferens removed/tied via scrotal incision. Tubectomy (female): part of fallopian tube removed/tied via abdomen or vagina',
          'Mechanism: blocks gamete transport so sperm and egg cannot meet',
          'Reversibility: POOR — terminal method, highly effective but very hard to reverse',
        ] },
      ],
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **IUD types → examples:** non-medicated = **Lippes loop**; copper = **CuT, Cu7, Multiload 375**; hormone = **Progestasert, LNG-20**.\n- **Copper IUD acts via Cu ions** (suppress sperm motility & fertilising capacity). **Hormone IUD adds:** uterus unfit for implantation + cervix hostile. **Every IUD** increases **phagocytosis of sperms**.\n- **Pill schedule:** daily for **21 days**, start within **first 5 days** of the cycle, then a **7-day gap** (menstruation). Pills **inhibit ovulation, inhibit implantation, alter cervical mucus**.\n- **Emergency contraception = within 72 hours** of coitus (progestogens / progestogen–estrogen / IUDs).\n- **Vasectomy = vas deferens (male, scrotum). Tubectomy = fallopian tube (female, abdomen/vagina).** Both are **highly effective but poorly reversible**.\n- **Reversible:** IUDs, pills, injectables, implants. **Poorly reversible / terminal:** vasectomy & tubectomy.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Match the IUD to its action:** NEET loves 'which IUD does what.' Copper IUD → **Cu ions suppress sperm motility/fertilising capacity**; hormone IUD → **uterus unfit for implantation + cervix hostile**; all IUDs → **phagocytosis of sperms**.\n\n**The two numbers:** pills = **21 days + 7-day gap, started within first 5 days**; emergency contraception = **within 72 hours**. Both are frequently tested.\n\n**Vasectomy vs tubectomy:** male = **vas deferens**, female = **fallopian tube**. A classic trap swaps the tube or the sex.\n\n**Saheli:** non-steroidal, **once-a-week** pill, developed at **CDRI Lucknow**.\n\n**Reversibility is the sorting question:** IUDs and all hormonal methods are **reversible**; surgical sterilisation is **terminal / poorly reversible**.\n\n**Classic NEET question:** \"Which contraceptive method has very poor reversibility?\" → **Surgical methods (vasectomy / tubectomy)** — not IUDs or pills, which are reversible.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which contraceptive methods are reversible, and which is the terminal (poorly reversible) one?',
          options: [
            'IUDs are terminal, while vasectomy and tubectomy are fully reversible',
            'Only oral pills are reversible; IUDs and implants are terminal methods',
            'IUDs, pills, injectables and implants are reversible; vasectomy and tubectomy are poorly reversible',
            'All contraceptive methods, including sterilisation, are equally reversible',
          ],
          correct_index: 2,
          explanation: "NCERT lists IUDs, pills, injectables and implants as reversible — they can be stopped or removed and fertility returns — which is why IUDs are recommended to delay or space children. Surgical sterilisation (vasectomy and tubectomy) is a terminal method that is highly effective but has very poor reversibility. The trap swaps this around: it is the surgery, not the IUD, that is terminal.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A copper-releasing IUD such as CuT prevents pregnancy mainly by:',
          options: [
            'Releasing Cu ions that suppress sperm motility and the fertilising capacity of sperms',
            'Permanently removing a part of the vas deferens',
            'Being taken as a tablet daily for 21 days to inhibit ovulation',
            'Releasing hormones that make the cervix hostile only, with no effect on sperms in the uterus',
          ],
          correct_index: 0,
          explanation: "A copper-releasing IUD works by releasing Cu ions that suppress sperm motility and fertilising capacity (on top of the phagocytosis every IUD causes). Removing part of the vas deferens is vasectomy; the 21-day tablet is the oral pill; and making the cervix hostile to sperms is the extra action of a hormone-releasing IUD, not the copper one — and even that comes with increased phagocytosis in the uterus.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about oral contraceptive pills is correct as per NCERT?',
          options: [
            'They must be taken continuously without any break, every day of the year',
            'They contain progestogens or progestogen–estrogen combinations and work only by blocking the cervix physically',
            'They are inserted surgically and cannot be reversed',
            'They are taken daily for 21 days and inhibit ovulation, inhibit implantation, and alter cervical mucus',
          ],
          correct_index: 3,
          explanation: "Pills are taken daily for 21 days (started within the first five days of the cycle), followed by a 7-day gap during which menstruation occurs, and they act in three ways — inhibiting ovulation, inhibiting implantation, and altering cervical mucus. They are not taken non-stop, they are hormonal (not a physical cervical block), and they are oral and reversible, not surgical.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Emergency contraception, to be effective, must be administered within:',
          options: [
            '21 days of coitus, using surgical sterilisation',
            '72 hours of coitus, using progestogens, progestogen–estrogen combinations or IUDs',
            'The first 5 days of the menstrual cycle only, using a diaphragm',
            'Six months of parturition, using lactational amenorrhea',
          ],
          correct_index: 1,
          explanation: "NCERT states that progestogens or progestogen–estrogen combinations or IUDs given within 72 hours of coitus are very effective emergency contraceptives, useful after rape or casual unprotected intercourse. The 21-day figure belongs to the pill schedule (not surgery), the first-5-days point is when the regular pill course begins, and lactational amenorrhea is a natural method effective up to six months after childbirth — none of those is the emergency window.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
