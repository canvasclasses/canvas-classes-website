import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { CareerMatch } from '@/lib/models/CareerMatch';
import { CareerPath } from '@/lib/models/CareerPath';
import type { ICareerProfile } from '@/lib/models/CareerProfile';
import type { ICareerPath } from '@/lib/models/CareerPath';
import VisionClient, { type VisionSeed } from './VisionClient';

export const metadata: Metadata = {
  title: 'Your Vision of the Future — Career Explorer | Canvas Classes',
  description:
    'A one-page personal vision built from your Career Explorer results. Edit it, print it, share it with someone who knows you.',
};

type ProfileLean = Pick<ICareerProfile, '_id' | 'user_id' | 'meta' | 'scores' | 'constraints'>;
type MatchLean = { career_id: string; computed_score: number; computed_bucket: string };

export default async function VisionPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  await connectToDatabase();

  const profile = await CareerProfile.findById(profileId).lean<ProfileLean | null>();
  if (!profile) notFound();

  // Top 3 non-excluded matches, regardless of bucket — we want the strongest
  // three signals the matcher produced.
  const matches = await CareerMatch.find({
    profile_id: profileId,
    computed_bucket: { $ne: 'excluded' },
  })
    .sort({ computed_score: -1 })
    .limit(3)
    .lean<MatchLean[]>();

  const careerIds = matches.map((m) => m.career_id);
  const careers = careerIds.length > 0
    ? await CareerPath.find({ _id: { $in: careerIds } }).lean<ICareerPath[]>()
    : [];
  const byId = new Map(careers.map((c) => [c._id, c]));
  const topCareers = matches
    .map((m) => byId.get(m.career_id))
    .filter((c): c is ICareerPath => Boolean(c));

  const seed = buildSeed(profile, topCareers);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <VisionClient profileId={profileId} seed={seed} />
    </main>
  );
}

function buildSeed(profile: ProfileLean, careers: ICareerPath[]): VisionSeed {
  const top = careers[0];
  const name = profile.meta?.name ?? '';

  // My work — lean on the top career's family + name.
  const work = top
    ? `I want to work as a ${top.name.toLowerCase()} or something in the ${top.family.toLowerCase()} space. ${top.one_liner}`
    : '';

  // Interests outside work — pull from highest-scoring interest facets.
  const interestEntries = Object.entries(profile.scores?.interest ?? {})
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([k]) => humanizeInterest(k));
  const interests = interestEntries.length > 0
    ? `Outside work, I want to keep space for ${interestEntries.join(', ')}.`
    : '';

  // Where I live — from constraints.
  const geo = profile.constraints?.geo_flex;
  const intl = profile.constraints?.international;
  let location = '';
  if (geo === 'metro') location = 'I see myself in a metro city — Bangalore, Bombay, or Delhi.';
  else if (geo === 'tier2') location = 'I see myself in a tier-2 city, closer to family but with real career opportunities.';
  else if (geo === 'hometown') location = 'I want to stay close to my hometown.';
  else if (geo === 'anywhere') location = 'I am open to living anywhere my career takes me.';
  if (intl === 'settle_abroad') location += ' I am open to settling abroad long-term.';
  else if (intl === 'work_return') location += ' Working abroad for a while, then returning to India, feels right.';
  else if (intl === 'india_only') location += ' I want to build my life in India.';

  // What matters — top 3 values facets.
  const valueEntries = Object.entries(profile.scores?.values ?? {})
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([k]) => humanizeValue(k));
  const matters = valueEntries.length > 0
    ? `The things I refuse to compromise on: ${valueEntries.join(', ')}.`
    : '';

  // People who inspire me — from the top career's role_models if present.
  const role = top?.role_models?.length
    ? `I look up to people like ${top.role_models.slice(0, 3).join(', ')} — for the kind of work they do, not just the fame.`
    : '';

  // What I need to learn.
  const learning = top
    ? [
        top.required_stream && top.required_stream.length > 0
          ? `Take the ${top.required_stream.filter((s) => s !== 'Any').join(' or ')} stream at 10+2.`
          : '',
        top.entrance_exams && top.entrance_exams.length > 0
          ? `Prepare for: ${top.entrance_exams.slice(0, 3).join(', ')}.`
          : '',
        top.degree_paths && top.degree_paths.length > 0
          ? `Look at degree paths like ${top.degree_paths.slice(0, 2).join(' or ')}.`
          : '',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  // How I'll get there — gentle default next steps tuned to class level.
  const cls = profile.meta?.class_level;
  const steps = [
    cls === '9' || cls === '10'
      ? 'This year: pick the stream my top careers actually need.'
      : 'This year: lock my stream choices and subject combinations.',
    'This quarter: talk to one working professional in my top career family.',
    'This month: spend 2 hours on a free online intro — a course, a YouTube channel, a project.',
    'Every week: write one thing I noticed about myself after doing something new.',
  ].join('\n');

  return {
    name,
    work,
    interests,
    location: location.trim(),
    matters,
    role,
    learning,
    steps,
    topCareerIds: careers.map((c) => c._id),
  };
}

function humanizeInterest(key: string): string {
  const map: Record<string, string> = {
    realistic: 'hands-on building and repair',
    investigative: 'reading, research, and figuring things out',
    artistic: 'creative work — writing, drawing, music, design',
    social: 'helping and teaching people',
    enterprising: 'organising people and starting things',
    conventional: 'getting systems clean and orderly',
  };
  return map[key] ?? key;
}

function humanizeValue(key: string): string {
  const map: Record<string, string> = {
    income: 'earning enough to support my family well',
    impact: 'doing work that meaningfully helps others',
    autonomy: 'being my own boss over my time',
    stability: 'a stable, predictable life',
    prestige: 'being respected in my field',
    creativity: 'making things that didn\'t exist before',
    balance: 'real time outside work for family and self',
    growth: 'always learning and getting better',
  };
  return map[key] ?? key;
}
