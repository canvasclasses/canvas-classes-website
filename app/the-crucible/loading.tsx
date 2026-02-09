'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-black tracking-tighter"
                    style={{
                        background: 'linear-gradient(to top, #f97316 0%, #fb923c 30%, #fef3c7 60%, #ffffff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 25px rgba(251,146,60,0.4))'
                    }}
                >
                    CRUCIBLE
                </motion.div>

                {/* Loading spinner */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
                    />
                    <span className="text-sm text-gray-500 font-medium">Loading questions...</span>
                </div>

                {/* Loading bar */}
                <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
