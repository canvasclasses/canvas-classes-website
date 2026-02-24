'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const jeeNeetLinks = [
  { label: 'The Crucible', href: '/the-crucible', external: false },
  { label: 'Detailed Lectures', href: '/detailed-lectures', external: false },
  { label: 'One Shot Lectures', href: '/one-shot-lectures', external: false },
  { label: 'Top 50 Concepts', href: '/top-50-concepts', external: false },
  { label: '2 Minute Chemistry', href: '/2-minute-chemistry', external: false },
  { label: 'NEET Crash Course', href: '/neet-crash-course', external: false },
];

const ncertBoardsLinks = [
  { label: 'NCERT Solutions', href: '/ncert-solutions', external: false },
  { label: 'CBSE 12 NCERT Revision', href: '/cbse-12-ncert-revision', external: false },
  { label: 'Download NCERT Books', href: '/download-ncert-books', external: false },
  { label: 'Organic Name Reactions', href: '/organic-name-reactions', external: false },
];

const revisionToolsLinks = [
  { label: 'Flashcards', href: '/chemistry-flashcards', external: false },
  { label: 'Assertion & Reason', href: '/assertion-reason', external: false },
  { label: 'Interactive P Table', href: '/interactive-periodic-table', external: false },
  { label: 'Periodic Trends', href: '/periodic-trends', external: false },
  { label: 'Salt Analysis', href: '/salt-analysis', external: false },
  { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator', external: false },
];

export default function Navbar({ authButton }: { authButton: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 20) setIsVisible(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else if (currentScrollY < lastScrollY) setIsVisible(true);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/the-crucible')) return null;

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
        }`}
    >
      <div className="relative px-6 py-3 rounded-full bg-[#050505]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/50 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center group">
          <Image
            src="/canvas logo white.svg"
            alt="Canvas Classes"
            width={105}
            height={30}
            className="object-contain opacity-90 group-hover:opacity-100 transition-opacity h-[21px] md:h-6 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* JEE/NEET Dropdown */}
          <NavDropdown
            label="JEE/NEET"
            links={jeeNeetLinks}
            active={activeDropdown === 'jee'}
            onMouseEnter={() => setActiveDropdown('jee')}
            onMouseLeave={() => setActiveDropdown(null)}
          />

          {/* NCERT Dropdown */}
          <NavDropdown
            label="NCERT & Boards"
            links={ncertBoardsLinks}
            active={activeDropdown === 'ncert'}
            onMouseEnter={() => setActiveDropdown('ncert')}
            onMouseLeave={() => setActiveDropdown(null)}
          />

          {/* Revision Dropdown */}
          <NavDropdown
            label="Revision Tools"
            links={revisionToolsLinks}
            active={activeDropdown === 'revision'}
            onMouseEnter={() => setActiveDropdown('revision')}
            onMouseLeave={() => setActiveDropdown(null)}
          />

          <NavLink href="/handwritten-notes" label="My Notes" />
          <NavLink href="/blog" label="Blog" className="!text-purple-400 hover:!text-purple-300" />
        </div>

        {/* Right Side: Auth & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block scale-90 origin-right opacity-90 hover:opacity-100 transition-opacity">
            {authButton}
          </div>

          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-xl overflow-hidden flex flex-col gap-2"
            >
              <MobileDropdown label="JEE/NEET" links={jeeNeetLinks} onLinkClick={() => setMobileMenuOpen(false)} />
              <MobileDropdown label="NCERT & Boards" links={ncertBoardsLinks} onLinkClick={() => setMobileMenuOpen(false)} />
              <MobileDropdown label="Revision Tools" links={revisionToolsLinks} onLinkClick={() => setMobileMenuOpen(false)} />
              <Link href="/handwritten-notes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                My Notes
              </Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors">
                Blog
              </Link>
              <div className="pt-2 border-t border-white/[0.08]">
                {authButton}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function NavDropdown({ label, links, active, onMouseEnter, onMouseLeave }: { label: string, links: any[], active: boolean, onMouseEnter: () => void, onMouseLeave: () => void }) {
  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all ${active ? 'text-white bg-white/[0.08]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}>
        {label}
        <ChevronDown size={14} className={`transition-transform duration-300 ${active ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-56 p-1.5 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden z-50"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="block px-3 py-2.5 text-sm rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ href, label, className = "" }: { href: string, label: string, className?: string }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-full transition-all ${className}`}
    >
      {label}
    </Link>
  );
}

function MobileDropdown({ label, links, onLinkClick }: { label: string, links: any[], onLinkClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-zinc-300"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  onClick={onLinkClick}
                  className="block px-3 py-2 text-sm rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 
// ==========================================
// OLD NAVBAR (Reference)
// ==========================================
/*
export default function Navbar({ authButton }: { authButton: React.ReactNode }) {
  const [jeeDropdownOpen, setJeeDropdownOpen] = useState(false);
  const [ncertDropdownOpen, setNcertDropdownOpen] = useState(false);
  const [revisionDropdownOpen, setRevisionDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();


  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at top (with small buffer)
      if (currentScrollY < 20) {
        setIsVisible(true);
      }
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/the-crucible')) return null;

  return (
    <nav className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[98%] max-w-[1400px] flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0 pointer-events-none'
      }`}>
      <Link href="/" className="flex items-center pl-2">
        <Image
          src="/logo.webp"
          alt="Canvas Classes"
          width={180}
          height={50}
          className="h-10 md:h-12 w-auto"
          priority
        />
      </Link>

      {/* Desktop Navigation *}
      <div className="hidden md:flex items-center gap-2 text-base font-bold text-gray-700">
        {/* JEE/NEET Dropdown *}
        <div
          className="relative group"
          onMouseEnter={() => setJeeDropdownOpen(true)}
          onMouseLeave={() => setJeeDropdownOpen(false)}
        >
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all text-gray-700">
            JEE/NEET <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${jeeDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
          </button>

          <div className={`absolute top-full left-0 pt-4 w-64 z-50 transition-all duration-300 ${jeeDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 overflow-hidden ring-1 ring-black/5">
              {jeeNeetLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* NCERT & Boards Dropdown *}
        <div
          className="relative group"
          onMouseEnter={() => setNcertDropdownOpen(true)}
          onMouseLeave={() => setNcertDropdownOpen(false)}
        >
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all text-gray-700">
            NCERT & Boards <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${ncertDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
          </button>

          <div className={`absolute top-full left-0 pt-4 w-64 z-50 transition-all duration-300 ${ncertDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 overflow-hidden ring-1 ring-black/5">
              {ncertBoardsLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Revision Tools Dropdown *}
        <div
          className="relative group"
          onMouseEnter={() => setRevisionDropdownOpen(true)}
          onMouseLeave={() => setRevisionDropdownOpen(false)}
        >
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all text-gray-700">
            Revision Tools <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${revisionDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
          </button>

          <div className={`absolute top-full left-0 pt-4 w-64 z-50 transition-all duration-300 ${revisionDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 overflow-hidden ring-1 ring-black/5">
              {revisionToolsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link href="/handwritten-notes" className="px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all">My Notes</Link>
        <Link href="/blog" className="px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all font-semibold text-purple-600 bg-purple-50/50">Blog</Link>
        <button
          onClick={() => window.dispatchEvent(new Event('openCommandPalette'))}
          className="ml-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-teal-600 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <div className="ml-2">
          {authButton}
        </div>
      </div>

      {/* Mobile Menu Button *}
      <div className="md:hidden pr-2">
        <button
          className="p-2 text-gray-700 bg-gray-100/50 rounded-full hover:bg-gray-200/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu *}
      <div className={`absolute top-full left-0 right-0 mt-4 mx-2 p-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 md:hidden transition-all duration-300 origin-top transform ${mobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        <div className="space-y-1">
          {/* JEE/NEET Mobile Section *}
          <div className="rounded-2xl overflow-hidden bg-gray-50/50">
            <button
              onClick={() => setJeeDropdownOpen(!jeeDropdownOpen)}
              className="flex items-center justify-between w-full px-5 py-4 font-bold text-gray-800"
            >
              JEE/NEET <ChevronDown className={`w-4 h-4 transition-transform ${jeeDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${jeeDropdownOpen ? 'max-h-96 pb-2' : 'max-h-0'}`}>
              <div className="px-3 space-y-1 mb-3">
                {jeeNeetLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* NCERT & Boards Mobile Section *}
          <div className="rounded-2xl overflow-hidden bg-gray-50/50 mt-2">
            <button
              onClick={() => setNcertDropdownOpen(!ncertDropdownOpen)}
              className="flex items-center justify-between w-full px-5 py-4 font-bold text-gray-800"
            >
              NCERT & Boards <ChevronDown className={`w-4 h-4 transition-transform ${ncertDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${ncertDropdownOpen ? 'max-h-96 pb-2' : 'max-h-0'}`}>
              <div className="px-3 space-y-1 mb-3">
                {ncertBoardsLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {/* Revision Tools Mobile Section *}
            <div className="rounded-2xl overflow-hidden bg-gray-50/50 mt-2">
              <button
                onClick={() => setRevisionDropdownOpen(!revisionDropdownOpen)}
                className="flex items-center justify-between w-full px-5 py-4 font-bold text-gray-800"
              >
                Revision Tools <ChevronDown className={`w-4 h-4 transition-transform ${revisionDropdownOpen ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} />
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${revisionDropdownOpen ? 'max-h-96 pb-2' : 'max-h-0'}`}>
                <div className="px-3 space-y-1 mb-3">
                  {revisionToolsLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/handwritten-notes"
              className="block px-5 py-3 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Notes
            </Link>
            <Link
              href="/blog"
              className="block px-5 py-3 font-bold text-purple-600 bg-purple-50/50 hover:bg-purple-100/50 rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="px-5 py-3">
              {authButton}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
*/