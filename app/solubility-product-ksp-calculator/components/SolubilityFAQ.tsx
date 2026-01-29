import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
    {
        question: "What actually is 'Solubility'?",
        answer: "Think of solubility as the 'maximum capacity' of water to hold a specific salt. It's usually measured in moles per liter (mol/L). If you try to add more than this limit, it won't dissolve—it will just sit at the bottom as a solid.",
        icon: "💧"
    },
    {
        question: "Why do some salts dissolve while others don't?",
        answer: "It's a tug-of-war! The ions in the salt are held together by 'Lattice Energy' (sticky force). Water tries to pull them apart with 'Hydration Energy' (pulling force). If Water's pull is stronger > Salt dissolves. If Salt's grip is stronger > It stays solid (Precipitate).",
        icon: "🧲"
    },
    {
        question: "What affects Solubility?",
        answer: (
            <div className="space-y-3">
                <p>Solubility depends on several complex parameters:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Internal Factors:</strong> Lattice energy, Hydration energy, Polarization, Packing pattern, and Entropy.</li>
                    <li><strong>External Factors:</strong> Temperature, Common Ion Effect, and pH.</li>
                </ul>
                <p className="text-sm text-gray-400 italic border-l-2 border-indigo-500/50 pl-3 mt-2">
                    Note: No single equation correlates all these parameters together. Usually, we study solubility in situations where only one of these parameters is dominating.
                </p>
            </div>
        ),
        icon: "🌡️"
    },
    {
        question: "Is Ksp the same as Solubility?",
        answer: "No! Solubility ('s') is the actual amount that dissolves. Ksp is a constant value (the limit product). Think of Ksp as the 'Rule Book' number that tells you the limit, and Solubility as 'how many people' actually fit inside based on that rule.",
        icon: "≠"
    },
    {
        question: "Does stirring change Ksp?",
        answer: "No. Stirring only helps you reach the limit faster (speeds up dissolving), but it cannot change the limit itself. Only Temperature changes the Ksp value.",
        icon: "🥄"
    },
    {
        question: "What are Hygroscopic and Deliquescent substances?",
        answer: (
            <div className="space-y-3">
                <p>Both absorb moisture from the air, but there's a difference:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Hygroscopic:</strong> Absorbs water but <em>doesn't dissolve</em> in it (e.g., Quick lime, Silica gel). It just gets wet.</li>
                    <li><strong>Deliquescent:</strong> Absorbs so much water that it completely <em>dissolves</em> and turns into a liquid solution (e.g., NaOH, CaCl₂).</li>
                </ul>
            </div>
        ),
        icon: "💦"
    }
];

export default function SolubilityFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto mt-16 mb-12">
            <h3 className="text-2xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
                <span className="text-3xl">🤔</span> Common Doubts (FAQs)
            </h3>

            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-200 hover:bg-gray-800/50"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full text-left p-5 flex items-center justify-between gap-4"
                        >
                            <span className="flex items-center gap-3 text-lg font-medium text-gray-200">
                                <span className="text-2xl">{item.icon}</span>
                                {item.question}
                            </span>
                            <span className={`text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="p-5 pt-0 text-gray-300 text-base leading-relaxed border-t border-gray-700/30">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
