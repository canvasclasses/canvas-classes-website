import {
    BookOpen,
    Flame,
    Droplet,
    TestTube,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import SaltAnalysisPreview from './SaltAnalysisPreview';

const PROCEDURE_STEPS = [
    {
        n: 1,
        title: 'Preliminary Examination',
        icon: BookOpen,
        accent: 'text-emerald-400',
        ring: 'border-emerald-500/20 bg-emerald-500/5',
        body: 'Note the colour of the salt, observe its smell, and check solubility in water. Coloured salts often hint at transition metal cations — blue suggests Cu²⁺, green suggests Fe²⁺ or Ni²⁺, pink suggests Co²⁺ or Mn²⁺.',
    },
    {
        n: 2,
        title: 'Dry Tests',
        icon: Flame,
        accent: 'text-amber-400',
        ring: 'border-amber-500/20 bg-amber-500/5',
        body: 'Heat a small amount of salt in a dry test tube. Observe colour changes and gas evolution. Perform borax bead test for transition metals and flame test using a clean platinum wire dipped in concentrated HCl.',
    },
    {
        n: 3,
        title: 'Anion Analysis',
        icon: Droplet,
        accent: 'text-cyan-400',
        ring: 'border-cyan-500/20 bg-cyan-500/5',
        body: 'Test for anions in two stages. Dilute H₂SO₄ test detects carbonate, sulphide, sulphite, nitrite and acetate. Concentrated H₂SO₄ test detects chloride, bromide, iodide, nitrate and oxalate. Confirm with specific tests like the brown ring test.',
    },
    {
        n: 4,
        title: 'Cation Analysis',
        icon: TestTube,
        accent: 'text-purple-400',
        ring: 'border-purple-500/20 bg-purple-500/5',
        body: 'Prepare original solution and pass through Groups 0 → I → II → III → IV → V → VI in fixed order. Each group uses a specific reagent — dilute HCl, H₂S in acidic medium, NH₄Cl + NH₄OH, H₂S in basic medium, (NH₄)₂CO₃, and confirmatory tests for Mg²⁺.',
    },
    {
        n: 5,
        title: 'Confirmatory Tests',
        icon: CheckCircle2,
        accent: 'text-pink-400',
        ring: 'border-pink-500/20 bg-pink-500/5',
        body: 'Once the cation and anion are identified by their group, run at least one confirmatory test for each — silver nitrate test for halides, brown ring test for nitrate, ammonium molybdate test for phosphate, and characteristic flame colours for cations.',
    },
];

export default function SaltAnalysisIntro() {
    return (
        <section
            id="learn-salt-analysis"
            className="border-t border-gray-800 bg-gradient-to-b from-gray-900 to-gray-900/60 py-14 md:py-20"
        >
            <div className="container mx-auto max-w-6xl px-4">
                {/* What is Salt Analysis — two-column on desktop, preview right */}
                <div className="mb-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-12">
                    {/* Left: text */}
                    <div>
                        <span className="mb-4 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-400">
                            Class 12 Chemistry Practical
                        </span>
                        <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl">
                            What is{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                                Salt Analysis
                            </span>
                            ?
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-gray-300 md:text-lg">
                            <p>
                                <strong className="text-white">Salt analysis</strong>, also called{' '}
                                <em>qualitative inorganic analysis</em>, is the systematic procedure
                                used to identify the <strong>cation</strong> (basic radical) and the{' '}
                                <strong>anion</strong> (acidic radical) present in an unknown
                                inorganic salt. It is one of the most important practicals in CBSE
                                Class 12 Chemistry and a foundation topic for JEE and NEET
                                inorganic chemistry.
                            </p>
                            <p>
                                The analysis is done in a <strong>fixed order</strong>: a few
                                preliminary tests to narrow down possibilities, dry tests on the
                                solid salt, then anion analysis using dilute and concentrated
                                sulphuric acid, and finally cation analysis by separating cations
                                into <strong>six groups</strong> using selective group reagents —
                                dilute HCl, H₂S, NH₄OH, NH₄Cl, (NH₄)₂CO₃ and confirmatory tests for
                                Mg²⁺. Each group reagent is chosen so that it precipitates{' '}
                                <em>only</em> its own cations while keeping the rest in solution.
                            </p>
                        </div>

                        {/* Jump-to navigation */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#anion-simulator"
                                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                            >
                                Anion Simulator <ArrowRight size={14} />
                            </a>
                            <a
                                href="#cation-simulator"
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20"
                            >
                                Cation Simulator <ArrowRight size={14} />
                            </a>
                            <a
                                href="#dry-tests"
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20"
                            >
                                Flame &amp; Dry Tests <ArrowRight size={14} />
                            </a>
                            <a
                                href="#quiz-section"
                                className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
                            >
                                Practice Quiz <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Right: live flame-test preview */}
                    <div className="mx-auto w-full max-w-md lg:sticky lg:top-24">
                        <SaltAnalysisPreview />
                    </div>
                </div>

                {/* Procedure Steps */}
                <div className="mb-16">
                    <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                        How to Perform Salt Analysis:{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Step-by-Step Procedure
                        </span>
                    </h2>
                    <p className="mb-8 text-gray-400">
                        The five stages of CBSE Class 12 salt analysis, in the exact order followed
                        in the lab.
                    </p>

                    {/* Desktop: 2-column grid (always expanded) */}
                    <ol className="hidden gap-4 md:grid md:grid-cols-2">
                        {PROCEDURE_STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <li
                                    key={step.n}
                                    className={`relative rounded-2xl border ${step.ring} p-5 md:p-6`}
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60`}
                                        >
                                            <Icon size={20} className={step.accent} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                            Step {step.n}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                                        {step.body}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>

                    {/* Mobile: collapsible accordion (saves vertical space) */}
                    <div className="space-y-3 md:hidden">
                        {PROCEDURE_STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <details
                                    key={step.n}
                                    className={`group rounded-2xl border ${step.ring} overflow-hidden`}
                                >
                                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900/60">
                                            <Icon size={18} className={step.accent} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                Step {step.n}
                                            </p>
                                            <h3 className="text-base font-bold text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-900 text-emerald-400 transition group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <div className="border-t border-white/10 px-4 py-3">
                                        <p className="text-sm leading-relaxed text-gray-300">
                                            {step.body}
                                        </p>
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
