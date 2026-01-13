import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Mail, Users, Video, Award } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block bg-white rounded-xl px-4 py-2 mb-4">
                            <Image
                                src="/logo.webp"
                                alt="Canvas Classes"
                                width={140}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Empowering students with free, high-quality chemistry education. From concept building to exam success.
                        </p>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium border border-teal-500/20">
                                <Users size={14} /> 1M+ Students
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                                <Video size={14} /> 2000+ Videos
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                                <Award size={14} /> 15+ Years
                            </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.youtube.com/@canvasclasses"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href="mailto:contact@canvasclasses.in"
                                className="p-2.5 rounded-full bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Courses</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/detailed-lectures" className="text-gray-400 hover:text-white transition-colors">JEE/NEET Prep</Link></li>
                            <li><Link href="/ncert-solutions" className="text-gray-400 hover:text-white transition-colors">NCERT Solutions</Link></li>
                            <li><Link href="/cbse-12-ncert-revision" className="text-gray-400 hover:text-white transition-colors">CBSE Revision</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/handwritten-notes" className="text-gray-400 hover:text-white transition-colors">Handwritten Notes</Link></li>
                            <li><Link href="/quick-recap" className="text-gray-400 hover:text-white transition-colors">Quick Recap</Link></li>
                            <li><Link href="/top-50-concepts" className="text-gray-400 hover:text-white transition-colors">Top 50 Concepts</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {currentYear} Canvas Classes by Paaras Sir. All rights reserved.</p>
                    <p>Made with <span className="text-red-400">❤️</span> for Students</p>
                </div>
            </div>
        </footer>
    );
}
