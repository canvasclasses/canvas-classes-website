import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';
import type { ICareerPath } from '@/lib/models/CareerPath';

type CareerDoc = ICareerPath & { is_active?: boolean };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const career = await CareerPath.findById(slug).lean<CareerDoc | null>();
    if (!career) return { title: 'Career — Canvas Classes' };
    return {
      title: `${career.name} — Career Deep Dive | Canvas Classes`,
      description: career.one_liner,
    };
  } catch {
    return { title: 'Career — Canvas Classes' };
  }
}

export default async function CareerDeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const career = await CareerPath.findById(slug).lean<CareerDoc | null>();
  if (!career || !career.is_active) notFound();

  const money = (r?: [number, number]) => (r ? `₹${r[0]}–${r[1]} LPA` : '—');

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/career-explorer" className="text-xs text-white/50 hover:text-white/80">
          ← Career Explorer
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">{career.name}</h1>
          {career.hidden_gem && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-widest text-emerald-300">
              Hidden Gem
            </span>
          )}
          {career.evergreen_sector && (
            <span
              title="Evergreen sectors meet basic human needs — people will pay for these no matter the decade."
              className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs uppercase tracking-widest text-teal-300"
            >
              Evergreen · {career.evergreen_sector}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-white/50">{career.family}</div>
        <p className="mt-4 text-lg text-white/80">{career.one_liner}</p>

        {career.school_subjects && career.school_subjects.length > 0 && (
          <div className="mt-5 rounded-lg border border-white/10 bg-[#0B0F15] px-4 py-3">
            <div className="text-xs uppercase tracking-widest text-white/50">School subjects that feed this</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {career.school_subjects.map((s: string) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <Stats
          items={[
            { label: 'Entry salary', value: money(career.entry_salary_inr_lpa) },
            { label: 'Mid-career', value: money(career.mid_salary_inr_lpa) },
            { label: 'Top range', value: money(career.top_salary_inr_lpa) },
            { label: 'Education', value: `${career.education_duration_years} years` },
            { label: 'Demand', value: career.demand_trajectory },
            { label: 'Supply', value: career.supply_saturation },
          ]}
        />

        {career.day_in_life && (
          <Section title="A day in the life">
            <p className="whitespace-pre-line text-white/80">{career.day_in_life}</p>
          </Section>
        )}

        <Section title="How you&apos;d train">
          <ul className="list-disc space-y-1 pl-5 text-white/80">
            {career.required_stream && career.required_stream.length > 0 && (
              <li>Stream at 10+2: <strong>{career.required_stream.join(' or ')}</strong></li>
            )}
            {career.entrance_exams && career.entrance_exams.length > 0 && (
              <li>Entrance exams: {career.entrance_exams.join(', ')}</li>
            )}
            {career.degree_paths && career.degree_paths.length > 0 && (
              <li>Degree paths: {career.degree_paths.join(' · ')}</li>
            )}
            {career.min_qualification && <li>Minimum qualification: {career.min_qualification}</li>}
            {career.alternative_paths && career.alternative_paths.length > 0 && (
              <li>Alternative paths: {career.alternative_paths.join(' · ')}</li>
            )}
          </ul>
        </Section>

        <Section title="Work reality">
          <Grid items={[
            ['Indoors / outdoors', `${career.indoor_outdoor}% outdoor`],
            ['Desk / field', `${career.desk_field}% field`],
            ['Solo / team', `${career.solo_team}% team`],
            ['Travel', career.travel],
            ['Work hours', career.work_hours],
            ['Communication intensity', `${career.communication_intensity}/5`],
            ['Public-facing', `${career.public_facing}/5`],
            ['Physical demand', `${career.physical_demand}/5`],
          ]} />
        </Section>

        <Section title="Future outlook">
          <Grid items={[
            ['10-year demand', career.demand_trajectory],
            ['Supply in India', career.supply_saturation],
            ['Automation vulnerability', `${career.automation_vulnerability}/5`],
            ['Emerging vs established', `${career.emerging_score}/5`],
            ['Remote feasibility', `${career.remote_feasibility}/5`],
            ['International mobility', `${career.international_mobility}/5`],
          ]} />
          {career.ten_year_outlook && <p className="mt-4 text-white/80">{career.ten_year_outlook}</p>}
          {career.disruption_risks && career.disruption_risks.length > 0 && (
            <div className="mt-3 text-sm text-white/60">
              <div className="text-white/80">Disruption risks</div>
              <ul className="list-disc pl-5">{career.disruption_risks.map((r: string) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
          {career.adjacent_pivots && career.adjacent_pivots.length > 0 && (
            <div className="mt-3 text-sm text-white/60">
              <div className="text-white/80">If this path changes, you can pivot to</div>
              <div>{career.adjacent_pivots.join(' · ')}</div>
            </div>
          )}
        </Section>

        <Section title="Lifestyle fit">
          <Grid items={[
            ['Job stability', `${career.job_stability}/5`],
            ['Work-life balance', `${career.work_life_balance}/5`],
            ['Social prestige (India)', `${career.social_prestige_india}/5`],
            ['Autonomy', `${career.autonomy}/5`],
            ['Creative expression', `${career.creative_expression}/5`],
            ['Impact / meaning', `${career.impact}/5`],
          ]} />
        </Section>

        {((career.what_people_love?.length ?? 0) + (career.burnout_triggers?.length ?? 0) + (career.misconceptions?.length ?? 0)) > 0 ? (
          <Section title="The honest take">
            {career.what_people_love && career.what_people_love.length > 0 && (
              <div className="mb-4">
                <div className="text-emerald-300">What people love</div>
                <ul className="list-disc pl-5 text-white/80">{career.what_people_love.map((s: string) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {career.burnout_triggers && career.burnout_triggers.length > 0 && (
              <div className="mb-4">
                <div className="text-red-300">What burns people out</div>
                <ul className="list-disc pl-5 text-white/80">{career.burnout_triggers.map((s: string) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {career.misconceptions && career.misconceptions.length > 0 && (
              <div>
                <div className="text-white/70">Common misconceptions</div>
                <ul className="list-disc pl-5 text-white/80">{career.misconceptions.map((s: string) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
          </Section>
        ) : null}
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Stats({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
          <div className="text-xs uppercase tracking-widest text-white/50">{it.label}</div>
          <div className="mt-1 text-base text-white/90">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
function Grid({ items }: { items: Array<[string, string | number]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0B0F15] px-4 py-2 text-sm">
          <span className="text-white/60">{k}</span>
          <span className="text-white/90">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
