'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ElementDetailCard — the rich element-detail card, ported (self-contained) from
// apps/student/app/interactive-periodic-table/PeriodicTableClient.tsx's inline
// `ElementModalContent` + its helpers (`formatFormula`, `renderBlockContent`,
// `getElementColor`, `isLightColor`, `SpecialChemistry`, `DetailItem`,
// `DataGridSection`).
//
// Differences from the source modal:
//   • No fixed/backdrop modal chrome, no close button, no compare action — this
//     renders INLINE inside a Live Book page (the GroupElementsRenderer accordion).
//   • `getElementColor` here is the category-color variant (the source's
//     viewMode/property branches are periodic-table-only state). The colored
//     header strip is driven by the element's category.
//
// Depends ONLY on @canvas/data/periodic/elementsData + react + framer-motion +
// lucide-react (all peer deps of @canvas/book-renderer). No @/ or apps/* imports.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Zap,
  AlertTriangle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  Element,
  CATEGORY_COLORS,
  CategoryType,
} from '@canvas/data/periodic/elementsData';

// ─── Color helpers (ported) ──────────────────────────────────────────────────

// Category-color variant of the source `getElementColor` (the property/exception
// view modes are periodic-table-only state and not relevant to a standalone card).
export function getElementColor(element: Element): string {
  return CATEGORY_COLORS[element.category as CategoryType] || '#6b7280';
}

// Check if a color is light (needs dark text). Ported verbatim.
export function isLightColor(color: string): boolean {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }
  if (color.startsWith('hsl')) {
    const match = color.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
    if (match) {
      const h = parseFloat(match[1]) / 360;
      const s = parseFloat(match[2]) / 100;
      const l = parseFloat(match[3]) / 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance > 0.5;
    }
  }
  return false;
}

// ─── Formatting helpers (ported) ─────────────────────────────────────────────

// Format chemical formulas (subscript numbers that follow a letter).
function formatFormula(formula: string) {
  const parts = formula.split(/(\d+)/);
  return parts.map((part, index) => {
    if (/^\d+$/.test(part) && index > 0 && /[A-Za-z]$/.test(parts[index - 1])) {
      return <sub key={index} className="text-[0.7em] align-baseline">{part}</sub>;
    }
    return <span key={index}>{part}</span>;
  });
}

// Render content that may carry <sup>/<sub> tags with readable styling.
// (Kept for parity with the source; safe with author-controlled data.)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderBlockContent(content: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = content;
  let key = 0;

  while (remaining.length > 0) {
    const supMatch = remaining.match(/<sup>(.*?)<\/sup>/);
    const subMatch = remaining.match(/<sub>(.*?)<\/sub>/);

    let firstMatch: RegExpMatchArray | null = null;
    let matchType: 'sup' | 'sub' | null = null;
    let matchIndex = Infinity;

    if (supMatch && supMatch.index !== undefined && supMatch.index < matchIndex) {
      firstMatch = supMatch;
      matchType = 'sup';
      matchIndex = supMatch.index;
    }
    if (subMatch && subMatch.index !== undefined && subMatch.index < matchIndex) {
      firstMatch = subMatch;
      matchType = 'sub';
      matchIndex = subMatch.index;
    }

    if (firstMatch && matchType) {
      if (matchIndex > 0) {
        parts.push(<span key={key++}>{remaining.substring(0, matchIndex)}</span>);
      }
      const innerContent = firstMatch[1];
      if (matchType === 'sup') {
        parts.push(<sup key={key++} className="text-[0.85em] font-semibold align-super">{innerContent}</sup>);
      } else {
        parts.push(<sub key={key++} className="text-[0.85em] font-semibold align-sub">{innerContent}</sub>);
      }
      remaining = remaining.substring(matchIndex + firstMatch[0].length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }

  return parts.length > 0 ? parts : content;
}

// ─── Sub-components (ported) ─────────────────────────────────────────────────

const DetailItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="bg-gray-800/50 p-2.5 sm:p-3 rounded-lg border border-gray-700/50 flex flex-col justify-center">
    <div className="text-[10px] sm:text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wider">{label}</div>
    <div className="text-white text-sm sm:text-base font-semibold truncate" title={String(value)}>{value ?? '-'}</div>
  </div>
);

const SpecialChemistry = ({ element }: { element: Element }) => {
  const getNatureColor = (nature: string | undefined) => {
    if (!nature) return 'bg-gray-700 text-gray-200';
    const n = nature.toLowerCase();
    if (n.includes('acidic')) return 'bg-red-900/40 text-red-200 border-red-700/50';
    if (n.includes('basic')) return 'bg-blue-900/40 text-blue-200 border-blue-700/50';
    if (n.includes('amphoteric')) return 'bg-purple-900/40 text-purple-200 border-purple-700/50';
    return 'bg-gray-700 text-gray-200';
  };

  const hasData = element.flameColor || element.gasColor || element.block === 'd' || element.oxides || element.redoxNature || element.compoundsInfo;

  if (!hasData) return null;

  return (
    <div className="space-y-6 text-base">
      {/* Transition Metal Chemistry (Specific Layout) */}
      {element.block === 'd' && (
        <div className="bg-cyan-950/20 rounded-lg p-3 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
            <span className="text-lg">🧪</span> Transition Metal Chemistry
          </h3>

          <div className="space-y-4">
            {/* 1. Aquated Ion Colors */}
            {element.ionColors && element.ionColors.length > 0 && (
              <div>
                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Aquated Ion Colors:</h4>
                <div className="space-y-2 pl-1">
                  {element.ionColors.map((ion, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: ion.hexColor === 'transparent' ? '#1f2937' : ion.hexColor }}
                      />
                      <div className="flex items-baseline gap-1.5 text-gray-200">
                        <span className="font-semibold text-base">{formatFormula(ion.ion)}</span>
                        {ion.config && <span className="text-gray-500 font-mono text-xs">({ion.config})</span>}
                        <span className="text-gray-500 text-sm">→</span>
                        <span className={`text-sm ${ion.hexColor !== 'transparent' ? 'text-white' : 'text-gray-400'}`}>
                          {ion.color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Oxides Formed */}
            {(element.oxides || element.oxideNature) && (
              <div>
                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Oxides Formed:</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {element.oxides && element.oxides.map(oxide => (
                    <span key={oxide} className="bg-orange-900/30 text-orange-200 border border-orange-700/30 px-2 py-1 rounded text-sm font-mono">
                      {formatFormula(oxide)}
                    </span>
                  ))}
                  {element.oxideNature && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getNatureColor(element.oxideNature)}`}>
                      {element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1)}
                    </span>
                  )}
                </div>
                {element.oxideNatureDetails && (
                  <p className="text-cyan-100/70 text-sm leading-relaxed">
                    {formatFormula(element.oxideNatureDetails)}
                  </p>
                )}
              </div>
            )}

            {/* 3. Halides Formed */}
            {element.halides && element.halides.length > 0 && (
              <div>
                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Halides Formed:</h4>
                <div className="flex flex-wrap gap-2 mb-1">
                  {element.halides.map(halide => (
                    <span key={halide} className="bg-green-900/30 text-green-200 border border-green-700/30 px-2 py-1 rounded text-sm font-mono">
                      {formatFormula(halide)}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs italic">X = F, Cl, Br, I (unless specified)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other Chemistry (Redox, etc) — for non-d-block or additional info */}
      {(element.block as string) !== 'd' && (
        <>
          {/* Redox & Oxidation Behavior */}
          {(element.redoxNature || element.stableOxidationState !== undefined) && (
            <div className="bg-orange-900/10 rounded-xl p-5 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <Zap size={20} /> Oxidation & Reactivity
              </h3>
              <div className="space-y-3">
                {element.stableOxidationState !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-32">Stable State:</span>
                    <span className="text-white font-mono text-lg">+{element.stableOxidationState}</span>
                  </div>
                )}
                {element.oxidationStates && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 w-32">Common States:</span>
                    <span className="text-gray-300 font-mono text-lg">{element.oxidationStates.map(s => (s > 0 ? `+${s}` : s)).join(', ')}</span>
                  </div>
                )}
                {element.redoxNature && (
                  <div className="flex items-start gap-2 mt-2">
                    <span className="text-gray-400 w-32">Nature:</span>
                    <div>
                      <span className={`font-semibold uppercase text-sm tracking-wider px-2 py-0.5 rounded ${element.redoxNature === 'oxidizing' ? 'bg-red-500/20 text-red-300' :
                        element.redoxNature === 'reducing' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-300'
                        }`}>
                        {element.redoxNature} Agent
                      </span>
                      {element.redoxExplanation && (
                        <p className="text-gray-400 mt-2 leading-relaxed">
                          {element.redoxExplanation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Oxides for non-d-block */}
          {(element.oxides || element.oxideNature) && (element.block as string) !== 'd' && (
            <div className="bg-indigo-900/10 rounded-xl p-5 border border-indigo-500/20">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                <Atom size={20} /> Oxide Chemistry
              </h3>
              {element.oxides && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {element.oxides.map(oxide => (
                    <span key={oxide} className="bg-indigo-500/10 text-indigo-200 px-3 py-1 rounded-lg font-mono border border-indigo-500/20">
                      {formatFormula(oxide)}
                    </span>
                  ))}
                </div>
              )}
              {element.oxideNatureDetails && (
                <div className="text-gray-300 leading-relaxed pl-3 border-l-2 border-indigo-500/30">
                  <span className={`font-semibold mr-2 ${getNatureColor(element.oxideNature) === 'bg-gray-700 text-gray-200' ? 'text-indigo-300' : 'px-2 py-0.5 rounded text-xs ' + getNatureColor(element.oxideNature)}`}>
                    {element.oxideNature ? element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1) : ''} Nature
                  </span>
                  <span className="block mt-1">{formatFormula(element.oxideNatureDetails)}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Flame/Gas Colors */}
      {(element.flameColor || element.gasColor) && (
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/30">
            <Sparkles className="text-yellow-400" size={18} />
            <h3 className="text-lg md:text-xl font-bold text-yellow-400">Physical Appearance</h3>
          </div>
          <div className="space-y-3 pl-1">
            {element.flameColor && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-base min-w-[110px]">Flame Color:</span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border border-white/20 shadow-[0_0_10px_currentColor]"
                    style={{ color: element.flameColor.hexColor, backgroundColor: element.flameColor.hexColor }}
                  />
                  <span className="text-white text-base md:text-lg">{element.flameColor.color}</span>
                </div>
              </div>
            )}
            {element.gasColor && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-base min-w-[110px]">Gas Color:</span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border border-white/20"
                    style={{ backgroundColor: element.gasColor.hexColor }}
                  />
                  <span className="text-white text-base md:text-lg">{element.gasColor.color} ({formatFormula(element.gasColor.formula)})</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Common Compounds (General) */}
      {element.compoundsInfo && element.compoundsInfo.length > 0 && (
        <div className="bg-emerald-900/10 rounded-lg p-4 border border-emerald-500/20">
          <h3 className="text-base font-semibold text-emerald-400 mb-3">Important Compounds</h3>
          <div className="space-y-2">
            {element.compoundsInfo.map((comp, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                {comp.hexColor && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600 shrink-0"
                    style={{ backgroundColor: comp.hexColor }}
                  />
                )}
                <span className="text-gray-300 font-mono text-sm">{formatFormula(comp.formula)}</span>
                {comp.nature && (
                  <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${comp.nature.includes('acidic') ? 'bg-red-900/40 text-red-300' :
                    comp.nature.includes('basic') ? 'bg-blue-900/40 text-blue-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                    {comp.nature}
                  </span>
                )}
                <span className="text-gray-400 text-sm">{comp.color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Collapsible secondary data grid (ported).
const DataGridSection = ({ element }: { element: Element }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700/50">
      {/* Compact Header - Always Visible */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1.5">Ionization Energy</div>
          <div className="text-gray-200 font-semibold text-base md:text-lg">
            {element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : '-'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1.5">Electronegativity</div>
          <div className="text-gray-200 font-semibold text-base md:text-lg">
            {element.electronegativity ?? '-'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1.5">Atomic Radius</div>
          <div className="text-gray-200 font-semibold text-base md:text-lg">
            {element.atomicRadius ? `${element.atomicRadius} pm` : '-'}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 hover:bg-gray-800/30 transition-colors flex items-center justify-center gap-2 text-gray-400 text-sm rounded"
      >
        {isExpanded ? (
          <>
            <ChevronDown size={14} className="rotate-180 transition-transform" />
            Hide Additional Data
          </>
        ) : (
          <>
            <ChevronDown size={14} className="transition-transform" />
            Show More Data
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 overflow-hidden"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DetailItem label="Ionic Radius" value={element.ionicRadius ? `${element.ionicRadius} pm` : '-'} />
            <DetailItem label="Electron Affinity" value={element.electronAffinity !== undefined ? `${element.electronAffinity} kJ/mol` : '-'} />
            <DetailItem label="Density" value={element.density ? `${element.density} g/cm³` : '-'} />
            <DetailItem label="Melting Point" value={element.meltingPoint ? `${element.meltingPoint} K` : '-'} />
            <DetailItem label="Boiling Point" value={element.boilingPoint ? `${element.boilingPoint} K` : '-'} />
            <DetailItem label="Standard Potential" value={element.standardReductionPotential ? `${element.standardReductionPotential} V` : '-'} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ─── The card ────────────────────────────────────────────────────────────────

/**
 * ElementDetailCard — rich, dark-theme element detail panel for Live Books.
 * Renders inline (no modal chrome). Colors its header strip by element category.
 */
export function ElementDetailCard({ element }: { element: Element }) {
  const bgColor = getElementColor(element);
  const isDark = !isLightColor(bgColor);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl" style={{ backgroundColor: '#111827' }}>
      {/* Header Colored Strip */}
      <div className="p-3 md:p-6 relative" style={{ backgroundColor: bgColor }}>
        <div className="flex justify-between items-start">
          <div>
            <div className={`text-3xl md:text-5xl font-bold mb-0.5 md:mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {element.symbol}
            </div>
            <div className={`flex items-baseline gap-3 flex-wrap text-base md:text-xl font-medium ${isDark ? 'text-white/90' : 'text-gray-900/90'}`}>
              <span>{element.name}</span>
              {element.electronConfig && (
                <span className="font-mono tracking-tight">
                  {element.electronConfig}
                  {element.isException && element.exceptionType === 'Electron Configuration' && (
                    <span className="ml-2 text-xs font-sans font-semibold opacity-70">(exception)</span>
                  )}
                </span>
              )}
            </div>
            <div className={`text-xs md:text-sm font-medium opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {element.category}
            </div>
          </div>
          <div className={`text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="text-xl md:text-3xl font-bold opacity-50 leading-none">{element.atomicNumber}</div>
            <div className="text-xs md:text-base font-medium opacity-80 mt-0.5 md:mt-1">{element.atomicMass} u</div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3 md:p-6 bg-gray-900 text-white">
        {/* Trend Position Summary */}
        {element.trendPosition && (
          <div className="mb-5 pb-4 border-b border-gray-700/50">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed italic">
              {element.trendPosition}
            </p>
          </div>
        )}

        {/* ZONE 1: Anomalous Behavior */}
        {element.anomalousBehavior && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <h3 className="text-lg md:text-xl font-bold text-amber-400 flex-1">Anomalous Behavior</h3>
              <span className="text-xs md:text-sm px-2 py-0.5 bg-amber-500/20 rounded text-amber-300 font-medium">
                JEE {element.anomalousBehavior.jeeRelevance.toUpperCase()}
              </span>
            </div>
            <ul className="space-y-2.5 md:space-y-3 text-base md:text-lg text-gray-300 leading-relaxed">
              {element.anomalousBehavior.facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2.5 pl-1">
                  <span className="text-amber-400 mt-0.5 shrink-0 font-bold">•</span>
                  <span>{formatFormula(fact)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Oxidation States */}
        {element.oxidationStateCompounds && element.oxidationStateCompounds.length > 0 && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-500/30">
              <Zap size={18} className="text-blue-400 shrink-0" />
              <h3 className="text-lg md:text-xl font-bold text-blue-400">Oxidation States</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              {element.oxidationStateCompounds.map((oxState, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-300 font-bold text-xl md:text-2xl min-w-[50px]">
                    {oxState.state > 0 ? `+${oxState.state}` : oxState.state}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {oxState.compounds.map((compound, j) => (
                      <span key={j} className="bg-blue-500/10 text-blue-200 px-3 md:px-4 py-1.5 rounded text-sm md:text-base font-mono">
                        {formatFormula(compound)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZONE 2: Key Reactions */}
        {element.keyReactions && element.keyReactions.length > 0 && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/30">
              <Atom size={18} className="text-emerald-400 shrink-0" />
              <h3 className="text-lg md:text-xl font-bold text-emerald-400">Key Reactions</h3>
            </div>
            <div className="space-y-4 md:space-y-5">
              {element.keyReactions.map((reaction, i) => (
                <div key={i} className="pl-1">
                  <div className="font-mono text-emerald-200 text-base md:text-lg mb-2 font-semibold">
                    {formatFormula(reaction.equation)}
                  </div>
                  {reaction.conditions && (
                    <div className="text-sm md:text-base text-gray-400 mb-1.5">
                      <span className="font-medium text-gray-300">Conditions:</span> {reaction.conditions}
                    </div>
                  )}
                  {reaction.note && (
                    <div className="text-sm md:text-base text-gray-300 leading-relaxed">
                      {formatFormula(reaction.note)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZONE 3: Special Chemistry */}
        <SpecialChemistry element={element} />

        {/* Old Exception Alert (backward compatibility) */}
        {element.isException && !element.anomalousBehavior && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-yellow-500/30">
              <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
              <h3 className="text-lg md:text-xl font-bold text-yellow-400">Exception: {element.exceptionType}</h3>
            </div>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed pl-1">{element.exceptionExplanation}</p>
          </div>
        )}

        {/* ZONE 4: Data Grid */}
        <DataGridSection element={element} />
      </div>
    </div>
  );
}

export default ElementDetailCard;
