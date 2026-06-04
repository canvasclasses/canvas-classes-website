'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CharacterMapBlock, Character } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

function PortraitPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center text-[18px] font-bold"
      style={{
        width: 56,
        height: 56,
        background: 'rgba(244,114,182,0.12)',
        color: '#f9a8d4',
        border: '1.5px solid rgba(244,114,182,0.25)',
      }}
    >
      {initials}
    </div>
  );
}

function CharacterCard({ character, onOpen }: { character: Character; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-2xl p-4 transition-all hover:scale-[1.01]"
      style={{
        background: 'rgba(244,114,182,0.04)',
        border: '1.5px solid rgba(244,114,182,0.18)',
        cursor: 'pointer',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {character.portrait_url ? (
          <Image
            src={character.portrait_url}
            alt={character.name}
            width={56}
            height={56}
            className="rounded-full object-cover"
            style={{ border: '1.5px solid rgba(244,114,182,0.35)' }}
          />
        ) : (
          <PortraitPlaceholder name={character.name} />
        )}
        <div>
          <div className="text-[15px] font-bold" style={{ color: '#f9a8d4' }}>
            {character.name}
          </div>
          {character.role && (
            <div className="text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {character.role}
            </div>
          )}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {character.bio}
      </p>
      {character.traits && character.traits.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {character.traits.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(244,114,182,0.1)',
                color: 'rgba(249,168,212,0.85)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function CharacterMapRenderer({ block }: { block: CharacterMapBlock }) {
  const [openChar, setOpenChar] = useState<Character | null>(null);

  return (
    <div className="my-8 rounded-2xl border border-pink-500/15 bg-pink-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-pink-400 font-bold">⌘</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400/70">
          {block.title || 'Who is Who'}
        </span>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {block.characters.map((c) => (
          <CharacterCard key={c.id} character={c} onOpen={() => setOpenChar(c)} />
        ))}
      </div>

      {block.relationships.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-pink-400/50 mb-3">
            Relationships
          </div>
          <div className="flex flex-wrap gap-2">
            {block.relationships.map((r, i) => {
              const from = block.characters.find((c) => c.id === r.from);
              const to = block.characters.find((c) => c.id === r.to);
              if (!from || !to) return null;
              return (
                <div
                  key={i}
                  className="text-[12px] px-3 py-1.5 rounded-full inline-flex items-center gap-2"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(244,114,182,0.18)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <span style={{ color: '#f9a8d4' }}>{from.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>— {r.label} —</span>
                  <span style={{ color: '#f9a8d4' }}>{to.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {openChar && (
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: 'rgba(244,114,182,0.06)',
            border: '1px solid rgba(244,114,182,0.25)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[15px]" style={{ color: '#f9a8d4' }}>
              {openChar.name}
            </span>
            <button onClick={() => setOpenChar(null)} className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              close ×
            </button>
          </div>
          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/75">
            {openChar.bio}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );
}
