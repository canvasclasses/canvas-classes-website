'use strict';
// Class 11 Biology — Ch.19 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch19-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 9 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "2ce84f54-4f9b-430e-a3c7-dedbd07442cd",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A dark human silhouette from head to hip with soft glowing points marking each endocrine gland — brain, neck, chest, abdomen, pelvis — connected by faint threads of warm light representing hormones travelling through the blood",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A single human body silhouette shown from the front, rendered as a soft dark form, with warm glowing amber-orange points of light marking each endocrine gland in its correct location: hypothalamus and pituitary at the base of the brain, pineal deep in the brain, thyroid and parathyroid in the front of the neck, thymus in the upper chest, adrenal glands capping each kidney in the upper abdomen, pancreas across the upper abdomen, and the gonads in the pelvis. Faint thin threads of warm light connect the glowing points to each other and radiate outward into the silhouette, suggesting hormone messages travelling through the bloodstream. Clean minimal line work, no muscles or organs drawn in anatomical detail beyond the glowing gland markers, biologically accurate relative positions, no photorealism, no cartoon style, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "0837e4f6-a865-477c-a8fe-006bd57cf35b",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 9 NCERT exercises** for *Chemical Coordination and Integration*, pulled out of the textbook's running order and re-sorted into four revision themes: what a gland and a hormone even are, which gland makes which hormone, the hypothalamus–pituitary command chain, and what goes wrong when a hormone's function or supply fails.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "20777a58-b54f-4c72-89fc-c5f1fbafdfb0",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 19.1–19.9",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-foundations-and-map",
          "title": "What a Gland and a Hormone Are, and Where They Sit",
          "blurb": "The vocabulary this whole chapter rests on, plus the body map of all eight organised endocrine glands.",
          "items": [
            {
              "kind": "numerical",
              "id": "9a2122c4-953e-4578-b9f3-6d36d18845b7",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.1",
              "prompt": "Define the following:\n(a) Exocrine gland\n(b) Endocrine gland\n(c) Hormone",
              "answer": "Exocrine gland = has a duct to a specific site; endocrine gland = ductless, releases straight into blood; hormone = a non-nutrient, intercellular-messenger chemical produced in trace amounts.",
              "solution": "Start with the word *duct* — a duct is simply a little tube that carries a gland's secretion to wherever it's needed.\n\n**(a) Exocrine gland.** A gland that has a duct. It doesn't pour its secretion into the blood — it channels it, through that tube, to one specific place. This chapter's own example: the salivary gland has a duct that drips saliva straight into the mouth. The pancreas has an exocrine side too — most of the organ makes digestive juice and sends it, via a duct, into the intestine.\n\n**(b) Endocrine gland.** A gland with **no duct** — a *ductless* gland. With no tube to carry the secretion anywhere in particular, the gland instead releases it **directly into the blood**, and the blood carries it wherever it needs to go. Every gland this chapter covers — pituitary, thyroid, adrenal, and the rest — is an endocrine gland precisely because none of them has a duct.\n\n**(c) Hormone.** The secretion an endocrine gland releases into the blood. The older, classical definition was a chemical made by an endocrine gland, released into the blood, and carried to a distant target organ. The wider, current scientific definition — worth knowing word-for-word — is: hormones are **non-nutrient chemicals which act as intercellular messengers and are produced in trace amounts**. Break that down: *non-nutrient* means it isn't food and isn't burnt for energy, it only carries a signal. *Intercellular messenger* means it passes a message between cells. *Produced in trace amounts* means the body needs to make only a tiny quantity for it to work."
            },
            {
              "kind": "numerical",
              "id": "73910737-3683-4a93-8a2d-146dff258922",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.2",
              "prompt": "Diagrammatically indicate the location of the various endocrine glands in our\nbody.",
              "answer": "Head-to-pelvis: hypothalamus/pituitary/pineal in the head, thyroid/parathyroid in the neck, thymus in the chest, adrenals + pancreas in the upper abdomen, gonads lowest of all.",
              "solution": "Since a diagram can't be drawn here, walk down the body instead, from head to pelvis, placing each of the eight organised endocrine glands exactly where this chapter's own Figure 19.1 places them.\n\n- **Hypothalamus and pituitary** — both sit at the **base of the brain**. The hypothalamus is the basal part of the forebrain (the diencephalon); the pituitary hangs just below it, joined to it by a stalk.\n- **Pineal gland** — also inside the head, on the **dorsal (back) side of the forebrain**.\n- **Thyroid and parathyroid** — in the **front of the neck**. The thyroid's two lobes sit on either side of the trachea (windpipe), joined across the front by the isthmus; the four parathyroid glands are tucked on the **back (dorsal) side of the thyroid**, a pair embedded in each lobe.\n- **Thymus** — in the **upper chest**, between the lungs, behind the sternum (breastbone), on the ventral side of the aorta.\n- **Adrenal glands** — a pair, each one sitting like a **cap on top of a kidney**, in the upper abdomen.\n- **Pancreas** — lying across the **upper abdomen**, alongside the stomach and duodenum.\n- **Gonads** — lowest of all. In males, a pair of **testes sit in the scrotal sac, outside the abdomen**; in females, a pair of **ovaries sit inside the abdomen**.\n\nThat's the same head-to-pelvis order the figure uses — hypothalamus/pituitary/pineal in the head, thyroid/parathyroid in the neck, thymus in the chest, adrenals and pancreas in the upper abdomen, and the gonads lowest of all."
            }
          ]
        },
        {
          "id": "s2-which-gland-which-hormone",
          "title": "Which Gland Makes Which Hormone",
          "blurb": "The full source list, gland by gland, plus a hormone-to-source matching drill.",
          "items": [
            {
              "kind": "numerical",
              "id": "f99ba702-203d-4b81-8c3a-7383618df467",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.3",
              "prompt": "List the hormones secreted by the following:\n(a) Hypothalamus (b) Pituitary           (c) Thyroid     (d) Parathyroid\n(e) Adrenal      (f) Pancreas            (g) Testis      (h) Ovary\n(i) Thymus       (j) Atrium              (k) Kidney      (l) G-I Tract",
              "answer": "Twelve sources, each with its own hormone list — see the full solution for every one.",
              "solution": "Go gland by gland, exactly as this chapter covers them.\n\n(a) **Hypothalamus** — releasing and inhibiting hormones that control the pituitary (e.g. GnRH, a releasing hormone; somatostatin, an inhibiting hormone), plus oxytocin and vasopressin, which the hypothalamus itself synthesises and sends down the stalk to be stored in the posterior pituitary.\n\n(b) **Pituitary** — pars distalis (anterior): growth hormone (GH), prolactin (PRL), thyroid stimulating hormone (TSH), adrenocorticotrophic hormone (ACTH), luteinizing hormone (LH), follicle stimulating hormone (FSH). Pars intermedia: melanocyte stimulating hormone (MSH). Pars nervosa (posterior): stores and releases oxytocin and vasopressin (ADH), though both are actually made by the hypothalamus.\n\n(c) **Thyroid** — thyroxine (T4) and triiodothyronine (T3) from the follicular cells, plus thyrocalcitonin (TCT), which lowers blood calcium.\n\n(d) **Parathyroid** — parathyroid hormone (PTH).\n\n(e) **Adrenal** — the medulla secretes adrenaline (epinephrine) and noradrenaline (norepinephrine), the catecholamines; the cortex secretes corticoids — glucocorticoids (mainly cortisol) and mineralocorticoids (mainly aldosterone) — plus small amounts of androgenic steroids.\n\n(f) **Pancreas** — glucagon from the α-cells and insulin from the β-cells of the Islets of Langerhans.\n\n(g) **Testis** — androgens, mainly testosterone, from the Leydig (interstitial) cells.\n\n(h) **Ovary** — estrogen from the growing ovarian follicles, and progesterone from the corpus luteum after ovulation.\n\n(i) **Thymus** — thymosins.\n\n(j) **Atrium** (the atrial wall of the heart) — atrial natriuretic factor (ANF).\n\n(k) **Kidney** — erythropoietin, from the juxtaglomerular cells.\n\n(l) **G-I Tract** — gastrin, secretin, cholecystokinin (CCK), and gastric inhibitory peptide (GIP)."
            },
            {
              "kind": "numerical",
              "id": "b3c8d08d-a69b-4834-a2c2-24045ad123df",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.9",
              "prompt": "Match the following:\n   Column I          Column II\n   (a) T4              (i) Hypothalamus\n   (b) PTH            (ii) Thyroid\n   (c) GnRH          (iii) Pituitary\n   (d) LH            (iv) Parathyroid",
              "answer": "(a)-(ii), (b)-(iv), (c)-(i), (d)-(iii).",
              "solution": "This match asks, for each hormone, which gland actually **makes** it.\n\n| Hormone | Made by |\n|---|---|\n| (a) T4 | (ii) Thyroid — T4 (thyroxine) is one of the two hormones made by the thyroid's follicular cells, alongside T3. |\n| (b) PTH | (iv) Parathyroid — parathyroid hormone is made by the four parathyroid glands tucked on the back of the thyroid. |\n| (c) GnRH | (i) Hypothalamus — Gonadotrophin Releasing Hormone is one of the hypothalamus's own releasing hormones; it travels down to the pituitary and stimulates it to release the gonadotrophins. |\n| (d) LH | (iii) Pituitary — luteinizing hormone is one of the six hormones made by the pars distalis (anterior pituitary). |\n\nSo the full match is **(a)-(ii), (b)-(iv), (c)-(i), (d)-(iii)**. GnRH is the one to watch here: it is a hormone made **by** the hypothalamus that then acts **on** the pituitary, so its home gland is the hypothalamus — not the pituitary it goes on to stimulate."
            }
          ]
        },
        {
          "id": "s3-hypothalamus-pituitary-chain",
          "title": "The Hypothalamus–Pituitary Command Chain",
          "blurb": "Where hypothalamic and pituitary hormones actually act, and how a gonadotrophin like FSH flips the switch once it gets there.",
          "items": [
            {
              "kind": "numerical",
              "id": "55c5a13b-33b9-49f7-8e7c-0310cbaeafeb",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.4",
              "prompt": "Fill in the blanks:\n   Hormones                                 Target gland\n   (a) Hypothalamic hormones              __________________\n   (b) Thyrotrophin (TSH)                 __________________\n   (c) Corticotrophin (ACTH)              __________________\n   (d) Gonadotrophins (LH, FSH)           __________________\n   (e) Melanotrophin (MSH)                __________________",
              "answer": "Hypothalamic hormones → pituitary. TSH → thyroid. ACTH → adrenal cortex. Gonadotrophins → gonads. MSH → melanocytes (skin).",
              "solution": "Each row asks where that hormone travels to and acts — its target.\n\n(a) **Hypothalamic hormones** → the **pituitary**. The releasing and inhibiting hormones made by the hypothalamus travel through the portal circulatory system to reach the anterior pituitary (and reach the posterior pituitary via direct neural connections), telling it when to release its own hormones.\n\n(b) **Thyrotrophin (TSH)** → the **thyroid gland**. TSH is one of the anterior pituitary's own hormones, and its job is to stimulate the thyroid gland to make T3 and T4.\n\n(c) **Corticotrophin (ACTH)** → the **adrenal cortex**. ACTH stimulates the adrenal cortex to make its steroid hormones, the glucocorticoids.\n\n(d) **Gonadotrophins (LH, FSH)** → the **gonads** (testis in males, ovary in females). LH drives androgen secretion from the testis and induces ovulation / maintains the corpus luteum in the ovary; FSH, together with androgens, regulates spermatogenesis in males and drives growth of the ovarian follicles in females.\n\n(e) **Melanotrophin (MSH)** → the **melanocytes of the skin**. MSH acts on melanocytes and regulates skin pigmentation.\n\n*(A note on how to read this table: (a) is a hormone reaching a gland, but (b)–(e) are themselves pituitary hormones, so their 'targets' here are the organs they act on once released — thyroid, adrenal cortex, gonads, and skin, exactly as this chapter's pituitary page describes each one.)*"
            },
            {
              "kind": "numerical",
              "id": "dcff6894-b75b-4048-bf35-c8f05c0c4aee",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.8",
              "prompt": "Briefly mention the mechanism of action of FSH.",
              "answer": "FSH is a peptide hormone: it binds a membrane-bound receptor on the target-cell surface without entering the cell, triggers a second messenger like cyclic AMP inside, and that regulates the cell — driving spermatogenesis (with androgens) in males and follicle growth in females.",
              "solution": "FSH (follicle stimulating hormone) is one of the **gonadotrophins**, made by the pars distalis of the anterior pituitary. Chemically, it belongs to the **peptide/protein hormone** class — and this chapter's own page on hormone mechanisms is explicit that peptide and protein hormones (its own listed examples include the pituitary hormones) act through **membrane-bound receptors**.\n\nThat means FSH binds a receptor sitting on the **surface** of its target cell and, per this chapter, **normally does not enter the cell at all**. Instead, that binding makes the target cell produce a **second messenger** inside itself — a molecule such as **cyclic AMP** — and this second messenger is what actually carries the signal onward and regulates the cell's metabolism and activity.\n\nWhat does that activity look like for FSH specifically? In males, FSH — together with androgens — regulates **spermatogenesis**. In females, FSH drives the **growth of the ovarian follicles**. So the whole chain is: FSH released from the anterior pituitary → binds a surface receptor on its target cell (without entering it) → a second messenger like cyclic AMP is generated inside → that second messenger regulates the cell, producing FSH's downstream effect on sperm or follicle production."
            }
          ]
        },
        {
          "id": "s4-functions-and-deficiency",
          "title": "Hormone Functions, and What Goes Wrong Without Them",
          "blurb": "Full functional notes on six named hormones, quick-fire examples by function, and the three deficiency diseases NEET names most.",
          "items": [
            {
              "kind": "numerical",
              "id": "21892367-af01-4f99-83ae-2ba25836efa8",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.5",
              "prompt": "Write short notes on the functions of the following hormones:\n(a) Parathyroid hormone (PTH)           (b) Thyroid hormones\n(c) Thymosins                           (d) Androgens\n(e) Estrogens                           (f) Insulin and Glucagon",
              "answer": "PTH raises blood calcium; thyroid hormones set the BMR; thymosins build T-cell and antibody immunity; androgens drive male traits and spermatogenesis; estrogens drive female traits and follicle growth; insulin lowers and glucagon raises blood sugar together.",
              "solution": "**(a) Parathyroid hormone (PTH).** PTH is a hypercalcemic hormone — its whole job is to raise the level of Ca2+ circulating in the blood, and it does this through three routes at once: it acts on bone and stimulates bone resorption (dissolving bone to release stored calcium), it stimulates reabsorption of Ca2+ by the renal tubules in the kidney (so less calcium is lost in urine), and it increases Ca2+ absorption from digested food in the gut. Working opposite to thyrocalcitonin (TCT), which lowers blood calcium, PTH keeps the body's calcium in balance.\n\n**(b) Thyroid hormones (T3 and T4).** Made by the thyroid's follicular cells using dietary iodine, T3 and T4 set the tempo of the whole body. They regulate the **basal metabolic rate (BMR)** — the baseline speed at which the body burns energy at rest — support **red blood cell formation**, control the **metabolism of carbohydrates, proteins and fats**, and help maintain **water and electrolyte balance**.\n\n**(c) Thymosins.** Secreted by the thymus, thymosins do two things: they drive the **differentiation of T-lymphocytes**, the immune cells behind cell-mediated immunity, and they **promote antibody production**, giving humoral immunity. As the thymus degenerates in old age, it makes fewer thymosins, and the immune response of older people weakens as a direct result.\n\n**(d) Androgens.** Made mainly by the Leydig (interstitial) cells of the testis, with testosterone as the chief one. Androgens regulate the development and maturation of the male accessory sex organs, stimulate muscular growth, the growth of facial and axillary hair, aggressiveness and a low-pitched voice, and they are essential for **spermatogenesis**. They also act on the central nervous system to influence male sexual behaviour (libido), and they have anabolic effects on protein and carbohydrate metabolism.\n\n**(e) Estrogens.** Synthesised mainly by the growing ovarian follicles. Estrogen stimulates the growth and activity of the female secondary sex organs, drives the development of the growing follicles, brings on the female secondary sex characters (like a high-pitched voice) and mammary gland development, and regulates female sexual behaviour.\n\n**(f) Insulin and glucagon.** These two peptide hormones from the pancreas's Islets of Langerhans are antagonists that together hold blood glucose steady. **Insulin**, from the β-cells, is the hypoglycemic one — it enhances glucose uptake and utilisation by cells (mainly hepatocytes and adipocytes) and stimulates glycogenesis (storing glucose as glycogen), so blood glucose falls. **Glucagon**, from the α-cells, is the hyperglycemic one — it acts mainly on the liver, stimulating glycogenolysis (breaking glycogen back into glucose) and gluconeogenesis, so blood glucose rises. Glucose homeostasis is maintained jointly by the two pulling in opposite directions."
            },
            {
              "kind": "numerical",
              "id": "4b92cad8-f75b-4c5c-b3cf-464286564b1a",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.6",
              "prompt": "Give example(s) of:\n(a) Hyperglycemic hormone and hypoglycemic hormone\n(b) Hypercalcemic hormone\n(c) Gonadotrophic hormones\n(d) Progestational hormone\n(e) Blood pressure lowering hormone\n(f) Androgens and estrogens",
              "answer": "(a) glucagon / insulin (b) PTH (c) LH and FSH (d) progesterone (e) ANF (f) testosterone / estrogen.",
              "solution": "(a) **Hyperglycemic hormone**: glucagon — it raises blood glucose. **Hypoglycemic hormone**: insulin — it lowers blood glucose.\n\n(b) **Hypercalcemic hormone**: parathyroid hormone (PTH) — it raises blood Ca2+ through bone resorption, renal reabsorption, and gut absorption.\n\n(c) **Gonadotrophic hormones**: luteinizing hormone (LH) and follicle stimulating hormone (FSH) — both act on the gonads (testis and ovary).\n\n(d) **Progestational hormone**: progesterone, secreted mainly by the corpus luteum, since it is the hormone that supports pregnancy.\n\n(e) **Blood pressure lowering hormone**: atrial natriuretic factor (ANF), secreted by the atrial wall of the heart, which dilates blood vessels and brings the pressure down.\n\n(f) **Androgens**: testosterone, from the Leydig cells of the testis. **Estrogens**: estrogen, secreted mainly by the growing ovarian follicles."
            },
            {
              "kind": "numerical",
              "id": "2248eb4c-8037-4a89-b11c-eb7822f1e1bf",
              "source": "ncert_exercise",
              "source_label": "NCERT 19.7",
              "prompt": "Which hormonal deficiency is responsible for the following:\n(a) Diabetes mellitus     (b) Goitre       (c) Cretinism",
              "answer": "Diabetes mellitus = insulin deficiency/insufficiency; goitre = thyroid hormone (T3/T4) deficiency from lack of iodine; cretinism = the same thyroid hormone deficiency, occurring in a developing baby during pregnancy.",
              "solution": "**(a) Diabetes mellitus.** This chapter ties diabetes mellitus to **prolonged hyperglycemia** — blood sugar staying too high for too long, with glucose then lost through the urine and harmful ketone bodies forming. Since **insulin** is the hormone whose whole job is to bring blood glucose down, diabetes mellitus traces back to a deficiency or shortfall in insulin's action — which is exactly why diabetic patients are treated with **insulin therapy**, replacing the hormone the body can no longer supply enough of.\n\n**(b) Goitre.** Iodine is essential for the thyroid's follicular cells to make T3 and T4 at a normal rate. When dietary iodine runs short, thyroid hormone output falls — **hypothyroidism** — and the gland swells up trying to compensate, an enlargement this chapter calls **goitre**.\n\n**(c) Cretinism.** The same hypothyroidism, but occurring **during pregnancy**, in the developing baby. Without enough thyroid hormone reaching the fetus, the child is born with stunted growth (**cretinism**), along with mental retardation, low IQ, abnormal skin, and deaf-mutism."
            }
          ]
        }
      ]
    }
  ]
};
