import { JuniorQuestion } from '@canvas/data/models/JuniorQuestion';

// Returns the next N sequential display_ids for a given prefix, e.g.
// nextDisplayIds('C9SCI-MIX', 3) → ['C9SCI-MIX-001', '-002', '-003'].
// Scans existing display_ids with that prefix (including soft-deleted, so a
// number is never reused) and continues from the current max.
export async function nextDisplayIds(prefix: string, count: number): Promise<string[]> {
  const existing = await JuniorQuestion
    .find({ display_id: { $regex: `^${prefix}-\\d+$` } })
    .select('display_id')
    .lean<{ display_id: string }[]>();

  let max = 0;
  for (const doc of existing) {
    const n = parseInt(doc.display_id.slice(prefix.length + 1), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }

  const ids: string[] = [];
  for (let i = 1; i <= count; i++) {
    ids.push(`${prefix}-${String(max + i).padStart(3, '0')}`);
  }
  return ids;
}
