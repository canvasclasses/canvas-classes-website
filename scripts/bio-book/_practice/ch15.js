'use strict';
// Class 11 Biology — Ch.15 — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch15-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 14 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "49bf67e5-e3c6-42b9-b067-28e1917dd066",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A stylised human heart at the centre with a river of red blood cells flowing outward through branching vessels, and a faint ECG waveform tracing along the bottom edge",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A stylised human heart sits at the centre, with blood vessels branching outward on both sides carrying flowing red blood cells and pale straw-coloured plasma. A faint electrocardiogram waveform (a small P-wave, a tall spiked QRS complex, a rounded T-wave, repeating) runs along the bottom edge of the image like a glowing horizon line. Clean white outlines, muted reds and warm tones against the dark background, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "a1db751a-c1e8-400f-9551-42fa613207b7",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 14 NCERT exercises** for *Body Fluids and Circulation*, pulled out of the textbook's running order and re-sorted into five revision themes: what blood itself is made of, how blood and lymph compare with the two circulatory plans, the heart's evolutionary story and its own built-in pacemaker, one full beat read out as the cardiac cycle and the ECG, and finally two classic recap questions that mix ideas from across the whole chapter.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "442871d2-2441-4023-8c3a-adeac9e470cb",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 15.1–15.14",
      "intro": "Every end-of-chapter exercise, regrouped into five revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-blood-composition",
          "title": "Blood — Composition, Cells & Why It Counts as Connective Tissue",
          "blurb": "The formed elements and their jobs, what plasma proteins actually do, and why blood is called a tissue at all.",
          "items": [
            {
              "kind": "numerical",
              "id": "c4f253c3-1f55-42e2-9797-8f0e3eeaee1f",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.1",
              "prompt": "Name the components of the formed elements in the blood and mention one major function of each of them.",
              "answer": "RBCs transport respiratory gases; WBCs defend the body; platelets release the substances that clot blood.",
              "solution": "The **formed elements** are the cellular part of blood — everything left once you take the plasma away. There are three of them.\n\n**Erythrocytes (RBCs)** — the most abundant blood cell, packed with **haemoglobin**. Their major job is **transporting respiratory gases** (oxygen and carbon dioxide) around the body.\n\n**Leucocytes (WBCs)** — a mixed group split into granulocytes (neutrophils, eosinophils, basophils) and agranulocytes (lymphocytes, monocytes). As a group, their major job is **defense** — neutrophils and monocytes are phagocytic and destroy foreign organisms, basophils drive inflammatory reactions, eosinophils resist infections, and lymphocytes carry out the body's immune responses.\n\n**Platelets (thrombocytes)** — cell fragments pinched off from megakaryocytes. Their major job is to **release the substances that clot blood**, sealing a wound before too much blood is lost.\n\nSo one line each: RBCs carry gases, WBCs defend the body, platelets stop the bleeding."
            },
            {
              "kind": "numerical",
              "id": "dd39b906-36f3-4ffc-aa3d-c326342086e2",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.2",
              "prompt": "What is the importance of plasma proteins?",
              "answer": "Fibrinogen clots blood, globulins handle defense, and albumins maintain osmotic balance.",
              "solution": "Plasma is about 90–92% water, and the remaining 6–8% is mostly **proteins**. These proteins are not just filler — each one does a specific, important job:\n\n- **Fibrinogen** — needed for the **coagulation (clotting)** of blood. Without it, a cut would not seal.\n- **Globulins** — mainly involved in the body's **defense mechanisms** (this is the protein family antibodies belong to).\n- **Albumins** — help maintain **osmotic balance**, which means holding water in the right places inside the blood vessels instead of letting it leak out uncontrollably.\n\nSo plasma proteins together cover three separate needs at once: stopping blood loss, fighting infection, and keeping fluid balance steady. Lose any one of these proteins and a specific system breaks — that's why each is worth naming individually rather than lumping them together as 'plasma protein.'"
            },
            {
              "kind": "numerical",
              "id": "6701feb3-9440-424e-b5ef-bfa8572fc00c",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.4",
              "prompt": "Why do we consider blood as a connective tissue?",
              "answer": "Because it fits the connective-tissue definition exactly — cells (the formed elements) scattered in a matrix — except the matrix here is a fluid (plasma) instead of a solid.",
              "solution": "It sounds odd at first — we usually picture connective tissue as something solid, like bone or a ligament. But strip that picture down to its actual definition: a connective tissue is just **cells scattered in a matrix** (a background material the cells sit in).\n\nBlood fits that definition exactly. It has two parts, and only two: a **fluid matrix**, which is the **plasma**, and **cells suspended in it**, which are the **formed elements** (RBCs, WBCs, platelets). The only thing unusual about blood, compared to a 'typical' connective tissue like cartilage or bone, is that its matrix happens to be a **fluid** instead of a solid.\n\nSo blood is a **special connective tissue** — special because of the fluid matrix, but still a connective tissue by the same rule every other one follows: cells sitting in a matrix."
            }
          ]
        },
        {
          "id": "s2-lymph-and-double-circulation",
          "title": "Blood vs Lymph, and Double Circulation",
          "blurb": "What lymph is that blood isn't, and why keeping oxygenated and deoxygenated blood apart matters.",
          "items": [
            {
              "kind": "numerical",
              "id": "f5eef24f-913e-488b-bf33-74b916154e9b",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.5",
              "prompt": "What is the difference between lymph and blood?",
              "answer": "Blood is red, carries all the formed elements including RBCs, and flows in vessels; lymph is colourless, has no RBCs, mainly carries lymphocytes, and drains through the lymphatic system.",
              "solution": "**Blood** is plasma plus **all** the formed elements — RBCs, WBCs, and platelets are all present. It carries the **larger plasma proteins**, is **red** in colour because of the RBCs, and flows through **arteries, veins, and capillaries**.\n\n**Lymph** is different in almost every one of those respects. It is a **colourless** fluid — it has **no RBCs**, so it can't be red. It mainly contains specialised **lymphocytes**, and it carries **less protein**, because the larger plasma proteins were too big to leak out of the capillaries and stayed behind in the blood. It flows through its own separate network, the **lymphatic system**, which drains it back into the major veins. Lymph also does one job blood cannot: **fats are absorbed through lymph in the lacteals of the intestinal villi**.\n\nIn short: lymph is what blood plasma becomes after it leaks out of the capillaries, loses its big proteins and its RBCs, and picks up lymphocytes instead — a thinner, colourless, immune-focused cousin of blood."
            },
            {
              "kind": "numerical",
              "id": "42823e9a-590a-4e48-9557-cc53cc2ba40d",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.6",
              "prompt": "What is meant by double circulation? What is its significance?",
              "answer": "Blood follows two completely separate loops — pulmonary and systemic — through a 4-chambered heart, so oxygenated and deoxygenated blood never mix.",
              "solution": "**Double circulation** means blood makes **two separate round trips** through the heart in a single cycle, instead of just one. In humans, the **right ventricle** sends deoxygenated blood out on the **pulmonary** loop (to the lungs and back to the left atrium), and the **left ventricle** sends oxygenated blood out on the **systemic** loop (to the body tissues and back to the right atrium). These two pathways are kept **completely separate**, with **no mixing at all** — this is only possible because the heart is fully **4-chambered** (two atria, two ventricles), found in crocodiles, birds, and mammals.\n\n**Why it matters:** because the two loops never mix, the blood that finally reaches the body tissues on the systemic loop is **fully oxygenated**, not a diluted mix of oxygenated and deoxygenated blood. Compare this with amphibians and reptiles (except crocodiles), which have only a **single ventricle** — oxygenated and deoxygenated blood **get mixed up** there before being pumped out, which is why that pattern is called only **incomplete** double circulation. True double circulation, with its total separation of the two blood types, is what lets the body's tissues receive blood of the highest possible oxygen content on every single beat."
            }
          ]
        },
        {
          "id": "s3-heart-evolution-and-pacemaker",
          "title": "The Heart's Evolution and Its Own Pacemaker",
          "blurb": "From a 2-chambered fish heart to our 4-chambered one, and why the heart never needs to be told to beat.",
          "items": [
            {
              "kind": "numerical",
              "id": "7d8af318-45ed-4b05-818a-3984a46edc09",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.8",
              "prompt": "Describe the evolutionary change in the pattern of heart among the vertebrates.",
              "answer": "Chambers climb from 2 (fishes) to 3 (amphibians/reptiles, except crocodiles) to 4 (crocodiles, birds, mammals) — and circulation moves from single, to incomplete double, to true double.",
              "solution": "Every vertebrate has a muscular, chambered heart, but the number of chambers — and how well the two blood types are kept apart — climbs as you move up the vertebrate ladder.\n\n**Fishes** have a **2-chambered heart**: one atrium, one ventricle. The heart pumps out deoxygenated blood, the gills oxygenate it, and it goes straight to the body; the body then sends deoxygenated blood back to the heart. Blood makes just **one loop** per trip, so this is **single circulation**.\n\n**Amphibians and reptiles** — with one important exception, **crocodiles** — have a **3-chambered heart**: two atria, but only a **single ventricle**. The left atrium takes in oxygenated blood, the right atrium takes in deoxygenated blood, but since there's only one ventricle, the two get **mixed up** there before being pumped out. Because the blood going to the body is a mix, this is called **incomplete double circulation**.\n\n**Crocodiles, birds, and mammals** have a fully **4-chambered heart** — two atria and two ventricles. Oxygenated and deoxygenated blood reach the left and right atria, pass down into the ventricle on the **same** side, and are pumped out with **no mixing at all**. Two completely separate pathways exist, which is true **double circulation**.\n\nSo the trend across vertebrate evolution is: more chambers, and progressively tighter separation between oxygenated and deoxygenated blood — from none (fish) to partial (amphibians/most reptiles) to complete (crocodiles, birds, mammals, including us)."
            },
            {
              "kind": "numerical",
              "id": "21d07cd4-d875-4180-8828-6c094d522118",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.9",
              "prompt": "Why do we call our heart myogenic?",
              "answer": "Because the beat is generated by the heart's own nodal muscle tissue, not by an outside nerve.",
              "solution": "*Myo-* means muscle, *-genic* means generated by. Our heart is called **myogenic** because its beat is generated by the heart's **own muscle** — specifically a special **nodal tissue** built into the heart itself — rather than by a signal arriving from an outside nerve.\n\nThe normal activity of the heart is regulated **intrinsically**, meaning it is **auto-regulated**. The nodal tissue can **generate action potentials without any external stimuli** — it is **autoexcitable**. That's why a heart can keep beating on its own for a while even after every nerve to it has been cut, or after it's removed from the body altogether: the beat was never coming from an outside nerve in the first place.\n\n(Some animals have a *neurogenic* heart instead, where a nerve signal starts every beat — but the human heart is firmly myogenic.) The brain doesn't create the human heartbeat; as later parts of this chapter show, it only speeds it up or slows it down once the heart's own nodal tissue has already started it."
            },
            {
              "kind": "numerical",
              "id": "4d394609-1d04-4f04-bad5-eec273b6acf2",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.10",
              "prompt": "Sino-atrial node is called the pacemaker of our heart. Why?",
              "answer": "Because the SAN fires the most action potentials of any nodal tissue (70-75/min), so it sets the pace the rest of the heart follows.",
              "solution": "The whole heart's nodal tissue is **autoexcitable** — every part of it can generate its own action potentials without an outside signal. But different parts fire at **different rates**.\n\nThe **sino-atrial node (SAN)**, sitting in the right upper corner of the right atrium, generates the **maximum number of action potentials of them all — about 70–75 per minute**. Because it fires faster than every other patch of nodal tissue (the AVN, the AV bundle, the Purkinje fibres), it is the one that **initiates and maintains the rhythmic contraction of the heart** — the rest of the heart simply follows its lead rather than firing at its own, slower, natural rate.\n\nThat's exactly why the SAN is called the **pacemaker**: it doesn't just start the beat, it **sets the tempo** for the whole heart, which is why a normal heart beats 70–75 times a minute, averaging 72 beats per minute."
            },
            {
              "kind": "numerical",
              "id": "1677367a-8b1c-4750-a28d-9cb8dbae1d25",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.11",
              "prompt": "What is the significance of atrio-ventricular node and atrio-ventricular bundle in the functioning of heart?",
              "answer": "They relay the SAN's signal from the atria to the ventricles in the correct order, so the ventricles contract only after the atria have finished — keeping the beat properly sequenced.",
              "solution": "The heart's electrical signal has a fixed relay path: **SAN → AVN → AV bundle → right and left bundles → Purkinje fibres**. The AVN and the AV bundle are the two links in the middle of that chain, and their job is to carry the beat **from the atrial side of the heart to the ventricular side**.\n\nThe **atrio-ventricular node (AVN)** sits in the lower left corner of the right atrium, close to the atrio-ventricular septum. It picks up the action potential that the SAN has already sent through the atria (which is what makes the atria contract — atrial systole).\n\nFrom the AVN, the **atrio-ventricular bundle (AV bundle)** is a bundle of nodal fibres that passes through the atrio-ventricular septum, emerges on top of the inter-ventricular septum, and immediately divides into a **right and a left bundle**. These branches carry the signal out through minute fibres — the **Purkinje fibres** — running throughout the ventricular muscle of each side, which is what finally triggers **ventricular systole**.\n\nThe significance is this: without the AVN and AV bundle acting as the relay, the SAN's signal would have no route from the atria into the ventricular muscle. Because this relay exists, the ventricles contract only **after** the atrial signal has been carried across, keeping the atrial contraction and the ventricular contraction properly sequenced — atria push blood down into the ventricles first, and only then do the ventricles pump that blood onward."
            }
          ]
        },
        {
          "id": "s4-cardiac-cycle-and-ecg",
          "title": "The Cardiac Cycle, Heart Sounds & the ECG",
          "blurb": "One beat, the numbers that describe it, and the P-QRS-T trace a machine draws of it.",
          "items": [
            {
              "kind": "numerical",
              "id": "6e161c55-81e3-4d55-bd7c-189ba5e42d82",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.12",
              "prompt": "Define a cardiac cycle and the cardiac output.",
              "answer": "Cardiac cycle: the repeating sequence of systole and diastole of the atria and ventricles, lasting 0.8 seconds. Cardiac output: stroke volume × heart rate, about 5000 mL/min.",
              "solution": "**Cardiac cycle:** the repeating sequence made up of the **systole and diastole of both the atria and the ventricles** — starting from joint diastole (all four chambers relaxed), through atrial systole, then ventricular systole (while the atria relax), then ventricular diastole, and back to joint diastole again. Since the heart beats **72 times per minute**, it completes 72 of these cycles every minute, which means each single cardiac cycle takes **0.8 seconds** (60 seconds ÷ 72 beats).\n\n**Cardiac output:** during each cycle, every ventricle pumps out about **70 mL of blood** — this is called the **stroke volume**. Multiply the stroke volume by the heart rate and you get the **cardiac output**: the volume of blood pumped out by each ventricle per minute. In a healthy person this averages **5000 mL, or 5 litres, per minute**. The body can change either the stroke volume or the heart rate to change the cardiac output — which is why an athlete's cardiac output is much higher than an ordinary person's."
            },
            {
              "kind": "numerical",
              "id": "e41a57f6-2a4e-421e-a36e-85b5e0da0b3e",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.13",
              "prompt": "Explain heart sounds.",
              "answer": "'Lub' comes from the AV valves (tricuspid + bicuspid) closing at the start of ventricular systole; 'dub' comes from the semilunar valves closing as the ventricles relax.",
              "solution": "During each cardiac cycle, the heart makes **two prominent sounds**, easily heard through a stethoscope, and both come from valves slamming shut — not from the muscle contracting itself.\n\nThe **first heart sound, 'lub'**, comes from the **closure of the tricuspid and bicuspid valves** — the two AV (atrio-ventricular) valves. This happens right as the ventricles **begin to contract** (the start of ventricular systole): rising ventricular pressure pushes blood back toward the atria, and the AV valves slam shut to stop it.\n\nThe **second heart sound, 'dub'**, comes from the **closure of the semilunar valves** — the valves at the openings into the pulmonary artery and the aorta. This happens as the ventricles **relax** (ventricular diastole): falling ventricular pressure lets blood in the arteries push back against the semilunar valves, closing them so blood cannot flow backward into the ventricles.\n\nBoth sounds are of **clinical diagnostic significance** — a doctor listening for the timing, loudness, or any extra sound beyond the normal lub-dub can pick up on valve or heart problems."
            },
            {
              "kind": "numerical",
              "id": "d91d08d5-aaab-4ea8-bd7c-24a7ae416a0d",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.14",
              "prompt": "Draw a standard ECG and explain the different segments in it.",
              "answer": "A standard ECG shows a small P-wave (atrial depolarisation), a tall QRS complex (ventricular depolarisation), then a T-wave (ventricular repolarisation) — in that order, repeating with each beat.",
              "solution": "We can't draw the trace here, but you can build the whole shape in your head from three named segments, read left to right, repeating once every cardiac cycle:\n\n**P-wave** — a small, rounded upward wave that comes first. It represents the **electrical excitation (depolarisation) of the atria**, which is what leads to the **contraction of both atria** (atrial systole).\n\n**QRS complex** — the tall, sharp spike right after the P-wave, made of three parts close together: a small initial downward dip (**Q**), a tall upward peak (**R**), and a downward deflection completing it (**S**). Together, Q, R and S represent the **depolarisation of the ventricles**, and the **ventricular contraction (systole) begins shortly after Q**.\n\n**T-wave** — a rounded upward wave that comes last, separated from the QRS complex by a short flat stretch. It represents the **repolarisation of the ventricles** — their return from an excited state back to normal — and the **end of the T-wave marks the end of systole**.\n\nSo, on paper: a small bump (P), then a sharp tall spike (QRS), then a wider rounded bump (T), then a flat stretch before the next beat's P-wave begins. To record a standard ECG, three electrical leads are attached — one to each wrist and one to the left ankle. And since each QRS complex marks one ventricular contraction, **counting the number of QRS complexes** in a given time tells you the heart rate; any deviation from this normal shape can signal an abnormality."
            }
          ]
        },
        {
          "id": "s5-cumulative-recall",
          "title": "Cumulative Recall — Match the Column & Four Classic Comparisons",
          "blurb": "Two questions that pull together facts from across the whole chapter — the best test of whether it all stuck.",
          "items": [
            {
              "kind": "numerical",
              "id": "82c85740-0759-4cd8-80a3-b289f63aa6ae",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.3",
              "prompt": "Match Column I with Column II :\n\n| Column I | Column II |\n|---|---|\n| (a) Eosinophils | (i) Coagulation |\n| (b) RBC | (ii) Universal Recipient |\n| (c) AB Group | (iii) Resist Infections |\n| (d) Platelets | (iv) Contraction of Heart |\n| (e) Systole | (v) Gas transport |",
              "answer": "(a)–(iii), (b)–(v), (c)–(ii), (d)–(i), (e)–(iv)",
              "solution": "Match each one by what it actually does, straight from the chapter:\n\n**(a) Eosinophils → (iii) Resist Infections.** Eosinophils are granulocytes making up 2–3% of WBCs; they resist infections and are also linked to allergic reactions.\n\n**(b) RBC → (v) Gas transport.** RBCs are packed with haemoglobin, an iron-containing protein whose job is transporting respiratory gases (oxygen and carbon dioxide) around the body.\n\n**(c) AB Group → (ii) Universal Recipient.** Group AB carries both A and B antigens on its RBCs, so its plasma has **no antibodies (nil)** to react against incoming blood — it can accept blood from AB as well as every other group, which is why it's called the universal recipient.\n\n**(d) Platelets → (i) Coagulation.** Platelets (thrombocytes) are cell fragments from megakaryocytes; they release the substances that clot (coagulate) blood.\n\n**(e) Systole → (iv) Contraction of Heart.** Systole names the **contraction** phase of a heart chamber (atrial systole or ventricular systole) — the opposite of diastole, which is relaxation.\n\nFull matching: **(a)–(iii), (b)–(v), (c)–(ii), (d)–(i), (e)–(iv).**"
            },
            {
              "kind": "numerical",
              "id": "297b7d0b-a4ed-4696-aa42-fb7e0a3fb4d9",
              "source": "ncert_exercise",
              "source_label": "NCERT 15.7",
              "prompt": "Write the differences between :\n(a) Blood and Lymph\n(b) Open and Closed system of circulation\n(c) Systole and Diastole\n(d) P-wave and T-wave",
              "answer": "Four side-by-side comparisons — see the tables in the solution.",
              "solution": "**(a) Blood vs Lymph**\n\n| Feature | Blood | Lymph |\n|---|---|---|\n| Formed elements | All present — RBCs, WBCs, platelets | No RBCs; mainly lymphocytes |\n| Protein content | Carries the larger plasma proteins | Less protein — larger proteins stay behind in the vessels |\n| Colour | Red (because of RBCs) | Colourless |\n| Where it flows | Arteries, veins, capillaries | Lymphatic system, draining back to the major veins |\n| Special role | — | Absorbs fats via the lacteals of the intestinal villi |\n\n**(b) Open vs Closed system of circulation**\n\n| Feature | Open system | Closed system |\n|---|---|---|\n| Found in | Arthropods, molluscs | Annelids, chordates (including us) |\n| Blood pathway | Pumped into open spaces (sinuses); bathes the organs directly | Stays inside a closed network of blood vessels the whole time |\n| Flow regulation | Cannot be precisely regulated | Can be precisely regulated — the key advantage of a closed system |\n\n**(c) Systole vs Diastole**\n\n| Feature | Systole | Diastole |\n|---|---|---|\n| Meaning | Contraction of a heart chamber | Relaxation of a heart chamber |\n| Atrial phase | Atrial systole pushes extra blood (about 30% more) down into the ventricles | Atrial diastole — the atria relax while the ventricles contract |\n| Ventricular phase | Ventricular systole pumps blood into the pulmonary artery/aorta; shuts the AV valves, opens the semilunar valves | Ventricular diastole — pressure falls, semilunar valves close, AV valves open, ventricles refill |\n| Whole-heart state | — | Joint diastole — all four chambers relaxed together; the cycle's resting start and end point |\n\n**(d) P-wave vs T-wave**\n\n| Feature | P-wave | T-wave |\n|---|---|---|\n| Represents | Depolarisation (electrical excitation) of the atria | Repolarisation of the ventricles |\n| Leads to / marks | Contraction of both atria (atrial systole) | Return of the ventricles to a normal state; its end marks the end of systole |\n| Position on the ECG trace | The first, small wave | The last wave, appearing after the QRS complex |"
            }
          ]
        }
      ]
    }
  ]
};
