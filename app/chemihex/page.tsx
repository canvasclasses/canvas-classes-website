'use client';

import React, { useState } from 'react';
import { useChemiHexLogic } from '../../hooks/useChemiHexLogic';
import { MoleculeNode } from '../../components/chemihex/MoleculeNode';
import { ReagentDeck } from '../../components/chemihex/ReagentDeck';
import { ReactionTable } from '../../components/chemihex/ReactionTable';
import { FlaskConical, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- HEX GRID UTILS ---
const HEX_SIZE = 120;
// Pointy-topped hex layout
// x = size * sqrt(3) * (q + r/2)
// y = size * 3/2 * r
function hexToPixel(q: number, r: number) {
    const x = HEX_SIZE * Math.sqrt(3) * (q + r / 2);
    const y = HEX_SIZE * (3 / 2) * r;
    return { x, y };
}

export default function ChemiHexGame() {
    const { gameState, feedback, handleDrop, reagents } = useChemiHexLogic();
    const [draggedReagentId, setDraggedReagentId] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(true);

    // Center the grid visually in the top arena
    const CENTER_OFFSET_X = 600;
    const CENTER_OFFSET_Y = 200;

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 overflow-x-hidden font-sans flex flex-col pt-16">

            {/* 1. TOP ARENA (60vh) */}
            <div className="h-[60vh] relative bg-slate-900/50 overflow-hidden shadow-inner shrink-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                {/* Header Overlay */}
                <div className="absolute top-4 left-6 z-10">
                    <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                        <span className="text-teal-500">Chemi</span>Hex
                    </h1>
                    <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">The Organic Roadmap</p>
                </div>

                {/* Tutorial Toggle */}
                <button
                    onClick={() => setShowTutorial(true)}
                    className="absolute top-4 right-6 z-10 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className={`
                        absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none
                        flex items-center gap-3 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-md
                        ${feedback.success
                                    ? 'bg-green-900/60 border-green-500 text-green-100'
                                    : 'bg-red-900/60 border-red-500 text-red-100'}
                    `}
                        >
                            {feedback.success ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="font-bold">{feedback.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Game Board */}
                <div className="w-full h-full cursor-grab active:cursor-grabbing relative">
                    {/* Connection Lines Layer (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                            </marker>
                        </defs>
                        {gameState.edges.map(edge => {
                            const sourceNode = gameState.nodes.find(n => n.id === edge.source);
                            const targetNode = gameState.nodes.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode || !sourceNode.q) return null; // Simple check

                            const start = hexToPixel(sourceNode.q, sourceNode.r);
                            const end = hexToPixel(targetNode.q, targetNode.r);
                            // Adjust for offset and centering
                            const sX = start.x + CENTER_OFFSET_X + 64; // +64 for center of node (128px width)
                            const sY = start.y + CENTER_OFFSET_Y + 64;
                            const eX = end.x + CENTER_OFFSET_X + 64;
                            const eY = end.y + CENTER_OFFSET_Y + 64;

                            return (
                                <path
                                    key={edge.id}
                                    d={`M ${sX} ${sY} C ${(sX + eX) / 2} ${sY}, ${(sX + eX) / 2} ${eY}, ${eX} ${eY}`}
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                    fill="none"
                                    markerEnd="url(#arrowhead)"
                                    strokeDasharray="5,5"
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {gameState.nodes.map((node) => {
                        const { x, y } = hexToPixel(node.q, node.r);
                        const isTarget = feedback && !feedback.success && feedback.message.includes(node.type);

                        return (
                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                key={node.id}
                                className="absolute"
                                style={{
                                    left: x + CENTER_OFFSET_X,
                                    top: y + CENTER_OFFSET_Y,
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.transform = 'scale(1)';
                                    const reagentId = e.dataTransfer.getData('reagentId');
                                    if (reagentId) {
                                        handleDrop(node.id, reagentId);
                                    }
                                }}
                            >
                                <MoleculeNode
                                    data={node}
                                    feedbackStatus={isTarget ? 'error' : null}
                                />

                                {/* Drag Hint for valid targets */}
                                {draggedReagentId && (
                                    <div className="absolute -inset-4 border-2 border-teal-500/50 rounded-3xl animate-pulse pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Tutorial Modal */}
                <AnimatePresence>
                    {showTutorial && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-lg shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold text-white mb-4">Welcome to the Lab! 🧪</h2>
                                <ul className="space-y-4 text-slate-300 mb-8">
                                    <li className="flex gap-3">
                                        <span className="bg-teal-500/20 text-teal-400 font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">1</span>
                                        <span><strong>Your Goal:</strong> Synthesize the target molecule (Top Right).</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="bg-teal-500/20 text-teal-400 font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">2</span>
                                        <span><strong>Explore:</strong> Browse Reagent Cards in the deck below. Click them for details.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="bg-teal-500/20 text-teal-400 font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">3</span>
                                        <span><strong>React:</strong> Drag a card from the deck onto a molecule in the arena.</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => setShowTutorial(false)}
                                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition"
                                >
                                    Start Experiment
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. BOTTOM DECK (40vh) */}
            <div className="h-[40vh] bg-slate-950 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 shrink-0 relative flex flex-col">
                <ReagentDeck
                    reagents={reagents}
                    onDragStart={setDraggedReagentId}
                />

                {/* Scroll to Matrix Hint */}
                <div className="absolute bottom-4 right-6 animate-bounce pointer-events-none z-30">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur">
                        Scroll Down for Matrix ↓
                    </span>
                </div>
            </div>

            {/* 3. REACTION MATRIX SECTION */}
            <ReactionTable />

            {/* 4. CALL TO ACTION - ORGANIC WIZARD */}
            <div className="border-t border-slate-800 bg-slate-900 py-12 px-6">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                        <FlaskConical size={14} />
                        Next Challenge
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3">
                        Master Reaction Mechanisms
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl text-lg">
                        Dive deeper into organic synthesis. Solve step-by-step conversion puzzles in the Organic Wizard game.
                    </p>

                    <a
                        href="/organic-wizard"
                        className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FlaskConical className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span>Play Organic Wizard</span>
                    </a>
                </div>
            </div>

        </div>
    );
}
