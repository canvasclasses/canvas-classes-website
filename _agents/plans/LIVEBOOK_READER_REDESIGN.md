# LIVE BOOK READER — redesign attempt (REVERTED) + reference notes

> **STATUS: REVERTED 2026-07-19.** A full reader redesign was built across 2026-07-18/19
> (serif type, one-accent palette, teal section bands, peach title, de-boxing, a new
> figure model, etc.). The founder reviewed the final result and **did not like it**, and
> asked to **undo the whole session and return to the earlier (pre-2026-07-18) design.**
> All reader code was reverted to its pre-session state; the reader is on the **earlier
> design** (green-gradient title, amber-emphasis prose, sky headings, side-by-side images).
>
> **LESSON (for any future session): do NOT re-attempt a wholesale redesign.** The founder
> wants **small, incremental changes to the earlier design**, evaluated one at a time — not
> a ground-up restyle. Propose a single change, show it, keep it only if they like it.

## Reference — what the founder DOES like (kept for incremental ideas)

The founder's design references are **Oxford University Press (esp. *Chemistry³*, Burrows et al.)** and **Arihant** (Indian exam prep). Useful, non-controversial ideas distilled from OUP / Paul Luna's *Typography: A Very Short Introduction* ("typography is design for reading") — offer these ONE AT A TIME as small additions to the earlier design, never as a bundle:

- **Margin apparatus** — a wide outer margin carrying key-term definitions, reminders, cross-references, and small figures beside the paragraph they belong to (*Chemistry³*'s signature).
- **Colour-coded boxes by content type** so students navigate by colour (worked example / summary / application) — macro-typography / navigation.
- **Structured worked examples** — *Problem → Strategy → Solution → Answer*.
- **Annotated figures** — labels / leader-lines on diagrams; figures as numbered, consultable objects.
- **Section summaries** — a short recap to close each section.
- Arihant is the opposite pole (dense exam apparatus) → keep that density in exam/practice surfaces (Crucible, exam tips), NOT the reading page.

Specific colour ideas the founder reacted positively to during the (reverted) exploration, if ever revisited incrementally: a warm **peach** title, **teal** section headings with a coloured bar+band, warm-orange video cards. These were NOT kept — they're only recorded as starting points should the founder later want to test one in isolation.

## Do NOT
- Do not re-run the big redesign.
- Do not touch `packages/book-renderer` broadly without an explicit, specific founder request for that one change.
