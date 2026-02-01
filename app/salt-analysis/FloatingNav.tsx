'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Flame, Beaker, FlaskConical, Network, HelpCircle, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
    { id: 'revision-guide', label: 'Quick Recap', icon: BookOpen, color: 'text-cyan-400' },
    { id: 'dry-heating', label: 'Dry Tests', icon: Flame, color: 'text-yellow-400' },
    { id: 'flame-test', label: 'Flame Test', icon: Flame, color: 'text-orange-400' },
    { id: 'anion-simulator', label: 'Anion Sim', icon: Beaker, color: 'text-cyan-400' },
    { id: 'cation-simulator', label: 'Cation Sim', icon: FlaskConical, color: 'text-purple-400' },
    { id: 'cation-flowchart', label: 'Flowchart', icon: Network, color: 'text-purple-400' },
    { id: 'quiz-section', label: 'Practice', icon: HelpCircle, color: 'text-yellow-400' },
];

export default function FloatingNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        NAV_ITEMS.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsOpen(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Floating Menu Button - Fixed on left side */}
            <div className="fixed left-3 top-[65%] -translate-y-1/2 z-50 md:hidden">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border transition-all ${isOpen
                        ? 'bg-cyan-500 border-cyan-400 text-white'
                        : 'bg-gray-900/80 border-gray-700 text-gray-300'
                        }`}
                    whileTap={{ scale: 0.95 }}
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.button>

                {/* Navigation Menu - Expands from button */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="absolute left-0 top-12 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl p-2 min-w-[140px]"
                        >
                            {NAV_ITEMS.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;

                                return (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${isActive
                                            ? 'bg-cyan-500/20 text-cyan-300'
                                            : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={14} className={isActive ? 'text-cyan-400' : item.color} />
                                        <span className="text-xs font-medium">{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll to Top Button - Fixed on right side */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed right-4 bottom-20 md:bottom-8 z-50 w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-md border border-gray-700 text-gray-300 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Backdrop when menu is open */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
