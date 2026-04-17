'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================================
// TYPES
// =====================================================================

type NavLinkItem = {
  label: string;
  href: string;
  badge?: 'soon' | 'new';
};

type MegaMenuColumn = {
  heading: string;
  links: NavLinkItem[];
};

type FeaturedCard = {
  label: string;
  tagline: string;
  href: string;
  cta: string;
};

type MegaMenuDef = {
  id: string;
  label: string;
  anchor: 'left' | 'center' | 'right';
  featured?: FeaturedCard;   // renders as an orange hero panel (left slot)
  columns: MegaMenuColumn[];
  width?: string;            // override default panel width
};

// =====================================================================
// NAV DATA
// =====================================================================

const class9to10Menu: MegaMenuDef = {
  id: 'class-9-10',
  label: 'Class 9–10',
  anchor: 'left',
  width: 'w-44',
  columns: [
    {
      heading: '',
      links: [
        { label: 'Class 9', href: '/class-9' },
        { label: 'Class 10', href: '/class-10' },
      ],
    },
  ],
};

const class11to12Menu: MegaMenuDef = {
  id: 'class-11-12',
  label: 'Class 11–12',
  anchor: 'left',
  columns: [
    {
      heading: 'Chemistry',
      links: [
        { label: 'Class 11 Chemistry', href: '/class-11/chemistry', badge: 'new' },
        { label: 'Class 12 Chemistry', href: '/class-12/chemistry', badge: 'soon' },
        { label: 'NCERT Solutions', href: '/ncert-solutions' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Handwritten Notes', href: '/handwritten-notes' },
        { label: 'NCERT Book PDFs', href: '/download-ncert-books' },
      ],
    },
  ],
};

// JEE/NEET: The Crucible gets a featured hero panel — first thing seen on hover.
const jeeNeetMenu: MegaMenuDef = {
  id: 'jee-neet',
  label: 'JEE/NEET',
  anchor: 'center',
  featured: {
    label: 'The Crucible',
    tagline: 'Adaptive question practice for JEE & NEET. Track progress, drill chapters, attempt mocks.',
    href: '/the-crucible',
    cta: 'Start Practicing',
  },
  columns: [
    {
      heading: 'Learn',
      links: [
        { label: 'Detailed Lectures', href: '/detailed-lectures' },
        { label: 'One Shot Lectures', href: '/one-shot-lectures' },
        { label: 'NEET Crash Course', href: '/neet-crash-course' },
        { label: 'JEE PYQs', href: '/jee-pyqs' },
      ],
    },
    {
      heading: 'Revise',
      links: [
        { label: 'Top 50 Concepts', href: '/top-50-concepts' },
        { label: '2 Minute Chemistry', href: '/2-minute-chemistry' },
        { label: 'Quick Recap', href: '/quick-recap' },
      ],
    },
  ],
};

// Study Lab: all interactive tools, visualizers, and reference hubs.
const studyLabMenu: MegaMenuDef = {
  id: 'study-lab',
  label: 'Study Lab',
  anchor: 'right',
  columns: [
    {
      heading: 'Explore',
      links: [
        { label: 'Interactive Periodic Table', href: '/interactive-periodic-table' },
        { label: 'Periodic Trends', href: '/periodic-trends' },
        { label: 'Salt Analysis Simulator', href: '/salt-analysis' },
        { label: 'ChemiHex', href: '/chemihex' },
      ],
    },
    {
      heading: 'Practice',
      links: [
        { label: 'Chemistry Flashcards', href: '/chemistry-flashcards' },
        { label: 'Assertion & Reason', href: '/assertion-reason' },
        { label: 'Organic Wizard', href: '/organic-wizard' },
        { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator' },
      ],
    },
    {
      heading: 'Reference',
      links: [
        { label: 'Organic Name Reactions', href: '/organic-name-reactions' },
        { label: 'Organic Hub', href: '/organic-chemistry-hub' },
        { label: 'Physical Chemistry Hub', href: '/physical-chemistry-hub' },
        { label: 'Inorganic Hub', href: '/inorganic-chemistry-hub' },
      ],
    },
  ],
};

const allMenus: MegaMenuDef[] = [
  class9to10Menu,
  class11to12Menu,
  jeeNeetMenu,
  studyLabMenu,
];

// =====================================================================
// NAVBAR
// =====================================================================

export default function Navbar({ authButton }: { authButton: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const cur = window.scrollY;
      if (cur < 20) setIsVisible(true);
      else if (cur > lastScrollY && cur > 100) setIsVisible(false);
      else if (cur < lastScrollY) setIsVisible(true);
      lastScrollY = cur;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/the-crucible')) return null;
  if (pathname?.startsWith('/books')) return null;

  // Hide navbar inside book reader pages (class-X/bookSlug/pageSlug)
  // but NOT on the grade landing pages themselves (class-X/)
  if (/^\/class-\d+\/[^/]+\/[^/]+/.test(pathname ?? '')) return null;

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1280px] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative px-6 py-3 rounded-full bg-[#050505]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/50 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center group shrink-0">
          <Image
            src="/Canvas Logo white.svg"
            alt="Canvas Classes"
            width={105}
            height={30}
            className="object-contain opacity-90 group-hover:opacity-100 transition-opacity h-[21px] md:h-6 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0.5">
          {allMenus.map((menu) => (
            <MegaMenuDropdown
              key={menu.id}
              menu={menu}
              active={activeDropdown === menu.id}
              onMouseEnter={() => setActiveDropdown(menu.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            />
          ))}
          <NavLink
            href="/blog"
            label="Blog"
            className="!text-purple-400 hover:!text-purple-300"
          />
        </div>

        {/* Auth + Mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block scale-90 origin-right opacity-90 hover:opacity-100 transition-opacity">
            {authButton}
          </div>
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-xl flex flex-col gap-2 max-h-[82vh] overflow-y-auto"
            >
              {allMenus.map((menu) => (
                <MobileMegaMenu
                  key={menu.id}
                  menu={menu}
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
              ))}
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors"
              >
                Blog
              </Link>
              <div className="pt-2 border-t border-white/[0.08]">{authButton}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// =====================================================================
// DESKTOP MEGA-MENU
// =====================================================================

function MegaMenuDropdown({
  menu,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  menu: MegaMenuDef;
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const anchorClass = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  }[menu.anchor];

  const numCols = menu.columns.length;
  const totalCols = (menu.featured ? 1 : 0) + numCols;
  const widthClass =
    menu.width ??
    (totalCols >= 3 ? 'w-[680px]' : totalCols === 2 ? 'w-[460px]' : 'w-64');

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
          active
            ? 'text-white bg-white/[0.08]'
            : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
        }`}
      >
        {menu.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${active ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-full mt-3 ${anchorClass} ${widthClass} p-5 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-50`}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
              }}
            >
              {/* Featured card — The Crucible gets the orange hero panel */}
              {menu.featured && (
                <Link
                  href={menu.featured.href}
                  className="group flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 hover:border-orange-500/50 hover:from-orange-500/15 hover:to-amber-500/10 transition-all"
                >
                  <div className="text-sm font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
                    {menu.featured.label}
                  </div>
                  <div className="text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed flex-1 transition-colors">
                    {menu.featured.tagline}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-orange-400/80 group-hover:text-orange-300 transition-colors mt-auto">
                    {menu.featured.cta}
                    <ArrowRight size={11} />
                  </div>
                </Link>
              )}

              {/* Regular columns */}
              {menu.columns.map((col) => (
                <div key={col.heading}>
                  {col.heading && (
                    <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      {col.heading}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    {col.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center justify-between gap-2 px-2 py-2 text-sm rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <span className="truncate">{link.label}</span>
                        {link.badge === 'soon' && (
                          <span className="shrink-0 text-[10px] uppercase tracking-wide text-zinc-500 group-hover:text-zinc-400">
                            Soon
                          </span>
                        )}
                        {link.badge === 'new' && (
                          <span className="shrink-0 text-[10px] uppercase tracking-wide text-emerald-400/80">
                            New
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// PLAIN NAV LINK (Blog)
// =====================================================================

function NavLink({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-full transition-all ${className}`}
    >
      {label}
    </Link>
  );
}

// =====================================================================
// MOBILE MEGA-MENU
// =====================================================================

function MobileMegaMenu({
  menu,
  onLinkClick,
}: {
  menu: MegaMenuDef;
  onLinkClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-zinc-300"
      >
        {menu.label}
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-3 space-y-3">
              {/* Featured card on mobile */}
              {menu.featured && (
                <Link
                  href={menu.featured.href}
                  onClick={onLinkClick}
                  className="flex items-center justify-between mx-1 mt-1 px-3 py-3 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-orange-400">
                      {menu.featured.label}
                    </div>
                    <div className="text-[11px] text-orange-400/60 mt-0.5">
                      {menu.featured.cta} →
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-orange-400/60 shrink-0" />
                </Link>
              )}

              {/* Columns as stacked sub-sections */}
              {menu.columns.map((col) => (
                <div key={col.heading || 'default'}>
                  {col.heading && (
                    <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {col.heading}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {col.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onLinkClick}
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <span>{link.label}</span>
                        {link.badge === 'soon' && (
                          <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                            Soon
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
