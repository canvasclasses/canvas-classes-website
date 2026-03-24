# Math Taxonomy Migration — 2026-03-24

## Why your other system shows zero questions

The math taxonomy chapter IDs were refactored this morning.
Old IDs (`ma11_complex`, `ma12_functions`, etc.) were replaced with
a unified competitive-syllabus scheme (`ma_complex`, `ma_functions`, etc.).

Your other system has the old files and sends queries with the old chapter IDs,
which no longer match anything in MongoDB → returns 0 results.

## What to do

Copy these 2 files into your other project, **replacing** the existing versions:

```
app/api/v2/questions/route.ts
app/crucible/admin/taxonomy/taxonomyData_from_csv.ts
```

That's it. No database changes needed. MongoDB data is untouched.

## Verification

After copying, restart the dev server (`npm run dev`) and reload the dashboard.
All existing questions and the 20 new COMP-001..020 (Complex Numbers) entries
should appear immediately.
