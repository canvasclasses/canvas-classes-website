'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

const TelegramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

export default function Footer() {
    const pathname = usePathname();
    const isCrucibleAdmin = pathname?.startsWith('/the-crucible/admin') || pathname?.startsWith('/crucible/admin');
    const isOrganicMaster = pathname === '/organic-chemistry-hub';
    const isCrucibleLanding = pathname === '/the-crucible';
    const currentYear = new Date().getFullYear();

    if (isCrucibleAdmin || isOrganicMaster || isCrucibleLanding) return null;

    return (
        <footer className="bg-[#050505] border-t border-white/8 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Brand — 5 cols */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-block mb-5 group">
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
                        <p className="text-zinc-400 text-sm leading-relaxed mb-7 max-w-sm">
                            Free, high-quality chemistry education for JEE &amp; NEET — from concept building to exam success.
                        </p>

                        {/* Social Buttons */}
                        <div className="flex items-center gap-2.5">
                            <a
                                href="https://www.youtube.com/@CanvasClassesOfficial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 sm:p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} className="sm:hidden" />
                                <Youtube size={20} className="hidden sm:block" />
                            </a>
                            <a
                                href="https://t.me/mycanvasclasses"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 sm:p-3 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 border border-sky-500/20 hover:border-sky-500/40 transition-all"
                                aria-label="Telegram"
                            >
                                <TelegramIcon className="sm:hidden w-[18px] h-[18px]" />
                                <TelegramIcon className="hidden sm:block w-[20px] h-[20px]" />
                            </a>
                            <a
                                href="mailto:support@canvasclasses.in"
                                className="p-2.5 sm:p-3 rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                                aria-label="Email"
                            >
                                <Mail size={18} className="sm:hidden" />
                                <Mail size={20} className="hidden sm:block" />
                            </a>
                        </div>
                        <p className="mt-3 text-[11px] text-zinc-600">
                            Join our Telegram for updates &amp; doubt clearing
                        </p>
                    </div>

                    {/* Explore — 3 cols */}
                    <div className="md:col-span-3 md:mt-2">
                        <h4 className="text-white font-medium mb-4 sm:mb-6 text-sm">Explore</h4>
                        <ul className="space-y-2.5 sm:space-y-3.5">
                            <li><Link href="/detailed-lectures" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">JEE / NEET Prep</Link></li>
                            <li><Link href="/ncert-solutions" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">NCERT Solutions</Link></li>
                            <li><Link href="/handwritten-notes" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Notes</Link></li>
                            <li><Link href="/one-shot-lectures" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">One Shots</Link></li>
                            <li><Link href="/chemistry-questions" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Question Bank</Link></li>
                            <li><Link href="/blog" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Blog</Link></li>
                            <li><Link href="/about" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Interactive Tools — 4 cols */}
                    <div className="md:col-span-4 md:mt-2">
                        <h4 className="text-white font-medium mb-4 sm:mb-6 text-sm">Interactive Tools</h4>
                        <ul className="space-y-2.5 sm:space-y-3.5">
                            <li><Link href="/interactive-periodic-table" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Periodic Table</Link></li>
                            <li><Link href="/salt-analysis" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Salt Analysis</Link></li>
                            <li><Link href="/chemistry-flashcards" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Flashcards</Link></li>
                            <li><Link href="/assertion-reason" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Circuit Breaker</Link></li>
                            <li><Link href="/solubility-product-ksp-calculator" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Ksp Calculator</Link></li>
                            <li><Link href="/the-crucible" className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">The Crucible</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
                    <p>© {currentYear} Canvas Classes by Paaras Sir. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms &amp; Conditions</Link>
                    </div>
                    <p>Made with <span className="text-red-500/80">❤️</span> for Students</p>
                </div>
            </div>
        </footer>
    );
}
