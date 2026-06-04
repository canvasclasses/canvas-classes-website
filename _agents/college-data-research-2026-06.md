# College data research — June 2026

Source-verified factual data written into the `colleges` collection (and BITS facts
into `compareData.ts`) for the College **Compare** tool. Scope: the ~50 most-compared
institutes — all 31 NITs, 11 top IIITs, 8 notable GFTIs, + 3 BITS campuses.

## Method

- Six parallel research agents, each given a strict spec and a batch of institutes.
- Sources prioritised: **official institute fee PDFs / sites (.ac.in)**, the
  **official NIRF 2024 pages (nirfindia.org)**, cross-checked against
  **shiksha.com / careers360.com / collegedunia.com**. Every fee cross-checked
  across ≥2 sources; agents instructed to return `null` (not guess) when unverified.
- **NIRF 2024 ranks verified directly against `nirfindia.org/Rankings/2024`** by the
  main agent (not just the sub-agents), because the sub-agents disagreed and several
  aggregator figures were stale.

## Field definitions (kept consistent across all institutes)

| Field | Definition |
|---|---|
| `annual_fees` | Annual B.Tech **tuition** fee, OPEN category, ₹/yr, **excluding** hostel & mess. NIT tuition is uniform (₹62,500/sem = **₹1,25,000/yr**, MHRD-set) — confirmed across NITs. IIITs/BITS vary. |
| `hostel_fees` | Annual hostel + mess, ₹/yr. **Only written where medium/high confidence** — left untouched otherwise (hostel data is fragmented across sources). |
| `total_seats` | Approximate total B.Tech intake (all branches, latest year). Aggregator seat matrices; varies year-to-year. |
| `nirf_rank_engineering` | NIRF **2024** Engineering integer rank (top-100). `null` = band-only (101-150 etc.) or unranked in 2024. |
| `nirf_rank_overall` | NIRF **2024** Overall integer rank (top-100), else `null`. |
| `website` | Official homepage. |

## NIRF 2024 — corrections to existing DB values (verified vs nirfindia.org)

| Institute | DB had | Verified 2024 | Note |
|---|---|---|---|
| MNNIT Allahabad | 49 | **60** | DB value was stale/wrong |
| MNIT Jaipur | 46 | **43** | |
| NIT Kurukshetra | 58 | **81** | large correction |
| MANIT Bhopal | 65 | **72** | |
| VNIT Nagpur | 41 | **39** | |
| NIT Durgapur | 43 | **44** | |
| NIT Jamshedpur | 90 | **null** | only in 101-150 band in 2024 |
| PEC Chandigarh | 45 | **null** | band-only in 2024 |
| IIIT Allahabad | 89 | **87** | DB value was the 2023 figure |

Unchanged (already correct): NIT Trichy 9, Surathkal 17, Rourkela 19, Warangal 21,
Calicut 25, Surat 59.

## Fee tiering observed (decision-relevant)

- **NITs:** uniform ₹1.25 L/yr tuition.
- **IIITs:** autonomous INI IIITs ₹1.4–1.6 L/yr (Allahabad 1.62, Gwalior 1.58,
  Jabalpur 1.435, Kancheepuram 1.62); PPP IIITs ₹1.98–3.3 L/yr (Sri City 3.3,
  Guwahati 2.75, Vadodara 2.5, Lucknow 2.4, Nagpur 1.98).
- **GFTIs:** IIEST Shibpur ₹1.25 L, PEC ₹1.76 L, BIT Mesra (deemed) ₹3.02 L.
- **BITS:** **₹5.35 L/yr** tuition (₹2,67,500/sem, 2025-26) — far above the NITs.
  Stored in `compareData.ts` `BITS_FACTS` (BITS isn't in the `colleges` collection).

## Confidence / known gaps

- **Tuition:** high confidence (official PDFs / uniform NIT rate).
- **Hostel+mess:** patchy — written for ~13 institutes (medium+); the rest left null
  (the tool's "Annual tuition" row is the reliable headline cost; "~Total 4-yr cost"
  shows only where both tuition AND hostel are known).
- **Seats:** approximate (aggregator matrices); BIT Mesra seats left null (source
  conflict).
- **IIIT Pune / Kalyani tuition:** not confidently isolated → left null (website/seats only).

## NIRF beyond top-100

NIRF assigns integer ranks only to the top 100; below that it publishes bands
(101-150, 151-200, …). Institutes in a band have `nirf_rank_engineering = null`
(the tool shows "Not ranked"). A future enhancement could add a `nirf_band` string
field to surface "101-150" instead of "Not ranked".

## Editorial layer (instituteProfiles.ts)

Character/orientation scores (research / entrepreneurship / core-industry / govt-PSU /
abroad), `knownForBranches`, and highlights are **editorial synthesis**, not fetched
metrics — anchored in durable, widely-known reputation and the branches each institute
actually runs. Revisable. Coverage expanded this pass to ~45 institutes; the smallest
new NITs (Sikkim, Mizoram, Nagaland, Manipur, Andhra, Arunachal, Uttarakhand,
Puducherry) are intentionally left unprofiled (thin, would be guesswork) and degrade
gracefully to "not yet profiled".

## Apply / rollback

- Applied via `scripts/update_college_data.js` (explicit field whitelist, no mass
  assignment). 50/50 institutes updated.
- Full pre-write backup at `scripts/_backups/colleges-pre-research-<timestamp>.json`.
- Rollback: `node scripts/restore_colleges_backup.js <backup.json>`.

## Character research pass (2026-06) — orientation now source-backed for 27 institutes

A second fan-out gathered **institutional-character evidence with sources** for 27
institutes (16 NITs, 5 IIITs, 3 GFTIs, 3 BITS) and converted it to orientation
scores via a documented rubric (see header of `instituteProfiles.ts`). Evidence
proxies: NIRF 2024 **research (RP) sub-scores**, **DST-NIDHI/MeitY incubators**
(+ startup counts + founder-alumni), **department founding years**, and PSU/abroad
pipelines.

Representative sourced findings now in the profiles:
- **MNNIT Allahabad** ran India’s **first UG CSE programme (1976)**; PARAM supercomputing heritage.
- **NIT Raipur** — Mining & Metallurgy departments since **1956** (founded as a Govt College of Mining & Metallurgy); NITRRFIE DST incubator, 50+ startups.
- **NIT Rourkela** — highest NIT research sub-scores; FTBI incubator 100+ startups (Coratia ROVs); rare Ceramic Engineering dept.
- **NIT Surathkal** — NITK-STEP; reportedly the most student-founded startups among NITs; Practo founder alumnus.
- **NIT Trichy** — RP 57.0; TREC-STEP + CEDI; Freshworks & HackerRank founder-alumni.
- **IIEST Shibpur** — Civil (1856), Metallurgy (1939), Mining (1956), Aerospace depts.
- **BIT Mesra** — India’s **first Space Engineering & Rocketry dept (1964)**; first STEP in India; alumnus Ashish Vaswani.
- **PEC Chandigarh** — Aerospace dept since **1962**.
- **BITS Pilani** — PIEDS incubator, **400+ startups**; founder-alumni (Hotmail, SanDisk/Micron, redBus, GreyOrange); Practice School (1973); IPCD abroad pipeline.

`knownForBranches` now carries a verified **"(since YYYY)"** suffix on legacy
departments where a founding year was sourced — the UI surfaces this and
`isLegacyStrength` strips the suffix before matching.

**Two-tier provenance:** the 27 above are research-backed; the remaining ~16
profiles stay **editorial** (clearly marked in the file and degrade gracefully).
NIRF RP sub-scores and department years came from nirfindia.org + official
institute/incubator pages (.ac.in) + DST/MeitY pages; per-claim source URLs are
in the agent outputs captured in the session transcript.

## Suggested next pass

- Dedicated **institutional-character research** (incubators / DST-funded I-Hubs,
  research output, founder-alumni, legacy departments) to make orientation scores
  fully source-backed rather than editorial.
- Extend factual research to the remaining ~55 long-tail GFTIs/IIITs.
- Curate hostel+mess for the institutes still missing it; add IIT data when a
  JEE-Advanced predictor lands.
