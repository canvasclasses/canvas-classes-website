'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle } from 'lucide-react';

// Minimal valid skeleton — every required field has a placeholder. Editing
// from this shape is faster than writing the whole JSON from scratch, and the
// admin sees the schema shape inline. Once V2 ships the structured form
// editor this gets retired.
const SKELETON = {
  slug: 'new-career-slug',
  display_name: 'New career display name',
  category: 'engineering', // 'engineering' | 'medical' | 'crossover'
  archetype: 'transforming', // 'transforming' | 'emerging' | 'traditional'

  one_line: 'Single-line career definition (max 140 chars).',
  what_it_is_today: '2-paragraph 2026 reality.',
  what_parents_think_it_is: 'The misconception to dismantle.',
  common_misconceptions: ['Misconception 1', 'Misconception 2'],

  income: {
    year_1:  { p25: 5,  median: 10, p75: 18 },
    year_5:  { p25: 12, median: 22, p75: 40 },
    year_10: { p25: 25, median: 45, p75: 90 },
    notes: 'Salary data sources + caveats here.',
    sources: [
      { type: 'salary', label: 'AmbitionBox 2026', accessed_date: '2026-04-01' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    { name: 'Sub-path A', description: 'What this sub-path does.', ai_exposure_5y: 'moderate', income_vs_median: 'similar' },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary: '2-3 sentence honest assessment.',
    what_doesnt_compress: ['Skill 1', 'Skill 2', 'Skill 3'],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs 2025', accessed_date: '2026-02-20' },
    ],
  },

  moat_skills: [
    {
      skill: 'Moat skill name',
      why_it_matters: 'Why this skill matters for this career.',
      how_to_build_in_college: 'Concrete 4-year action plan.',
    },
  ],

  educational_path: {
    primary_degrees: ['B.Tech CSE'],
    alternative_degrees: ['BSc Computer Science', 'BCA'],
    target_colleges: {
      stretch: ['IIT Bombay CSE'],
      realistic: ['NIT Trichy CSE'],
      accessible: ['Top state engineering colleges'],
    },
    minimum_viable_path: 'Cheapest path that actually works.',
    what_to_do_in_college: ['Year 1 action', 'Year 2 action', 'Year 3 action', 'Year 4 action'],
    time_to_first_real_income: 4,
  },

  // REQUIRED — schema rejects empty cons array.
  cons: [
    { issue: 'Honest downside 1', explanation: '2-3 sentence explanation.' },
  ],

  india_context: {
    geographic_concentration: 'Where this career concentrates in India.',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad'],
  },

  adjacent_careers: [
    { career_slug: 'another-career-slug', why_its_a_natural_pivot: 'Why this pivot makes sense.' },
  ],

  example_paths: [
    {
      college_tier: 'mid_nit',
      college_to_first_job: 'What this person did during college that mattered.',
      where_now: 'Anonymised current role and tenure.',
      income_range: '₹25-35 LPA',
      one_decision_that_mattered: 'The one choice that shaped the path.',
    },
  ],

  sources: [
    { type: 'editorial', label: 'Editorial — paired interviews with 5 practitioners', accessed_date: '2026-04-10' },
  ],
  authors: ['editorial@canvasclasses.in'],
  last_full_review: '2026-04',
  next_review_due: '2026-07',
  status: 'draft',
};

interface FieldError { path: string; message: string }

export default function NewSpecClient() {
  const router = useRouter();
  const [draft, setDraft] = useState<string>(() => JSON.stringify(SKELETON, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  async function create() {
    setSaving(true);
    setError(null);
    setFieldErrors([]);
    try {
      const parsed = JSON.parse(draft);
      const res = await fetch('/api/v2/career-explorer/specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (Array.isArray(body.fields)) setFieldErrors(body.fields);
        throw new Error(body.error || `Create failed (${res.status})`);
      }
      const body = await res.json();
      router.push(`/career-explorer/specs/${body.item._id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end">
        <button
          onClick={create}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create spec
        </button>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        className="mt-3 h-[70vh] w-full rounded-xl border border-white/10 bg-[#0B0F15] p-4 font-mono text-xs leading-relaxed text-white/90 focus:border-orange-400/60 focus:outline-none"
      />

      <div className="mt-3 min-h-[24px] text-sm">
        {error && (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertCircle className="h-4 w-4" /> {error}
          </span>
        )}
      </div>

      {fieldErrors.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-red-300">Field errors</div>
          <ul className="mt-2 space-y-1 text-sm">
            {fieldErrors.map((f, i) => (
              <li key={i} className="text-red-200">
                <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px]">{f.path}</code>{' '}
                <span className="text-red-100">{f.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
