'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstallAppButton } from '@/features/pwa/InstallAppButton';

// =====================================================================
// TYPES
// =====================================================================

type NavLinkItem = {
  label: string;
  href: string;
  badge?: 'soon' | 'new';
  accent?: 'orange';
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

// Live Books: unified entry point for every grade-level book grid. Replaces
// the old Class 9-10 and Class 11-12 dropdowns since both were really
// "where the live books for this grade live." NCERT downloads land here
// too — they're book-adjacent and the only other "downloadable book" slot.
const liveBooksMenu: MegaMenuDef = {
  id: 'live-books',
  label: 'Live Books',
  anchor: 'left',
  width: 'w-60',
  columns: [
    {
      heading: '',
      links: [
        { label: 'Class 9', href: '/class-9' },
        { label: 'Class 10', href: '/class-10' },
        { label: 'Class 11 Chemistry', href: '/class-11/chemistry', badge: 'new' },
        { label: 'Class 12 Chemistry', href: '/class-12/chemistry' },
        { label: 'NCERT Book PDFs', href: '/download-ncert-books' },
      ],
    },
  ],
};

// Study Lab: all interactive tools, visualizers, and reference hubs.
// The JEE/NEET dropdown (Chemistry Lectures, One-Shot, NEET Crash Course,
// Top 50 Concepts, 2-Minute Chemistry) was retired 2026-06 — Study Planner
// is now the canonical entry point for exam-prep resources. Those five
// pages still exist as routes for SEO/deep-links; they just lose the nav
// surface since the Study Planner aggregates them in context.
const studyLabMenu: MegaMenuDef = {
  id: 'study-lab',
  label: 'Study Lab',
  anchor: 'center',
  // Featured panel retired 2026-06 — the Interactive Periodic Table now sits
  // at the top of the Explore column with an orange accent instead, which
  // keeps it visually prominent without inflating the menu width.
  columns: [
    {
      heading: 'Explore',
      links: [
        { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', accent: 'orange' },
        { label: 'Periodic Trends', href: '/periodic-trends' },
        { label: 'Salt Analysis Simulator', href: '/salt-analysis' },
      ],
    },
    {
      heading: 'Practice',
      links: [
        { label: 'Chemistry Flashcards', href: '/chemistry-flashcards' },
        { label: 'Assertion & Reason', href: '/assertion-reason' },
        { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator' },
      ],
    },
    {
      heading: 'Reference',
      links: [
        { label: 'NCERT Solutions', href: '/ncert-solutions' },
        { label: 'Organic Hub', href: '/organic-chemistry-hub' },
        { label: 'Physical Chemistry Hub', href: '/physical-chemistry-hub' },
        { label: 'Inorganic Hub', href: '/inorganic-chemistry-hub' },
      ],
    },
  ],
};

// Plan your career: College Predictor (featured — highest search intent) +
// Career Guide + Career Planning hub. Replaces the previous standalone
// /college-predictor top-level link so the predictor and editorial career
// content sit under one navigational umbrella.
const planYourCareerMenu: MegaMenuDef = {
  id: 'plan-your-career',
  label: 'Plan your career',
  anchor: 'right',
  featured: {
    label: 'College Predictor',
    tagline:
      'Rank-to-college predictions for JEE Main, JEE Advanced, and NEET. Filter by branch, state, and category.',
    href: '/college-predictor',
    cta: 'Predict my colleges',
  },
  columns: [
    {
      heading: '',
      links: [
        { label: 'Branch Finder', href: '/college-predictor/branch-finder', badge: 'new' },
        { label: 'Career Guide', href: '/career-guide' },
        // Career Planning hub (/career-planning) removed from nav 2026-06 —
        // route kept live for SEO/deep-links only.
      ],
    },
  ],
};

const allMenus: MegaMenuDef[] = [
  liveBooksMenu,
  studyLabMenu,
  planYourCareerMenu,
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
  // BITSAT 2026 plan hide-rule removed 2026-06 — route archived under
  // app/_bitsat-2026-archive. Restore when reviving for BITSAT 2027.
  if (pathname?.startsWith('/crucible/preview')) return null;

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
          {/* The Crucible is the only colored flagship — orange accent matches
              its brand. Study Planner and the dropdowns ride the default
              zinc/white treatment so the eye lands on Crucible first.
              Handwritten Notes sits at the far right (just before auth) and
              uses Kalam to evoke the handwritten-marker feel of the page. */}
          <NavLink
            href="/the-crucible"
            label="The Crucible"
            className="!text-orange-400 hover:!text-orange-300"
          />
          <NavLink href="/study-planner" label="Study Planner" />
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
            href="/handwritten-notes"
            label="Handwritten Notes"
            className="!text-amber-300 hover:!text-amber-200 text-[15px]"
            style={{ fontFamily: 'var(--font-kalam), cursive' }}
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
              {/* Mirrors the desktop ordering — Crucible is the only colored
                  flagship; Study Planner rides the default treatment;
                  Handwritten Notes sits at the bottom with its Kalam accent. */}
              <Link
                href="/the-crucible"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-xl transition-colors"
              >
                The Crucible
              </Link>
              <Link
                href="/study-planner"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Study Planner
              </Link>
              {allMenus.map((menu) => (
                <MobileMegaMenu
                  key={menu.id}
                  menu={menu}
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
              ))}
              <Link
                href="/handwritten-notes"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors"
                style={{ fontFamily: 'var(--font-kalam), cursive' }}
              >
                Handwritten Notes
              </Link>
              <InstallAppButton onAction={() => setMobileMenuOpen(false)} />
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
                        className={`group flex items-center justify-between gap-2 px-2 py-2 text-sm rounded-lg transition-colors ${
                          link.accent === 'orange'
                            ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                            : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                        }`}
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
  style,
}: {
  href: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-full transition-all ${className}`}
      style={style}
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
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                          link.accent === 'orange'
                            ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
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
