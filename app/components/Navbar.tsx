'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronDown, X } from 'lucide-react';

const jeeNeetLinks = [
  { label: 'Detailed Lectures', href: '/detailed-lectures', external: false },
  { label: 'Quick Recap', href: '/quick-recap', external: false },
  { label: 'Top 50 Concepts', href: '/top-50-concepts', external: false },
  { label: '2 Minute Chemistry', href: '/2-minute-chemistry', external: false },
  { label: 'NEET Crash Course', href: '/neet-crash-course', external: false },
];

const ncertBoardsLinks = [
  { label: 'NCERT Solutions', href: '/ncert-solutions', external: false },
  { label: 'CBSE 12 NCERT Revision', href: '/cbse-12-ncert-revision', external: false },
  { label: 'Download NCERT Books', href: '/download-ncert-books', external: false },
  { label: 'Organic Name Reactions', href: '/organic-name-reactions', external: false },
  { label: 'Assertion & Reason', href: '/assertion-reason', external: false },
];

export default function Navbar() {
  const [jeeDropdownOpen, setJeeDropdownOpen] = useState(false);
  const [ncertDropdownOpen, setNcertDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[98%] max-w-[1400px] flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 transition-all duration-300">
      <Link href="/" className="flex items-center pl-2">
        <Image
          src="/logo.png"
          alt="Canvas Classes"
          width={180}
          height={50}
          className="h-10 md:h-12 w-auto"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 text-base font-bold text-gray-700">
        {/* JEE/NEET Dropdown */}
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

        {/* NCERT & Boards Dropdown */}
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

        <Link href="/flashcards" className="px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all">Flashcards</Link>
        <Link href="/handwritten-notes" className="px-4 py-2 rounded-full hover:bg-teal-50/80 hover:text-teal-700 transition-all">My Notes</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden pr-2">
        <button
          className="p-2 text-gray-700 bg-gray-100/50 rounded-full hover:bg-gray-200/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 right-0 mt-4 mx-2 p-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 md:hidden transition-all duration-300 origin-top transform ${mobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        <div className="space-y-1">
          {/* JEE/NEET Mobile Section */}
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

          {/* NCERT & Boards Mobile Section */}
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
            <Link
              href="/flashcards"
              className="block px-5 py-3 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Flashcards
            </Link>
            <Link
              href="/handwritten-notes"
              className="block px-5 py-3 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Notes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
