import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';

const VIVA_QUESTIONS: { q: string; a: string }[] = [
    {
        q: 'What is salt analysis in chemistry?',
        a: 'Salt analysis (qualitative inorganic analysis) is the systematic procedure used to identify the cation and anion present in an unknown inorganic salt. It is one of the most important practicals in CBSE Class 12 Chemistry and a foundation topic for JEE and NEET inorganic chemistry.',
    },
    {
        q: 'What is the original solution in salt analysis?',
        a: 'The original solution (O.S.) is a solution of the salt prepared in a suitable solvent — usually water, dilute HCl, dilute HNO₃, or aqua regia, depending on the solubility of the salt. The original solution is used for systematic cation analysis through Groups 0 to VI.',
    },
    {
        q: 'Why is dilute HCl used as the Group I reagent?',
        a: 'Dilute HCl precipitates only the cations whose chlorides are insoluble — Pb²⁺, Ag⁺, and Hg₂²⁺. The dilute concentration provides a controlled chloride ion concentration so that the chlorides of Group II–VI cations (which are soluble) remain in solution and can be analysed in subsequent groups.',
    },
    {
        q: 'How do you identify the cation in a salt?',
        a: 'Cations are identified by passing the original solution through Groups 0 to VI in fixed order. Group 0 (NH₄⁺) is tested first using NaOH. Group I uses dilute HCl. Group II uses H₂S in acidic medium. Group III uses NH₄Cl + NH₄OH. Group IV uses H₂S in alkaline medium. Group V uses (NH₄)₂CO₃. Group VI tests for Mg²⁺. Once the cation is precipitated in a group, a confirmatory test pinpoints the exact ion.',
    },
    {
        q: 'How do you identify the anion in a salt?',
        a: 'Anions are identified in two stages. The dilute H₂SO₄ test detects carbonate, sulphide, sulphite, nitrite and acetate by gas evolution. The concentrated H₂SO₄ test detects chloride, bromide, iodide, nitrate and oxalate. The anion is then confirmed using specific tests — silver nitrate test for halides, brown ring test for nitrate, BaCl₂ test for sulphate, and ammonium molybdate test for phosphate.',
    },
    {
        q: 'What is the dry test in salt analysis?',
        a: 'Dry tests are performed on the solid salt before it is dissolved. They include noting the colour and smell of the salt, heating the salt in a dry test tube to observe colour changes and any gas evolved, the flame test using a clean platinum wire dipped in concentrated HCl, and the borax bead test for transition metal cations. Dry tests give early hints about the cation and anion present.',
    },
    {
        q: 'Why is H₂S not passed in Group I?',
        a: 'H₂S is not passed in Group I because the goal of Group I is to precipitate only Pb²⁺, Ag⁺, and Hg₂²⁺ as their insoluble chlorides using dilute HCl. If H₂S were passed first, sulphides of Group II cations would also precipitate together, making it impossible to separate Group I from Group II cleanly.',
    },
    {
        q: 'What is the principle of qualitative inorganic analysis?',
        a: 'The principle is selective precipitation based on the Solubility Product (Ksp) of insoluble salts. By controlling the concentration of the precipitating ion (Cl⁻, S²⁻, OH⁻, CO₃²⁻) and the pH of the medium, only the cations of one group exceed their Ksp and precipitate, while cations of later groups remain in solution. The Common Ion Effect is used to fine-tune ion concentrations during the procedure.',
    },
    {
        q: 'What apparatus is needed for salt analysis practical?',
        a: 'The basic apparatus includes test tubes and a test tube stand, test tube holder, Bunsen burner, platinum or nichrome wire for the flame test, watch glass, glass rod, dropper bottles for reagents (dilute HCl, dilute and concentrated H₂SO₄, NaOH, NH₄OH, NH₄Cl, H₂S source, BaCl₂, AgNO₃, FeSO₄, (NH₄)₂CO₃), a centrifuge or filter paper for separating precipitates, and a wash bottle.',
    },
    {
        q: 'What precautions should be taken during salt analysis?',
        a: 'Always test for NH₄⁺ in the original solution before adding any ammonium reagent. Use cold dilute HCl in Group I to fully precipitate PbCl₂. Pass H₂S only in a fume hood — it is toxic. Keep the medium acidic for Group II and alkaline for Group IV. Centrifuge or filter completely before moving to the next group. Confirm each cation and anion with at least one specific confirmatory test.',
    },
];

export default function SaltAnalysisVivaFAQ() {
    return (
        <section
            id="viva-questions"
            className="border-t border-gray-800 bg-gray-900/60 py-16 md:py-20"
        >
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-8 flex items-center gap-3">
                    <HelpCircle className="text-emerald-400" size={24} />
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Salt Analysis{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                            Viva Questions
                        </span>
                    </h2>
                </div>
                <p className="mb-8 text-gray-400">
                    The most commonly asked viva questions in CBSE Class 12 Chemistry practical
                    examinations, with concise model answers.
                </p>

                <div className="space-y-3">
                    {VIVA_QUESTIONS.map((item, idx) => (
                        <details
                            key={idx}
                            className="group overflow-hidden rounded-xl border border-gray-700/60 bg-gray-800/40 transition hover:border-emerald-500/30"
                        >
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                                <h3 className="text-base font-semibold text-white md:text-lg">
                                    <span className="mr-2 text-emerald-400">Q{idx + 1}.</span>
                                    {item.q}
                                </h3>
                                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-900 text-emerald-400 transition group-open:rotate-45">
                                    +
                                </span>
                            </summary>
                            <div className="border-t border-gray-700/60 px-5 py-4">
                                <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                                    {item.a}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>

                {/* Soft CTA to Question Bank */}
                <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 md:p-8">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="mb-1 text-xl font-bold text-white">
                                Practice salt analysis questions
                            </h3>
                            <p className="text-sm text-gray-300 md:text-base">
                                Test yourself with conceptual MCQs, previous year board questions,
                                and JEE/NEET problems on qualitative analysis.
                            </p>
                        </div>
                        <Link
                            href="/chemistry-questions"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-bold text-black transition hover:from-emerald-400 hover:to-teal-400"
                        >
                            Practice Questions <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
