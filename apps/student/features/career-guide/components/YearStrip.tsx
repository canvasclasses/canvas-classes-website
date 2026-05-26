/*
 * YearStrip — visual proof that the career landscape has shifted across
 * 2011 → 2016 → 2021 → 2026. Each row lists the jobs that were considered
 * the "default ambitious career" in that year, with type indicators:
 *   - "hot"  — currently strong (↗ prefix, accent colour)
 *   - "new"  — first wave appearance (+ prefix, white text)
 *   - "dead" — strikethrough, faded
 *
 * Pure data → JSX. Server-renderable. Ported verbatim from the design
 * bundle (career-guide/project/app.jsx::YearStrip).
 */

import { Fragment } from 'react';

type JobKind = 'hot' | 'new' | 'dead' | '';

interface JobEntry {
  label: string;
  k: JobKind;
}

interface YearRow {
  year: string;
  sub: string;
  now?: boolean;
  jobs: JobEntry[];
}

const ROWS: YearRow[] = [
  {
    year: '2011',
    sub: 'what your parents were told',
    jobs: [
      { label: 'Mechanical engineer', k: 'hot' },
      { label: 'Civil engineer (PSU)', k: 'hot' },
      { label: 'MBBS → general practice', k: 'hot' },
      { label: 'IT services dev', k: 'hot' },
      { label: 'Petroleum engineer', k: 'hot' },
    ],
  },
  {
    year: '2016',
    sub: 'still mostly the same list',
    jobs: [
      { label: 'Mechanical engineer', k: '' },
      { label: 'MBBS → specialist', k: 'hot' },
      { label: 'Data analyst', k: 'new' },
      { label: 'Android developer', k: 'new' },
      { label: 'Mobile UI designer', k: 'new' },
    ],
  },
  {
    year: '2021',
    sub: 'the list quietly forks',
    jobs: [
      { label: 'IT services dev', k: 'dead' },
      { label: 'Petroleum engineer', k: 'dead' },
      { label: 'ML engineer', k: 'new' },
      { label: 'Cloud / DevOps', k: 'new' },
      { label: 'Bioinformatics', k: 'new' },
      { label: 'Battery R&D', k: 'new' },
    ],
  },
  {
    year: '2026',
    sub: "what's actually being hired for now",
    now: true,
    jobs: [
      { label: 'AI safety / evaluations', k: 'hot' },
      { label: 'Applied ML engineer', k: 'hot' },
      { label: 'Robotics + automation', k: 'hot' },
      { label: 'Semiconductor design', k: 'hot' },
      { label: 'Healthcare AI', k: 'hot' },
      { label: 'Drug discovery (computational)', k: 'hot' },
      { label: 'Energy / battery', k: 'hot' },
      { label: 'MBBS → specialist', k: '' },
    ],
  },
];

export default function YearStrip() {
  return (
    <div className="cg-yearstrip">
      {ROWS.map((row, i) => (
        <Fragment key={row.year}>
          <div className="cg-yearstrip-rail">
            <div className={'cg-yearstrip-year' + (row.now ? ' now' : '')}>
              {row.year}
              <div className="cg-yearstrip-sub">{row.sub}</div>
            </div>
            <div className="cg-yearstrip-jobs">
              {row.jobs.map((j, k) => (
                <span key={k} className={'cg-yearstrip-job' + (j.k ? ' ' + j.k : '')}>
                  {j.label}
                </span>
              ))}
            </div>
          </div>
          {i < ROWS.length - 1 && <div className="cg-yearstrip-divider" />}
        </Fragment>
      ))}
    </div>
  );
}
