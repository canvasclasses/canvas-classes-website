'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, BarChart3, Search, FileText, Gauge, History, Newspaper } from 'lucide-react';

// Sub-navigation shared across all /seo/* pages. Client component because
// it needs the active path to highlight the current tab.

const TABS = [
  { href: '/seo',            label: 'Insights',   Icon: Lightbulb },
  { href: '/seo/briefings',  label: 'Briefings',  Icon: Newspaper },
  { href: '/seo/overview',   label: 'Overview',   Icon: BarChart3 },
  { href: '/seo/queries',    label: 'Queries',    Icon: Search },
  { href: '/seo/pages',      label: 'Pages',      Icon: FileText },
  { href: '/seo/web-vitals', label: 'Web Vitals', Icon: Gauge },
  { href: '/seo/sync',       label: 'Sync log',   Icon: History },
];

export function SeoSubnav() {
  const pathname = usePathname() ?? '/seo';
  return (
    <nav className="border-b border-white/10 bg-[#0B0F15]/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6">
        {TABS.map(({ href, label, Icon }) => {
          // /seo must match exactly; subpaths get prefix-match so /seo/queries/x
          // would still highlight Queries if we ever add child routes.
          const active = href === '/seo' ? pathname === '/seo' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                active
                  ? 'border-orange-400 text-white'
                  : 'border-transparent text-white/50 hover:border-white/20 hover:text-white/80'
              }`}
            >
              <Icon size={14} className={active ? 'text-orange-300' : ''} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
