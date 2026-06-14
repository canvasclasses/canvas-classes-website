# EMI — Physics Solution Flags

_Last updated: 2026-06-13 07:41_

## 🔴 Blocking — no solution written

- **EMI-133** — solution present but stored correct_option is null
- **EMI-134** — solution present but stored correct_option is null
- **EMI-135** — solution present but stored correct_option is null
- **EMI-138** — solution present but stored correct_option is null
- **EMI-139** — solution present but stored correct_option is null
- **EMI-140** — solution present but stored correct_option is null
- **EMI-141** — solution present but stored correct_option is null
- **EMI-142** — solution present but stored correct_option is null
- **EMI-143** — solution present but stored correct_option is null
- **EMI-144** — solution present but stored correct_option is null
- **EMI-146** — solution present but stored correct_option is null
- **EMI-147** — solution present but stored correct_option is null
- **EMI-149** — solution present but stored correct_option is null
- **EMI-150** — solution present but stored correct_option is null
- **EMI-151** — solution present but stored correct_option is null
- **EMI-152** — solution present but stored correct_option is null
- **EMI-153** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **EMI-132** — Q66 (EMI-132): book key (b) φ²/2L, derived in the book's hint by writing φ=Li and ½Li². But the question states 'no current flows in the coil' — with i=0 the self-energy ½Li² is literally zero, making (a) physically defensible (the φ is external flux, not self-flux). Kept book key (b) per the convention + the book's own hint; flagged for founder review — the 'no current' wording vs the φ=Li assumption is internally inconsistent.
- **EMI-150** — Q120 (EMI-150): book key (a,b,d). Overrode to (a,d): for θ=180° from a perpendicular start the flux reverses (+BA→−BA), so |Δφ|=2BA and Q=2BAn/R, NOT BAn/R — so option (b) is physically wrong. (a) θ=90°→BAn/R and (d) θ=360°→0 are correct. Push to Notion Physics Answer Discrepancies (book abd → correct ad).
- **EMI-152** — Q122 (EMI-152): book key (a,d). Overrode to (b,d): a coil rotating at constant ω is an AC generator with e = BAnω·sin(ωt). Option (a) 'emf is zero' is absurd for a rotating coil; option (b) 'changes nonlinearly with time' is correct (sinusoidal), and (d) 'max value BAnω' is correct. Push to Notion Physics Answer Discrepancies (book ad → correct bd).
- **ACUR-148** — Q74 (ACUR-148): the printed options were OCR-garbled; reconstructed to a:P1>P2>P3, b:P1=P2>P3, c:P1=P2<P3, d:P1=P2=P3. Physics: the LC (pure reactance) pair draws zero average power while the two R-containing pairs draw equal power, so P1=P2>P3 = option (b). Book key (as recorded) was (d) P1=P2=P3, which ignores that the reactive pair dissipates nothing. Stored (b). Flag for founder confirmation.

## ⚪ Soft quality — audit notes

_(none)_
