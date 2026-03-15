'use client';

import { useState } from 'react';
import GasLaws from './GasLaws';
import Titration from './Titration';
import Electrochemistry from './Electrochemistry';
import { Wind, FlaskConical, Zap, Sparkles } from 'lucide-react';

type Section = 'gaslaws' | 'titration' | 'electrochemistry';

const NAV_ITEMS: { id: Section; label: string; badge: string; icon: typeof Wind; color: string; activeClass: string }[] = [
  {
    id: 'gaslaws',
    label: 'Gas Laws',
    badge: 'Sim',
    icon: Wind,
    color: 'teal',
    activeClass: 'bg-teal-500/15 text-teal-400',
  },
  {
    id: 'titration',
    label: 'Acid-Base Titration',
    badge: 'Sim',
    icon: FlaskConical,
    color: 'blue',
    activeClass: 'bg-blue-500/15 text-blue-400',
  },
  {
    id: 'electrochemistry',
    label: 'Electrochemistry',
    badge: 'New',
    icon: Zap,
    color: 'amber',
    activeClass: 'bg-amber-500/15 text-amber-400',
  },
];

export default function PhysChemHubContent() {
  const [section, setSection] = useState<Section>('gaslaws');

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-[#d6e0f5] font-sans font-medium overflow-hidden">

      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-88px-60px)] md:h-[calc(100vh-88px)] mt-[88px] relative z-10 w-full md:w-[96%] max-w-[1440px] mx-auto md:rounded-t-3xl overflow-hidden md:ring-1 md:ring-white/10 md:bg-[#080c14]/60 md:shadow-2xl">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden md:flex w-60 shrink-0 bg-[#0a0d14]/90 backdrop-blur-2xl border-r border-white/8 p-4 flex-col gap-1.5 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-white/40 tracking-[0.2em] uppercase px-3 pb-4 pt-2">
            <Sparkles size={13} className="text-teal-500" />
            Physical Chemistry
          </div>

          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center justify-between w-full p-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group ${
                  active
                    ? `${item.activeClass} shadow-[inset_3px_0_0_currentColor]`
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={active
                      ? (item.color === 'teal' ? 'text-teal-400' : item.color === 'blue' ? 'text-blue-400' : 'text-amber-400')
                      : `text-gray-500 group-hover:${item.color === 'teal' ? 'text-teal-400' : item.color === 'blue' ? 'text-blue-400' : 'text-amber-400'}`
                    }
                  />
                  {item.label}
                </div>
                <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-white/40">{item.badge}</span>
              </button>
            );
          })}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-10 md:pb-32 scroll-smooth" style={{scrollbarWidth:'thin', scrollbarColor:'rgba(45,212,191,0.2) transparent'}}>
          <div className="max-w-[1200px] mx-auto">
            {section === 'gaslaws' && <GasLaws />}
            {section === 'titration' && <Titration />}
            {section === 'electrochemistry' && <Electrochemistry />}
          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#080c14]/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 z-50">
        <button
          onClick={() => setSection('gaslaws')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'gaslaws' ? 'text-teal-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Wind size={20} />
          <span className="text-[10px] font-semibold">Gas Laws</span>
        </button>
        <button
          onClick={() => setSection('titration')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'titration' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <FlaskConical size={20} />
          <span className="text-[10px] font-semibold">Titration</span>
        </button>
        <button
          onClick={() => setSection('electrochemistry')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'electrochemistry' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Zap size={20} />
          <span className="text-[10px] font-semibold">Electrochem</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(45,212,191,0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(45,212,191,0.4); }
      `}} />
    </div>
  );
}
