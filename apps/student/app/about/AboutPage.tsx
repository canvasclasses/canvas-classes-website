'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Heart,
    GraduationCap,
    Award,
    Calendar,
    Play,
    Trophy,
    Users,
    Globe,
    Anchor,
    Lightbulb,
    ArrowRight,
    Quote,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FAQSection from '../components/FAQSection';


// Stats data
const stats = [
    { icon: Trophy, value: '15+', label: 'Years Experience' },
    { icon: Users, value: '1M+', label: 'Students Impacted' },
    { icon: Globe, value: 'MHRD', label: 'Recognized' },
];

// Journey cards data
const journeyCards = [
    {
        icon: GraduationCap,
        title: 'B.Tech Mechanical Engineering',
        subtitle: 'NIT Hamirpur (2010)',
        description: 'Strong technical foundation from one of India\'s premier engineering institutes',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        icon: Anchor,
        title: 'PGD Marine Engineering',
        subtitle: 'AEMA, Karjat',
        description: 'Specialized marine engineering qualification adding to technical expertise',
        color: 'from-cyan-500 to-teal-600',
    },
    {
        icon: Calendar,
        title: '15+ Years Teaching Experience',
        subtitle: 'Since College Days',
        description: 'Started teaching chemistry from 1st year of college, now 15+ years of expertise',
        color: 'from-amber-500 to-orange-600',
    },
    {
        icon: Play,
        title: 'Canvas Classes Pioneer',
        subtitle: 'Launched 2014',
        description: 'Early adopter of educational technology, experimenting since 2013',
        color: 'from-purple-500 to-fuchsia-600',
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <Navbar authButton={null} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Tag */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20">
                                <Heart className="w-4 h-4 text-pink-400" />
                                <span className="text-pink-400 font-semibold text-sm">Engineer, Educator, Innovator</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-8">
                            <span className="text-white">Meet </span>
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Paaras Thakur
                            </span>
                        </h1>

                        {/* Bio */}
                        <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                            <p>
                                Paaras Thakur is an{' '}
                                <span className="text-emerald-400 font-semibold">EdTech enthusiast</span> and a passionate{' '}
                                <span className="text-purple-400 font-semibold">teaching geek</span> who chose the path of inspiring minds over conventional engineering. With a solid foundation as a Mechanical Engineer, he has dedicated the last 15+ years to empowering students across India to conquer the challenging JEE and NEET examinations.
                            </p>

                            <p>
                                His journey is driven by a deep conviction to revolutionize education. This philosophy is perfectly captured in the very name of our platform,{' '}
                                <span className="text-blue-400 font-bold">CANVAS</span> –{' '}
                                <span className="text-blue-400 font-semibold">Creating Awareness and Nurturing the Vision of Acquisitive Students</span>. He believes in fostering awareness about effective competitive exam preparation and, crucially, in helping every student truly identify and hone their unique potential.
                            </p>

                            <p>
                                At Canvas Classes, the focus goes beyond traditional classroom walls. His goal is to provide e-learning content that offers more than just textbook concepts – it delivers practical knowledge, ensuring you understand the real-world importance of what you learn.
                            </p>
                        </div>

                        {/* Quote */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 pl-6 border-l-4 border-blue-500"
                        >
                            <p className="text-white text-xl font-semibold italic">
                                "Join him in developing the invaluable art of learning, transforming complex concepts into clear understanding, and ultimately, building a strong foundation for your future success."
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4 mt-12"
                        >
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                                    >
                                        <Icon className="w-5 h-5 text-amber-400" />
                                        <span className="text-white font-bold">{stat.value}</span>
                                        <span className="text-slate-400">{stat.label}</span>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Educational Journey Section */}
            <section className="py-16 md:py-24 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                            Educational Journey & Achievements
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            From NIT graduate to EdTech pioneer – a journey of passion, innovation, and impact
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {journeyCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-xl">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">
                                            {card.title}
                                        </h3>
                                        <p className="text-blue-400 font-medium text-sm mb-3">
                                            {card.subtitle}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {card.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Personal Message Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/5">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                                A Personal Message
                            </h2>

                            <div className="space-y-6 text-slate-300 leading-relaxed">
                                <p>
                                    <span className="text-pink-400 font-semibold">"Teaching is an art"</span> – this belief has guided his entire journey. From conducting awareness seminars in schools around Hamirpur during his college days to impacting millions of students through digital platforms, every step has been driven by passion.
                                </p>

                                <p>
                                    He chose teaching over the core engineering sector because he found his calling in{' '}
                                    <span className="text-blue-400 font-semibold underline decoration-blue-400/50">interacting with the beautiful minds of our country</span>. Each student teaches him something new, making this journey incredibly rewarding.
                                </p>

                                <p>
                                    As someone who calls himself a{' '}
                                    <span className="text-purple-400 font-semibold">"teaching geek who knows how to tech"</span>, he has been experimenting with educational technology since 2013. The recognition from MHRD and the trust of millions of students validates this approach.
                                </p>
                            </div>

                            {/* Final Quote */}
                            <div className="mt-10 pt-8 border-t border-white/10">
                                <div className="flex justify-center mb-4">
                                    <Quote className="w-8 h-8 text-purple-400" />
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-white text-center italic">
                                    "He is grateful to his mentors and students for making him a better person, and he hopes there is more to do."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-4">
                            <Lightbulb className="w-10 h-10 text-amber-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                            Explore free resources and start learning chemistry the Canvas way!
                        </p>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow text-lg"
                            >
                                Explore Resources
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Who is Paaras Sir?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Paaras Thakur (Paaras Sir) is a renowned Chemistry educator with over 15 years of experience. A mechanical engineering graduate from NIT Hamirpur, he has mentored lakhs of students for JEE & NEET."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Does Canvas Classes offer free content?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! In addition to comprehensive video lectures and notes, we offer interactive tools for visualising inorganic chemistry concepts, Interactive P-Table, Salt Analysis, Flashcards, Assertion-Reason practice and much more. This is the first such platform in India bringing Tech closer to Ed."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is the content suitable for JEE and NEET?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Absolutely. The content is specifically designed to cover the syllabi of JEE Main, JEE Advanced, and NEET, ranging from fundamental concepts to advanced problem-solving."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How can I contact Paaras Sir?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "You can connect with us through our contact page or email us at paaras.thakur07@gmail.com."
                                }
                            }
                        ]
                    })
                }}
            />
        </main>
    );
}
