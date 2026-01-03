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
];

const ncertBoardsLinks = [
  { label: 'NCERT Solutions', href: '/ncert-solutions', external: false },
  { label: 'CBSE 12 NCERT Revision', href: '/cbse-12-ncert-revision', external: false },
  { label: 'Organic Name Reactions', href: '/organic-name-reactions', external: false },
  { label: 'Assertion & Reason', href: '/assertion-reason', external: false },
];

export default function Navbar() {
  const [jeeDropdownOpen, setJeeDropdownOpen] = useState(false);
  const [ncertDropdownOpen, setNcertDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl flex items-center justify-between px-6 py-2 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Canvas Classes"
          width={180}
          height={50}
          className="h-12 w-auto"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 text-base font-semibold text-gray-700">
        {/* JEE/NEET Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setJeeDropdownOpen(true)}
          onMouseLeave={() => setJeeDropdownOpen(false)}
        >
          <button className="flex items-center gap-1 hover:text-teal-600 transition-colors py-2">
            JEE/NEET <ChevronDown className={`w-4 h-4 transition-transform ${jeeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {jeeDropdownOpen && (
            <div className="absolute top-full left-0 pt-2 w-56 z-50">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                {jeeNeetLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NCERT & Boards Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setNcertDropdownOpen(true)}
          onMouseLeave={() => setNcertDropdownOpen(false)}
        >
          <button className="flex items-center gap-1 hover:text-teal-600 transition-colors py-2">
            NCERT & Boards <ChevronDown className={`w-4 h-4 transition-transform ${ncertDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {ncertDropdownOpen && (
            <div className="absolute top-full left-0 pt-2 w-56 z-50">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                {ncertBoardsLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
        <Link href="#" className="hover:text-teal-600 transition-colors">Flashcards</Link>
        <Link href="/handwritten-notes" className="hover:text-teal-600 transition-colors">My Notes</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-4 md:hidden">
          <div className="px-4 space-y-3">
            <div className="font-semibold text-gray-500 text-xs uppercase tracking-wider">JEE/NEET</div>
            {jeeNeetLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 text-gray-700 hover:text-teal-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-100 my-3" />
            <Link href="#" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">NCERT & Boards</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">Flashcards</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">My Notes</Link>
            <Link href="#" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
