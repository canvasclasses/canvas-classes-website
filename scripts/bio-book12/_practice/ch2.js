'use strict';
/**
 * Class 12 Biology — Chapter 2 (Human Reproduction)
 * "Practice — NCERT Exercises" page.
 *
 * All 21 NCERT textbook exercises, regrouped from the book's running order into
 * 5 revision themes, each with a full NCERT-faithful worked solution.
 * Authored against ./CONTRACT.md. PROMPT text is verbatim NCERT (Rule 0).
 */

module.exports = {
  slug: 'ch2-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 21 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '5cbde599-cbef-4d28-8168-b15c11360a7a',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Human reproduction — male and female reproductive systems with gametes and the path to fertilisation',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A wide 16:5 hand-drawn coloured educational illustration on a deep charcoal (near-black) dark background, muted earthy palette (warm ochre, dusty teal, soft brick-red, muted sage), NO glow, NO neon, NO 3D render, NO orange tech look. A clean textbook-style composition for Human Reproduction: on the left a simplified labelled human male reproductive system (paired testis, epididymis, vas deferens), in the centre a single sperm swimming toward a large round ovum, on the right a simplified female reproductive system (ovary, fallopian tube, uterus) with a tiny early embryo implanted in the uterine wall. Soft hand-inked outlines, gentle cross-hatched shading, calm scientific mood, plenty of dark negative space, no text labels floating in space. Looks like a page from a beautifully illustrated biology reference book.',
    },
    {
      id: '8c4805ff-cb94-43ad-941a-caece684a536',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 21 NCERT exercises** for Human Reproduction, regrouped out of the textbook's running order into five revision themes: the male system, the female system, the jobs each structure does, the cycles that tie it together, and a few think-it-through questions.\n\nTry each one on your own first. Write your answer, then open the worked solution. The point isn't to check a box — if you got it wrong, the solution should teach you the whole idea, not just hand you the answer.",
    },
    {
      id: '78597961-fb5b-4e56-9125-5a117715085d',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 2.1–2.21',
      intro:
        'Every end-of-chapter NCERT question for Human Reproduction, with a full answer for each. Work top to bottom, or jump to the theme you want to revise.',
      sections: [
        {
          id: '50e1a33e-648e-4b8f-a84b-38344bdc1e50',
          title: 'The male system — sperm, tubules and secretions',
          blurb: 'Where sperm are made, how they mature, and what the glands add.',
          items: [
            {
              kind: 'numerical',
              id: '50265674-9f3e-477a-86d5-2cc5efc8613e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.2',
              prompt: 'Draw a labelled diagram of male reproductive system.',
              answer:
                'A pair of testes in the scrotum, connected through epididymis → vas deferens → ejaculatory duct → urethra → penis, with the accessory glands (seminal vesicle, prostate, bulbourethral glands) opening in.',
              solution:
                "We can't draw here, so picture it and label these parts in order.\n\n**The parts to show and label:**\n\n- **Scrotum** — a pouch of skin outside the abdomen that holds the two testes. It keeps them about 2–2.5 °C cooler than body temperature, which sperm production needs.\n- **Testis** — the paired oval gland where sperm and the male hormone are made. Inside are the coiled seminiferous tubules.\n- **Epididymis** — a highly coiled tube lying along the back of each testis, where sperm are stored and mature.\n- **Vas deferens (ductus deferens)** — the tube that carries sperm up from the epididymis; it loops over the urinary bladder.\n- **Ejaculatory duct** — formed where the vas deferens joins the duct of the seminal vesicle; it opens into the urethra.\n- **Urethra** — the common passage through the penis that carries both semen and urine to the outside.\n- **Penis** — the male external genital organ.\n- **Accessory glands** — a pair of **seminal vesicles**, a **prostate**, and a pair of **bulbourethral (Cowper's) glands**, all emptying their secretions into the tract.\n\nDraw the two testes in the scrotum at the bottom, trace the tube up through the epididymis and vas deferens, show where the seminal vesicle and prostate join near the bladder, and lead the urethra out through the penis.",
            },
            {
              kind: 'numerical',
              id: '35ae2849-1511-46e4-91db-49d7e6864815',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.5',
              prompt: 'Describe the structure of a seminiferous tubule.',
              answer:
                'Each tubule is lined by two cell types — dividing male germ cells (spermatogonia) and tall supporting Sertoli cells; the spaces between tubules hold Leydig (interstitial) cells and blood vessels.',
              solution:
                "Each testis has many compartments (lobules), and every lobule holds one to three coiled **seminiferous tubules** — this is where sperm are actually made.\n\n**Inside the tubule wall**, two kinds of cells sit on the lining:\n\n- **Spermatogonia (male germ cells)** — placed near the outer wall. They divide and, step by step, form sperm. So a single tubule shows all the stages: spermatogonia → primary and secondary spermatocytes → spermatids → sperm, arranged from the wall inward toward the central cavity.\n- **Sertoli cells** — tall cells that stretch from the wall toward the centre. They **nourish and support** the developing germ cells (which is why they're called 'nurse cells').\n\n**Outside the tubules**, in the spaces between them (the interstitial spaces), lie:\n\n- **Leydig cells (interstitial cells)** — they make and secrete the male sex hormones (androgens).\n- **Blood vessels and immune cells.**\n\nSo one line to remember: germ cells and Sertoli cells are *inside* the tubule; Leydig cells are *between* the tubules.",
            },
            {
              kind: 'numerical',
              id: '86bbccea-201f-4727-9f66-03565b0569d6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.6',
              prompt: 'What is spermatogenesis? Briefly describe the process of spermatogenesis.',
              answer:
                'Spermatogenesis is the formation of sperm from immature germ cells in the seminiferous tubules; spermatogonia → primary spermatocyte → (meiosis) → secondary spermatocytes → spermatids → spermatozoa.',
              solution:
                "**Spermatogenesis** is the process by which sperm are produced from the immature male germ cells inside the seminiferous tubules. It begins at puberty.\n\n**The steps:**\n\n1. The **spermatogonia** on the inside wall of the tubule multiply by **mitosis**. Each has the full (diploid, 2n = 46) number of chromosomes.\n2. Some of them grow into **primary spermatocytes** (still 2n).\n3. A primary spermatocyte undergoes the **first meiotic division** to form two **secondary spermatocytes**, each now haploid (n = 23).\n4. Each secondary spermatocyte undergoes the **second meiotic division** to form two **spermatids** — so one primary spermatocyte gives **four haploid spermatids**.\n5. The spermatids are then transformed into **spermatozoa (sperm)** by a process called **spermiogenesis**.\n\nThe sperm heads become embedded in the Sertoli cells, and are finally released from the tubules by **spermiation**. The whole process is switched on and kept going by hormones (see the next question).",
            },
            {
              kind: 'numerical',
              id: '36dd6365-445c-46bd-ac92-bd7bafd25a88',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.7',
              prompt: 'Name the hormones involved in regulation of spermatogenesis.',
              answer:
                'GnRH (hypothalamus) → LH and FSH from the anterior pituitary. LH acts on Leydig cells to make androgens; FSH acts on Sertoli cells.',
              solution:
                "Spermatogenesis is controlled by a chain of hormones.\n\n- **GnRH (Gonadotropin Releasing Hormone)** — released by the **hypothalamus**. It acts on the anterior pituitary.\n- The anterior pituitary then releases two **gonadotropins**:\n  - **LH (Luteinising Hormone)** — acts on the **Leydig cells** and makes them secrete **androgens** (male hormones). The androgens are what actually drive the process of spermatogenesis.\n  - **FSH (Follicle Stimulating Hormone)** — acts on the **Sertoli cells** and makes them secrete factors that help **spermiogenesis** (the changing of spermatids into sperm).\n\nSo the short answer: **GnRH, LH, FSH,** and the **androgens** secreted under LH.",
            },
            {
              kind: 'numerical',
              id: 'db41a725-edba-465b-85ac-b26cc2d82704',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.8',
              prompt: 'Define spermiogenesis and spermiation.',
              answer:
                'Spermiogenesis = the transformation of spermatids into mature spermatozoa. Spermiation = the release of those sperm from the Sertoli cells into the lumen of the seminiferous tubule.',
              solution:
                "These two are back-to-back steps at the end of sperm formation, and students mix them up.\n\n- **Spermiogenesis** — the process in which the **spermatids** (round, immature cells) are **transformed into spermatozoa** (streamlined, tailed, motile sperm). It's the 'shaping' step.\n- **Spermiation** — after they are shaped, the sperm heads stay embedded in the Sertoli cells; **spermiation** is the **release of these mature sperm** from the Sertoli cells into the cavity (lumen) of the seminiferous tubule.\n\nMemory hook: spermio-**genesis** = *making* the sperm; spermi-**ation** = *letting go* of the sperm.",
            },
            {
              kind: 'numerical',
              id: '4c2591c1-d793-4c20-913d-e9822b55fde8',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.9',
              prompt: 'Draw a labelled diagram of sperm.',
              answer:
                'A microscopic cell with a head (acrosome + nucleus), a short neck, a middle piece (packed with mitochondria), and a tail — all covered by the plasma membrane.',
              solution:
                "Picture a tiny cell shaped like a tadpole, and label these four regions.\n\n- **Head** — has two parts:\n  - **Acrosome** — a cap at the very front, filled with enzymes that help the sperm penetrate the egg at fertilisation.\n  - **Nucleus** — the elongated haploid nucleus, carrying the father's chromosomes.\n- **Neck** — a very short region just behind the head; contains the centrioles.\n- **Middle piece** — packed with many **mitochondria** that produce the energy (ATP) needed for the tail to move.\n- **Tail** — the long, whip-like part that lashes to and fro to swim the sperm forward.\n\nThe whole sperm — head, neck, middle piece and tail — is covered by the **plasma membrane**. A human male typically ejaculates about 200–300 million sperm at a time.",
            },
            {
              kind: 'numerical',
              id: '026563c8-e4e5-42dc-b3b5-acd2fbb929f5',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.10',
              prompt: 'What are the major components of seminal plasma?',
              answer:
                'The fluid part of semen (from the accessory glands) — rich in fructose, calcium and certain enzymes.',
              solution:
                "**Semen** = sperm **+** seminal plasma. The **seminal plasma** is the fluid part, supplied mostly by the accessory glands (seminal vesicles, prostate, bulbourethral glands).\n\nAs NCERT states, seminal plasma is **rich in:**\n\n- **Fructose** — a sugar that gives the sperm energy to swim.\n- **Calcium.**\n- **Certain enzymes.**\n\nThis fluid activates the sperm, gives them nutrition, and provides the medium in which they can move.",
            },
            {
              kind: 'numerical',
              id: '83aad1de-d2f2-4004-b0a2-f2d4e05b95cb',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.11',
              prompt: 'What are the major functions of male accessory ducts and glands?',
              answer:
                'The ducts store and carry the sperm out; the glands add a fluid that nourishes, activates and provides a medium for the sperm to travel in.',
              solution:
                "Split this into the two things asked.\n\n**Male accessory ducts** — the rete testis, vasa efferentia, epididymis and vas deferens.\n- Their job is to **store the sperm** and **transport** them from the testis to the outside (through the urethra).\n\n**Male accessory glands** — a pair of seminal vesicles, a prostate, and a pair of bulbourethral glands.\n- Their secretions together form the **seminal plasma**, which is rich in **fructose, calcium and certain enzymes**.\n- This fluid **nourishes and activates** the sperm and provides the **medium** in which they can swim.\n- The bulbourethral glands also secrete a fluid that **lubricates the penis**.",
            },
          ],
        },
        {
          id: '0a53d692-92ae-4602-af4b-1f04130a543b',
          title: 'The female system & the egg',
          blurb: 'The organs, the ovary, oogenesis and the Graafian follicle.',
          items: [
            {
              kind: 'numerical',
              id: '7b9e9f01-aae0-4a21-801e-9169eb2a882e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.3',
              prompt: 'Draw a labelled diagram of female reproductive system.',
              answer:
                'A pair of ovaries, each near a fallopian tube (with fimbriae + infundibulum), leading into the uterus (with endometrium), then the cervix and vagina.',
              solution:
                "Picture it and label the parts in the path an egg travels.\n\n**The parts to show and label:**\n\n- **Ovary** — the paired female gonad, one on each side of the lower abdomen. It produces the ovum (egg) and the female hormones (estrogen and progesterone).\n- **Fallopian tube (oviduct)** — about 10–12 cm long, carrying the egg from the ovary toward the uterus. Show its parts:\n  - **Fimbriae** — finger-like fringes at the mouth of the tube that help pick up the ovum after ovulation.\n  - **Infundibulum** — the funnel-shaped part bearing the fimbriae.\n  - **Ampulla** — the wider middle part (where fertilisation usually happens).\n  - **Isthmus** — the narrow last part joining the uterus.\n- **Uterus (womb)** — the single, pear-shaped organ where the embryo develops. Its inner lining is the **endometrium**. Above it is the wider **fundus**; the wall has muscular **myometrium**.\n- **Cervix** — the narrow neck of the uterus opening into the vagina.\n- **Vagina** — the canal leading to the outside.\n\nDraw the two ovaries, curve a fallopian tube from each (fimbriae reaching toward the ovary) into the central uterus, then narrow it down through the cervix to the vagina.",
            },
            {
              kind: 'numerical',
              id: 'a3b31ce5-4783-4779-9d42-6413e68f0486',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.12',
              prompt: 'What is oogenesis? Give a brief account of oogenesis.',
              answer:
                'Oogenesis is the formation of the mature female gamete (ovum) in the ovary; it starts before birth, pauses, and finishes only when the egg is fertilised.',
              solution:
                "**Oogenesis** is the process of formation of the mature egg (ovum) from the female germ cells in the ovary. Unlike sperm formation, it is spread over years.\n\n**The steps:**\n\n1. Oogenesis begins **before birth**, in the foetus. The germ cells multiply to form **oogonia**. No more oogonia are formed after birth.\n2. These oogonia enter meiosis but **pause** — they become **primary oocytes** arrested in the first meiotic prophase. The primary oocyte gets surrounded by a layer of cells and is called a **primary follicle**.\n3. Over time the follicle grows: primary → **secondary follicle** → **tertiary follicle**. The tertiary follicle develops a fluid-filled cavity (antrum).\n4. Importantly, the primary oocyte now **completes the first meiotic division** — it is an **unequal division**, producing one large **secondary oocyte** and a tiny **first polar body**.\n5. The tertiary follicle matures into the **Graafian follicle**. The secondary oocyte forms a new membrane, the **zona pellucida**, around it.\n6. The Graafian follicle then ruptures and releases the secondary oocyte from the ovary — this is **ovulation**.\n7. The **second meiotic division** of the oocyte is completed only **if a sperm fertilises it**, producing the ovum and a second polar body.\n\nSo the memory line: oogenesis *starts before birth, stops midway, and finishes only at fertilisation.*",
            },
            {
              kind: 'numerical',
              id: '0bf178b3-3548-4b2b-893d-300431cf10a8',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.13',
              prompt: 'Draw a labelled diagram of a section through ovary.',
              answer:
                'A section shows the outer epithelium and stroma, with follicles at every stage — primary, secondary, tertiary, mature Graafian follicle — plus a released egg and a corpus luteum.',
              solution:
                "Picture a section (a cut-through) of the ovary and label the stages of follicle development arranged around it.\n\n**The parts to show and label:**\n\n- **Germinal epithelium** — the covering layer on the outside of the ovary.\n- **Stroma** — the connective tissue that fills the ovary; it has an outer **cortex** and an inner **medulla**.\n- **Primary follicle** — a primary oocyte with a single layer of surrounding cells.\n- **Secondary follicle** — a follicle with several layers of cells around the oocyte.\n- **Tertiary follicle** — a larger follicle that has developed a fluid-filled cavity (antrum).\n- **Graafian follicle (mature follicle)** — the fully grown follicle ready to release the egg.\n- **Ovum being released (ovulation).**\n- **Corpus luteum** — the yellowish body left behind after the follicle ruptures.\n\nDraw the follicles getting larger as you go around the section (primary → secondary → tertiary → Graafian), then show the egg being shed and the corpus luteum forming where the follicle burst.",
            },
            {
              kind: 'numerical',
              id: '18055091-cd77-46af-9bc0-9b579997f365',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.14',
              prompt: 'Draw a labelled diagram of a Graafian follicle?',
              answer:
                'The mature follicle: a secondary oocyte with its zona pellucida, surrounded by granulosa cells and a fluid-filled antrum, wrapped by the theca layers.',
              solution:
                "The **Graafian follicle** is the fully mature ovarian follicle, just before ovulation. Picture it and label these parts.\n\n**The parts to show and label:**\n\n- **Secondary oocyte** — the egg cell sitting inside, ready to be released.\n- **Zona pellucida** — the clear membrane immediately around the oocyte.\n- **Corona radiata** — the layer of follicle cells clinging to the zona pellucida.\n- **Granulosa cells** — the layers of cells that make up the wall of the follicle.\n- **Antrum** — the fluid-filled cavity inside the follicle.\n- **Theca (interna and externa)** — the outer coverings of connective tissue wrapping the follicle.\n\nDraw a large round follicle with a fluid cavity (antrum), the oocyte pushed to one side surrounded by its zona pellucida and follicle cells, and the theca layers forming the outer shell.",
            },
          ],
        },
        {
          id: '09396f28-51a9-484d-b2c6-566fa81f57e3',
          title: 'What each structure does — functions & fact-checks',
          blurb: 'The specific job of each organ and part, and correcting common myths.',
          items: [
            {
              kind: 'numerical',
              id: 'fefd8625-2753-47de-952d-21c717b0755a',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.4',
              prompt: 'Write two major functions each of testis and ovary.',
              answer:
                'Testis: makes sperm + secretes androgens (testosterone). Ovary: makes ova (eggs) + secretes female hormones (estrogen and progesterone).',
              solution:
                "Both the testis and the ovary do **two** kinds of work — they make gametes, and they make hormones.\n\n**Testis:**\n1. Produces the **male gametes (sperm)** — through spermatogenesis in the seminiferous tubules.\n2. Secretes the **male sex hormones (androgens, e.g. testosterone)** — from the Leydig cells.\n\n**Ovary:**\n1. Produces the **female gamete (ovum / egg)** — through oogenesis.\n2. Secretes the **female sex hormones (estrogen and progesterone)**.\n\nSo the neat pattern to remember: each gonad = **gamete factory + hormone factory**.",
            },
            {
              kind: 'numerical',
              id: '7d2d6b27-1a32-425a-b76c-a52029dbe8f5',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.15',
              prompt:
                'Name the functions of the following: (a) Corpus luteum (b) Endometrium (c) Acrosome (d) Sperm tail (e) Fimbriae',
              answer:
                'Corpus luteum → secretes progesterone; Endometrium → site of implantation; Acrosome → enzymes to penetrate the egg; Sperm tail → movement; Fimbriae → picks up the ovum after ovulation.',
              solution:
                "Here is each structure with its job.\n\n| Structure | Function |\n|---|---|\n| **(a) Corpus luteum** | Secretes large amounts of **progesterone**, which is essential to maintain the endometrium for **implantation and pregnancy**. |\n| **(b) Endometrium** | The inner lining of the uterus; it is the **site of implantation** of the embryo, and it undergoes cyclic changes during the menstrual cycle. |\n| **(c) Acrosome** | The cap on the sperm head, filled with **enzymes** that help the sperm **penetrate the egg** at fertilisation. |\n| **(d) Sperm tail** | Enables the **movement (motility)** of the sperm — it lashes about to swim the sperm toward the egg. |\n| **(e) Fimbriae** | The finger-like projections at the mouth of the fallopian tube; they help **pick up (collect) the ovum** after ovulation. |",
            },
            {
              kind: 'numerical',
              id: '425906e3-93f9-40c4-a8f6-f92824696a90',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.16',
              prompt:
                'Identify True/False statements. Correct each false statement to make it true. (a) Androgens are produced by Sertoli cells. (True/False) (b) Spermatozoa get nutrition from Sertoli cells. (True/False) (c) Leydig cells are found in ovary. (True/False) (d) Leydig cells synthesise androgens. (True/False) (e) Oogenesis takes place in corpus luteum. (True/False) (f) Menstrual cycle ceases during pregnancy. (True/False) (g) Presence or absence of hymen is not a reliable indicator of virginity or sexual experience. (True/False)',
              answer:
                '(a) False (b) True (c) False (d) True (e) False (f) True (g) True.',
              solution:
                "| Statement | True/False | Correction (if false) |\n|---|---|---|\n| **(a)** Androgens are produced by Sertoli cells. | **False** | Androgens are produced by the **Leydig cells** (interstitial cells), not Sertoli cells. |\n| **(b)** Spermatozoa get nutrition from Sertoli cells. | **True** | — |\n| **(c)** Leydig cells are found in ovary. | **False** | Leydig cells are found in the **testis** (in the spaces between the seminiferous tubules). |\n| **(d)** Leydig cells synthesise androgens. | **True** | — |\n| **(e)** Oogenesis takes place in corpus luteum. | **False** | Oogenesis takes place in the **ovary**. |\n| **(f)** Menstrual cycle ceases during pregnancy. | **True** | — |\n| **(g)** Presence or absence of hymen is not a reliable indicator of virginity or sexual experience. | **True** | — (The hymen can tear for many non-sexual reasons — sport, exercise, etc. — so it is not a reliable indicator.) |",
            },
          ],
        },
        {
          id: '454b96d2-bfa7-4215-bb70-2c08a7a0dc7d',
          title: 'Cycles, fertilisation, pregnancy & birth',
          blurb: 'Tying the pieces together — from ovulation to implantation to delivery.',
          items: [
            {
              kind: 'numerical',
              id: 'f9e796fe-b387-447e-81e4-c17c400b3d28',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.1',
              prompt:
                'Fill in the blanks: (a) Humans reproduce _____ (asexually/sexually) (b) Humans are _____ (oviparous, viviparous, ovoviviparous) (c) Fertilisation is _____ in humans (external/internal) (d) Male and female gametes are _____ (diploid/haploid) (e) Zygote is _____ (diploid/haploid) (f) The process of release of ovum from a mature follicle is called _____ (g) Ovulation is induced by a hormone called _____ (h) The fusion of male and female gametes is called _____ (i) Fertilisation takes place in _____ (j) Zygote divides to form _____ which is implanted in uterus. (k) The structure which provides vascular connection between foetus and uterus is called _____',
              answer:
                '(a) sexually (b) viviparous (c) internal (d) haploid (e) diploid (f) ovulation (g) Luteinising Hormone (LH) (h) fertilisation (syngamy) (i) ampullary-isthmic junction of the fallopian tube (j) blastocyst (k) placenta.',
              solution:
                "**(a) sexually** — humans reproduce by sexual reproduction (male and female gametes fuse).\n\n**(b) viviparous** — humans give birth to young ones, not eggs.\n\n**(c) internal** — the gametes fuse inside the female body.\n\n**(d) haploid** — each gamete (sperm and egg) has half the chromosome number (n = 23).\n\n**(e) diploid** — the zygote, formed by fusion of two gametes, has the full number (2n = 46).\n\n**(f) ovulation** — the release of the ovum from the mature Graafian follicle.\n\n**(g) Luteinising Hormone (LH)** — a sharp surge of LH triggers ovulation.\n\n**(h) fertilisation** (also called syngamy) — the fusion of the male and female gametes.\n\n**(i) the ampullary-isthmic junction** of the fallopian tube (oviduct) — where the sperm meets and fuses with the egg.\n\n**(j) blastocyst** — the zygote divides (cleavage) to form a morula and then a blastocyst, which implants in the uterus.\n\n**(k) placenta** — the structure that connects the developing foetus to the uterine wall for exchange of materials.",
            },
            {
              kind: 'numerical',
              id: '4d8822ec-aa3e-4149-aa0d-ef03bfd33c61',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.17',
              prompt: 'What is menstrual cycle? Which hormones regulate menstrual cycle?',
              answer:
                'The roughly 28-day cyclic change in the reproductive tract of primate females; regulated by GnRH, LH, FSH, estrogen and progesterone.',
              solution:
                "**The menstrual cycle** is the cyclic change that takes place in the reproductive tract of primate females (monkeys, apes and humans). In humans it repeats about every **28/29 days**, from one menstruation to the next. The first menstruation at puberty is called **menarche**.\n\n**The phases (one cycle):**\n1. **Menstrual phase (days 1–5)** — the endometrium breaks down and is shed as blood flow. This happens only if the released egg was **not** fertilised.\n2. **Follicular / proliferative phase (days 6–13)** — the follicle grows and matures, and the endometrium rebuilds. Estrogen rises.\n3. **Ovulation (around day 14)** — a **surge of LH** ruptures the Graafian follicle and releases the egg.\n4. **Luteal / secretory phase (days 15–28)** — the ruptured follicle becomes the **corpus luteum**, which secretes progesterone to maintain the endometrium for a possible pregnancy.\n\n**Hormones that regulate it:** **GnRH** (hypothalamus), the pituitary gonadotropins **LH** and **FSH**, and the ovarian hormones **estrogen** and **progesterone**.",
            },
            {
              kind: 'numerical',
              id: 'f7c5e00a-48cf-4c89-afeb-4c24816c0b43',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.18',
              prompt: 'What is parturition? Which hormones are involved in induction of parturition?',
              answer:
                'Parturition is the delivery of the baby (childbirth) at the end of pregnancy; it is induced by a neuroendocrine mechanism in which oxytocin (and relaxin) play the key role.',
              solution:
                "**Parturition** is the process of **delivery of the foetus** (childbirth) at the end of the gestation period.\n\n**How it is induced:** It is triggered by a **neuroendocrine mechanism**.\n\n1. Signals from the **fully developed foetus and the placenta** set off mild uterine contractions — the **foetal ejection reflex**.\n2. This reflex triggers the release of **oxytocin** from the mother's pituitary.\n3. **Oxytocin** acts on the uterine muscles and causes **stronger contractions**.\n4. Stronger contractions cause still more oxytocin to be released — a **positive feedback loop** — until the contractions are strong enough to expel the baby out of the birth canal.\n\nAfter the baby is delivered, the placenta is also expelled.\n\n**Hormone involved:** the key one is **oxytocin** (**relaxin** also assists by relaxing the pelvic ligaments).",
            },
          ],
        },
        {
          id: '45d9fa0c-c4e9-4b3d-9fac-377ddcd19719',
          title: 'Think it through — applied reasoning',
          blurb: 'Using the biology to reason about real situations.',
          items: [
            {
              kind: 'numerical',
              id: '87c79d9c-203b-4846-ac1f-1560bb31df4e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.19',
              prompt:
                'In our society the women are often blamed for giving birth to daughters. Can you explain why this is not correct?',
              answer:
                "It is scientifically wrong: the mother's egg always carries an X chromosome, so the baby's sex is decided by the father's sperm (X → girl, Y → boy).",
              solution:
                "Blaming the woman is scientifically incorrect. Here is why.\n\n- A human female has the sex chromosomes **XX**, and a male has **XY**.\n- When gametes form, **every egg from the mother carries an X** chromosome — she can only ever give an X.\n- The father's sperm are of **two kinds**: half carry **X** and half carry **Y**.\n- **If an X-bearing sperm** fertilises the egg → the baby is **XX → a girl.**\n- **If a Y-bearing sperm** fertilises the egg → the baby is **XY → a boy.**\n\nSo the sex of the child depends entirely on **which sperm from the father** fertilises the egg. The mother has no control over it and cannot determine the sex. Blaming women for the birth of daughters has no scientific basis at all.",
            },
            {
              kind: 'numerical',
              id: 'e84a36c0-79f8-45b0-93c5-0c915329c9dc',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.20',
              prompt:
                'How many eggs are released by a human ovary in a month? How many eggs do you think would have been released if the mother gave birth to identical twins? Would your answer change if the twins born were fraternal?',
              answer:
                'Normally one egg per month. Identical twins → still one egg (it splits). Fraternal twins → two eggs. Yes, the answer changes for fraternal twins.',
              solution:
                "Take it in three parts.\n\n**Eggs per month:** a human ovary normally releases **one egg (ovum) each month** (one cycle, one ovulation).\n\n**Identical twins:** identical (monozygotic) twins come from a **single egg** fertilised by a single sperm; the resulting zygote/early embryo then **splits into two**. So even for identical twins, only **one egg** was released.\n\n**Fraternal twins:** fraternal (dizygotic) twins come from **two separate eggs**, each fertilised by a different sperm. So here **two eggs** must have been released.\n\n**So yes — the answer changes.** Identical twins → **one** egg; fraternal twins → **two** eggs.",
            },
            {
              kind: 'numerical',
              id: 'ef510538-ffb8-414b-9814-5865df13d8c3',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.21',
              prompt:
                'How many eggs do you think were released by the ovary of a female dog which gave birth to 6 puppies?',
              answer:
                'At least six eggs — one egg for each puppy (dogs release several eggs at a time).',
              solution:
                "Unlike humans, a dog is a **polytocous** animal — it releases **several eggs at a time** and gives birth to a litter (many young ones together).\n\nEach puppy develops from **one fertilised egg (one zygote)**. So to produce **6 puppies**, the ovary must have released **at least 6 eggs (ova)**, and each of those 6 eggs was fertilised by a separate sperm.\n\n**Answer: 6 eggs.**",
            },
          ],
        },
      ],
    },
  ],
};
