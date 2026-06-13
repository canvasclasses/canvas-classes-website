# BITSAT Predictor — Validation Report

Generated: 2026-06-13T17:42:28.287Z

## A. Invariants

| ID | Name | Pass | Detail |
|---|---|---|---|
| IN-1 | Score 0 (modern) yields no Safe results | ✅ | rows=48 safe=0 |
| IN-2 | Score 390 (modern) yields all Safe | ✅ | rows=48 non-safe=0 |
| IN-3 | Bucket monotonic in score | ✅ | 0 violations |
| IN-4 | Probability monotonic in score | ✅ | 0 violations |
| IN-5a | Modern regime returns only max_score=390 rows | ✅ | rows=48 |
| IN-5b | Legacy regime returns only max_score=450 rows | ✅ | rows=38 |
| IN-6 | Result list sorted Safe → Target → Reach → Unlikely | ✅ | 0 out-of-order pairs over 48 rows |
| IN-7 | Bucket math reconstructible from (score, projected, σ) | ✅ | 0 mismatches |
| IN-8 | Empty filter equals unset filter | ✅ | a=47 rows, b=47 rows |
| IN-9 | Every returned programme_code is in the catalog | ✅ | 0 stray codes over 48 rows |

## B. Source ↔ Mongo spot-checks

| ID | Name | Pass | Detail |
|---|---|---|---|
| SP-1 | 12 random rows match source ↔ Mongo | ✅ | 12/12 matched |

## C. Hindsight backtest

For each target year, the predictor was given ONLY data from prior years, then asked
to bucket every (campus, programme) at scores 220, 240, 260, 280, 300, 320, 340. The
realised cutoff was then looked up; "hit" = user score actually cleared the realised
cutoff. Healthy calibration means Safe ≈ near-100%, Reach ≈ 10–40%, Unlikely ≈ near-0%.

### Per-year breakdown

| Year | Bucket | Hits / Total | Hit Rate |
|---|---|---|---|
| 2023 | safe | 216 / 235 | 92% |
| 2023 | target | 0 / 9 | 0% |
| 2023 | reach | 0 / 7 | 0% |
| 2023 | unlikely | 0 / 15 | 0% |
| 2024 | safe | 175 / 216 | 81% |
| 2024 | target | 0 / 1 | 0% |
| 2024 | reach | 0 / 18 | 0% |
| 2024 | unlikely | 0 / 31 | 0% |
| 2025 | safe | 183 / 183 | 100% |
| 2025 | target | 25 / 25 | 100% |
| 2025 | reach | 28 / 30 | 93% |
| 2025 | unlikely | 5 / 49 | 10% |

### Aggregate (all target years)

| Bucket | Hits / Total | Hit Rate |
|---|---|---|
| safe | 574 / 634 | 90.5% |
| target | 25 / 35 | 71.4% |
| reach | 28 / 55 | 50.9% |
| unlikely | 5 / 95 | 5.3% |

| ID | Name | Pass | Detail |
|---|---|---|---|
| BT-1 | Bucket hit rate ordering: Safe ≥ Target ≥ Reach ≥ Unlikely | ✅ | rates=[91%, 71%, 51%, 5%] |
| BT-2 | Safe bucket hit rate ≥ 85% | ✅ | 90.5% |
| BT-3 | Unlikely bucket hit rate ≤ 15% | ✅ | 5.3% |

## Summary

**14 / 14** checks passed.