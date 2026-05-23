# ELPS — Math Solution Flags

_Last updated: 2026-05-20 13:46_

## 🔴 Blocking — no solution written

- **ELPS-080** — solution present but stored integer_value is null (answer is 5/4 = 1.25, non-integer)

## 🟡 Needs verification — solution written, uncertain

- **ELPS-066** — Derived max area = 58 + 29√3; stored option (d) text in DB appears OCR-garbled as "82 + √3", but answer letter (d) is correct.
- **ELPS-080** — Answer is 5/4 = 1.25 (rational, not integer). The integer_value field cannot store this; stored_answer was empty. Solution written without updating the answer field.

## ⚪ Soft quality — audit notes

_(none)_
