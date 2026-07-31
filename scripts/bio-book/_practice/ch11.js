'use strict';
// Class 11 Biology — Ch.11 Photosynthesis — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated 2026-07-30 to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module now carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = {
  "slug": "ch11-practice-ncert-exercises",
  "title": "Practice — NCERT Exercises",
  "subtitle": "All 9 NCERT textbook exercises for the chapter, grouped into 3 revision themes with full worked solutions.",
  "page_type": "lesson",
  "tags": [
    "ncert-exercises",
    "practice"
  ],
  "blocks": [
    {
      "id": "a63adde2-6498-4404-a48e-ee45507c101d",
      "type": "image",
      "order": 0,
      "src": "",
      "alt": "A leaf cross-section on the left showing ordinary C3 mesophyll, next to a C4 leaf cross-section on the right showing the wreath-like Kranz anatomy of enlarged bundle sheath cells packed with chloroplasts",
      "caption": "",
      "width": "full",
      "aspect_ratio": "16:5",
      "generation_prompt": "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a C3 leaf cross-section with ordinary mesophyll tissue (palisade and spongy layers) and a small, ordinary vascular bundle with unremarkable bundle sheath cells. Right half: a C4 leaf cross-section showing the Kranz anatomy — a ring of large, thick-walled bundle sheath cells densely packed with chloroplasts, wrapped around the vascular bundle like a wreath, with mesophyll cells arranged radially around that ring. Clean white outlines, muted natural greens and soft tan tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image."
    },
    {
      "id": "8711643e-80f3-4484-876a-569b1eed8d98",
      "type": "text",
      "order": 1,
      "markdown": "You've read the chapter — now drill it. Below are **all 9 NCERT exercises** for *Photosynthesis in Higher Plants*, pulled out of the textbook's running order and re-sorted into three revision themes: C4 anatomy and why it's so efficient, what the pigments actually do, and reading the data NCERT gives you.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through."
    },
    {
      "id": "f336d0c2-48ac-4e7b-963d-f0fcae3db8cb",
      "type": "practice_bank",
      "order": 2,
      "title": "NCERT Exercises 11.1–11.9",
      "intro": "Every end-of-chapter exercise, regrouped into three revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.",
      "sections": [
        {
          "id": "s1-c4-anatomy",
          "title": "C4 Anatomy and Why It's So Efficient",
          "blurb": "Telling C3 from C4, and why so few Calvin-cycle cells still make a C4 plant so productive.",
          "items": [
            {
              "kind": "numerical",
              "id": "d9bce8af-01f1-4c8c-80e1-a173857bddd0",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.1",
              "prompt": "By looking at a plant externally, can you tell whether a plant is C3 or C4? Why and how?",
              "answer": "No, not reliably — C3 vs C4 is a biochemical/anatomical difference, not an external one. Growth habitat (hot, bright, tropical grasses tend to be C4) is only a weak hint.",
              "solution": "Not with certainty. Whether a plant is C3 or C4 comes down to **which CO2-fixing pathway it runs and whether it has Kranz anatomy** — both are things you can only see biochemically or under a microscope, not by looking at the plant's outward shape, leaf form, or flowers.\n\nThe closest thing to an external clue is **habitat and growth habit**: C4 photosynthesis is especially advantageous in hot, bright, dry tropical conditions, so many C4 plants are tropical grasses — maize, sugarcane, sorghum. If you see a grass thriving in blazing midday heat, it's a reasonable guess that it's C4. But that's a correlation from ecology, not a rule — plenty of C3 plants also grow in the tropics, and this guess can be wrong.\n\nThe only certain ways to tell are internal: check the leaf's anatomy for the Kranz pattern (see the next question), or test biochemically for the first stable product of CO2 fixation (a 3-carbon PGA means C3; a 4-carbon OAA means C4)."
            },
            {
              "kind": "numerical",
              "id": "82525ebf-0952-4f5e-acfd-7eca41a93ebb",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.2",
              "prompt": "By looking at which internal structure of a plant you can tell whether a plant is C3 or C4? Explain.",
              "answer": "Kranz anatomy — a wreath-like ring of large, chloroplast-rich bundle sheath cells around the vascular bundle, present only in C4 plants.",
              "solution": "Take a thin cross-section of the leaf and look at it under a microscope. In a **C4 plant**, you'll see **Kranz anatomy** — the vascular bundles are surrounded by a ring (*Kranz* is German for 'wreath') of **large, thick-walled bundle sheath cells packed with chloroplasts**, and the mesophyll cells are arranged **radially, concentrically around that bundle sheath ring**.\n\nA **C3 plant** has none of this. Its bundle sheath cells are ordinary — small, thin-walled, with few or no chloroplasts — and the mesophyll is arranged in the usual way (typically palisade and spongy layers), with no wreath-like ring around the vascular bundle.\n\nSo the tell isn't a single cell type on its own — it's the **whole arrangement**: a conspicuous ring of big, chloroplast-dense cells hugging the vascular bundle means C4; its absence means C3."
            },
            {
              "kind": "numerical",
              "id": "c8799e97-0cb2-4107-8342-688148a3cb92",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.3",
              "prompt": "Even though a very few cells in a C4 plant carry out the biosynthetic – Calvin pathway, yet they are highly productive. Can you discuss why?",
              "answer": "Because those few bundle sheath cells run the Calvin cycle in an almost CO2-saturated environment, thanks to the CO2-concentrating relay from the mesophyll — near-zero photorespiration, near-maximum RuBisCO efficiency.",
              "solution": "C4 plants split the job between two cell types instead of doing everything in one. The **mesophyll cells** fix CO2 first, using the enzyme **PEP carboxylase** — an enzyme with a very high affinity for CO2 and no oxygenase side-activity, so it works efficiently even at the very low CO2 concentration ordinary air provides. That fixation produces a **4-carbon acid**, which is then shuttled into the **bundle sheath cells**.\n\nOnce inside, the 4-carbon acid is broken down again, **releasing CO2 right there** — which pumps the local CO2 concentration inside the bundle sheath cells up far higher than what the mesophyll or the atmosphere ever sees.\n\nThat's the whole trick. Only the bundle sheath cells run the Calvin cycle, but they run it bathed in a **CO2-rich environment built specially for them** by the mesophyll's relay. RuBisCO working in that concentrated CO2 does almost nothing but carboxylation — see the next question — with essentially no wasted turns on photorespiration. So a small population of Calvin-cycle-running cells, each working close to its maximum possible efficiency, sustains a very high rate of sugar production for the whole leaf."
            },
            {
              "kind": "numerical",
              "id": "107bc057-040c-4d67-a2fa-54334a3e00bd",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.4",
              "prompt": "RuBisCO is an enzyme that acts both as a carboxylase and oxygenase. Why do you think RuBisCO carries out more carboxylation in C4 plants?",
              "answer": "Because the C4 CO2-concentrating relay keeps CO2 high and O2 relatively low right where RuBisCO sits, and that ratio is what decides carboxylase vs oxygenase activity.",
              "solution": "RuBisCO doesn't choose between carboxylase and oxygenase activity randomly — which one it does more of depends on the **local ratio of CO2 to O2** around the enzyme. More CO2 relative to O2 favours **carboxylation** (the Calvin cycle, building sugar); more O2 relative to CO2 favours **oxygenation** (photorespiration, which wastes energy and fixed carbon).\n\nIn a **C4 plant**, RuBisCO sits inside the bundle sheath cells, which — as the previous question explained — are kept in an artificially **CO2-rich environment** by the mesophyll's PEP-carboxylase relay. With CO2 concentrated that high right where RuBisCO works, the enzyme's oxygenase activity is almost completely suppressed, and it spends nearly all its time carboxylating.\n\nContrast that with a **C3 plant**, where RuBisCO is directly exposed to ordinary atmospheric air, with its comparatively low CO2 and relatively higher O2 — especially on a hot, bright day when stomata partly close and O2 (a photosynthesis by-product) builds up locally. Under those conditions RuBisCO does a substantial amount of oxygenase work, and photorespiration eats into the plant's productivity. C4's whole anatomical and biochemical design exists specifically to avoid that."
            }
          ]
        },
        {
          "id": "s2-pigments",
          "title": "Pigments — What They Do and How They Behave",
          "blurb": "Why chlorophyll a is irreplaceable, why a dark leaf turns yellow, and why shade leaves look different from sun leaves.",
          "items": [
            {
              "kind": "numerical",
              "id": "ca78a8e0-b960-418b-b2ea-deb864d97ad1",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.5",
              "prompt": "Suppose there were plants that had a high concentration of Chlorophyll b, but lacked chlorophyll a, would it carry out photosynthesis? Then why do plants have chlorophyll b and other accessory pigments?",
              "answer": "No — only chlorophyll a can run the reaction centre. Accessory pigments exist to widen the range of light captured and to protect chlorophyll a, not to replace it.",
              "solution": "**No, it would not photosynthesise**, no matter how much chlorophyll b it had. Only **chlorophyll a** sits at the reaction centre and can actually perform the photochemical act — turning absorbed light energy into the excited electron that starts the light reaction. Chlorophyll b, xanthophylls and carotenoids can all absorb light, but every one of them can only **hand that captured energy on to chlorophyll a** — none of them can run the reaction centre chemistry on its own. Without chlorophyll a, that funnelled energy has nowhere to go, so there is no light reaction and no photosynthesis at all, regardless of how much chlorophyll b is sitting there.\n\nSo why do plants bother keeping chlorophyll b and the other accessory pigments if chlorophyll a is doing all the real work? Two reasons, both about making chlorophyll a's job easier rather than replacing it:\n\n1. **They widen the usable spectrum.** Each accessory pigment absorbs a somewhat different set of wavelengths than chlorophyll a, so together the whole pigment team captures a broader range of light and channels all of it toward chlorophyll a.\n2. **They protect chlorophyll a from photo-oxidation** — damage from absorbing more light energy than it can safely process."
            },
            {
              "kind": "numerical",
              "id": "1b210ba6-9e16-4a74-92df-df6bde8dd25f",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.6",
              "prompt": "Why is the colour of a leaf kept in the dark frequently becomes yellow, or pale green? Which pigment do you think is more stable?",
              "answer": "Chlorophyll needs continuous light-driven synthesis to be maintained and breaks down without it; carotenoids and xanthophylls are the more stable pigments, so they show through as yellow once chlorophyll fades.",
              "solution": "A leaf's green colour isn't a one-time coat of paint — **chlorophyll is constantly being broken down and has to be constantly resynthesised** to keep the leaf looking green, and that resynthesis needs light. Take the light away, and chlorophyll production stops while the existing chlorophyll keeps degrading on its own. The green fades.\n\nWhat's left behind are the other pigments this chapter covers — the **xanthophylls and carotenoids** — which are chemically **more stable** and don't depend on continuous light-driven synthesis to persist. As the unstable chlorophyll disappears faster than these sturdier pigments, their yellow-to-orange colour is what shows through, which is exactly why a leaf kept in the dark turns yellow or pale green.\n\nSo between the pigment families on this page: **chlorophyll (a and b)** is the less stable one, needing continual light-dependent upkeep; **carotenoids and xanthophylls** are the more stable ones."
            },
            {
              "kind": "numerical",
              "id": "d7996d94-2b39-45e6-bd12-f3f2d46bbafd",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.7",
              "prompt": "Look at leaves of the same plant on the shady side and compare it with the leaves on the sunny side. Or, compare the potted plants kept in the sunlight with those in the shade. Which of them has leaves that are darker green? Why?",
              "answer": "Shade leaves are usually the darker green — they pack in more chlorophyll to make the most of scarce light.",
              "solution": "**Shade leaves are usually the darker green of the two.** A leaf growing in shade receives far less light overall, so to keep photosynthesising at a usable rate with so little light coming in, the plant compensates by packing **more chlorophyll into the leaf** — more pigment per leaf means a deeper, darker green.\n\nA leaf growing in full sun receives more light than it strictly needs, so it doesn't have to invest as heavily in light-capturing pigment. It can run perfectly well with a **lower chlorophyll density**, which is why sun leaves often look paler or more yellow-green by comparison — not because anything is wrong with them, but because they simply don't need to chase every last photon the way a shade leaf does."
            }
          ]
        },
        {
          "id": "s3-reading-the-data",
          "title": "Reading the Data",
          "blurb": "The light-response graph, and the three comparisons NCERT asks you to hold side by side.",
          "items": [
            {
              "kind": "numerical",
              "id": "b52b1a24-8544-4c10-bbea-5a555b828486",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.8",
              "prompt": "Figure 11.10 shows the effect of light on the rate of photosynthesis. Based on the graph, answer the following questions:\n(a) At which point/s (A, B or C) in the curve light is a limiting factor?\n(b) What could be the limiting factor/s in region A?\n(c) What do C and D represent on the curve?",
              "answer": "The initial straight-line rise is where light limits the rate; the later flat plateau(s) are where some other factor (CO2 or temperature) has taken over as the limiting factor. Check the exact letter positions against the printed figure in your book.",
              "solution": "This question refers to the actual printed **Fig. 11.10** — a graph of light intensity (x-axis) against the rate of CO2 fixation / photosynthesis (y-axis). The figure's own point labels didn't survive the text extraction this page was built from, so match the *shape* described here against the real figure in front of you rather than trusting a letter-by-letter mapping from memory.\n\n**The shape, in words, straight from this chapter's own text:** at **low light intensities**, the rate rises in a **straight, linear relationship** with light — more light, proportionally more photosynthesis. As light intensity keeps increasing, the curve **gradually flattens out**, because some other factor has now become limiting. This flattening — **light saturation** — happens at only about **10% of full sunlight**, which is why, outside of shade or dense forest, light is rarely what's actually holding photosynthesis back in nature.\n\n**(a) Where is light the limiting factor?** In the early, steeply-rising, roughly straight-line part of the curve (typically the point/region labelled **A**) — that's the stretch where more light genuinely produces more photosynthesis.\n\n**(b) The limiting factor in that region:** **light intensity itself.** The rate is climbing in direct proportion to the light supplied, which is only possible if light is still the thing holding the rate back.\n\n**(c) What the later, flatter part of the curve represents:** once the curve bends and plateaus, light has **stopped** being limiting — the plant now has more light than it can use, and **Blackman's Law** (covered later in this chapter) takes over: the rate is now set by whichever factor is nearest its own minimum, typically **CO2 concentration** (or temperature). If the figure shows two separate plateau heights, that's usually the same light-response curve run under two different CO2 supplies — the higher plateau shows that once light stopped limiting, *raising CO2* let the rate climb further, which is direct proof that CO2 had become the new limiting factor."
            },
            {
              "kind": "numerical",
              "id": "9059e0ba-e742-4506-b42f-7e6d0dba1742",
              "source": "ncert_exercise",
              "source_label": "NCERT 11.9",
              "prompt": "Give comparison between the following:\n(a) C3 and C4 pathways\n(b) Cyclic and non-cyclic photophosphorylation\n(c) Anatomy of leaf in C3 and C4 plants",
              "answer": "Three side-by-side comparisons — see the tables in the solution.",
              "solution": "**(a) C3 pathway vs C4 pathway**\n\n| Feature | C3 pathway | C4 pathway |\n|---|---|---|\n| Primary CO2 acceptor | RuBP (5-carbon) | PEP (3-carbon) |\n| First stable product | 3-PGA (3-carbon acid) | OAA (4-carbon acid) |\n| Fixation enzyme | RuBisCO only | PEP carboxylase (mesophyll), then RuBisCO (bundle sheath) |\n| Site(s) of CO2 fixation | Mesophyll cells only | Mesophyll cells, then bundle sheath cells |\n| Photorespiration | Significant, especially in hot/bright conditions | Minimal — CO2 is concentrated around RuBisCO |\n| Typical examples | Wheat, rice, most dicots | Maize, sugarcane, sorghum |\n\n**(b) Cyclic vs non-cyclic photophosphorylation**\n\n| Feature | Non-cyclic | Cyclic |\n|---|---|---|\n| Photosystems used | Both, in series — PS II then PS I | PS I only |\n| Electron path | Straight through, via the Z-scheme, ending at NADP+ | Loops back to PS I instead of moving on |\n| Water split? | Yes — associated with PS II | No |\n| Products | Both ATP and NADPH + H+ | ATP only, no NADPH |\n| Where it happens | Grana membranes (both photosystems present) | Possibly the stroma lamellae (which lack PS II and NADP reductase) |\n\n**(c) Leaf anatomy in C3 vs C4 plants**\n\n| Feature | C3 leaf | C4 leaf |\n|---|---|---|\n| Kranz anatomy | Absent | Present — a wreath of bundle sheath cells around the vascular bundle |\n| Bundle sheath cells | Small, thin-walled, few or no chloroplasts | Large, thick-walled, densely packed with chloroplasts |\n| Mesophyll arrangement | Usual palisade + spongy layers | Arranged radially around the bundle sheath ring |\n| CO2-fixing cell type(s) | Mesophyll cells only | Mesophyll cells (initial fixation) and bundle sheath cells (Calvin cycle) |"
            }
          ]
        }
      ]
    }
  ]
};
