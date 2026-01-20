'use client';

import { motion } from 'framer-motion';

export default function AtomicProcessVisualizer() {
    return (
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {/* Stage 1: Absorption */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 flex flex-col items-center">
                <h4 className="text-orange-400 font-bold mb-6 text-lg tracking-wide">1. Energy Absorption</h4>
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* SVG Container */}
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Orbits */}
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                        {/* Nucleus */}
                        <circle cx="100" cy="100" r="8" fill="url(#nucleus-gradient)" />

                        {/* Defs */}
                        <defs>
                            <radialGradient id="nucleus-gradient">
                                <stop offset="0%" stopColor="#E5E7EB" />
                                <stop offset="100%" stopColor="#9CA3AF" />
                            </radialGradient>
                            <marker id="arrow-head-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#F97316" />
                            </marker>
                            <marker id="arrow-head-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#F97316" />
                            </marker>
                        </defs>

                        {/* Incoming Heat Photon (Wavy Line) */}
                        <motion.path
                            d="M 10,60 Q 20,40 30,60 T 50,60 T 70,60"
                            fill="none"
                            stroke="#F97316"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                            markerEnd="url(#arrow-head-orange)"
                        />

                        {/* Electron Start (Inner) */}
                        <circle cx="100" cy="60" r="5" fill="#EF4444">
                            <animate
                                attributeName="opacity"
                                values="1;0"
                                dur="3s"
                                begin="1.5s"
                                repeatCount="indefinite"
                            />
                        </circle>

                        {/* Excitation Arrow (Up) */}
                        <motion.line
                            x1="100" y1="55"
                            x2="100" y2="25"
                            stroke="#F97316"
                            strokeWidth="2"
                            markerEnd="url(#arrow-head-orange)"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 2.5 }}
                        />

                        {/* Electron End (Outer) - Appears after jump */}
                        <circle cx="100" cy="20" r="5" fill="#EF4444" opacity="0">
                            <animate
                                attributeName="opacity"
                                values="0;1;0"
                                dur="3s"
                                begin="1.5s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                </div>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Heat excites electron to outer shell
                </p>
            </div>

            {/* Stage 2: Emission */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 flex flex-col items-center">
                <h4 className="text-cyan-400 font-bold mb-6 text-lg tracking-wide">2. Light Emission</h4>
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Orbits */}
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                        {/* Nucleus */}
                        <circle cx="100" cy="100" r="8" fill="url(#nucleus-gradient)" />

                        <defs>
                            <marker id="arrow-head-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#22D3EE" />
                            </marker>
                        </defs>

                        {/* Electron Start (Outer) */}
                        <circle cx="100" cy="20" r="5" fill="#22D3EE">
                            <animate
                                attributeName="opacity"
                                values="1;0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </circle>

                        {/* De-excitation Arrow (Down) */}
                        <motion.line
                            x1="100" y1="25"
                            x2="100" y2="55"
                            stroke="#22D3EE"
                            strokeWidth="2"
                            markerEnd="url(#arrow-head-cyan)"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
                        />

                        {/* Outgoing Photon (Wavy Line) */}
                        <motion.path
                            d="M 120,60 Q 140,40 160,60 T 180,60 T 200,60"
                            fill="none"
                            stroke="#22D3EE"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                            markerEnd="url(#arrow-head-cyan)"
                        />

                        {/* Electron End (Inner) */}
                        <circle cx="100" cy="60" r="5" fill="#22D3EE" opacity="0">
                            <animate
                                attributeName="opacity"
                                values="0;1;0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                </div>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Electron falls & emits colored light
                </p>
            </div>
        </div>
    );
}
