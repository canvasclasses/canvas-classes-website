'use strict';
// Class 11 Biology — Ch.12 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch12-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 12 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "fec94061-7943-4456-828e-965a6058114b",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A mitochondrion shown in cross-section with its folded inner membrane glowing faintly, tiny points of light drifting along the membrane toward a soft blue glow at one end, with small golden token-like shapes appearing near the membrane",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A single mitochondrion shown in cross-section, its folded inner membrane (cristae) rendered as smooth curved ridges glowing faintly, with a chain of small point-of-light particles representing electrons moving along the inner membrane toward one end where a soft blue glow represents oxygen. Near the membrane, small golden token-like shapes suggest ATP being released. Muted warm oranges and cool blues, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "f8827ba1-6abb-4173-8ebe-41d8eda17857",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 12 NCERT exercises** for *Respiration in Plants*, pulled out of the textbook's running order and re-sorted into four revision themes: substrates and glycolysis, the mitochondrial machinery that makes the bulk of the ATP, the fine print behind the famous balance sheet, and the six classic head-to-head comparisons NCERT loves to ask.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "b15d5a80-fd5b-4116-b03b-bd6cd6d1deae",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 12.1–12.12",
      "intro": "Every end-of-chapter exercise, regrouped into four revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-substrates-glycolysis",
          "title": "Respiratory Substrates & Glycolysis",
          "blurb": "What actually gets oxidised, and the ten-step road from glucose down to pyruvate.",
          "items": [
            {
              "kind": "numerical",
              "id": "45f80932-17dc-45bf-b453-a3006999a809",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.2",
              "prompt": "What are respiratory substrates? Name the most common respiratory substrate.",
              "answer": "Respiratory substrates are the compounds oxidised during respiration to release energy; the most common one is a carbohydrate — usually glucose.",
              "solution": "**Respiratory substrates** are the compounds that get oxidised inside the cell during respiration, releasing the energy that is later trapped as ATP.\n\nUsually this compound is a **carbohydrate**. In fact, this chapter calls glucose the *favoured substrate for respiration* — all other carbohydrates are usually converted into glucose first, before they enter the respiratory pathway. So the **most common respiratory substrate is glucose**.\n\nThat said, glucose isn't the only option. Proteins, fats and even organic acids can also be used as respiratory substrates in some plants under certain conditions. But in a living cell a single pure substrate is rarely used alone — pure fats or pure proteins are never respired by themselves; the fuel is usually a mixture."
            },
            {
              "kind": "numerical",
              "id": "fa5c964e-68bb-4764-9940-3b982bc6987b",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.3",
              "prompt": "Give the schematic representation of glycolysis?",
              "answer": "Glucose → (10 enzyme-controlled steps in the cytoplasm, via fructose-1,6-bisphosphate and two triose phosphates) → 2 Pyruvic acid, with a net yield of 2 ATP + 2 NADH + H+.",
              "solution": "NCERT's Figure 12.1 shows glycolysis as a chain of **ten enzyme-controlled reactions**, all happening in the **cytoplasm**, that carry glucose down to pyruvate. Here it is laid out step by step, with every ATP and NADH marked:\n\n1. **Glucose (6C)** is phosphorylated to **glucose-6-phosphate**, by the enzyme **hexokinase**. *(1st ATP spent.)*\n2. Glucose-6-phosphate **isomerises** to **fructose-6-phosphate**.\n3. Fructose-6-phosphate is phosphorylated to **fructose-1,6-bisphosphate**. *(2nd ATP spent.)*\n4. Fructose-1,6-bisphosphate is **split** into two three-carbon triose phosphates: **dihydroxyacetone phosphate (DHAP)** and **glyceraldehyde-3-phosphate (PGAL)**. From this point on, every step below happens twice per glucose, because there are now two triose molecules headed downstream.\n5. **PGAL is oxidised to 1,3-bisphosphoglycerate (BPGA)** — two hydrogen atoms are removed from PGAL and handed to NAD+, forming **NADH + H+**. *(The only NADH-forming step of glycolysis — once per triose, so twice per glucose.)*\n6. **BPGA is converted to 3-phosphoglyceric acid (PGA)**, an energy-yielding step whose energy is trapped as **ATP**. *(1st ATP-making step, ×2 per glucose.)*\n7. PGA is converted to **2-phosphoglycerate**.\n8. 2-phosphoglycerate loses water to form **phosphoenolpyruvate (PEP)**.\n9. **PEP is converted to pyruvic acid**, with another ATP made in the process. *(2nd ATP-making step, ×2 per glucose.)*\n\nBecause the run from step 5 onward happens for both triose molecules, the totals for one whole glucose come out to: **2 ATP spent** (steps 1 and 3), **4 ATP made** (steps 6 and 9, each happening twice), and **2 NADH + H+ formed** (step 5, happening twice). Net result: **2 molecules of pyruvic acid + a net gain of 2 ATP + 2 NADH + H+** per glucose."
            }
          ]
        },
        {
          "id": "s2-aerobic-respiration-ets",
          "title": "Aerobic Respiration — Krebs Cycle, ETS & Oxidative Phosphorylation",
          "blurb": "Pyruvate walks into the mitochondrion, gets stripped bare, and its hydrogen carriers cash in for the big ATP haul.",
          "items": [
            {
              "kind": "numerical",
              "id": "d4a3383b-12f1-473a-88b7-c9c5cb3f08b6",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.4",
              "prompt": "What are the main steps in aerobic respiration? Where does it take place?",
              "answer": "Three main steps — the link reaction and the Krebs cycle (both in the mitochondrial matrix), then the electron transport system with oxidative phosphorylation (on the inner mitochondrial membrane).",
              "solution": "Aerobic respiration begins once pyruvate — glycolysis's end product — is **transported from the cytoplasm into the mitochondrion**. Inside, there are crucial events, and each happens in a different part of the mitochondrion.\n\n**1. The link reaction — pyruvate becomes acetyl CoA.** In the **matrix**, pyruvate undergoes oxidative decarboxylation: a CO2 is removed and hydrogen is removed as NADH, catalysed by **pyruvic dehydrogenase** (needs NAD+ and Coenzyme A). This gives Acetyl CoA + CO2 + NADH + H+, and it happens twice per glucose — once for each pyruvate.\n\n**2. The Krebs (citric acid / TCA) cycle.** Still in the **matrix**, acetyl CoA condenses with oxaloacetic acid to form citric acid, which is then dismantled step by step — releasing 2 CO2, generating 3 NADH + H+ and 1 FADH2, and making 1 ATP (via GTP) — before regenerating oxaloacetic acid so the cycle can run again.\n\n**3. The electron transport system and oxidative phosphorylation.** This happens on the **inner mitochondrial membrane**. The NADH and FADH2 collected from glycolysis, the link reaction and the Krebs cycle are oxidised here, and their electrons are passed down a chain of carriers to molecular oxygen, forming water. That electron flow is coupled to ATP synthase, which makes the bulk of the ATP.\n\nSo, in short: the **complete oxidation of pyruvate** (link reaction + Krebs cycle) happens in the **mitochondrial matrix**, while the **electron-passing and ATP-making step** happens on the **inner mitochondrial membrane**."
            },
            {
              "kind": "numerical",
              "id": "f23b9ac8-2bfe-44e9-a682-9a265426ad73",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.5",
              "prompt": "Give the schematic representation of an overall view of Krebs' cycle.",
              "answer": "Acetyl CoA + OAA → citric acid → isocitrate → (2 decarboxylations) α-ketoglutaric acid → succinyl-CoA → succinic acid (GTP made) → malic acid → OAA regenerated; net per acetyl CoA: 2 CO2 + 3 NADH+H+ + 1 FADH2 + 1 ATP.",
              "solution": "NCERT's Figure 12.3 draws the Krebs cycle as a ring that starts and ends at oxaloacetic acid (OAA). Walking around it step by step:\n\n1. **Acetyl CoA (2C) + Oxaloacetic acid (OAA, 4C) + H2O → Citric acid (6C)**, catalysed by **citrate synthase**. CoA is released here, free to pick up the next acetyl group.\n2. Citric acid is **isomerised to isocitrate**.\n3. **1st decarboxylation:** isocitrate loses a CO2 and reduces NAD+ to NADH + H+, forming **α-ketoglutaric acid (5C)**.\n4. **2nd decarboxylation:** α-ketoglutaric acid loses another CO2 and reduces another NAD+ to NADH + H+, forming **succinyl-CoA (4C)**.\n5. **Succinyl-CoA → succinic acid (4C)**, with a molecule of **GTP** made directly — this is substrate-level phosphorylation. In a coupled reaction, GTP → GDP while ATP is made from ADP.\n6. Succinic acid is oxidised onward, with **FAD+ reduced to FADH2**, eventually reaching **malic acid (4C)**.\n7. **Malic acid is oxidised back to oxaloacetic acid (OAA)**, with **NAD+ reduced to NADH + H+** — closing the cycle so it can begin again with the next acetyl CoA.\n\nTally one full turn of the cycle and you get, for every acetyl CoA that enters: **2 CO2 released, 3 NADH + H+ formed, 1 FADH2 formed, and 1 ATP (via GTP) made**."
            },
            {
              "kind": "numerical",
              "id": "0055febe-dd78-4000-8f53-3370a27ec042",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.6",
              "prompt": "Explain ETS.",
              "answer": "The electron transport system is the chain of carriers on the inner mitochondrial membrane that passes electrons from NADH/FADH2 down to oxygen, with that flow coupled to ATP synthase; NADH yields 3 ATP, FADH2 yields 2 ATP.",
              "solution": "The **electron transport system (ETS)** is the pathway through which the electrons carried by NADH and FADH2 are passed from one carrier to the next until they finally reach oxygen. It sits on the **inner mitochondrial membrane**.\n\nFollow one electron through it:\n\n- **Complex I (NADH dehydrogenase)** oxidises NADH — the NADH made in the matrix during the citric acid cycle — and hands its electrons to **ubiquinone**, a carrier within the inner membrane.\n- **Complex II** feeds electrons from **FADH2** (generated during oxidation of succinate in the citric acid cycle) into the same ubiquinone.\n- The now-reduced ubiquinone, called **ubiquinol**, is oxidised by **Complex III (the cytochrome bc1 complex)**, which passes the electrons on to **cytochrome c** — a small, mobile protein sitting on the outer surface of the inner membrane.\n- Cytochrome c carries the electrons to **Complex IV (cytochrome c oxidase)**, which contains cytochromes a and a3 plus two copper centres, and finally hands the electrons to **O2**, forming **H2O**.\n\nAs electrons flow from Complex I through to Complex IV, that flow is coupled to **Complex V (ATP synthase)**, which builds ATP from ADP and inorganic phosphate. The amount of ATP made depends on where the electrons entered: oxidising one **NADH gives 3 ATP**, while oxidising one **FADH2 gives 2 ATP** — it enters lower down the chain, at Complex II, so it yields less.\n\nOxygen's whole role is right at the end — it is the **final hydrogen (electron) acceptor**. That one job is vital: by continuously removing hydrogen, oxygen keeps the entire chain moving. Take it away, and the chain backs up and stops."
            },
            {
              "kind": "numerical",
              "id": "568b840a-260d-4eca-ac1b-8dcfa6d246c8",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.11",
              "prompt": "What is oxidative phosphorylation?",
              "answer": "ATP synthesis driven by the energy of oxidation-reduction (electron flow through the ETS to oxygen), using ATP synthase (F1 + F0); 4 H+ cross F0 per ATP made.",
              "solution": "**Oxidative phosphorylation** is the process by which ATP is synthesised using the energy released as electrons move down the electron transport system to oxygen.\n\nThe name draws a contrast with photophosphorylation. In **photophosphorylation** (the light reaction of photosynthesis), it is **light energy** that builds the proton gradient used to make ATP. In respiration there is no light involved — instead it is the **energy of oxidation-reduction** (electrons moving from carrier to carrier) that builds the proton gradient. That's exactly why this ATP-making process in respiration is called **oxidative** phosphorylation.\n\nThe machine that actually makes the ATP is **ATP synthase (Complex V)**, which has two parts:\n\n- **F1**, the headpiece — a peripheral membrane protein complex that holds the site where ATP is actually made from ADP and inorganic phosphate.\n- **F0** — an integral membrane protein complex that forms the **channel** through which protons cross the inner mitochondrial membrane.\n\nProtons flow down their electrochemical gradient through F0, from the intermembrane space into the matrix, and that flow is coupled to ATP synthesis at F1. For **every ATP produced, 4 H+ pass through F0**."
            },
            {
              "kind": "numerical",
              "id": "7444bfa4-e96f-40ee-ba7f-e558b4c0b74c",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.12",
              "prompt": "What is the significance of step-wise release of energy in respiration?",
              "answer": "Releasing energy in small controlled steps lets the cell trap it as ATP at several points, instead of losing nearly all of it as heat the way a single-step combustion would.",
              "solution": "If a cell burned glucose the way you'd burn it in a flame — all at once — nearly all of that energy would be lost as heat, exactly as the plain combustion equation shows: **C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy**, with most of that Energy escaping as heat. Heat is useless to a cell; it cannot use a burst of warmth to build molecules or do cellular work.\n\nSo instead the cell oxidises glucose in a **series of small, slow, enzyme-controlled steps** — glycolysis, then the link reaction, then the Krebs cycle, then the electron transport system — rather than in one single reaction. Each step is sized so that the energy it releases is just enough to be **coupled to the synthesis of ATP**, instead of dissipating as heat.\n\nThis is the whole significance of the step-wise release: it lets the cell **capture usable energy in small, manageable packets (as ATP) at many points along the pathway**, rather than wasting nearly all of it as heat in one uncontrolled burst. ATP can then be spent exactly where and when the cell needs it — which is why ATP is called the **energy currency of the cell**."
            }
          ]
        },
        {
          "id": "s3-balance-sheet-amphibolic",
          "title": "The ATP Balance Sheet & the Amphibolic Pathway",
          "blurb": "The four assumptions behind the famous 38, why the pathway builds as much as it breaks, and what two gases reveal about the fuel being burned.",
          "items": [
            {
              "kind": "numerical",
              "id": "cb9bee53-aaa4-4542-bdcd-d23e1c2ddb7f",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.8",
              "prompt": "What are the assumptions made during the calculation of net gain of ATP?",
              "answer": "Four assumptions: a strictly sequential pathway; glycolytic NADH reaches the mitochondria for oxidative phosphorylation; no intermediates are withdrawn; only glucose is respired.",
              "solution": "NCERT lists **four assumptions** that the tidy '38 ATP per glucose' figure depends on:\n\n1. **A sequential, orderly pathway** — one substrate forming the next, with glycolysis, then the TCA (Krebs) cycle, then the ETS pathway following one after another.\n2. **The NADH made in glycolysis reaches the mitochondria.** It is assumed this NADH is transferred into the mitochondria and undergoes oxidative phosphorylation there, just like the NADH made inside the mitochondrion.\n3. **None of the pathway's intermediates are withdrawn** to synthesise any other compound — every carbon stays on the energy-extraction track.\n4. **Only glucose is being respired** — no other substrate (fat, protein, or anything else) enters the pathway at any intermediate stage.\n\nGrant all four, and the arithmetic gives a net gain of **38 ATP** per glucose. But NCERT is explicit that these assumptions are not really valid in a living system: all the pathways work simultaneously rather than one after another, substrates enter and leave as the cell needs them, ATP is used the moment it's needed, and enzyme rates are controlled by multiple means. So the 38 stays a useful, honest **theoretical exercise** — not a live readout of what any one cell is actually doing."
            },
            {
              "kind": "numerical",
              "id": "93d93b4c-03a6-4106-b853-00e38454fc88",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.9",
              "prompt": "Discuss \"The respiratory pathway is an amphibolic pathway.\"",
              "answer": "The respiratory pathway both breaks molecules down for energy (catabolism) and supplies intermediates that are withdrawn to build fats and proteins (anabolism) — so it is amphibolic, not purely catabolic.",
              "solution": "On the surface, respiration looks like a purely catabolic (breaking-down) process — it takes big molecules apart to release energy. But look at where non-carbohydrate fuels enter the pathway, and a second, opposite use shows up.\n\nFats are first split into **glycerol and fatty acids**. The fatty acids are broken down to **acetyl CoA** and enter the pathway there; the glycerol enters after being converted to **PGAL** (a glycolysis intermediate). Proteins are broken down by proteases into **amino acids**, which are deaminated, and depending on their structure, the leftover carbon skeleton enters the pathway as pyruvate, as acetyl CoA, or at some stage within the Krebs' cycle.\n\nHere is the key twist: these very same compounds — acetyl CoA, pyruvate, the Krebs' cycle intermediates — are also **withdrawn** from the respiratory pathway whenever the cell needs to build something. Take fatty acids: to *use* a fatty acid as fuel, it is broken down *to* acetyl CoA before entering the pathway. But when the organism needs to *make* a fatty acid, acetyl CoA is *withdrawn* from that very same point in the pathway to build it. The same link-up happens for proteins and their intermediates.\n\nBreaking a molecule down is **catabolism**; building one up is **anabolism**. Because the respiratory pathway participates in both — supplying breakdown products for energy and supplying building blocks for synthesis — it is better described as an **amphibolic pathway** than as a purely catabolic one."
            },
            {
              "kind": "numerical",
              "id": "6ec6d907-4312-45ff-be47-fa1c33df2db2",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.10",
              "prompt": "Define RQ. What is its value for fats?",
              "answer": "RQ = volume of CO2 evolved ÷ volume of O2 consumed; for fats, RQ is less than 1 (about 0.7).",
              "solution": "The **respiratory quotient (RQ)**, also called the respiratory ratio, is the ratio of the volume of CO2 evolved to the volume of O2 consumed during respiration:\n\n**RQ = volume of CO2 evolved ÷ volume of O2 consumed**\n\nIts value depends on which respiratory substrate is being used, because different fuels need different amounts of oxygen to be fully oxidised.\n\n**For fats, the RQ is less than 1.** Fats are hydrogen-rich and oxygen-poor molecules, so completely oxidising them consumes more oxygen than the carbon dioxide they release, pushing the ratio below 1. NCERT works this out for the fatty acid tripalmitin: 2(C51H98O6) + 145 O2 → 102 CO2 + 98 H2O + energy, giving RQ = 102 CO2 ÷ 145 O2 = **0.7**.\n\nSo the RQ for fats comes out to about **0.7** — compare that with carbohydrates, whose RQ is exactly **1** (equal CO2 and O2), and proteins, whose RQ is about **0.9**."
            }
          ]
        },
        {
          "id": "s4-telling-processes-apart",
          "title": "Telling the Processes Apart",
          "blurb": "The chapter's six classic side-by-side comparisons, gathered into one place.",
          "items": [
            {
              "kind": "numerical",
              "id": "4a81a9bf-134d-45b5-a22c-e75788770d8a",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.1",
              "prompt": "Differentiate between\n(a) Respiration and Combustion\n(b) Glycolysis and Krebs' cycle\n(c) Aerobic respiration and Fermentation",
              "answer": "Three side-by-side comparisons — see the tables in the solution.",
              "solution": "**(a) Respiration vs Combustion**\n\n| Feature | Respiration | Combustion |\n|---|---|---|\n| Steps | Occurs in a series of slow, step-wise, enzyme-controlled reactions | Happens in a single, uncontrolled step |\n| Energy release | Released gradually and trapped as ATP | Released all at once, mostly as heat |\n| Control | Enzyme-controlled, inside living cells | Uncontrolled; can happen outside any cell |\n| Usefulness of the energy | Energy captured in ATP can be used to do cellular work | Heat energy cannot be directly used to build molecules |\n| Overall equation | Same equation as combustion, C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy, but the energy is trapped across many small coupled steps | C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy, released mostly as heat in one burst |\n\n**(b) Glycolysis vs Krebs' cycle**\n\n| Feature | Glycolysis | Krebs' cycle |\n|---|---|---|\n| Location | Cytoplasm | Mitochondrial matrix |\n| Oxygen required | No — occurs in all organisms, aerobic or anaerobic | Yes — only runs once pyruvate has become acetyl CoA under aerobic conditions |\n| Starting material | Glucose (6C) | Acetyl CoA (2C) condensing with oxaloacetic acid (4C) |\n| What it produces | 2 × pyruvic acid (3C) | Regenerated oxaloacetic acid (4C), with CO2 released along the way |\n| Extent of oxidation | Partial oxidation of glucose | Complete oxidation of the acetyl group to CO2 |\n| Yield | Net 2 ATP + 2 NADH + H+ (per glucose) | Per acetyl CoA: 2 CO2 + 3 NADH+H+ + 1 FADH2 + 1 ATP (via GTP) |\n\n**(c) Aerobic respiration vs Fermentation**\n\n| Feature | Aerobic respiration | Fermentation |\n|---|---|---|\n| Extent of breakdown | Complete — glucose fully degraded to CO2 and H2O | Partial — stops at pyruvic acid's derivatives (ethanol or lactic acid) |\n| ATP yield | Net 38 ATP per glucose (theoretical) | Net 2 ATP per glucose |\n| NADH → NAD+ re-oxidation | Very vigorous | Slow |\n| Oxygen needed | Yes | No |"
            },
            {
              "kind": "numerical",
              "id": "55a2c556-aaf7-4ef5-b20e-11282ad33854",
              "source": "ncert_exercise",
              "source_label": "NCERT 12.7",
              "prompt": "Distinguish between the following:\n(a) Aerobic respiration and Anaerobic respiration\n(b) Glycolysis and Fermentation\n(c) Glycolysis and Citric acid Cycle",
              "answer": "Three side-by-side comparisons — see the tables in the solution.",
              "solution": "**(a) Aerobic respiration vs Anaerobic respiration**\n\n| Feature | Aerobic respiration | Anaerobic respiration (fermentation) |\n|---|---|---|\n| Oxygen | Required | Not required |\n| Extent of oxidation | Complete — glucose fully degraded to CO2 and H2O | Partial — stops at ethanol or lactic acid |\n| Location | Cytoplasm (glycolysis) plus mitochondria (link reaction, Krebs cycle, ETS) | Cytoplasm only |\n| ATP yield | Net 38 ATP per glucose (theoretical) | Net 2 ATP per glucose |\n| NADH → NAD+ re-oxidation | Very vigorous | Slow |\n| End products | CO2 + H2O + a large amount of energy | Ethanol + CO2, or lactic acid, with only a small amount of energy released |\n\n**(b) Glycolysis vs Fermentation**\n\n| Feature | Glycolysis | Fermentation |\n|---|---|---|\n| What it is | Breakdown of one glucose into two pyruvic acid molecules | What happens to that pyruvic acid next, under anaerobic conditions |\n| Location | Cytoplasm | Cytoplasm |\n| Oxygen needed | No | No |\n| Occurs in | All living organisms | Many prokaryotes and unicellular eukaryotes; lactic acid fermentation also occurs in animal muscle during exercise |\n| Product | Pyruvic acid | Ethanol + CO2 (alcoholic), or lactic acid (lactic acid fermentation) |\n| Its role | Always the first step, in every organism | An optional continuation of glycolysis, used only when oxygen is unavailable, mainly to regenerate NAD+ |\n\n**(c) Glycolysis vs Citric acid Cycle**\n\n| Feature | Glycolysis | Citric acid cycle (Krebs' cycle) |\n|---|---|---|\n| Location | Cytoplasm | Mitochondrial matrix |\n| Oxygen required | No | Yes, indirectly — it only proceeds once pyruvate has been aerobically converted to acetyl CoA |\n| Starting material | Glucose (6C) | Acetyl CoA (2C) + oxaloacetic acid (4C) |\n| Nature of the pathway | A straight, one-way chain of ten reactions | A cyclic pathway — it regenerates its own starting material, oxaloacetic acid |\n| Products per turn | 2 pyruvic acid, net 2 ATP + 2 NADH+H+ (whole pathway, per glucose) | 2 CO2 + 3 NADH+H+ + 1 FADH2 + 1 ATP, per acetyl CoA that enters |"
            }
          ]
        }
      ]
    }
  ]
};
