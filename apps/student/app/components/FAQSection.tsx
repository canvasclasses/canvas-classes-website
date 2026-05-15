import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Who is Paaras Sir?",
        answer: "Paaras Thakur (Paaras Sir) is a renowned Chemistry educator with over 15 years of experience. A mechanical engineering graduate from NIT Hamirpur, he has mentored lakhs of students for JEE & NEET. He is known for his unique teaching style that blends deep conceptual understanding with exam-oriented strategies."
    },
    {
        question: "Does Canvas Classes offer free content?",
        answer: "Yes! In addition to comprehensive video lectures and notes, we offer interactive tools for visualising inorganic chemistry concepts, Interactive P-Table, Salt Analysis, Flashcards, Assertion-Reason practice and much more. This is the first such platform in India bringing Tech closer to Ed."
    },
    {
        question: "Is the content suitable for JEE and NEET?",
        answer: "Absolutely. The content is specifically designed to cover the syllabi of JEE Main, JEE Advanced, and NEET. It ranges from fundamental concepts to advanced problem-solving techniques required for these competitive exams."
    },
    {
        question: "Where can I find PDF notes?",
        answer: "You can find chapter-wise handwritten notes and other study materials in the 'Resources' section of our website. These notes are curated by Paaras Sir to help you revise effectively."
    },
    {
        question: "How can I contact Paaras Sir?",
        answer: "You can connect with us through our contact page or email us at paaras.thakur07@gmail.com. Follow us on Instagram and YouTube for regular updates and interactive sessions."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-16 md:py-24 bg-slate-900/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <HelpCircle className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Common queries about Paaras Sir and Canvas Classes
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-800/40 rounded-xl border border-white/5 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-lg font-medium text-white pr-8">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <Minus className="w-5 h-5 text-blue-400 shrink-0" />
                                ) : (
                                    <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                                )}
                            </button>
                            <motion.div
                                initial={false}
                                animate={{ height: openIndex === index ? 'auto' : 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 text-slate-300 leading-relaxed border-t border-white/5">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
