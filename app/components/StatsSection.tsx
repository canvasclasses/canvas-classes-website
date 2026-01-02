'use client';

import { motion } from 'framer-motion';

const stats = [
    { value: '2K+', label: 'Chemistry Videos', color: 'text-purple-600' },
    { value: '1M+', label: 'Students Helped', color: 'text-purple-600' },
    { value: '15+', label: 'Years Experience', color: 'text-cyan-500' },
    { value: 'FREE', label: 'Content', color: 'text-purple-600' },
];

export default function StatsSection() {
    return (
        <section className="relative py-16 bg-gradient-to-b from-slate-100 to-purple-100/50">
            <div className="container mx-auto px-6 sm:px-12 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <p className={`text-4xl sm:text-5xl font-bold mb-2 ${stat.color}`}>
                                    {stat.value}
                                </p>
                                <p className="text-gray-600 font-medium text-sm sm:text-base">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
