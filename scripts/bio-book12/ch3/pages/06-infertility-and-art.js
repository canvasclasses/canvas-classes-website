'use strict';
/**
 * Class 12 Biology — Chapter 3: Reproductive Health
 * Page 6 (closing page) — Infertility & Assisted Reproductive Technologies.
 *
 * Source of truth: NCERT Class 12 Ch.3 (lebo103.txt), section 3.5 INFERTILITY.
 * Rule 0: every fact traces to that text — the six causes of infertility
 * (physical, congenital, diseases, drugs, immunological, psychological), the
 * "male partner more often" line, IVF + embryo transfer ("test tube baby"),
 * the 8-blastomere cut-off deciding ZIFT (fallopian tube) vs IUT (uterus),
 * GIFT (a donor OVUM into another female's fallopian tube), ICSI (sperm
 * injected into the ovum) and AI / IUI. Nothing invented.
 *
 * Rule 0 note on the fun_fact: NCERT does NOT name the first test-tube baby
 * (no Louise Brown / no Durga-Kanupriya, no year). So the fun_fact is anchored
 * on the "test tube baby" NAME itself — which NCERT does use — and its real
 * meaning (fertilisation outside the body, then the embryo returned to the
 * mother). No person or date is asserted, because NCERT gives none.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'infertility-and-assisted-reproduction',
  title: 'Infertility & Assisted Reproductive Technologies',
  subtitle: "Some couples can't have a child no matter how long they try. This closing page is about why that happens — and the lab techniques (IVF, ZIFT, IUT, GIFT, ICSI, AI) that can hand them one.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['infertility', 'assisted-reproductive-technologies', 'ivf', 'zift', 'gift', 'icsi', 'reproductive-health'],
  glossary: [
    { term: 'infertility', definition: 'The inability of a couple to produce children despite unprotected sexual co-habitation. The cause can lie with either partner.' },
    { term: 'IVF', definition: 'In vitro fertilisation — fertilisation carried out outside the body, in the lab, under conditions almost like those inside the body. Followed by embryo transfer, it is the "test tube baby" programme.' },
    { term: 'ZIFT', definition: 'Zygote intra fallopian transfer — the zygote or an early embryo of up to 8 blastomeres is placed into the fallopian tube.' },
    { term: 'IUT', definition: 'Intra uterine transfer — an embryo with more than 8 blastomeres is placed into the uterus.' },
    { term: 'GIFT', definition: 'Gamete intra fallopian transfer — an ovum collected from a donor is transferred into the fallopian tube of another female who cannot make an ovum of her own but can support fertilisation and development.' },
    { term: 'ICSI', definition: 'Intra cytoplasmic sperm injection — a single sperm is injected directly into the ovum in the lab to form an embryo.' },
    { term: 'artificial insemination', definition: 'A technique (AI) in which semen from the husband or a healthy donor is introduced artificially into the vagina or, in IUI, into the uterus of the female. Used for male inability to inseminate or very low sperm count.' },
  ],
  blocks: [
    {
      id: '3f8a1c2e-6b4d-4e91-a7c3-5d2e8f0a1b34',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A quiet lab bench at night: a warm-lit dish under a microscope, a couple shown as soft silhouettes waiting in the background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm, hopeful scene inside a small fertility laboratory at night. In the foreground, a single shallow glass culture dish sits under the warm pool of light of a microscope lamp — the quiet centre of the image, glowing amber. Softly out of focus in the background, a couple sit close together as gentle warm-lit silhouettes, waiting, none of them the sharp focal subject. The whole frame reads as science in service of longing and hope, not clinical coldness. One warm amber light source tying the composition together, deep naturalistic dark background tones throughout (#0a0a0a base), painterly atmospheric illustration style, no text, no labels, no diagram elements, tasteful and respectful.",
    },
    {
      id: '7c2b9e1a-4f83-4a26-b5d1-9e0c3a6f2d78',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Baby That Was Never in a Tube',
      markdown: "The most famous phrase in this whole topic is a bit of a lie. We call it the **test tube baby** programme — but no baby ever grows in a tube. What actually happens is that the egg and the sperm are brought together **outside the body**, in a lab dish, in conditions kept almost exactly like the inside of the body. That's all *in vitro* means: \"in glass.\" Once a tiny embryo forms, it's placed **back inside the mother** to grow the normal way for the next nine months. The lab only does the one step the couple's body couldn't — the meeting of egg and sperm.",
    },
    {
      id: 'a1d4f6b8-2c39-4b7e-8f01-6a5c9d3e2b41',
      type: 'text',
      order: 2,
      markdown: "A chapter on reproductive health can't end without this. Around the world, and in India too, a large number of couples are **infertile** — they are unable to produce children **inspite of unprotected sexual co-habitation**. That last part matters: this isn't about couples who are choosing to wait or using contraception. These are couples who want a child, who are trying, and for whom it simply isn't happening.\n\nHere's the honest part NCERT insists on. In India, the woman is often blamed the moment a couple stays childless. But **more often than not, the problem lies with the male partner.** Infertility has nothing to do with fault or blame — it's a medical condition, and the first job of an infertility clinic is to find out *where* the block actually is.",
    },
    {
      id: 'e9c3a7d2-5b16-4f84-9a2d-1c8b0e5f3a67',
      type: 'heading',
      order: 3,
      level: 2,
      text: "Why a Couple May Stay Childless",
      objective: "By the end of this you can list the six kinds of reasons NCERT gives for infertility — and explain why a clinic tries to correct the cause before turning to ART.",
    },
    {
      id: '2b6d8f0a-9c41-4e73-b1a5-7d3e6c2f9048',
      type: 'text',
      order: 4,
      markdown: "NCERT groups the reasons into six kinds, and it's worth holding all six:\n\n- **Physical** — something in the body's structure or working that gets in the way.\n- **Congenital** — a defect present from birth.\n- **Diseases** — an illness that damages the reproductive organs or their function.\n- **Drugs** — the effect of certain drugs on fertility.\n- **Immunological** — the body's own immune system working against the gametes or the process.\n- **Psychological** — even the mind and emotional state can be a cause.\n\nSpecialised **infertility clinics** exist to diagnose these and, where possible, treat them — and many couples are helped this way. But sometimes the cause **can't be corrected**. For those couples, medicine offers a second route: a set of special techniques known as **assisted reproductive technologies (ART)**, which step in and do the part the body can't.",
    },
    {
      id: '8d1f3a5c-7b29-4064-a3e8-2f6b0d9c1e47',
      type: 'heading',
      order: 5,
      level: 2,
      text: "The ART Toolkit — Six Techniques, and the One Thing That Sets Them Apart",
      objective: "By the end of this you can name each ART technique, say exactly what is done, and — the part NEET loves — say precisely where the gamete or embryo is put.",
    },
    {
      id: '4a7c2e9d-1b83-4f56-9c02-6e8a3d5b7f10',
      type: 'text',
      order: 6,
      markdown: "Start with the flagship. **In vitro fertilisation (IVF)** means fertilisation done outside the body, and it's followed by **embryo transfer (ET)** — together this is the test tube baby programme. Ova from the wife (or a donor) and sperms from the husband (or a donor) are collected and induced to **form a zygote under simulated conditions in the lab**.\n\nNow comes the step students most often get wrong, so read it slowly. Once that embryo exists, where does it go? **It depends on how far it has divided:**\n\n- If it's still a **zygote or an early embryo — up to 8 blastomeres** — it is transferred into the **fallopian tube**. This is **ZIFT** (zygote intra fallopian transfer).\n- If it's a **later embryo with more than 8 blastomeres**, it goes into the **uterus**. This is **IUT** (intra uterine transfer).\n\nSo one cut-off — **8 blastomeres** — decides fallopian tube versus uterus. (And embryos formed the natural way, *in vivo*, can be used for these transfers too, to help a woman who cannot conceive on her own.)",
    },
    {
      id: 'c5e8b1a3-6d92-4074-8b3f-0a2c7e9d4165',
      type: 'text',
      order: 7,
      markdown: "The other techniques each fix a *different* specific problem:\n\n- **GIFT (gamete intra fallopian transfer)** is for a woman who **cannot produce an ovum** of her own but whose body can still host fertilisation and pregnancy. An **ovum from a donor** is transferred into **her fallopian tube**. Notice what is moved here: a **gamete** — an unfertilised egg — not an embryo. That single word is the whole trap, because GIFT and ZIFT both target the fallopian tube.\n- **ICSI (intra cytoplasmic sperm injection)** is the ultra-precise one: a **single sperm is injected directly into the ovum** to build an embryo in the lab. It's the answer when sperm can't fertilise on their own.\n- **AI (artificial insemination)** is for a male who cannot inseminate the female, or whose ejaculate has a **very low sperm count**. Semen — from the husband or a healthy donor — is introduced artificially into the **vagina**, or into the **uterus**, which is then called **IUI (intra-uterine insemination)**.\n\nAll of these need extremely precise handling and expensive equipment, so they exist in only a few centres and reach only a limited number of people. That's exactly why NCERT reminds us that **legal adoption** remains one of the best options for couples looking for parenthood.",
    },
    {
      id: '9f2a6c4e-3b71-4d85-a0c9-5e8b1f3d7a62',
      type: 'table',
      order: 8,
      caption: "The six ART techniques at a glance — what is done, and (the NEET part) where the gamete or embryo is placed.",
      headers: ['Technique', 'Full form', 'What is done', 'Where it is placed'],
      rows: [
        ['IVF + ET', 'In vitro fertilisation + embryo transfer', 'Ova and sperms are collected; a zygote is formed outside the body under lab conditions ("test tube baby")', 'Embryo returned to the woman — by ZIFT or IUT'],
        ['ZIFT', 'Zygote intra fallopian transfer', 'A zygote or early embryo of up to 8 blastomeres is transferred', 'Into the fallopian tube'],
        ['IUT', 'Intra uterine transfer', 'A later embryo, with more than 8 blastomeres, is transferred', 'Into the uterus'],
        ['GIFT', 'Gamete intra fallopian transfer', 'An ovum (a gamete, not an embryo) from a donor is transferred', 'Into the fallopian tube of a female who cannot make an ovum'],
        ['ICSI', 'Intra cytoplasmic sperm injection', 'A single sperm is injected directly into the ovum to form an embryo in the lab', 'Embryo then transferred to the woman'],
        ['AI / IUI', 'Artificial insemination / intra-uterine insemination', 'Semen from the husband or a healthy donor is introduced artificially (for low sperm count or inability to inseminate)', 'Into the vagina, or into the uterus (IUI)'],
      ],
    },
    {
      id: '6b3d9e1a-8c47-4f20-b5e6-2a9c0d7f4b83',
      type: 'reasoning_prompt',
      order: 9,
      reasoning_type: 'logical',
      prompt: "A woman cannot produce an ovum of her own, but her fallopian tubes and uterus are perfectly capable of supporting a pregnancy. A donor ovum is placed directly into her fallopian tube. Which technique is this — and why is it NOT ZIFT, even though ZIFT also targets the fallopian tube?",
      options: [
        "ZIFT — anything transferred into the fallopian tube is ZIFT by definition",
        "IUT — because a donor was involved, the transfer must go to the uterus",
        "GIFT — a gamete (an unfertilised ovum) is being transferred, whereas ZIFT transfers an already-formed zygote or embryo",
        "ICSI — a donor ovum always means a sperm was injected into it first",
      ],
      correct_index: 2,
      reveal: "This is GIFT. The destination is the same as ZIFT — the fallopian tube — so the destination alone can't tell them apart. The deciding question is *what* is being moved. GIFT transfers a **gamete**: an unfertilised ovum from a donor. ZIFT transfers a **zygote or early embryo** that has already formed after fertilisation. The tempting wrong answer is the first one — 'fallopian tube = ZIFT' — but that only tracks the where, not the what. Fertilisation hasn't happened yet in GIFT; it has in ZIFT.",
      difficulty_level: 3,
    },
    {
      id: '1e7a4c2b-5d96-4083-9f1a-8c3e6b0d2f57',
      type: 'callout',
      order: 10,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "1. **Infertility** = unable to produce children *inspite of unprotected sexual co-habitation* — and **more often the male partner** is the cause, not the female.\n2. **Six causes:** physical, congenital, diseases, drugs, immunological, psychological.\n3. **IVF + ET = the test tube baby programme** — fertilisation *outside* the body, embryo then returned to the mother.\n4. **The 8-blastomere rule:** up to 8 blastomeres → **fallopian tube (ZIFT)**; more than 8 → **uterus (IUT)**.\n5. **GIFT moves a gamete** (a donor ovum) into the fallopian tube; **ZIFT moves a zygote/embryo** into the fallopian tube. Same place, different cargo.\n6. **ICSI** = one sperm injected straight into the ovum. **AI/IUI** = semen introduced into the vagina or uterus (for low sperm count).",
    },
    {
      id: 'b8c1f3a6-2e94-4d75-8a0b-7f5c9e2d1a46',
      type: 'callout',
      order: 11,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Expand every acronym exactly:** ZIFT = *zygote* intra fallopian transfer, GIFT = *gamete* intra fallopian transfer, IUT = intra *uterine* transfer, ICSI = intra *cytoplasmic* sperm injection, IUI = intra-uterine *insemination*. NEET swaps one word (zygote↔gamete, uterine↔fallopian) and calls it a new option.\n\n**The 8-blastomere cut-off is a favourite:** ≤ 8 blastomeres → fallopian tube (ZIFT); > 8 blastomeres → uterus (IUT).\n\n**ZIFT vs GIFT:** both go to the fallopian tube, so the destination is a decoy. ZIFT = zygote/embryo (fertilisation done); GIFT = gamete, a donor ovum (fertilisation not yet done).\n\n**GIFT is for the woman who can't make an ovum** but can support pregnancy — the donor ovum goes into *her* fallopian tube.\n\n**Classic NEET question:** \"An embryo with more than 8 blastomeres is transferred into the ___ , a procedure called ___.\" → the **uterus**, called **IUT** (intra uterine transfer).",
    },
    {
      id: 'd4a9c2e7-6b13-4f88-a5c0-3e9b1d7f2c60',
      type: 'text',
      order: 12,
      markdown: "And that closes the chapter. Reproductive health turned out to be far wider than working organs — it's awareness and sex education, the birth-control choices a society makes, the strict law around MTP, protection from STIs, and finally the science that helps couples who long for a child but can't have one on their own. Every one of these is really the same idea seen from a different side: giving people the knowledge and the care to make their own reproductive choices, safely. That is what a reproductively healthy society looks like.",
    },
    {
      id: '5c8e1b3a-9d47-4062-b7f1-0a6c2e8d5b93',
      type: 'inline_quiz',
      order: 13,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'a3f6c9d2-1b84-4e57-9c03-6d8a2f5b7e40',
          question: "After IVF, an early embryo of up to 8 blastomeres is available for transfer. According to NCERT, where is it placed, and what is the procedure called?",
          options: [
            "Into the uterus — the procedure is IUT",
            "Into the vagina — the procedure is IUI",
            "Into the fallopian tube — the procedure is ZIFT",
            "Into the fallopian tube — the procedure is GIFT",
          ],
          correct_index: 2,
          explanation: "Up to 8 blastomeres means the fallopian tube, and transferring a zygote or early embryo there is ZIFT. It isn't IUT — that's for embryos with more than 8 blastomeres, and IUT targets the uterus. And it isn't GIFT: GIFT moves an unfertilised donor ovum (a gamete), not an already-formed embryo.",
          difficulty_level: 2,
        },
        {
          id: '7e2b5d8a-4c91-4f63-b0a7-3c6e9d1f2a58',
          question: "GIFT and ZIFT both deliver into the fallopian tube. What actually distinguishes them?",
          options: [
            "GIFT transfers a gamete (a donor ovum); ZIFT transfers a zygote or early embryo",
            "GIFT goes into the uterus while ZIFT goes into the fallopian tube",
            "GIFT is done for men with a low sperm count; ZIFT is done for women",
            "GIFT injects a sperm into the ovum; ZIFT introduces semen into the vagina",
          ],
          correct_index: 0,
          explanation: "The destination is identical, so it can't be the difference — the difference is the cargo. GIFT (gamete intra fallopian transfer) moves an unfertilised ovum from a donor; ZIFT (zygote intra fallopian transfer) moves an already-formed zygote/embryo. The 'GIFT goes into the uterus' option is the trap — that describes IUT, not GIFT. Injecting a sperm into the ovum is ICSI, and introducing semen into the vagina is AI/IUI.",
          difficulty_level: 2,
        },
        {
          id: 'f1c4a7e9-8b23-4d06-a5f2-9e0c3b7d6142',
          question: "A couple is infertile because the man has a very low sperm count and cannot inseminate his partner. Which technique introduces semen from the husband or a healthy donor artificially into the female tract?",
          options: [
            "ICSI — intra cytoplasmic sperm injection",
            "GIFT — gamete intra fallopian transfer",
            "IUT — intra uterine transfer",
            "AI — artificial insemination (introduced into the vagina or, as IUI, the uterus)",
          ],
          correct_index: 3,
          explanation: "Low sperm count or inability to inseminate is exactly what artificial insemination (AI) addresses — semen from the husband or a donor is introduced into the vagina, or into the uterus as IUI. ICSI is different: it injects a single sperm directly into the ovum in the lab. GIFT transfers a donor ovum, and IUT transfers an embryo of more than 8 blastomeres into the uterus — neither introduces semen.",
          difficulty_level: 2,
        },
        {
          id: '2d9a6c3e-5b71-4f84-8c0a-1e7b9d2f5a63',
          question: "Which statement about infertility and ART matches NCERT?",
          options: [
            "Infertility is almost always the fault of the female partner",
            "In couples who stay childless, more often than not the problem lies with the male partner",
            "'Test tube baby' means the child is grown to term inside a laboratory tube",
            "ICSI is performed by introducing semen into the uterus of the female",
          ],
          correct_index: 1,
          explanation: "NCERT states plainly that although the female is often blamed in India, more often than not the problem lies with the male partner. Infertility is not almost always the female's fault (option 1 is the very myth NCERT corrects), 'test tube baby' refers to fertilisation done outside the body with the embryo returned to the mother (nothing is grown to term in a tube), and ICSI is injecting a single sperm into the ovum — introducing semen into the uterus is IUI, not ICSI.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
