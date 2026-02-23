'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Mail, Users, Video, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const isCrucibleAdmin = pathname?.startsWith('/the-crucible/admin');
    const currentYear = new Date().getFullYear();

    if (isCrucibleAdmin) return null;

    return (
        <footer className="bg-[#050505] border-t border-white/8 relative overflow-hidden">

            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                    {/* Brand Section - 5 Columns */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-block mb-6 group">
                            <div className="relative h-8 w-auto aspect-[3.6]">
                                <Image
                                    src="/logo.webp"
                                    alt="Canvas Classes"
                                    width={140}
                                    height={40}
                                    className="object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Empowering students with free, high-quality chemistry education. From concept building to exam success.
                        </p>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-2.5 mb-8">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 text-zinc-300 text-[11px] font-medium border border-white/8">
                                <Users size={12} className="text-teal-400" /> 1M+ Students
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 text-zinc-300 text-[11px] font-medium border border-white/8">
                                <Video size={12} className="text-purple-400" /> 2000+ Videos
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 text-zinc-300 text-[11px] font-medium border border-white/8">
                                <Award size={12} className="text-rose-400" /> 15+ Years
                            </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.youtube.com/@canvasclasses"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/3 text-zinc-400 hover:text-white hover:bg-white/8 hover:border-white/12 border border-white/5 transition-all"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href="mailto:paaras.thakur07@gmail.com"
                                className="p-2.5 rounded-xl bg-white/3 text-zinc-400 hover:text-white hover:bg-white/8 hover:border-white/12 border border-white/5 transition-all"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Courses - Horizontal Links */}
                    <div className="md:col-span-2 md:mt-2">
                        <h4 className="text-white font-medium mb-6 text-sm">Courses</h4>
                        <ul className="space-y-3.5">
                            <li><Link href="/detailed-lectures" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">JEE/NEET Prep</Link></li>
                            <li><Link href="/ncert-solutions" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">NCERT Solutions</Link></li>
                            <li><Link href="/cbse-12-ncert-revision" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">CBSE Revision</Link></li>
                        </ul>
                    </div>

                    {/* Interactive Tools - Horizontal Links */}
                    <div className="md:col-span-3 md:mt-2">
                        <h4 className="text-white font-medium mb-6 text-sm">Interactive Tools</h4>
                        <ul className="space-y-3.5">
                            <li><Link href="/interactive-periodic-table" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Periodic Table</Link></li>
                            <li><Link href="/salt-analysis" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Salt Analysis</Link></li>
                            <li><Link href="/chemistry-flashcards" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Flashcards</Link></li>
                            <li><Link href="/assertion-reason" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Circuit Breaker</Link></li>
                            <li><Link href="/solubility-product-ksp-calculator" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Ksp Calculator</Link></li>
                        </ul>
                    </div>

                    {/* Resources & More - Horizontal Links */}
                    <div className="md:col-span-2 md:mt-2">
                        <h4 className="text-white font-medium mb-6 text-sm">Resources</h4>
                        <ul className="space-y-3.5">
                            <li><Link href="/handwritten-notes" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Notes</Link></li>
                            <li><Link href="/one-shot-lectures" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">One Shots</Link></li>
                            <li><Link href="/top-50-concepts" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Top 50 Concepts</Link></li>
                            <li><Link href="/chemistry-questions" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Question Bank</Link></li>
                            <li><Link href="/blog" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Blog</Link></li>
                            <li><Link href="/about" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
                    <p>© {currentYear} Canvas Classes by Paaras Sir. All rights reserved.</p>
                    <p>Made with <span className="text-red-500/80">❤️</span> for Students</p>
                </div>
            </div>
        </footer>
    );
}
