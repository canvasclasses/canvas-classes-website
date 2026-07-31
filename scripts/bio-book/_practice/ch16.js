'use strict';
// Class 11 Biology — Ch.16 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch16-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 12 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "7f28e694-e73b-461a-88ad-72c5c1f842e7",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A two-panel scene: on the left a glowing kidney cross-section with a single nephron and its hairpin loop of Henle running deep into the medulla, on the right a urinary bladder connected to a coiled dialysis tube",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a bean-shaped kidney shown in cross-section, with cortex and medulla visible, and one nephron drawn large and glowing — glomerulus in Bowman's capsule, a hairpin-shaped loop of Henle running deep into the medulla, with a thin parallel capillary loop (vasa recta) beside it. Right half: a simplified urinary bladder connected downward to a urethra, and beside it a coiled length of dialysis tubing suggesting an artificial kidney. Clean white outlines, muted natural reddish-browns and soft blues for blood vessels, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "284c910a-10a0-42f9-bedb-cc83c5a2930a",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 12 NCERT exercises** for *Excretory Products and Their Elimination*, pulled out of the textbook's running order and re-sorted into four revision themes: nitrogenous waste and why land animals had to change strategy, filtration and its own built-in thermostat, how the kidney concentrates urine and finally lets it go, and a rapid-fire round of the true/false, match and fill-in-the-blank questions that test the whole chapter at once.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "2a968406-4495-4643-bba3-a9792f3a2bd9",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 16.1–16.12",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-nitrogenous-wastes",
          "title": "Nitrogenous Wastes & Why Land Animals Changed Strategy",
          "blurb": "What osmoregulation means, and why ammonia is a luxury only water-dwelling animals can afford.",
          "items": [
            {
              "kind": "numerical",
              "id": "1dc05178-fd7f-40fa-95e7-6c6ab37f64a0",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.8",
              "prompt": "What is meant by the term osmoregulation?",
              "answer": "Osmoregulation is controlling an animal's ionic and fluid-volume balance — keeping the salt and water content of its body fluids steady.",
              "solution": "**Osmoregulation** is the control of an animal's **ionic and fluid volume balance** — in plain words, keeping the amount of salt and the amount of water in the body's fluids steady, instead of letting them drift.\n\nThis chapter actually names osmoregulation as the *main job* of one particular excretory structure: **protonephridia**, also called **flame cells** — the excretory structures of Platyhelminthes (like Planaria), rotifers, some annelids, and the cephalochordate Amphioxus. Their primary purpose isn't removing nitrogenous waste at all; it's regulating the ionic and fluid balance of the animal's body. Contrast that with structures like **nephridia** (earthworms) or **Malpighian tubules** (insects), which do double duty — both removing nitrogenous wastes *and* osmoregulation.\n\nSo osmoregulation is a broader idea than just \"getting rid of waste\" — it's about the animal actively managing how much water and how many ions stay inside it."
            },
            {
              "kind": "numerical",
              "id": "6c0ccee8-e1ba-438b-a968-dcbb0636a8ef",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.9",
              "prompt": "Terrestrial animals are generally either ureotelic or uricotelic, not ammonotelic, why ?",
              "answer": "Because ammonia is the most toxic nitrogenous waste and needs the largest amount of water to flush out safely — water a land animal cannot spare — so terrestrial life pushed animals toward the water-saving options, urea or uric acid.",
              "solution": "This comes straight down to the **toxicity-versus-water** trade-off that runs through the whole chapter. **Ammonia** is the **most toxic** of the three nitrogenous wastes, and getting rid of it safely needs a **large amount of water** to dilute it below dangerous levels. **Uric acid**, at the other end, is the **least toxic** and can be removed with only a **minimum loss of water**. **Urea** sits in between.\n\nAn aquatic animal like a bony fish can afford ammonia — it sits inside an endless supply of water and simply lets the ammonia diffuse straight out across its gills or body surface, with the kidneys barely involved. A **terrestrial** animal has no such luxury. It cannot spend litres of its limited body water just to flush out the most toxic waste it makes.\n\nSo **terrestrial adaptation necessitated the production of lesser toxic nitrogenous wastes — urea and uric acid — specifically to conserve water.** Mammals and many terrestrial amphibians became **ureotelic** (urea, made in the liver, filtered out by the kidneys); reptiles, birds, land snails and insects went further and became **uricotelic** (uric acid, as a near-dry pellet or paste). Both choices trade a bit of extra biochemical work (converting ammonia into something less toxic) for a much smaller water bill — exactly what a land animal needs."
            }
          ]
        },
        {
          "id": "s2-filtration-gfr",
          "title": "Filtration, GFR & the Kidney’s Own Thermostat",
          "blurb": "What GFR actually measures, and how the JGA keeps it from drifting.",
          "items": [
            {
              "kind": "numerical",
              "id": "873ab897-df9e-451d-b835-eb5c6965572d",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.1",
              "prompt": "Define Glomerular Filtration Rate (GFR)",
              "answer": "GFR is the amount of filtrate the kidneys form each minute — about 125 ml/minute, which adds up to roughly 180 litres a day.",
              "solution": "The **glomerular filtration rate (GFR)** is simply how much filtrate the kidneys form in **one minute**. In a healthy person that rate holds fairly steady at **approximately 125 ml/minute** — which, added up across a whole day, comes to **about 180 litres**.\n\nPut that number next to how much urine you actually pass in a day — only **1 to 1.5 litres** — and you can see how much of that filtrate the tubules must be quietly taking back through reabsorption. GFR isn't left to drift on its own, either: the kidney has its own built-in thermostat for it, the **juxta glomerular apparatus (JGA)**, which is exactly what the next question is about."
            },
            {
              "kind": "numerical",
              "id": "3c329bba-bacd-4e71-94f4-01c93d2efce7",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.2",
              "prompt": "Explain the autoregulatory mechanism of GFR.",
              "answer": "A fall in GFR is sensed by the JGA, which releases renin — renin raises glomerular blood pressure (via angiotensin II) and pushes GFR back up to normal.",
              "solution": "The kidney keeps its own filtration rate in check using a built-in sensor called the **juxta glomerular apparatus (JGA)**. It's formed by **cellular modifications in the distal convoluted tubule (DCT) and the afferent arteriole**, right at the spot where the two touch each other.\n\nHere is the loop, step by step: if the **GFR falls**, the **JG cells release renin**. Renin doesn't act on the kidney directly — it converts **angiotensinogen**, already circulating in the blood, into **angiotensin I**, which is then converted further into **angiotensin II**. Angiotensin II is a **powerful vasoconstrictor**: it squeezes blood vessels, and that **raises glomerular blood pressure**, which in turn **pushes the GFR back up to normal**. (Angiotensin II also signals the adrenal cortex to release aldosterone, which causes the tubule to reabsorb Na+ and water — a second route to the same result of raising blood pressure.)\n\nSo the whole thing is a self-correcting feedback loop: **GFR drops → JGA fires → renin → angiotensin II → blood pressure and GFR climb back up**. Once GFR is restored, the original trigger for renin release goes away — that is what makes it \"auto\"-regulatory."
            },
            {
              "kind": "numerical",
              "id": "c47c5d76-bf4a-463d-b0cb-a791014af32f",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.10",
              "prompt": "What is the significance of juxta glomerular apparatus (JGA) in kidney function?",
              "answer": "The JGA is the kidney's own feedback sensor for GFR — a fall in GFR makes it release renin, which raises blood pressure and GFR back to normal and also triggers aldosterone to help hold on to Na+ and water.",
              "solution": "The **JGA (juxta glomerular apparatus)** is the kidney's built-in regulator — the structure that stops the glomerular filtration rate from simply drifting up or down with every small change in blood flow. It is formed where a modified stretch of the **distal convoluted tubule** touches the **afferent arteriole**.\n\nIts significance is entirely about **feedback**: whenever **glomerular blood flow, glomerular blood pressure, or GFR falls**, the **JG cells** inside the JGA respond by **releasing renin**. Renin sets off a chain — **angiotensinogen → angiotensin I → angiotensin II** — and angiotensin II is a **powerful vasoconstrictor** that raises **glomerular blood pressure and GFR** directly. It also signals the **adrenal cortex** to release **aldosterone**, which causes **reabsorption of Na+ and water from the distal parts of the tubule**, raising blood pressure (and therefore GFR) a second way.\n\nSo the JGA matters because it's the single structure that lets the kidney sense its own filtration slipping and correct it automatically — through the **renin-angiotensin-aldosterone mechanism** — without needing any outside signal to start the fix."
            }
          ]
        },
        {
          "id": "s3-concentrating-and-releasing",
          "title": "Concentrating Urine, Releasing It & Backup Excretion",
          "blurb": "How Henle's loop and the vasa recta build a salt gradient, how the bladder finally lets go, and who else besides the kidney helps carry the load.",
          "items": [
            {
              "kind": "numerical",
              "id": "2d3e3653-b595-4c2b-9db9-f464d33c00e2",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.4",
              "prompt": "Give a brief account of the counter current mechanism.",
              "answer": "Henle's loop and the vasa recta both run as hairpin counter currents lying side by side; together they build a rising salt gradient (300 to about 1200 mOsmol/L) in the medulla, which lets the collecting duct pull water out and concentrate the urine.",
              "solution": "A **counter current** is simply two flows, side by side, moving in **opposite directions**. Two structures in the nephron are built exactly this way: **Henle's loop**, shaped like a hairpin with filtrate going **down** the descending limb and **up** the ascending limb; and the **vasa recta**, the blood vessel looping alongside it, also hairpin-shaped, carrying blood in opposite directions through its two limbs.\n\nBecause these two hairpins run in close **proximity** to each other and both carry counter currents, together they maintain an **osmolarity that keeps rising toward the inner medulla** — from about **300 mOsmol/L in the cortex** up to roughly **1200 mOsmol/L in the inner medulla**.\n\nTwo solutes actually build this gradient: **NaCl** is transported out by the **ascending limb of Henle's loop**, exchanged with the **descending limb of the vasa recta**, and then returned to the interstitium by the **ascending limb of the vasa recta** — so the salt stays trapped deep in the medulla instead of being carried away in the blood. **Urea** contributes too: small amounts enter the thin segment of the ascending limb of Henle's loop, and the **collecting tubule carries it back** to the interstitium.\n\nThe payoff comes right at the end of the tubule: because the medullary interstitium is now this concentrated, **water passes easily out of the collecting tubule** on its own by osmosis, concentrating the filtrate into urine. This is how human kidneys can produce urine nearly **four times more concentrated** than the filtrate they started with."
            },
            {
              "kind": "numerical",
              "id": "9c541803-460b-4fa9-a72a-32145795dc33",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.6",
              "prompt": "Explain micturition.",
              "answer": "Micturition is the voluntary release of stored urine, triggered by the micturition reflex: bladder-wall stretch receptors signal the CNS, which contracts the bladder muscle and relaxes the urethral sphincter.",
              "solution": "The urine the nephrons make is carried to the **urinary bladder** and stored there **until a voluntary signal is given by the central nervous system (CNS)** — the release is under conscious control, not automatic.\n\nHere is the sequence. As the bladder fills, its wall gets **stretched**. That stretching activates **stretch receptors on the walls of the bladder**, and these receptors **send signals to the CNS**. The CNS then sends motor messages back that do **two things at the same time**: they **contract the smooth muscles of the bladder** and **relax the urethral sphincter**. With the muscle squeezing and the gate open together, urine is released — this whole release is called **micturition**, and the neural pathway behind it is named the **micturition reflex**.\n\nA few numbers worth locking in alongside this: an adult human excretes, on average, **1 to 1.5 litres of urine per day**. It is a **light yellow, watery** fluid, **slightly acidic (pH around 6.0)**, with a characteristic odour, and carries out about **25–30 g of urea per day**. Because urine reflects what's happening inside the body, its composition can point to disease — **glucose in the urine (glycosuria)** and **ketone bodies in the urine (ketonuria)** are both signs of **diabetes mellitus**."
            },
            {
              "kind": "numerical",
              "id": "83b49e20-b35a-464e-83f9-2def1766755b",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.5",
              "prompt": "Describe the role of liver, lungs and skin in excretion.",
              "answer": "Lungs remove CO2 (~200 ml/min) and water vapour; the liver secretes bile carrying pigments, cholesterol, degraded steroids, vitamins and drugs out with the digestive wastes; the skin removes NaCl, urea and lactic acid in sweat, and sterols, hydrocarbons and waxes in sebum.",
              "solution": "The kidney is the main excretory organ, but it isn't the only one — the **lungs, liver and skin** each carry part of the load too, and each one gets rid of a different kind of waste.\n\n**Lungs.** Every minute, the lungs remove a large amount of **carbon dioxide (about 200 ml per minute)** — a genuine metabolic waste — along with a significant amount of **water**. This is why heavy breathing during exercise is, quite literally, an act of excretion.\n\n**Liver.** The liver is the **largest gland** in the body. It secretes **bile**, and that bile carries substances such as **bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins and drugs**. Most of this ultimately **passes out along with the digestive wastes** — so the liver's waste leaves the body through the gut rather than through the kidney.\n\n**Skin.** The skin has two kinds of glands doing excretory work. The **sweat glands** produce **sweat**, a watery fluid carrying **NaCl, small amounts of urea, and lactic acid** — though sweat's *main* job is cooling the body, and waste removal is only a side effect. The **sebaceous glands** get rid of **sterols, hydrocarbons and waxes** as **sebum**, which doubles as a protective oily coating for the skin.\n\nOne more source, easy to forget: small amounts of nitrogenous waste also leave through **saliva**. Together, these three organs quietly take some of the pressure off the kidneys every single day."
            }
          ]
        },
        {
          "id": "s4-rapid-fire-recall",
          "title": "Rapid-Fire Recall — True/False, Match & Fill-in-the-Blanks",
          "blurb": "NCERT's own objective-style questions, each drawing on facts from across the whole chapter — a fast final check before you move on.",
          "items": [
            {
              "kind": "numerical",
              "id": "38ddf2f3-18fd-4958-9849-149f3ac1d934",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.3",
              "prompt": "Indicate whether the following statements are true or false :\n(a) Micturition is carried out by a reflex.\n(b) ADH helps in water elimination, making the urine hypotonic.\n(c) Protein-free fluid is filtered from blood plasma into the Bowman's capsule.\n(d) Henle's loop plays an important role in concentrating the urine.\n(e) Glucose is actively reabsorbed in the proximal convoluted tubule.",
              "answer": "(a) True (b) False — ADH causes water reabsorption, not elimination (c) True (d) True (e) True.",
              "solution": "Go through each statement against what this chapter actually says.\n\n**(a) Micturition is carried out by a reflex — True.** The release of stored urine follows a defined neural pathway: stretch receptors on the bladder wall signal the CNS, which sends motor messages back to contract the bladder and relax the urethral sphincter. NCERT names this whole pathway the **micturition reflex**.\n\n**(b) ADH helps in water elimination, making the urine hypotonic — False.** This is the exact opposite of what ADH does. ADH **facilitates water reabsorption** from the later parts of the tubule, which *prevents* water loss (it prevents diuresis) rather than causing it. Because more water is pulled back into the blood, the urine left behind becomes **more concentrated**, not more dilute — so it turns **hypertonic**, not hypotonic.\n\n**(c) Protein-free fluid is filtered from blood plasma into the Bowman's capsule — True.** Glomerular filtration is fine enough that almost every constituent of plasma crosses into Bowman's capsule *except the proteins* — which is exactly why the step is called **ultrafiltration**. So what lands in Bowman's capsule is, for all practical purposes, protein-free.\n\n**(d) Henle's loop plays an important role in concentrating the urine — True.** Even though very little reabsorption happens along the loop itself, its hairpin shape, running as a counter current alongside the vasa recta, is exactly what builds the high-osmolarity medullary interstitium (300 → about 1200 mOsmol/L) that later lets the collecting duct pull water out and concentrate the urine.\n\n**(e) Glucose is actively reabsorbed in the proximal convoluted tubule — True.** The PCT is where nearly all of the essential nutrients — glucose included — are reabsorbed, and substances such as glucose, amino acids and Na+ are pulled back by **active transport**."
            },
            {
              "kind": "numerical",
              "id": "1dfb4c6b-9bda-4eaf-a0fc-bba6f0e57f8d",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.7",
              "prompt": "Match the items of column I with those of column II :\nColumn I                      Column II\n(a) Ammonotelism               (i) Birds\n(b) Bowman's capsule          (ii) Water reabsorption\n(c) Micturition               (iii) Bony fish\n(d) Uricotelism               (iv) Urinary bladder\n(d) ADH                       (v) Renal tubule",
              "answer": "(a)–(iii) (b)–(v) (c)–(iv) (d) Uricotelism–(i) (e) ADH–(ii).",
              "solution": "One thing to flag first: the source list has **two items both labelled \"(d)\"** — Uricotelism and ADH. That's a printing slip, not a real double-match; treat the second one as **(e)**.\n\n**(a) Ammonotelism → (iii) Bony fish.** Ammonotelism is the strategy of excreting nitrogen as ammonia, and the chapter names many bony fishes (along with aquatic amphibians and aquatic insects) as ammonotelic.\n\n**(b) Bowman's capsule → (v) Renal tubule.** The renal tubule *begins* as the double-walled, cup-like Bowman's capsule, which wraps around the glomerulus — so Bowman's capsule is the starting segment of the renal tubule, not a separate structure.\n\n**(c) Micturition → (iv) Urinary bladder.** Micturition is the voluntary release of urine that has been stored in the urinary bladder — the whole reflex exists to empty that organ.\n\n**(d) Uricotelism → (i) Birds.** Uricotelism is excreting nitrogen as uric acid (a pellet or paste, with minimum water loss), and birds are one of the chapter's named uricotelic groups, alongside reptiles, land snails and insects.\n\n**(e) ADH → (ii) Water reabsorption.** ADH (vasopressin) works by facilitating water reabsorption from the later parts of the tubule, which is exactly why it prevents diuresis."
            },
            {
              "kind": "numerical",
              "id": "2b9a55eb-09bb-4120-9397-f78ec49029ee",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.11",
              "prompt": "Name the following:\n(a) A chordate animal having flame cells as excretory structures\n(b) Cortical portions projecting between the medullary pyramids in the human kidney\n(c) A loop of capillary running parallel to the Henle's loop.",
              "answer": "(a) Amphioxus (b) Renal columns / Columns of Bertini (c) Vasa recta.",
              "solution": "**(a) Amphioxus.** Flame cells (protonephridia) are usually associated with flatworms like Planaria, but the chapter also names the **cephalochordate Amphioxus** as an animal that uses them — and Amphioxus is the chordate the question is after.\n\n**(b) Renal columns, also called the Columns of Bertini.** Inside the kidney, the medulla is broken up into conical **medullary pyramids**. Between one pyramid and the next, the **cortex dips inward** in strips — those inward extensions of cortex running between the pyramids are the renal columns (Columns of Bertini). A common trap is to think of them as part of the medulla; they are actually cortex reaching down between the pyramids.\n\n**(c) Vasa recta.** The efferent arteriole forms the peritubular capillaries around the tubule, and a minute vessel from that network runs parallel to Henle's loop, shaped the same hairpin way — this is the **vasa recta**. It's what makes the counter-current mechanism work: its proximity to Henle's loop is what lets the medullary salt gradient stay in place instead of washing away."
            },
            {
              "kind": "numerical",
              "id": "06a082d8-8052-4bdc-b6ca-1df29b527e6a",
              "source": "ncert_exercise",
              "source_label": "NCERT 16.12",
              "prompt": "Fill in the gaps :\n(a) Ascending limb of Henle's loop is _______ to water whereas the descending limb is _______ to it.\n(b) Reabsorption of water from distal parts of the tubules is facilitated by hormone _______.\n(c) Dialysis fluid contain all the constituents as in plasma except _______.\n(d) A healthy adult human excretes (on average) _______ gm of urea/day.",
              "answer": "(a) impermeable ... permeable (b) ADH (c) nitrogenous wastes (d) 25–30 gm/day.",
              "solution": "**(a) Ascending limb — impermeable to water; descending limb — permeable to water.** The two limbs of Henle's loop have opposite permeabilities on purpose. The descending limb is permeable to water (but almost impermeable to electrolytes), so water leaves and the filtrate concentrates as it goes down. The ascending limb flips this: it is impermeable to water but allows electrolytes to pass out, so the filtrate dilutes again as it goes up.\n\n**(b) ADH.** Reabsorption of water from the later, distal parts of the tubule is facilitated by **ADH (antidiuretic hormone, also called vasopressin)**, released from the neurohypophysis whenever osmoreceptors sense too much fluid has been lost.\n\n**(c) The nitrogenous wastes.** In hemodialysis, the dialysing fluid is made to match blood plasma exactly — same salts, same glucose — **except that it contains no nitrogenous wastes**. That one missing piece is what drives the wastes in the blood to diffuse out on their own, down the concentration gradient, cleaning the blood.\n\n**(d) 25–30 gm/day.** A healthy adult human, on average, excretes about **25 to 30 grams of urea per day** in the urine — one of the standard numbers this chapter expects you to know alongside the 1–1.5 litre daily urine volume."
            }
          ]
        }
      ]
    }
  ]
};
