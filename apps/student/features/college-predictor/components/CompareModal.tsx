'use client';

import { motion } from 'framer-motion';
import { useCompare } from './CompareContext';
import { parentVerdict, type Bucket } from '../lib/parentVocab';

// Side-by-side compare modal. Renders a 2-4 column grid where each column is
// one pinned (college, branch) result, with consistent rows: bucket, probability,
// projected close, NIRF, location, quota, historical sparkline-lite, branch
// name. Lets a parent see "NIT Trichy CSE vs NIT Surathkal CSE vs IIIT Hyderabad
// CSE" at a glance.
//
// This is the JoSAA-flavoured payload shape; the BITSAT variant can ship later
// with its own mapping. For now we narrow the payload via a discriminator.

interface JosaaCompareItem {
  kind: 'josaa';
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  branch_short_name: string;
  branch_name: string;
  bucket: Bucket;
  probability_pct: number;
  projected_closing_rank: number;
  historical: { year: number; closing_rank: number }[];
  quota_matched: string;
}

type CompareItem = JosaaCompareItem;

const BUCKET_META: Record<Bucket, { label: string; cls: string }> = {
  safe:     { label: 'Safe',     cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  target:   { label: 'Target',   cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  reach:    { label: 'Reach',    cls: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  unlikely: { label: 'Unlikely', cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
};

const TONE_BADGE: Record<'green' | 'amber' | 'blue' | 'grey', string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  blue:  'bg-sky-500/15 text-sky-400 border-sky-500/30',
  grey:  'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

export default function CompareModal() {
  const { pinned, openModal, setOpenModal, toggle } = useCompare();
  if (!openModal) return null;

  const items = pinned
    .map((p) => p.payload as CompareItem)
    .filter((x) => x && x.kind === 'josaa');

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={() => setOpenModal(false)}
    >
      <motion.div
        initial={{ scale: 0.97, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl rounded-2xl bg-[#0B0F15] border border-white/10 overflow-hidden my-8"
      >
        <div className="flex items-start justify-between p-5 border-b border-white/5">
          <div>
            <div className="text-base font-semibold text-white">Compare side-by-side</div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {items.length} {items.length === 1 ? 'college' : 'colleges'} pinned · same rows for direct comparison
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="text-zinc-500 hover:text-white text-xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Column grid — 2/3/4 columns depending on count */}
        <div className={`p-5 grid gap-3 grid-cols-1 ${items.length === 2 ? 'md:grid-cols-2' : items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {items.map((it) => (
            <CompareColumn
              key={`${it.college_id}::${it.branch_short_name}`}
              item={it}
              onRemove={() =>
                toggle({
                  id: `${it.college_id}::${it.branch_short_name}`,
                  payload: it,
                })
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CompareColumn({ item, onRemove }: { item: JosaaCompareItem; onRemove: () => void }) {
  const meta = BUCKET_META[item.bucket];
  const v = parentVerdict(item.bucket, item.probability_pct);
  const lo = item.historical.length > 0 ? Math.min(...item.historical.map((h) => h.closing_rank)) : null;
  const hi = item.historical.length > 0 ? Math.max(...item.historical.map((h) => h.closing_rank)) : null;
  return (
    <div className="rounded-xl bg-[#151E32] border border-white/5 p-4 flex flex-col gap-3 relative">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from comparison"
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 text-base leading-none flex items-center justify-center"
      >
        ×
      </button>

      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider">{item.college_type}</div>
        <div className="text-lg font-semibold text-white mt-0.5">{item.college_short_name}</div>
        <div className="text-xs text-zinc-400 mt-1">{item.branch_name}</div>
      </div>

      <Row label="Verdict">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${TONE_BADGE[v.tone]}`}>
          {v.short}
        </span>
      </Row>

      <Row label="Bucket">
        <span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.cls}`}>
          {meta.label}
        </span>
      </Row>

      <Row label="Chance">
        <span className="text-base font-bold text-orange-400 tabular-nums">{item.probability_pct}%</span>
      </Row>

      <Row label="Projected close">
        <span className="text-sm font-semibold text-white tabular-nums">
          #{item.projected_closing_rank.toLocaleString('en-IN')}
        </span>
      </Row>

      <Row label="NIRF">
        <span className="text-sm text-zinc-200 tabular-nums">
          {item.nirf_rank_engineering !== undefined ? `#${item.nirf_rank_engineering}` : '—'}
        </span>
      </Row>

      <Row label="Location">
        <span className="text-sm text-zinc-200">{item.college_state} · {item.college_region}</span>
      </Row>

      <Row label="Quota">
        <span className="text-sm text-zinc-200">{item.quota_matched}</span>
      </Row>

      {lo !== null && hi !== null && (
        <Row label="Historical range">
          <span className="text-xs text-zinc-300 tabular-nums">
            #{lo.toLocaleString('en-IN')} – #{hi.toLocaleString('en-IN')}
          </span>
        </Row>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-t border-white/5 first-of-type:border-t-0">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
