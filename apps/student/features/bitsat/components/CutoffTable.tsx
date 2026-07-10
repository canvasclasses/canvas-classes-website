'use client';

import { useState } from 'react';
import { BITSAT_CAMPUS_BY_ID, type BitsatCampusId } from '@canvas/data/bitsat/campuses';
import { BITSAT_PROGRAMME_BY_CODE } from '@canvas/data/bitsat/programmes';
import type { BitsatIteration, BitsatIterationCutoffRow } from '../data/iterationCutoffs';
import {
  BITSAT_ACCENT,
  DISPLAY_FONT,
  MONO_FONT,
  PANEL_BG,
  PANEL_BORDER,
  SectionLabel,
  StatCard,
  TrendDelta,
  MiniTrend,
} from './ui';

interface Props {
  iterations: BitsatIteration[]; // newest-first
}

const CAMPUS_ORDER: BitsatCampusId[] = ['pilani', 'goa', 'hyderabad'];

const DEGREE_GROUPS: { key: 'BE' | 'MSC' | 'BPHARM'; label: string }[] = [
  { key: 'BE', label: 'Engineering — B.E.' },
  { key: 'MSC', label: 'Sciences & Economics — M.Sc.' },
  { key: 'BPHARM', label: 'Pharmacy — B.Pharm.' },
];

type CampusFilter = 'all' | BitsatCampusId;

export default function CutoffTable({ iterations }: Props) {
  const [iterIdx, setIterIdx] = useState(0);
  const [campusFilter, setCampusFilter] = useState<CampusFilter>('all');

  if (iterations.length === 0) {
    return <EmptyState message="Iteration cutoffs will appear here as BITS publishes each round." />;
  }

  const active = iterations[iterIdx];
  const { years, currentYear, max_score } = active;
  const prevYear = years[years.indexOf(currentYear) - 1];

  const flagshipByCampus = CAMPUS_ORDER.map((campusId) => {
    const rows = active.rows.filter((r) => r.campus === campusId && r.scores[currentYear] != null);
    let top: BitsatIterationCutoffRow | null = null;
    for (const r of rows) if (!top || r.scores[currentYear]! > top.scores[currentYear]!) top = r;
    return { campusId, campus: BITSAT_CAMPUS_BY_ID[campusId], top, count: rows.length };
  }).filter((c) => c.top);

  const shownCampuses =
    campusFilter === 'all' ? CAMPUS_ORDER : [campusFilter];

  return (
    <div>
      {/* Header line + iteration selector */}
      <div className="mb-6 text-center">
        <SectionLabel>Iteration-1 allotment · closing scores</SectionLabel>
        <h2
          className="mt-2"
          style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Branch-wise cutoffs
        </h2>
        {iterations.length > 1 && (
          <div className="mt-3 flex justify-center">
            <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {iterations.map((it, idx) => (
                <button
                  key={`${it.currentYear}-${it.iteration}`}
                  type="button"
                  onClick={() => setIterIdx(idx)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    idx === iterIdx
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  Iteration {it.iteration}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flagship cards */}
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {flagshipByCampus.map(({ campusId, campus, top, count }) => (
          <StatCard
            key={campusId}
            label={
              <span className="flex items-center gap-2">
                BITS {campus.name}
                {campus.nirf_rank_engineering != null && (
                  <span
                    className="rounded px-1.5 py-0.5 text-[9px] font-bold not-italic"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', letterSpacing: '0.04em' }}
                  >
                    NIRF #{campus.nirf_rank_engineering}
                  </span>
                )}
              </span>
            }
            value={top!.scores[currentYear]}
            accent
            sub={
              <>
                {BITSAT_PROGRAMME_BY_CODE[top!.programme_code]?.display_name} ·{' '}
                <span className="text-zinc-400">top branch</span> · {count} branches
              </>
            }
          />
        ))}
      </div>

      {/* Campus filter */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <span style={{ fontFamily: MONO_FONT }} className="text-[10.5px] uppercase tracking-[0.16em] text-zinc-600">
          Campus
        </span>
        {(['all', ...CAMPUS_ORDER] as CampusFilter[]).map((f) => {
          const on = campusFilter === f;
          const label = f === 'all' ? 'All' : BITSAT_CAMPUS_BY_ID[f].name;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setCampusFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                on
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black'
                  : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mb-5 text-center text-[11px] text-zinc-600">
        out of {max_score} · <span style={{ color: BITSAT_ACCENT }}>{currentYear} highlighted</span>
      </div>

      {/* Campus panels */}
      <div className="space-y-5">
        {shownCampuses.map((campusId) => (
          <CampusPanel
            key={campusId}
            campusId={campusId}
            rows={active.rows.filter((r) => r.campus === campusId && r.scores[currentYear] != null)}
            years={years}
            currentYear={currentYear}
            prevYear={prevYear}
          />
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs text-zinc-500">
        Iteration-1 allotment closing scores (out of {max_score}). A dash means BITS did not allot that
        branch in that year&apos;s first iteration. Trend (▲/▼) and sparkline are vs the previous year.
      </p>
    </div>
  );
}

function CampusPanel({
  campusId,
  rows,
  years,
  currentYear,
  prevYear,
}: {
  campusId: BitsatCampusId;
  rows: BitsatIterationCutoffRow[];
  years: number[];
  currentYear: number;
  prevYear: number | undefined;
}) {
  const campus = BITSAT_CAMPUS_BY_ID[campusId];
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl" style={{ background: PANEL_BG, border: PANEL_BORDER }}>
      {/* Panel header */}
      <div className="border-b border-white/5 px-5 py-4 text-center">
        <span
          className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
          style={{ background: `${BITSAT_ACCENT}1a`, color: BITSAT_ACCENT, fontFamily: DISPLAY_FONT }}
        >
          {campus.name[0]}
        </span>
        <div
          className="mt-2"
          style={{ fontFamily: DISPLAY_FONT, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          BITS {campus.name}
        </div>
        <div className="mt-0.5 text-[11.5px] text-zinc-500">
          {campus.state}
          {campus.nirf_rank_engineering != null && ` · NIRF Eng #${campus.nirf_rank_engineering}`}
          {' · '}
          <span style={{ fontFamily: MONO_FONT }}>{rows.length} branches</span>
        </div>
      </div>

      {/* Grouped tables */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] text-sm">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-[0.12em] text-zinc-600">
              <th className="px-5 py-2.5 text-center font-medium">Branch</th>
              {years.map((y) => (
                <th
                  key={y}
                  className="px-3 py-2.5 text-center font-medium"
                  style={{ color: y === currentYear ? BITSAT_ACCENT : undefined, fontFamily: MONO_FONT }}
                >
                  {y}
                </th>
              ))}
              <th className="px-3 py-2.5 text-center font-medium">vs {prevYear ?? '—'}</th>
              <th className="px-4 py-2.5 text-center font-medium">Trend</th>
            </tr>
          </thead>
          {DEGREE_GROUPS.map((group) => {
            const groupRows = rows
              .filter((r) => BITSAT_PROGRAMME_BY_CODE[r.programme_code]?.degree_type === group.key)
              .sort((a, b) => b.scores[currentYear]! - a.scores[currentYear]!);
            if (groupRows.length === 0) return null;
            return (
              <tbody key={group.key}>
                <tr>
                  <td colSpan={years.length + 3} className="bg-white/[0.015] px-5 pb-1.5 pt-3">
                    <SectionLabel>{group.label}</SectionLabel>
                  </td>
                </tr>
                {groupRows.map((row) => {
                  const prog = BITSAT_PROGRAMME_BY_CODE[row.programme_code];
                  const cur = row.scores[currentYear]!;
                  const prev = prevYear != null ? row.scores[prevYear] : undefined;
                  const delta = prev != null ? cur - prev : null;
                  const sparkVals = years
                    .map((y) => row.scores[y])
                    .filter((v): v is number => typeof v === 'number');
                  return (
                    <tr key={row.programme_code} className="border-t border-white/5 hover:bg-white/[0.025]">
                      <td className="px-5 py-2.5 text-center">
                        <div className="font-medium text-zinc-200">{prog?.short_name ?? row.programme_code}</div>
                        <div className="text-[11px] text-zinc-500">{prog?.display_name}</div>
                      </td>
                      {years.map((y) => {
                        const v = row.scores[y];
                        const isCur = y === currentYear;
                        return (
                          <td
                            key={y}
                            className="px-3 py-2.5 text-center tabular-nums"
                            style={{
                              color: v == null ? '#52525b' : isCur ? BITSAT_ACCENT : '#a1a1aa',
                              fontWeight: isCur ? 700 : 400,
                              fontSize: isCur ? 15 : 14,
                            }}
                          >
                            {v ?? '—'}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <TrendDelta delta={delta} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-center">
                          <MiniTrend values={sparkVals} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0B0F15] p-10 text-center">
      <div className="text-sm text-zinc-400">{message}</div>
    </div>
  );
}
