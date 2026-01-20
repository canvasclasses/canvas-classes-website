'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Beaker, ArrowRight, CheckCircle2, FlaskConical, AlertCircle, Info } from 'lucide-react';

interface FlowStep {
    id: number;
    title: string;
    reagent: string;
    reagentDesc: string;
    leftResult: {
        group: string;
        ions: string;
        desc: string;
        color: string;
    };
    rightResult: {
        condition: string;
        nextAction: string;
    };
    explanation: string;
}

const FLOW_STEPS: FlowStep[] = [
    {
        id: 0,
        title: "Step 1: Group I Analysis",
        reagent: "Dilute (2M) HCl",
        reagentDesc: "Add in cold conditions",
        leftResult: {
            group: "Group I",
            ions: "Hg₂²⁺, Ag⁺, Pb²⁺",
            desc: "Insoluble Chlorides (PbCl₂, AgCl, Hg₂Cl₂)",
            color: "bg-white border-gray-200 text-gray-800"
        },
        rightResult: {
            condition: "No Precipitate?",
            nextAction: "Pass H₂S Gas"
        },
        explanation: "Group I cations precipitate as chlorides with Dilute HCl. Note: PbCl₂ is soluble in hot water but insoluble in cold."
    },
    {
        id: 1,
        title: "Step 2: Group II Analysis",
        reagent: "H₂S Gas",
        reagentDesc: "In presence of 0.2M HCl",
        leftResult: {
            group: "Group II",
            ions: "Hg²⁺, Pb²⁺, Bi³⁺, Cu²⁺, Cd²⁺, As³⁺, Sb³⁺, Sn²⁺",
            desc: "Insoluble Sulphides",
            color: "bg-yellow-900 border-yellow-700 text-yellow-100"
        },
        rightResult: {
            condition: "No Precipitate?",
            nextAction: "Boil H₂S, Add NH₄Cl + NH₄OH"
        },
        explanation: "H₂S in acidic medium (HCl) precipitates Group II sulphides which have very low solubility products (Ksp)."
    },
    {
        id: 2,
        title: "Step 3: Group III Analysis",
        reagent: "NH₄Cl + NH₄OH",
        reagentDesc: "Add in Excess",
        leftResult: {
            group: "Group III",
            ions: "Fe³⁺, Al³⁺, Cr³⁺",
            desc: "Insoluble Hydroxides (M(OH)₃)",
            color: "bg-red-900 border-red-700 text-red-100"
        },
        rightResult: {
            condition: "No Precipitate?",
            nextAction: "Pass H₂S Gas"
        },
        explanation: "NH₄OH in presence of NH₄Cl provides controlled OH⁻ concentration to precipitate only Group III hydroxides."
    },
    {
        id: 3,
        title: "Step 4: Group IV Analysis",
        reagent: "H₂S Gas",
        reagentDesc: "In Ammoniacal Solution",
        leftResult: {
            group: "Group IV",
            ions: "Co²⁺, Ni²⁺, Mn²⁺, Zn²⁺",
            desc: "Insoluble Sulphides (MS)",
            color: "bg-slate-700 border-slate-500 text-slate-100"
        },
        rightResult: {
            condition: "No Precipitate?",
            nextAction: "Add (NH₄)₂CO₃"
        },
        explanation: "In basic medium, S²⁻ concentration is high enough to precipitate Group IV sulphides (higher Ksp than Group II)."
    },
    {
        id: 4,
        title: "Step 5: Group V Analysis",
        reagent: "(NH₄)₂CO₃",
        reagentDesc: "With NH₄Cl + NH₄OH",
        leftResult: {
            group: "Group V",
            ions: "Ba²⁺, Sr²⁺, Ca²⁺",
            desc: "Insoluble Carbonates (MCO₃)",
            color: "bg-white border-gray-200 text-gray-800"
        },
        rightResult: {
            condition: "No Precipitate?",
            nextAction: "Test for Mg²⁺ / Na⁺"
        },
        explanation: "Group V cations precipitate as carbonates. NH₄Cl prevents precipitation of Mg²⁺ by buffering the solution."
    },
    {
        id: 5,
        title: "Step 6: Group VI",
        reagent: "Na₂HPO₄",
        reagentDesc: "Disodium Hydrogen Phosphate",
        leftResult: {
            group: "Group VI",
            ions: "Mg²⁺",
            desc: "White Crystalline Ppt",
            color: "bg-white border-gray-200 text-gray-800"
        },
        rightResult: {
            condition: "End of Scheme",
            nextAction: "Analysis Complete"
        },
        explanation: "Magnesium forms a white precipitate of Magnesium Ammonium Phosphate (Mg(NH₄)PO₄) in basic medium."
    }
];

export default function CationSchemeFlowchart() {
    const [activeStep, setActiveStep] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to new step
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeStep]);

    const handleNext = () => {
        if (activeStep < FLOW_STEPS.length) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className="w-full max-w-full mx-auto my-8">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[800px]">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <ArrowRight className="text-purple-500" />
                            Build the Analysis Scheme
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Click the reagents to build the cation analysis flowchart step-by-step.
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Reset Chart
                    </button>
                </div>

                {/* Main Visualization Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 relative scroll-smooth custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black"
                >
                    {/* START NODE */}
                    <div className="flex justify-center mb-8 relative z-10">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] border border-blue-400/30 text-center">
                            <h3 className="text-xl font-bold">Original Salt Solution</h3>
                            <p className="text-blue-200 text-sm">Clear Solution prepared in water/acid</p>
                        </div>
                    </div>

                    {/* FLOW STEPS */}
                    <div className="max-w-5xl mx-auto space-y-0">
                        {FLOW_STEPS.slice(0, activeStep + 1).map((step, index) => {
                            const isLastActive = index === activeStep;

                            return (
                                <div key={step.id} className="relative">

                                    {/* Connecting Line from Previous or Start */}
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 h-8 w-0.5 bg-gray-800" />

                                    {/* STEP CONTAINER - Removed BG/Border for cleaner look */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative z-10 p-2 mb-8 text-center"
                                    >

                                        {/* Step Header / Action */}
                                        <div className="flex flex-col items-center justify-center">

                                            {/* Step Badge - kept minimal */}
                                            <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em]">
                                                {step.title}
                                            </div>

                                            {/* Action Button */}
                                            {isLastActive && activeStep < FLOW_STEPS.length ? (
                                                <button
                                                    onClick={handleNext}
                                                    className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-900/30 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1"
                                                >
                                                    <span className="flex items-center gap-3 text-xl">
                                                        <Beaker size={24} /> Add {step.reagent}
                                                    </span>
                                                    <span className="text-sm text-purple-200 font-normal">{step.reagentDesc}</span>

                                                    {/* Pulsing Ring */}
                                                    <span className="absolute -inset-1 rounded-2xl border-2 border-purple-500/50 animate-ping opacity-50" />
                                                </button>
                                            ) : (
                                                <div className="flex flex-col items-center py-2">
                                                    <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                                                        <CheckCircle2 size={20} />
                                                        <span>Added {step.reagent}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{step.reagentDesc}</span>
                                                </div>
                                            )}

                                            {/* Explanation Text - No Box */}
                                            <p className="mt-4 text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
                                                {step.explanation}
                                            </p>

                                        </div>

                                        {/* BRANCHING RESULTS */}
                                        <AnimatePresence>
                                            {activeStep > index && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-8 pt-8 border-t border-gray-800 grid grid-cols-2 gap-8 relative"
                                                >
                                                    {/* Left Branch: Precipitate */}
                                                    <div className="flex flex-col items-center relative gap-4">
                                                        <div className="absolute right-[50%] -top-8 w-[50%] h-8 border-l-2 border-t-2 border-gray-800 rounded-tl-2xl" />

                                                        {/* Icon - kept simple */}
                                                        <div className={`w-14 h-14 rounded-2xl ${step.leftResult.color} flex items-center justify-center shadow-lg mb-1 relative z-10`}>
                                                            <FlaskConical size={28} />
                                                        </div>

                                                        {/* Clean Result Text - No Inner Boxes */}
                                                        <div className="text-center">
                                                            <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1 block">Precipitate</span>
                                                            <h4 className="text-2xl font-bold text-white mb-1">{step.leftResult.group}</h4>
                                                            <p className="text-gray-400 text-sm mb-3">{step.leftResult.desc}</p>

                                                            {/* Text Only Ion Result - Bold and Pink */}
                                                            <p className="text-pink-400 font-bold text-xl tracking-wide">
                                                                {step.leftResult.ions}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Right Branch: No Precipitate/Filtrate */}
                                                    <div className="flex flex-col items-center relative gap-4">
                                                        <div className="absolute left-[50%] -top-8 w-[50%] h-8 border-r-2 border-t-2 border-gray-800 rounded-tr-2xl" />

                                                        <div className="w-14 h-14 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center mb-1 shadow-md relative z-10">
                                                            <ArrowRight className="text-gray-500" size={24} />
                                                        </div>

                                                        <div className="text-center">
                                                            <h4 className="font-bold text-gray-300 text-lg mb-1">No Precipitate</h4>
                                                            <p className="text-sm text-gray-500 mb-4 max-w-[200px] mx-auto leading-relaxed">
                                                                Pass filtrate to next group
                                                            </p>

                                                            {/* Pill Button is acceptable for action */}
                                                            <button className="px-5 py-2 hover:bg-purple-900/30 text-purple-400 hover:text-purple-300 text-sm font-bold rounded-full border border-purple-500/20 transition-colors">
                                                                Next: {step.rightResult.nextAction}
                                                            </button>
                                                        </div>

                                                        {/* Connector to next node */}
                                                        {index < FLOW_STEPS.length - 1 && (
                                                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 h-20 w-px bg-gray-800" />
                                                        )}
                                                    </div>

                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </motion.div>
                                </div>
                            );
                        })}

                        {/* Final Completion State */}
                        {activeStep === FLOW_STEPS.length && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center"
                            >
                                <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-400 mb-4">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Flowchart Complete!</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    You have traced the full path for Systematic Cation Analysis. Now you are ready to identify unknown salts!
                                </p>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
