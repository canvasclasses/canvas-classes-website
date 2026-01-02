'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Globe } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'Premium Quality, Zero Cost',
        description: 'All content is professionally created with the same quality as paid courses, but accessible to everyone for free.',
        bgColor: 'bg-gradient-to-br from-teal-400 to-teal-600',
    },
    {
        icon: Users,
        title: 'Trusted by Educators',
        description: 'Hundreds of teachers use our content in their classrooms, helping thousands more students learn chemistry effectively.',
        bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
        icon: Globe,
        title: 'Lifetime Access',
        description: 'Access all resources anytime, anywhere. Our content remains freely available with regular updates and new additions.',
        bgColor: 'bg-gradient-to-br from-teal-400 to-emerald-500',
    },
];

export default function WhyChooseUsSection() {
    return (
        <section className="relative py-20 bg-[#fdfefe]">
            <div className="container mx-auto px-6 sm:px-12 lg:px-20">
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonial Quote Block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-10 md:p-14 text-center overflow-hidden"
                >
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                        ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="relative z-10 text-white text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed max-w-4xl mx-auto mb-8">
                        "My mission is simple: make chemistry education accessible to every student, regardless of their financial background. Education is a right, not a privilege."
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center">
                                <span className="text-white font-bold text-sm leading-tight text-center">
                                    Paaras<br />Sir
                                </span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold text-lg">Paaras Thakur</p>
                            <p className="text-white/80 text-sm">Founder, Canvas Classes</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
