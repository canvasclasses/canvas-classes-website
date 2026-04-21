// Seed questionnaire — Phase 1 MVP.
//
// 50 items across the six dimensions. Tone: conversational, Indian context,
// student-as-decision-maker. Weights are starting-point guesses; we'll tune
// after real student data comes back.
//
// Import from the seed script (scripts/career-explorer/seed_questions.js) and
// from the admin UI (reset-to-defaults action).

import type { ICareerQuestion } from '@/lib/models/CareerQuestion';

type SeedQuestion = Omit<ICareerQuestion, 'created_at' | 'updated_at'>;

// ── Dimension A · Aptitude & Cognitive Style (8 questions) ──────────────────
const aptitude: SeedQuestion[] = [
  {
    _id: 'cq_apt_001',
    dimension: 'aptitude',
    sub_facet: 'logical',
    order: 1,
    prompt: "You're given a messy dataset and a tight deadline. What's your instinct?",
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Break it into rules, then chain them to reach an answer.', contributes: { logical: 2, numerical: 1 } },
      { id: 'b', label: 'Visualise it on paper — draw the shape of the data first.', contributes: { spatial: 2, logical: 1 } },
      { id: 'c', label: 'Talk it through with someone to sharpen your thinking.', contributes: { interpersonal: 2, verbal: 1 } },
      { id: 'd', label: 'Start building something rough — you think by doing.', contributes: { kinesthetic: 2, logical: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_002',
    dimension: 'aptitude',
    sub_facet: 'spatial',
    order: 2,
    prompt: 'Picture yourself explaining how a bicycle gear works. You would most naturally…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Draw it. Arrows, rotations, the whole thing.', contributes: { spatial: 2, kinesthetic: 1 } },
      { id: 'b', label: 'Use analogies and stories.', contributes: { verbal: 2, interpersonal: 1 } },
      { id: 'c', label: 'Work out the ratios — numbers are the clearest explanation.', contributes: { numerical: 2, logical: 1 } },
      { id: 'd', label: 'Take one apart and show them.', contributes: { kinesthetic: 2, spatial: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_003',
    dimension: 'aptitude',
    sub_facet: 'numerical',
    order: 3,
    prompt: 'A friend says their startup grew "2x this quarter". You…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Want to see the actual numbers and the base.', contributes: { numerical: 2, logical: 1 } },
      { id: 'b', label: 'Congratulate them and ask about the story behind it.', contributes: { interpersonal: 2, verbal: 1 } },
      { id: 'c', label: 'Sketch a chart in your head to check if it sounds right.', contributes: { spatial: 1, numerical: 1 } },
      { id: 'd', label: 'Trust them and move on. Growth is growth.', contributes: { interpersonal: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_004',
    dimension: 'aptitude',
    sub_facet: 'verbal',
    order: 4,
    prompt: 'You find an essay you wrote two years ago. Your first instinct is to…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Rewrite every sentence until it sings.', contributes: { verbal: 2, intrapersonal: 1 } },
      { id: 'b', label: 'Skim and move on — the argument matters, not the prose.', contributes: { logical: 2 } },
      { id: 'c', label: 'Wonder who you were back then. Read it like a time capsule.', contributes: { intrapersonal: 2, verbal: 1 } },
      { id: 'd', label: 'Delete it. You never look back.', contributes: {} },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_005',
    dimension: 'aptitude',
    sub_facet: 'kinesthetic',
    order: 5,
    prompt: 'Which of these would you genuinely enjoy for a full Sunday?',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Repairing something with your hands — cycle, circuit, piece of furniture.', contributes: { kinesthetic: 2, spatial: 1 } },
      { id: 'b', label: 'Reading a long, difficult book.', contributes: { verbal: 2, intrapersonal: 1 } },
      { id: 'c', label: 'Organising a gathering with friends.', contributes: { interpersonal: 2 } },
      { id: 'd', label: 'Solving a hard puzzle or problem set.', contributes: { logical: 2, numerical: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_006',
    dimension: 'aptitude',
    sub_facet: 'interpersonal',
    order: 6,
    prompt: 'Group project in college. You notice two people quietly not contributing. You…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Speak to each of them privately — figure out what\'s really going on.', contributes: { interpersonal: 2, intrapersonal: 1 } },
      { id: 'b', label: 'Split the work more explicitly so there\'s no room to hide.', contributes: { logical: 2 } },
      { id: 'c', label: 'Do their share yourself. Faster than arguing.', contributes: { kinesthetic: 1 } },
      { id: 'd', label: 'Call it out in the next group meeting.', contributes: { verbal: 2, interpersonal: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_007',
    dimension: 'aptitude',
    sub_facet: 'intrapersonal',
    order: 7,
    prompt: 'After a hard day, the best way for you to reset is…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Alone time. A walk, a journal, a long thought.', contributes: { intrapersonal: 2 } },
      { id: 'b', label: 'A long conversation with someone you trust.', contributes: { interpersonal: 2 } },
      { id: 'c', label: 'Something physical — gym, sport, just moving.', contributes: { kinesthetic: 2 } },
      { id: 'd', label: 'Something cognitive — a game, a problem, a book.', contributes: { logical: 1, verbal: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_apt_008',
    dimension: 'aptitude',
    sub_facet: 'musical',
    order: 8,
    prompt: 'Which is closest to true for you?',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'I notice tone, rhythm, and pattern in sound — music, speech, anything audible.', contributes: { musical: 2, verbal: 1 } },
      { id: 'b', label: 'I remember numbers and sequences more easily than most.', contributes: { numerical: 2, logical: 1 } },
      { id: 'c', label: 'I remember faces, rooms, routes.', contributes: { spatial: 2 } },
      { id: 'd', label: 'I remember conversations almost word-for-word.', contributes: { verbal: 2, interpersonal: 1 } },
    ],
    is_active: true,
  },
];

// ── Dimension B · Interests (RIASEC) — 10 questions ──────────────────────────
const interest: SeedQuestion[] = [
  {
    _id: 'cq_int_001',
    dimension: 'interest',
    order: 9,
    prompt: "An ideal Sunday: you'd rather…",
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Fix up something in the house or build a small project.', contributes: { R: 2 } },
      { id: 'b', label: 'Read about a topic you\'ve been obsessing over.', contributes: { I: 2 } },
      { id: 'c', label: 'Work on a creative piece — writing, music, design.', contributes: { A: 2 } },
      { id: 'd', label: 'Meet a friend going through something and help them think it through.', contributes: { S: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_002',
    dimension: 'interest',
    order: 10,
    prompt: 'Another ideal Sunday: you\'d rather…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Plan and sell something. Make a little money doing it.', contributes: { E: 2 } },
      { id: 'b', label: 'Finish all your pending admin — bills, records, paperwork.', contributes: { C: 2 } },
      { id: 'c', label: 'Take apart a gadget to see how it works.', contributes: { R: 1, I: 1 } },
      { id: 'd', label: 'Try a new recipe, precisely.', contributes: { R: 1, A: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_003',
    dimension: 'interest',
    order: 11,
    prompt: 'In a school project, you\'d most naturally take on…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Building the prototype or physical artefact.', contributes: { R: 2 } },
      { id: 'b', label: 'The research and analysis.', contributes: { I: 2 } },
      { id: 'c', label: 'The design — visuals, storytelling, how it looks and feels.', contributes: { A: 2 } },
      { id: 'd', label: 'Coordinating the team and keeping everyone going.', contributes: { E: 1, S: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_004',
    dimension: 'interest',
    order: 12,
    prompt: 'Which of these gives you the most energy?',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Understanding why something works the way it does.', contributes: { I: 2 } },
      { id: 'b', label: 'Making something beautiful or original.', contributes: { A: 2 } },
      { id: 'c', label: 'Helping someone solve a problem they\'re stuck on.', contributes: { S: 2 } },
      { id: 'd', label: 'Convincing a group to get behind an idea.', contributes: { E: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_005',
    dimension: 'interest',
    order: 13,
    prompt: 'If money and family pressure were equal across options, you\'d pick…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'A career where you build or fix real things.', contributes: { R: 2 } },
      { id: 'b', label: 'A career where you investigate and figure things out.', contributes: { I: 2 } },
      { id: 'c', label: 'A career where you create and express.', contributes: { A: 2 } },
      { id: 'd', label: 'A career where you work with and for people.', contributes: { S: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_006',
    dimension: 'interest',
    order: 14,
    prompt: 'When you imagine being in charge…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'You\'re running something — a business, a team, a movement.', contributes: { E: 2 } },
      { id: 'b', label: 'You\'re the expert everyone consults for hard decisions.', contributes: { I: 2 } },
      { id: 'c', label: 'You\'re keeping something running flawlessly — operations, systems, records.', contributes: { C: 2 } },
      { id: 'd', label: 'You\'re creating the brand, voice, or aesthetic that defines it.', contributes: { A: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_007',
    dimension: 'interest',
    order: 15,
    prompt: 'Which of these feels closest to a compliment?',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: '"You\'re great with your hands."', contributes: { R: 2 } },
      { id: 'b', label: '"You think really deeply about things."', contributes: { I: 2 } },
      { id: 'c', label: '"You have such a distinctive style."', contributes: { A: 2 } },
      { id: 'd', label: '"You\'re the person everyone comes to."', contributes: { S: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_008',
    dimension: 'interest',
    order: 16,
    prompt: 'Another compliment. Closest to one you\'d value?',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: '"You make things happen."', contributes: { E: 2 } },
      { id: 'b', label: '"Nothing falls through the cracks with you."', contributes: { C: 2 } },
      { id: 'c', label: '"You see patterns no one else sees."', contributes: { I: 2 } },
      { id: 'd', label: '"You bring out the best in people."', contributes: { S: 1, E: 1 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_009',
    dimension: 'interest',
    order: 17,
    prompt: 'A class you\'d gladly take even without credit…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Physics / biology / chemistry — how things actually work.', contributes: { I: 2 } },
      { id: 'b', label: 'Film / literature / philosophy.', contributes: { A: 1, I: 1 } },
      { id: 'c', label: 'Business / economics / negotiation.', contributes: { E: 2 } },
      { id: 'd', label: 'Psychology / counselling / teaching methods.', contributes: { S: 2 } },
    ],
    is_active: true,
  },
  {
    _id: 'cq_int_010',
    dimension: 'interest',
    order: 18,
    prompt: 'Your dream workspace has…',
    format: 'force_choice',
    mode: 'contribution',
    options: [
      { id: 'a', label: 'Tools, machines, materials. Space to build.', contributes: { R: 2 } },
      { id: 'b', label: 'Books, whiteboards, and long undisturbed afternoons.', contributes: { I: 2 } },
      { id: 'c', label: 'Good light, a studio, your own taste on every surface.', contributes: { A: 2 } },
      { id: 'd', label: 'A second screen, a well-organised filing system, a calendar that respects you.', contributes: { C: 2 } },
    ],
    is_active: true,
  },
];

// ── Dimension C · Work Style & Environment — 8 questions ─────────────────────
const workStyleLikert = (opts: { left: string; right: string; key: string }): SeedQuestion['options'] => ([
  { id: '1', label: `Strongly: ${opts.left}`, contributes: { [opts.key]: -2 } },
  { id: '2', label: `Leans: ${opts.left}`, contributes: { [opts.key]: -1 } },
  { id: '3', label: 'No strong preference', contributes: { [opts.key]: 0 } },
  { id: '4', label: `Leans: ${opts.right}`, contributes: { [opts.key]: 1 } },
  { id: '5', label: `Strongly: ${opts.right}`, contributes: { [opts.key]: 2 } },
]);

const work_style: SeedQuestion[] = [
  {
    _id: 'cq_ws_001', dimension: 'work_style', sub_facet: 'indoor_outdoor', order: 19,
    prompt: 'Where do you want your work to happen, most days?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Indoors', right: 'Outdoors', key: 'indoor_outdoor' }), is_active: true,
  },
  {
    _id: 'cq_ws_002', dimension: 'work_style', sub_facet: 'desk_field', order: 20,
    prompt: 'Desk-based work or on-your-feet work?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'At a desk', right: 'Out in the field', key: 'desk_field' }), is_active: true,
  },
  {
    _id: 'cq_ws_003', dimension: 'work_style', sub_facet: 'solo_team', order: 21,
    prompt: 'Solo focus or constant team interaction?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Mostly solo', right: 'Mostly team', key: 'solo_team' }), is_active: true,
  },
  {
    _id: 'cq_ws_004', dimension: 'work_style', sub_facet: 'structured_flex', order: 22,
    prompt: 'Predictable structure or constant variety?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Predictable', right: 'Constantly varied', key: 'structured_flex' }), is_active: true,
  },
  {
    _id: 'cq_ws_005', dimension: 'work_style', sub_facet: 'public_facing', order: 23,
    prompt: 'Behind-the-scenes or publicly visible?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Behind the scenes', right: 'Public-facing', key: 'public_facing' }), is_active: true,
  },
  {
    _id: 'cq_ws_006', dimension: 'work_style', sub_facet: 'stakes', order: 24,
    prompt: 'Steady low-stakes or high-stakes with bigger upside?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Steady, low-stakes', right: 'High-stakes', key: 'stakes' }), is_active: true,
  },
  {
    _id: 'cq_ws_007', dimension: 'work_style', sub_facet: 'travel_appetite', order: 25,
    prompt: 'Travel for work — how much would you actually enjoy?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Almost none', right: 'Constant travel', key: 'travel_appetite' }), is_active: true,
  },
  {
    _id: 'cq_ws_008', dimension: 'work_style', sub_facet: 'uniform_tolerance', order: 26,
    prompt: 'Wearing a uniform / strict dress code — OK with it?', format: 'likert5', mode: 'contribution',
    options: workStyleLikert({ left: 'Hate it', right: 'Completely fine', key: 'uniform_tolerance' }), is_active: true,
  },
];

// ── Dimension D · Values & Life Priorities — 7 questions ─────────────────────
const values: SeedQuestion[] = [
  {
    _id: 'cq_val_001', dimension: 'values', sub_facet: 'financial', order: 27,
    prompt: 'How much does the size of your future income matter to you — honestly?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'I just need enough. I don\'t chase money.', contributes: { financial: 0 } },
      { id: '2', label: 'Comfortable is enough.', contributes: { financial: 25 } },
      { id: '3', label: 'I want to do well but not at any cost.', contributes: { financial: 50 } },
      { id: '4', label: 'I\'d trade a lot to earn well.', contributes: { financial: 75 } },
      { id: '5', label: 'Earning a lot matters deeply to me.', contributes: { financial: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_002', dimension: 'values', sub_facet: 'stability', order: 28,
    prompt: 'Stable monthly salary vs. high variance with a bigger ceiling?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Give me high variance. I\'ll handle it.', contributes: { stability: 0 } },
      { id: '2', label: 'Some variance is fine.', contributes: { stability: 25 } },
      { id: '3', label: 'Balance.', contributes: { stability: 50 } },
      { id: '4', label: 'Leaning stable.', contributes: { stability: 75 } },
      { id: '5', label: 'Predictable salary is very important.', contributes: { stability: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_003', dimension: 'values', sub_facet: 'impact', order: 29,
    prompt: 'Making tangible impact on people or systems — how much do you need that?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Not really a driver for me.', contributes: { impact: 0 } },
      { id: '2', label: 'Nice-to-have.', contributes: { impact: 25 } },
      { id: '3', label: 'Matters.', contributes: { impact: 50 } },
      { id: '4', label: 'Matters a lot.', contributes: { impact: 75 } },
      { id: '5', label: 'I can\'t do work that feels meaningless.', contributes: { impact: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_004', dimension: 'values', sub_facet: 'prestige', order: 30,
    prompt: 'How much does social prestige of your career matter — to you, not your family?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Not at all.', contributes: { prestige: 0 } },
      { id: '2', label: 'A little.', contributes: { prestige: 25 } },
      { id: '3', label: 'Some.', contributes: { prestige: 50 } },
      { id: '4', label: 'Quite a bit.', contributes: { prestige: 75 } },
      { id: '5', label: 'A lot.', contributes: { prestige: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_005', dimension: 'values', sub_facet: 'wlb', order: 31,
    prompt: 'Work-life balance vs. intense work that takes over your life?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'I\'ll work insane hours if the work is worth it.', contributes: { wlb: 0 } },
      { id: '2', label: 'I can push hard for a few years.', contributes: { wlb: 25 } },
      { id: '3', label: 'Balance matters.', contributes: { wlb: 50 } },
      { id: '4', label: 'Balance matters a lot.', contributes: { wlb: 75 } },
      { id: '5', label: 'My life outside work is non-negotiable.', contributes: { wlb: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_006', dimension: 'values', sub_facet: 'autonomy', order: 32,
    prompt: 'Being told what to do vs. deciding what to do?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'I prefer a clear boss with clear tasks.', contributes: { autonomy: 0 } },
      { id: '2', label: 'Some direction, some freedom.', contributes: { autonomy: 25 } },
      { id: '3', label: 'Balanced.', contributes: { autonomy: 50 } },
      { id: '4', label: 'I want mostly my own calls.', contributes: { autonomy: 75 } },
      { id: '5', label: 'I need to own my decisions completely.', contributes: { autonomy: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_val_007', dimension: 'values', sub_facet: 'creative', order: 33,
    prompt: 'How much creative expression do you need your work to allow?',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'None required.', contributes: { creative: 0 } },
      { id: '2', label: 'A little.', contributes: { creative: 25 } },
      { id: '3', label: 'Some.', contributes: { creative: 50 } },
      { id: '4', label: 'A lot.', contributes: { creative: 75 } },
      { id: '5', label: 'Creativity is the whole point.', contributes: { creative: 100 } },
    ], is_active: true,
  },
];

// ── Dimension E · Constraints & Context — 10 questions ───────────────────────
const constraints: SeedQuestion[] = [
  {
    _id: 'cq_con_001', dimension: 'constraints', order: 34,
    prompt: 'Honest question: how would you describe your family\'s financial capacity for your education?',
    help_text: 'No judgement. This just helps us avoid suggesting paths that would require loans your family can\'t carry.',
    format: 'single_select', mode: 'constraint', constraint_key: 'financial_capacity',
    options: [
      { id: '1', label: 'Very tight — government / scholarship only.', value: 1 },
      { id: '2', label: 'Limited — low-fee colleges only.', value: 2 },
      { id: '3', label: 'Moderate — mid-range private is possible.', value: 3 },
      { id: '4', label: 'Comfortable — premium private is an option.', value: 4 },
      { id: '5', label: 'Very comfortable — cost is not a major constraint.', value: 5 },
    ], is_active: true,
  },
  {
    _id: 'cq_con_002', dimension: 'constraints', order: 35,
    prompt: 'Are you (and your family) open to an education loan if the career warrants it?',
    format: 'single_select', mode: 'constraint', constraint_key: 'loan_ok',
    options: [
      { id: 'y', label: 'Yes, for the right programme.', value: true },
      { id: 'n', label: 'No, we\'d rather not take one.', value: false },
    ], is_active: true,
  },
  {
    _id: 'cq_con_003', dimension: 'constraints', order: 36,
    prompt: 'Where do you actually want to live and work?',
    format: 'single_select', mode: 'constraint', constraint_key: 'geo_flex',
    options: [
      { id: 'metro', label: 'A metro (Bangalore, Delhi, Mumbai, etc.)', value: 'metro' },
      { id: 'tier2', label: 'Tier-2 city, less chaos.', value: 'tier2' },
      { id: 'hometown', label: 'Close to my hometown / family.', value: 'hometown' },
      { id: 'anywhere', label: 'Anywhere — including abroad.', value: 'anywhere' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_004', dimension: 'constraints', order: 37,
    prompt: 'Do you want to eventually work or settle abroad?',
    format: 'single_select', mode: 'constraint', constraint_key: 'international',
    options: [
      { id: 'settle', label: 'Yes — I want to settle abroad long-term.', value: 'settle_abroad' },
      { id: 'return', label: 'Work abroad for a few years, then return.', value: 'work_return' },
      { id: 'india', label: 'India only.', value: 'india_only' },
      { id: 'unsure', label: 'Not sure yet.', value: 'unsure' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_005', dimension: 'constraints', order: 38,
    prompt: 'How comfortable are you with English as a working language?',
    format: 'single_select', mode: 'constraint', constraint_key: 'language_comfort',
    options: [
      { id: 'native', label: 'Native-level. I think and dream in it.', value: 'en_native' },
      { id: 'good', label: 'Good. Work is no problem.', value: 'en_good' },
      { id: 'dev', label: 'Still developing.', value: 'en_developing' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_006', dimension: 'constraints', order: 39,
    prompt: 'Your current stream (or most likely stream)?',
    format: 'single_select', mode: 'constraint', constraint_key: 'stream',
    options: [
      { id: 'pcm', label: 'PCM (Physics, Chemistry, Maths)', value: 'PCM' },
      { id: 'pcb', label: 'PCB (Physics, Chemistry, Biology)', value: 'PCB' },
      { id: 'pcmb', label: 'PCMB (all four)', value: 'PCMB' },
      { id: 'com', label: 'Commerce', value: 'Commerce' },
      { id: 'arts', label: 'Arts / Humanities', value: 'Arts' },
      { id: 'und', label: 'Still undecided', value: 'Undecided' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_007', dimension: 'constraints', order: 40,
    prompt: 'How would you rate your current academic band — not where you want to be, where you actually are?',
    format: 'single_select', mode: 'constraint', constraint_key: 'academic_band',
    options: [
      { id: 'top', label: 'Top of my class (top 10%).', value: 'top' },
      { id: 'strong', label: 'Strong (top 30%).', value: 'strong' },
      { id: 'avg', label: 'Average.', value: 'average' },
      { id: 'str', label: 'Struggling right now.', value: 'struggling' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_008', dimension: 'constraints', order: 41,
    prompt: 'How long a path to a stable career can you and your family support?',
    format: 'single_select', mode: 'constraint', constraint_key: 'time_horizon',
    options: [
      { id: 's', label: 'Short — I need to earn within 1–2 years.', value: 'short' },
      { id: 'm', label: 'Medium — 3–5 years is OK.', value: 'medium' },
      { id: 'l', label: 'Long — 6+ years is fine if the career warrants it.', value: 'long' },
    ], is_active: true,
  },
  {
    _id: 'cq_con_009', dimension: 'constraints', order: 42,
    prompt: 'How much pressure does your family put on a specific career path?',
    format: 'likert5', mode: 'constraint', constraint_key: 'family_pressure',
    options: [
      { id: '1', label: 'None — they\'ll support what I choose.', value: 1 },
      { id: '2', label: 'A little.', value: 2 },
      { id: '3', label: 'Some.', value: 3 },
      { id: '4', label: 'A lot.', value: 4 },
      { id: '5', label: 'Heavy — deviating would cause real conflict.', value: 5 },
    ], is_active: true,
  },
  {
    _id: 'cq_con_010', dimension: 'constraints', order: 43,
    prompt: 'Anything else we should know? (Optional — health, responsibilities, anything unusual.)',
    format: 'single_select', mode: 'constraint', constraint_key: 'special_circumstances',
    options: [
      { id: 'none', label: 'Nothing I want to flag.', value: '' },
      { id: 'flag', label: 'Yes — I\'ll add a note on the next screen.', value: 'flagged' },
    ], is_active: true,
  },
];

// ── Dimension F · Future Orientation — 7 questions ───────────────────────────
const future: SeedQuestion[] = [
  {
    _id: 'cq_fut_001', dimension: 'future', sub_facet: 'tech_comfort', order: 44,
    prompt: '"I enjoy learning new tech tools and picking up software quickly."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { tech_comfort: 0 } },
      { id: '2', label: 'Disagree', contributes: { tech_comfort: 25 } },
      { id: '3', label: 'Neutral', contributes: { tech_comfort: 50 } },
      { id: '4', label: 'Agree', contributes: { tech_comfort: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { tech_comfort: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_002', dimension: 'future', sub_facet: 'learning_orientation', order: 45,
    prompt: '"I learn best by teaching myself rather than sitting in classes."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { learning_orientation: 0 } },
      { id: '2', label: 'Disagree', contributes: { learning_orientation: 25 } },
      { id: '3', label: 'Neutral', contributes: { learning_orientation: 50 } },
      { id: '4', label: 'Agree', contributes: { learning_orientation: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { learning_orientation: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_003', dimension: 'future', sub_facet: 'entrepreneurial', order: 46,
    prompt: '"I imagine myself eventually starting or running my own thing."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { entrepreneurial: 0 } },
      { id: '2', label: 'Disagree', contributes: { entrepreneurial: 25 } },
      { id: '3', label: 'Neutral', contributes: { entrepreneurial: 50 } },
      { id: '4', label: 'Agree', contributes: { entrepreneurial: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { entrepreneurial: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_004', dimension: 'future', sub_facet: 'risk_emerging', order: 47,
    prompt: '"I\'d take a chance on an emerging career that most people haven\'t heard of."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { risk_emerging: 0 } },
      { id: '2', label: 'Disagree', contributes: { risk_emerging: 25 } },
      { id: '3', label: 'Neutral', contributes: { risk_emerging: 50 } },
      { id: '4', label: 'Agree', contributes: { risk_emerging: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { risk_emerging: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_005', dimension: 'future', sub_facet: 'unconventional', order: 48,
    prompt: '"I don\'t need my career to fit a familiar label — content creator, founder, independent researcher are all on the table."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { unconventional: 0 } },
      { id: '2', label: 'Disagree', contributes: { unconventional: 25 } },
      { id: '3', label: 'Neutral', contributes: { unconventional: 50 } },
      { id: '4', label: 'Agree', contributes: { unconventional: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { unconventional: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_006', dimension: 'future', sub_facet: 'ai_openness', order: 49,
    prompt: '"I see AI as a tool to amplify what I do, not a threat to it."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { ai_openness: 0 } },
      { id: '2', label: 'Disagree', contributes: { ai_openness: 25 } },
      { id: '3', label: 'Neutral', contributes: { ai_openness: 50 } },
      { id: '4', label: 'Agree', contributes: { ai_openness: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { ai_openness: 100 } },
    ], is_active: true,
  },
  {
    _id: 'cq_fut_007', dimension: 'future', sub_facet: 'global_curiosity', order: 50,
    prompt: '"I\'m curious about how my work could connect to the wider world — other countries, cultures, global problems."',
    format: 'likert5', mode: 'contribution',
    options: [
      { id: '1', label: 'Strongly disagree', contributes: { global_curiosity: 0 } },
      { id: '2', label: 'Disagree', contributes: { global_curiosity: 25 } },
      { id: '3', label: 'Neutral', contributes: { global_curiosity: 50 } },
      { id: '4', label: 'Agree', contributes: { global_curiosity: 75 } },
      { id: '5', label: 'Strongly agree', contributes: { global_curiosity: 100 } },
    ], is_active: true,
  },
];

export const SEED_QUESTIONS: SeedQuestion[] = [
  ...aptitude,
  ...interest,
  ...work_style,
  ...values,
  ...constraints,
  ...future,
];

export const DIMENSION_ORDER: Array<SeedQuestion['dimension']> = [
  'constraints', // start with context so students feel heard early
  'interest',
  'aptitude',
  'work_style',
  'values',
  'future',
];

export const DIMENSION_LABELS: Record<SeedQuestion['dimension'], string> = {
  constraints: 'Your situation',
  interest: 'What pulls you',
  aptitude: 'How you think',
  work_style: 'How you work',
  values: 'What matters',
  future: 'The road ahead',
};
