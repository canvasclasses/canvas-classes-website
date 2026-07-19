'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'birth-control-natural-and-barrier-methods',
  title: 'Birth Control I — Natural & Barrier Methods',
  subtitle: "Why India pushed for smaller families, what makes a contraceptive 'ideal', and the first two families of methods — natural ones that time or avoid intercourse, and barriers that physically keep the sperm and ovum apart.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['reproductive-health', 'contraception', 'birth-control', 'natural-methods', 'barrier-methods', 'population'],
  glossary: [
    { term: 'contraception', definition: 'The deliberate prevention of an unwanted pregnancy, using methods or devices that keep the ovum and sperm from meeting or from producing a pregnancy.' },
    { term: 'periodic abstinence', definition: 'A natural method in which the couple avoids coitus from day 10 to day 17 of the menstrual cycle — the fertile period, when ovulation is expected and chances of fertilisation are very high.' },
    { term: 'coitus interruptus', definition: 'The withdrawal method — the male partner withdraws his penis from the vagina just before ejaculation so that semen is not deposited and insemination is avoided.' },
    { term: 'lactational amenorrhea', definition: 'Absence of menstruation during the period of intense breast-feeding after childbirth. Ovulation and the menstrual cycle do not occur, so chances of conception are almost nil — but only up to about six months after delivery.' },
    { term: 'barrier method', definition: 'A contraceptive that works by physically preventing the ovum and sperms from meeting, using a barrier such as a condom, diaphragm, cervical cap or vault.' },
    { term: 'spermicide', definition: 'A spermicidal cream, jelly or foam used along with barrier devices to kill sperms and increase the contraceptive efficiency of the barrier.' },
    { term: 'fertile period', definition: 'The stretch of the menstrual cycle (about day 10 to day 17) when ovulation is expected and the chance of fertilisation is very high.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A quiet evening street where a large, crowded skyline slowly gives way to a single small home with a couple and two children, under one warm light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm dusk cityscape: on the left, a dense, towering silhouette of a hugely overcrowded skyline of countless small dwellings packed tightly together, fading into haze — a feeling of unchecked crowding. As the eye moves right, the crowding thins and opens into breathing space, ending at a single small, warmly lit home where a couple stands with two children as gentle silhouettes. One soft warm light glows over the small home, tying the scene together and suggesting calm and choice rather than pressure. Painterly, atmospheric illustration, deep dusk tones throughout on a dark background (#0a0a0a base), no text, no labels, no diagram elements, no slogans.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two Numbers That Scared a Country',
      markdown: "In **1900** the whole world held about **2 billion** people. By **2000** it had rocketed to about **6 billion**, and by **2011** to **7.2 billion**. India ran the same race — roughly **350 million** at Independence, close to a **billion** by 2000, and past **1.2 billion** by May 2011. That is the story behind the poster you have almost certainly seen — a smiling couple with two children and the line **Hum Do Hamare Do** ('we two, our two'). It was not just an advertisement. It was a country trying to slow a number before that number ran out of food, shelter and clothing to hand around.",
    },
    // ── core concept: why population control matters ─────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Here is the puzzle. In the last century, **better health facilities and better living conditions** made life longer and safer — which sounds like nothing but good news. But it had an **explosive impact on population growth**. A **rapid fall in the death rate**, in the **maternal mortality rate (MMR)** and in the **infant mortality rate (IMR)**, plus **more people entering the reproductive age**, meant many more babies were being born and far fewer people were dying young. The population climbed fast.\n\nEven with the **Reproductive and Child Health (RCH) programme**, the growth rate came down only **marginally**. The **2011 census** put it at **less than 2 per cent — that is 20 out of every 1000 people per year**. That may sound small, but at that rate the population still **increases rapidly**, and an alarming growth rate could push the country into an **absolute scarcity of even the basic needs — food, shelter and clothing**. So the government stepped in.\n\nThe **most important step** was to **motivate smaller families** using **contraceptive methods**. Alongside that came other measures: **raising the statutory marriageable age** to **18 for women and 21 for men**, and giving **incentives to couples with small families**. The rest of this page is about the tools that make 'a smaller family' an actual choice — contraceptives that prevent unwanted pregnancies.",
    },
    // ── heading: ideal contraceptive ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: "What Makes a Contraceptive 'Ideal'",
      objective: "By the end of this you can list the exact qualities NCERT demands of an ideal contraceptive — and spot the one about sexual drive that students always forget.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Before we meet the methods, fix the yardstick they are all judged against. NCERT lays out what an **ideal contraceptive** should be, and it is worth memorising word for word because it is a favourite fill-in-the-blank:\n\n- **User-friendly** — easy for an ordinary person to use.\n- **Easily available** — you can actually get hold of it.\n- **Effective** — it reliably prevents pregnancy.\n- **Reversible** — you can stop using it and fertility returns; it should not permanently end the ability to have children.\n- **With no or least side-effects** — it should not harm the body.\n\nAnd the one condition students always drop: an ideal contraceptive should **in no way interfere with the sexual drive, desire or the sexual act** of the user. Keep all six in mind — as we go through the methods, you will see each one score well on some of these and badly on others. No single method is perfect on every count.",
    },
    // ── heading: natural methods ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Natural (Traditional) Methods — Timing and Avoiding',
      objective: "By the end of this you can explain how periodic abstinence, coitus interruptus and lactational amenorrhea each stop the ovum and sperm from meeting — and why 'no devices' cuts both ways.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Natural methods share one simple principle: **avoid the chance of the ovum and the sperms meeting**. No devices, no medicines — just timing and behaviour. There are three.\n\n**Periodic abstinence.** The couple **abstains from coitus from day 10 to day 17 of the menstrual cycle**, because **ovulation is expected in this window** and the chance of fertilisation is very high. This stretch is called the **fertile period**. Skip intercourse during it, and conception can be prevented.\n\n**Withdrawal, or coitus interruptus.** Here the **male partner withdraws his penis from the vagina just before ejaculation**, so the semen is never deposited inside — insemination is avoided.\n\n**Lactational amenorrhea.** *Amenorrhea* means absence of menstruation. This method rests on a real fact of the body: during **intense breast-feeding after childbirth (parturition), ovulation and the menstrual cycle do not occur**. So as long as the mother **fully breast-feeds** the child, the chance of conception is **almost nil** — but here is the catch NCERT insists on: it works only **up to a maximum of about six months** after delivery.\n\nBecause **no medicines or devices** are used, the **side-effects are almost nil** — that is the big appeal. The trade-off is honesty about failure: the **chances of these methods failing are high**, because they depend entirely on perfect timing and self-control.",
    },
    // ── heading: barrier methods ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Barrier Methods — A Physical Wall',
      objective: "By the end of this you can describe how condoms, diaphragms, cervical caps and vaults block sperm — and name the one barrier that also guards against STIs and AIDS.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Barrier methods do exactly what the name says: they put a **physical barrier** between the ovum and the sperms so the two cannot meet. They exist for **both males and females**.\n\n**Condoms.** These are **thin sheaths of rubber or latex** used to cover the **penis in the male**, or the **vagina and cervix in the female**, just before coitus — so the **ejaculated semen never enters the female reproductive tract**. **'Nirodh'** is a well-known Indian brand of male condom. Condom use has grown for one extra reason that goes beyond birth control: it **also protects the user from sexually transmitted infections (STIs) and AIDS**. Both male and female condoms are **disposable**, can be **self-inserted**, and so give the user **privacy**.\n\n**Diaphragms, cervical caps and vaults.** These are **barriers made of rubber that are inserted into the female reproductive tract to cover the cervix** during coitus. They prevent conception by **blocking the entry of sperms through the cervix**. Unlike condoms, they are **reusable**.\n\n**Spermicides.** To make these barriers more reliable, **spermicidal creams, jellies and foams** are used **along with** them. They do not replace the barrier — they **increase its contraceptive efficiency** by killing sperms that get past. Now line the natural and barrier families side by side before we test them.",
    },
    // ── comparison card: natural vs barrier ──────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Natural vs Barrier Methods',
      columns: [
        {
          heading: 'Natural / Traditional',
          points: [
            'How it works: avoids the chance of ovum and sperms meeting by timing or behaviour, not by any object.',
            'Members: periodic abstinence (avoid coitus day 10–17), coitus interruptus/withdrawal, lactational amenorrhea (up to ~6 months).',
            'Reversible: yes — nothing is used, so fertility is untouched; stop any time.',
            'Side-effects: almost nil (no medicines or devices).',
            'STI / AIDS protection: none.',
            'Reliability: failure chances are HIGH — depends fully on timing and self-control.',
          ],
        },
        {
          heading: 'Barrier',
          points: [
            'How it works: puts a physical wall (condom, diaphragm, cap, vault) so ovum and sperms cannot meet.',
            'Members: condoms (male & female — e.g. Nirodh), diaphragms, cervical caps, vaults; spermicides used alongside to boost efficiency.',
            'Reversible: yes — remove the barrier and fertility returns.',
            'Side-effects: minimal; condoms disposable, diaphragms/caps/vaults reusable.',
            'STI / AIDS protection: condoms DO protect against STIs and AIDS (the other barriers do not).',
            'Reliability: more dependable than natural timing; spermicides raise it further.',
          ],
        },
      ],
    },
    // ── reasoning prompt ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A young couple wants a method that prevents pregnancy AND guards them against sexually transmitted infections, including AIDS. Two friends suggest options. Which single method, from what you have read, meets BOTH needs — and why do the others fall short?",
      options: [
        "Periodic abstinence — avoiding coitus on days 10 to 17 keeps them safe from both pregnancy and infection",
        "The diaphragm with a spermicidal jelly — it covers the cervix and the jelly kills any germs",
        "The condom — it is a physical barrier that also protects the user from STIs and AIDS",
        "Lactational amenorrhea — no ovulation means no infection can be passed on either",
      ],
      correct_index: 2,
      reveal: "Only the **condom** does both jobs at once: it is a barrier that prevents the ejaculated semen from entering the female tract, and NCERT specifically notes its **additional benefit of protecting the user from STIs and AIDS**. The diaphragm-plus-spermicide is the tempting trap — it is a genuine barrier and spermicides do kill sperms, but NCERT credits STI/AIDS protection to condoms, not to diaphragms or spermicides, so it fails the infection test. Periodic abstinence and lactational amenorrhea only affect the *chance of fertilisation* by timing; neither puts up any barrier against infection.",
      difficulty_level: 3,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Periodic abstinence = avoid coitus day 10 to 17** (the fertile period). Learn the exact days.\n- **Coitus interruptus = withdrawal of the penis just before ejaculation.** Don't confuse it with abstinence.\n- **Lactational amenorrhea works only up to ~6 months after childbirth**, and only with **full** breast-feeding.\n- **Condoms protect against STIs and AIDS** — the diaphragm, cervical cap and vault do NOT.\n- **Diaphragms, caps and vaults cover the cervix and are reusable; condoms are disposable.**\n- **Spermicides (creams, jellies, foams) are used ALONG WITH barriers** to raise efficiency — they are not a barrier by themselves.\n- Natural methods: side-effects almost nil, but **failure chances high**.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Ideal contraceptive:** NEET lifts this list verbatim — **user-friendly, easily available, effective, reversible, with no/least side-effects, and no interference with sexual drive/desire/act.** The 'sexual drive' clause is the most-missed option.\n\n**Fertile-period days:** '**day 10 to 17**' of the cycle is a stock fill-in-the-blank. Memorise the exact numbers.\n\n**Condom = the STI answer:** if a question asks which contraceptive also prevents STIs/AIDS, it is the **condom**. Nirodh is the brand NCERT names.\n\n**Lactational amenorrhea limit:** the '**up to six months**' cap is a classic trap — a longer duration option is a distractor.\n\n**Reusable vs disposable:** diaphragms/cervical caps/vaults are **reusable**; condoms are **disposable**.\n\n**Classic NEET question:** \"Which contraceptive method provides protection against sexually transmitted infections in addition to preventing conception?\" → **Condom.** Don't pick the diaphragm.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In the periodic abstinence method, the couple avoids coitus during which part of the menstrual cycle, and why?',
          options: [
            'Day 1 to 5, because menstruation is occurring then',
            'Day 10 to 17, because ovulation is expected and fertilisation chances are very high',
            'Day 18 to 28, because the uterine lining is breaking down',
            'Day 6 to 9, because the ovum has just been released and is dying',
          ],
          correct_index: 1,
          explanation: "NCERT fixes the fertile period at day 10 to 17, when ovulation is expected and the chance of fertilisation is very high — so abstaining then prevents conception. Day 1–5 is menstruation (a low-fertility phase, not the one you avoid), and the day 18–28 and day 6–9 options invent reasons that don't match ovulation timing.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which contraceptive method offers the added benefit of protecting the user against STIs and AIDS?',
          options: [
            'Condom',
            'Diaphragm',
            'Cervical cap',
            'Lactational amenorrhea',
          ],
          correct_index: 0,
          explanation: "NCERT singles out the condom for the extra benefit of protecting against STIs and AIDS, because it stops direct contact and the entry of semen into the tract. The diaphragm and cervical cap are barriers too, but NCERT does not credit them with infection protection, and lactational amenorrhea only suppresses ovulation — it is no barrier to infection at all.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Lactational amenorrhea prevents conception because during intense breast-feeding after childbirth:',
          options: [
            'A physical barrier forms across the cervix and blocks sperms',
            'Spermicidal secretions build up in the vagina and kill sperms',
            'The male becomes temporarily infertile after parturition',
            'Ovulation and the menstrual cycle do not occur, so there is no ovum to fertilise',
          ],
          correct_index: 3,
          explanation: "During intense lactation after parturition, ovulation and therefore the menstrual cycle do not occur, so with no ovum released the chance of conception is almost nil — but only up to about six months. It is not a barrier method (no physical block, no spermicide) and it works through the breast-feeding mother's own hormonal state, not any change in the male.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about barrier methods matches NCERT exactly?',
          options: [
            'Diaphragms, cervical caps and vaults are disposable and used only once',
            'Spermicidal creams, jellies and foams are used along with barriers to increase their contraceptive efficiency',
            'Condoms are inserted to cover the cervix and are reusable after washing',
            'Barrier methods work by chemically dissolving the ovum before fertilisation',
          ],
          correct_index: 1,
          explanation: "NCERT states that spermicidal creams, jellies and foams are used alongside barriers to raise their contraceptive efficiency — they assist the barrier, they are not the barrier. Diaphragms, caps and vaults are reusable (not disposable — that describes condoms); condoms cover the penis or vagina/cervix and are disposable, not reusable cervix-covers; and barriers work by physically blocking the ovum and sperm from meeting, not by dissolving the ovum.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
