'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics/mixpanel';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Phase    = 'cyclization' | 'dl-naming' | 'epimers' | 'hand-trick';
type Anomer   = 'alpha' | 'beta';
type EView    = 'mannose' | 'galactose';
type FRow     = { label: string; left: string; right: string; isRef?: boolean; isFlipped?: boolean };
type EpimerEntry = {
  rows: FRow[]; title: string; color: string; subtitle: string;
  badge: string | null;
  info: { heading: string; body: string; tip: string | null };
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — CYCLIZATION (imperative SVG animation data)
// ─────────────────────────────────────────────────────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';
type AnimNode = { x: number; y: number; label: string; type: string; sub?: { t: string; s: string; l: string }[] };

const AF: Record<string, AnimNode> = {
  C1: { x: 400, y: 100, label: 'CHO',   type: 'func' },
  C2: { x: 400, y: 180, label: 'C2',    type: 'C', sub: [{ t:'OH',s:'R',l:'OH' },{ t:'H',s:'L',l:'H' }] },
  C3: { x: 400, y: 260, label: 'C3',    type: 'C', sub: [{ t:'H', s:'R',l:'H'  },{ t:'OH',s:'L',l:'OH' }] },
  C4: { x: 400, y: 340, label: 'C4',    type: 'C', sub: [{ t:'OH',s:'R',l:'OH' },{ t:'H',s:'L',l:'H' }] },
  C5: { x: 400, y: 420, label: 'C5',    type: 'C', sub: [{ t:'OH',s:'R',l:'OH' },{ t:'H',s:'L',l:'H' }] },
  C6: { x: 400, y: 500, label: 'CH₂OH', type: 'func' },
};
const RG: Record<string, { x: number; y: number }> = {
  C1:{x:600,y:320}, C2:{x:500,y:440}, C3:{x:300,y:440},
  C4:{x:200,y:320}, C5:{x:300,y:200}, C6:{x:300,y:80}, O:{x:500,y:200},
};

function mkEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string,string> = {}): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function mkAtom(id: string, type: string, label: string): SVGGElement {
  const g = mkEl('g', { id });
  g.appendChild(mkEl('circle', { r: type==='C'?'26':'24', class:`bio-atom-${type.toLowerCase()}` }));
  const t = mkEl('text', { 'text-anchor':'middle','dominant-baseline':'middle',class:'bio-text-label' });
  t.textContent = label; g.appendChild(t); return g;
}
function mkBond(id: string): SVGLineElement {
  return mkEl('line', { id, class:'bio-bond','stroke-width':'3' });
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 & 3 — FISCHER PROJECTION DATA
// ─────────────────────────────────────────────────────────────────────────────

const D_GLU: FRow[] = [
  { label:'C2', left:'H',  right:'OH' },
  { label:'C3', left:'OH', right:'H'  },
  { label:'C4', left:'H',  right:'OH' },
  { label:'C5', left:'H',  right:'OH', isRef:true },
];
const L_GLU: FRow[] = [
  { label:'C2', left:'OH', right:'H'  },
  { label:'C3', left:'H',  right:'OH' },
  { label:'C4', left:'OH', right:'H'  },
  { label:'C5', left:'OH', right:'H',  isRef:true },
];
const D_MAN: FRow[] = [
  { label:'C2', left:'OH', right:'H',  isFlipped:true },
  { label:'C3', left:'OH', right:'H'  },
  { label:'C4', left:'H',  right:'OH' },
  { label:'C5', left:'H',  right:'OH', isRef:true },
];
const D_GAL: FRow[] = [
  { label:'C2', left:'H',  right:'OH' },
  { label:'C3', left:'OH', right:'H'  },
  { label:'C4', left:'OH', right:'H',  isFlipped:true },
  { label:'C5', left:'H',  right:'OH', isRef:true },
];

const EPIMER_DATA: Record<EView, EpimerEntry> = {
  mannose: {
    rows: D_MAN, title:'D-Mannose', color:'#f472b6', subtitle:'C2 epimer of D-glucose', badge:'C2 FLIPPED',
    info: { heading:'D-Mannose — C2 epimer',
      body:'Only C2-OH has moved from right → left. Every other chiral center is identical to D-glucose. This single change creates a structurally distinct sugar with different enzyme recognition.',
      tip:'D-Mannose and D-Glucose are C2 epimers. They are diastereomers — NOT mirror images of each other.' },
  },
  galactose: {
    rows: D_GAL, title:'D-Galactose', color:'#34d399', subtitle:'C4 epimer of D-glucose', badge:'C4 FLIPPED',
    info: { heading:'D-Galactose — C4 epimer',
      body:'Only C4-OH has moved from right → left. D-Galactose is found in lactose (milk sugar). The C4 flip is the structural basis of lactose intolerance — humans lack sufficient enzyme to process it.',
      tip:'D-Galactose and D-Glucose are C4 epimers. D-Galactose is a component of lactose.' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — HAND TRICK DATA
// ─────────────────────────────────────────────────────────────────────────────

// Aldose lookup: C2-C3-C4 finger state (F=extended/OH-right, T=folded/OH-left)
const ALDOSE_DB: Record<string, { name: string; color: string; fact: string }> = {
  'FFF': { name:'D-Allose',    color:'#818cf8', fact:'All four OH groups on the right — the starting reference.' },
  'TFF': { name:'D-Altrose',   color:'#f472b6', fact:'Only C2-OH is on the left. Rarely found in nature.' },
  'FTF': { name:'D-Glucose',   color:'#34d399', fact:'Most abundant monosaccharide. Primary energy source.' },
  'TTF': { name:'D-Mannose',   color:'#60a5fa', fact:'C2 and C3 on the left. Found in glycoproteins.' },
  'FFT': { name:'D-Gulose',    color:'#a78bfa', fact:'Only C4-OH is on the left. Rare in nature.' },
  'TFT': { name:'D-Idose',     color:'#fb923c', fact:'C2 and C4 on the left. Rarely occurring.' },
  'FTT': { name:'D-Galactose', color:'#4ade80', fact:'C3 and C4 on the left. Component of lactose.' },
  'TTT': { name:'D-Talose',    color:'#f87171', fact:'All three flipped. Rarest D-aldohexose.' },
};

function rowsFromFolded(f: boolean[]): FRow[] {
  return [
    { label:'C2', left:f[0]?'OH':'H', right:f[0]?'H':'OH', isFlipped:f[0] },
    { label:'C3', left:f[1]?'OH':'H', right:f[1]?'H':'OH', isFlipped:f[1] },
    { label:'C4', left:f[2]?'OH':'H', right:f[2]?'H':'OH', isFlipped:f[2] },
    { label:'C5', left:'H', right:'OH', isRef:true },
  ];
}

// Fingers point RIGHT. Fold = distal phalanx rotates 175° → tip points LEFT (like a real curled finger).
// KX is the knuckle pivot. transformBox:fill-box + transformOrigin:'0% 50%' pivots at (KX, cy).
const HAND_FDEFS = [
  { label:'C2', cy: 87,  dist:108, idx:0, fixed:false },  // index  — longest
  { label:'C3', cy:130,  dist:130, idx:1, fixed:false },  // middle — tallest
  { label:'C4', cy:173,  dist:110, idx:2, fixed:false },  // ring
  { label:'C5', cy:210,  dist: 88, idx:3, fixed:true  },  // pinky  — D-series indicator
];
const FH_HAND = 30;
const PX_HAND = 192;  // proximal start x (palm right edge)
const KX_HAND = 252;  // knuckle x (pivot for 175° fold)

/** Tapered capsule path pointing right: wider at x1 (base), narrower rounded tip at x2. */
function fSegPath(x1:number, x2:number, cy:number, wL:number, wR:number): string {
  const r = wR / 2;
  return [
    `M ${x1} ${cy - wL/2}`,
    `L ${x2 - r} ${cy - wR/2}`,
    `A ${r} ${r} 0 0 1 ${x2 - r} ${cy + wR/2}`,
    `L ${x1} ${cy + wL/2}`,
    `Z`,
  ].join(' ');
}

function HandSVG({ folded, onToggle }: { folded:boolean[]; onToggle:(idx:number)=>void }) {
  const FH=FH_HAND, PX=PX_HAND, KX=KX_HAND;

  return (
    <svg viewBox="-50 0 510 285" width="100%"
      style={{ maxWidth:510, display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="hg-ext"  x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1e2a85"/><stop offset="100%" stopColor="#3730a3"/>
        </linearGradient>
        <linearGradient id="hg-fold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3b0764"/><stop offset="100%" stopColor="#5b21b6"/>
        </linearGradient>
        <linearGradient id="hg-fix"  x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#7c2d12"/><stop offset="100%" stopColor="#c2410c"/>
        </linearGradient>
        <linearGradient id="hg-palm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1c1a42"/><stop offset="100%" stopColor="#13112e"/>
        </linearGradient>
      </defs>

      {/* ── Palm + Thumb + Wrist — user-provided SVG silhouette ──
           Original viewBox 0 0 1260 1054.
           Transform: scale(0.153) maps finger attachment x≈990→192, y range 66–870→87–210.
           translate(41,77) shifts the scaled result into correct HandSVG position.
           strokeWidth 10 inside the group renders as ≈1.5px at scale 0.153. ── */}
      <g transform="translate(-62,-8) scale(0.253)"
         fill="#1c1a42" stroke="rgba(99,102,241,0.3)" strokeWidth="6">
        <path d="M1097 66.4c-1.4.7-5.9 1.8-10 2.5-4.1.6-9.7 1.8-12.5 2.6-2.7.8-12 3.5-20.5 6-8.5 2.6-21.1 5.7-28 7.1-21.5 4.2-27.2 5.6-37.5 8.6-5.5 1.6-11.8 3.3-14 3.8s-11.2 2.7-19.9 4.9c-24 6.1-45 9.5-84.1 13.6-16.6 1.8-33.1 3.6-56.5 6.5-8.5 1-21.6 2.6-29 3.5-13.5 1.6-53.3 7.1-73 10-20.4 3.1-43.5 7.7-57.5 11.5-3.8 1.1-11.9 3.1-18 4.6-6 1.4-15 3.9-20 5.6-14.3 4.8-58 25.8-83.2 39.9-7 4-14.1 7.9-15.8 8.8-4.9 2.5-33.3 20.8-44 28.4-38.3 27.2-63.6 49.7-103.4 92.1-15.7 16.7-22.5 23.3-25.5 24.6-2.2.9-7.2 4.2-11.1 7.2-5.9 4.6-13.9 9.5-32.1 19.9-5 2.8-16.7 7.2-32.6 12.3-14.3 4.5-14.8 4.6-17.9 3.1-2.4-1.3-5-1.5-12.7-1.1-13.8.8-19.7.7-28.2-.4-8.4-1.1-26.9-5.2-34.3-7.7-5.7-1.8-21-1.2-29 1.2-2.6.8-7.6 1.9-11 2.5-8.3 1.5-19.6 8-27.2 15.5-7.5 7.4-9.8 12.1-10.3 20.5-.5 10.6 2.8 14.3 17.7 19.5 8.8 3.1 9.9 3.9 8.2 5.8-2.8 3.5 1.7 6.1 5.9 3.5 1.8-1.1 2.3-.9 4.5 1.7 4.7 5.8 4.2 10.6-1.7 16.5-4.6 4.7-10.6 7-22 8.6-8.6 1.2-10.3 1.2-12.7-.1-2.1-1-7.1-1.5-18.2-1.7-14.3-.3-15.6-.1-18.9 1.9-1.9 1.2-5.3 2.4-7.5 2.8-8.4 1.3-8.4 1.3-11.6 7.6-3.4 6.8-3.5 10.2-.3 10.7 1.6.2 2.4-.5 3.4-3 2.7-6.7 4.6-8.5 9.8-9.2 3.5-.4 5.8-.2 7.8.9 4.1 2.1 31.8 2.1 35.4 0 3.8-2.2 3.8-2.2 15-3.9 6.9-1 12.5-2.6 16.2-4.4 4.3-2.1 5.9-2.5 6.2-1.5.3.7 1.7 1.3 3.1 1.3 2 0 2.5-.5 2.5-2.4 0-1.3-.7-2.7-1.6-3-1.3-.5-1.1-1.2 1.3-4.2 3.9-5.2 4-13.3.1-19.1-3.5-5.3-12.5-11.2-22.4-14.7-10.1-3.6-13.2-5.8-13.9-10-1.5-7.9 3.5-16.6 13.7-24.2 5.1-3.7 6.5-4.3 11.1-4.3 5.6 0 10.7-1.4 10.7-3 0-2 7.1-2.5 10-.7 3.6 2.1 9.9 2.1 12.9-.1 2.2-1.5 3.6-1.5 14.5-.4 6.7.7 16.2 1.9 21.1 2.6 5 .8 13 1.9 17.8 2.5 5.6.7 9.9 1.8 11.5 2.9 1.9 1.4 5.3 2.1 11.8 2.5 8.7.6 9.3.5 12-1.7 2.2-1.8 4.6-2.6 9.6-3 6.5-.6 13.8-3.2 31.8-11.5 3.6-1.7 9.4-4.2 13-5.7s9.4-4.3 13-6.3c8.4-4.8 9.8-5.3 10.5-4.2.4.6 1.5 1 2.6 1 2.3 0 2.3-.2.3 4.6-6.1 14.4-15.9 43.6-20 59.3-5.1 19.9-10.1 57.1-7.5 57.1.5 0 1.1 2.1 1.3 4.6.3 5.4 2.6 7.7 5.2 5.5 1.3-1.1 1.6-3.8 1.6-15 0-32.7 8-65.4 25-102.6.5-1.1 1.6-3.7 2.4-5.7s2.3-4.1 3.4-4.7c2-1.1 8.4-13.3 9.6-18.2.7-3.3 8.3-12.9 10.2-12.9.8 0 1.9-.9 2.6-2 .7-1.2 4.6-4.6 8.7-7.8 4.6-3.5 14.7-13.8 26.6-27.2 10.6-11.8 22.8-24.9 27.2-29.1 7.8-7.5 11.2-10.1 34.3-26.9 6.3-4.6 15.7-11.7 20.8-15.7 16.1-12.6 34.1-23.4 72.7-43.8 6.1-3.2 15.3-8.2 20.5-11.1 16.2-9 33.9-15.9 64-24.7 28-8.2 43.4-11.5 78.5-16.3 6.1-.9 15.3-2.2 20.5-2.9 17.9-2.5 48.5-6.3 67-8.5 37.6-4.3 52.9-6.2 78-9.5 5.8-.8 17.5-2.3 26-3.5 24.6-3.2 53.9-8.7 75.9-14.2 9.7-2.4 12.9-2.8 14.3-1.9 2.6 1.6 3.8 1.4 4.7-1.2 1.4-3.6 17.9-8.1 40.6-11.2 15.7-2.1 34-6.7 42.2-10.6 6-2.9 6.6-3 8.3-1.4 2.3 2.1 9.3 2.2 12.4.2 2.2-1.5 3.1-1.4 10.2.3 6.9 1.6 8.4 2.3 11.5 5.9 2 2.2 5.4 8 7.5 12.8l3.9 8.8-.1 17.5c0 15-.3 18.8-2.3 26.5-5.3 20.1-12.9 32.3-35.1 55.8-15.3 16.2-40.1 30.9-77.7 46.1-17.1 6.9-29.5 10.2-34.9 9.1-2.2-.4-3.5-.1-4.1.8-.4.7-4.3 2.6-8.7 4.1-4.3 1.5-12.6 5-18.5 7.8-5.8 2.8-14.4 6.1-19.1 7.3-30.3 8.2-39.8 11.1-50 15.7-9.7 4.4-12.6 5.2-18.9 5.6l-7.4.4-4.4-4.4c-15.8-15.2-30.2-39.7-37.3-63.3-2.5-8.1-3-9-5.1-9-3.4 0-3.4 2.5 0 13.5 6.9 22.2 19.7 44.4 34.9 60.2 5.1 5.2 5.4 5.9 5 9.5-.8 5.4-4.3 10.3-11.3 15.4-7.5 5.5-22.9 18.7-36.2 31-28 25.9-49.9 43.7-92.3 75.4-44.4 33.1-81.4 53.8-128 71.4-3.1 1.1-4.6 2.3-4.8 3.8-.5 3.3 2.3 3.5 11.1.4 34.6-12 77.1-35.3 116.9-64.2 38.8-28.1 74.8-57.3 101.7-82.4 11.3-10.5 26.9-23.9 35.4-30.3 5.2-4 7.4-5 9.5-4.7 1.5.2 5 .7 7.7 1.1 2.8.3 26.4.8 52.5.9 37.8.3 48 .1 50-1 1.9-1 3.7-1.1 7-.4 2.5.5 6 1.2 7.8 1.5l3.3.7-.3-4.4-.3-4.4-7.5-.7c-4.4-.5-7.9-1.3-8.5-2.2-.7-1-5.4-1.5-17.5-2.1-17-.7-20.3-.7-45 0-18.5.5-25.2.5-26.2-.1-2.1-1.3-.3-3.2 5-4.9 3.1-1.1 10.6-4.1 16.6-6.7 13-5.7 34.7-13.5 61.4-21.8 10.6-3.3 25.7-8.4 33.5-11.4 7.8-2.9 17.4-6.1 21.2-7.1 9.4-2.4 17.9-5.4 30.5-10.8 23.2-10 31.3-15.4 51.8-34.7 21.8-20.4 33.5-35.9 39.3-52 3.1-8.7 4.1-10.2 5.4-8 1 1.6 4.2 1.2 4.9-.6s.2-2.9-2.7-6.1c-1.8-2-1.8-2.7-.8-8.5 2.2-12 2.5-28.6.7-37.3-2.3-10.8-4.9-16-11.6-22.5-5.9-5.7-12.9-9.1-21.9-10.5-2.4-.4-5.8-1.6-7.5-2.6-3.6-2.2-9-2.4-12.6-.5M867.7 308.6c-.3.3-1.2.4-1.9.1-.8-.3-.5-.6.6-.6 1.1-.1 1.7.2 1.3.5m9.3 4.9c0 1.1-1.1 1.5-4.2 1.4l-4.3-.1 3-1.3c3.9-1.8 5.5-1.8 5.5 0m-537.5 51.9c-1.1 1.6-2.7 2.6-4.1 2.6-1.3 0-2.4-.2-2.4-.5 0-.6 7.4-5.3 7.8-5 .2.2-.4 1.5-1.3 2.9M79 484c1.1.7-.5 1-5.2 1-3.9 0-6.8-.4-6.8-1 0-1.3 10-1.3 12 0"/>
        <path d="M1059.7 160.7c-1.3 1.2-.7 4.2 1.1 5.2 2.7 1.4 22 5.1 26.9 5.1 3 0 4.5-.5 4.9-1.5 1.1-2.7-1.5-4.3-7.9-5-3.4-.4-9.8-1.6-14.2-2.6-8.8-2.1-9.9-2.2-10.8-1.2M1035.4 179.5c-1.1 2.9.4 4.4 5.3 4.9 2.6.3 11.2 1.8 19 3.2s16.5 2.7 19.4 2.8c4.5.1 5.4-.2 5.7-1.8.6-2.6-2.4-4.6-6.7-4.6-2 0-10.3-1.3-18.6-3-17-3.4-23.3-3.8-24.1-1.5M977.6 353.3c-1.8 1.3-1.8 2-.7 9.3 4.3 29.7 4.9 41 3.1 58.2-1.1 10.3-5.4 28.9-7.6 33.4-1.9 3.6-1.8 7.7.2 8.5 2.5.9 4-1.5 7.3-11.8 4-12.4 5.8-21.8 6.6-35.4.7-9.8 1-11.3 3.2-13.7 2.9-3 2.7-6.2-.4-6.6-1.9-.3-2.3-1.2-2.8-6-1.7-16-4.7-34.8-5.8-36-1-1-1.7-1-3.1.1M971.7 484.7c-1.6.3-3.1 1.1-3.4 1.9-1.3 3.3 1.4 3.9 16.5 3.5 8.1-.2 14.8-.4 14.9-.5.1 0 .4-1.3.8-2.9l.7-2.7-13.3.1c-7.4.1-14.7.4-16.2.6M39.3 505.6c-1.1 2.9 1.6 13.7 4.5 17.9 2.9 4.1 5 5.4 30.2 17.9 10.7 5.4 28.1 12.7 45 18.9 16.3 6.1 15.6 5.6 18.2 11.1 1.3 2.7 3.5 6.5 5.1 8.4 2.4 3.1 2.7 4.1 2.1 8.6-.3 2.8-1.2 7.6-2 10.7s-1.4 8.5-1.4 11.8c0 8.1 2.9 13.7 11.5 22.1 7.9 7.7 9.5 10.5 9.5 16.2 0 5.6-4.7 15.5-9 19.1-6.8 5.8-12.2 7.8-40.5 15.2-17.5 4.6-36.2 10.8-43.8 14.7-6.7 3.3-12.7 8.5-15.9 13.6s-2.9 15 .5 21.8c4.5 8.9 9.6 12 27.1 16.5 4.3 1.1 9 2.9 10.5 4 2.5 1.8 3.8 2 13.2 1.4 21.5-1.2 21.5-1.2 25.6 2.2 4.7 3.7 5.4 7.6 2.1 11.5-1.9 2.2-4.2 3.1-13.6 5.2C98.9 778.7 94 783 94 795.3c0 7 0 7.1 4.4 11.3 10 9.5 25.9 10.6 59.4 3.8 8.1-1.7 13.9-2.3 16.2-1.9 7.3 1.3 17.2 1.7 18.3.6 2.7-2.7 14-.5 52.2 10.4 14.3 4.1 32.2 8.8 39.8 10.5 16.6 3.7 35.5 9.1 44.1 12.5 3.4 1.4 6.7 2.5 7.2 2.5s2.2 1.3 3.7 3c2.6 2.7 6.7 5.1 28.6 16.6 3.8 2.1 7.8 3.4 10 3.4 2.8 0 5.4 1.3 12 6 7.2 5.2 13.6 9.1 35.1 21.2 1.9 1.1 4 2.4 4.5 2.8 2.8 2.3 28.2 14.2 36 16.9 12.4 4.4 28.1 7.5 54.7 10.6 2.5.3 5.2 1.3 5.8 2 .9 1.1 3.8 1.5 11.4 1.5 5.5 0 12 .5 14.3 1 2.4.6 12.3 2.1 22 3.5 9.8 1.4 20.1 3.2 22.8 4.1 2.8.9 6.9 1.6 9.2 1.5 2.4-.1 8.4.6 13.5 1.4 5.9.9 16.6 1.5 28.8 1.6 21.6 0 34.6.8 58.5 3.5 14 1.6 23.4 1.8 75 1.6 49.4-.2 63-.6 83.5-2.3 15-1.3 35.8-2.2 53.5-2.4 24.8-.3 44.1-1.5 66.2-4.1l4.1-.5 1.1-6.3c1.6-9 1.8-8.6-4.3-8.6-3 0-5.7-.3-5.9-.8-.3-.4.1-2.5.9-4.7 4.8-13.9 5.8-21.6 5.9-42 0-21.1-1.8-39.7-4.2-41.6-.7-.6-2-.9-2.8-.5-1.9.7-1.9 5.8 0 19.1 3 20.6 1.5 41.7-4.2 60.5-3 10.2-3.6 11-7.7 11-1.7 0-4.5.9-6.2 1.9-4.2 2.5-6.1 2.8-10.8 1.2-4.6-1.6-12-.9-14.4 1.2-2.1 2-8.5 2.5-10.4.9-.8-.6-5-1.1-10.3-1.1-5 0-19.3-.1-32-.3-30.8-.4-48.2-.2-98 1.1-23.1.7-47.4.9-54 .6-23.4-1.2-63.1-3.5-67-4-2.2-.3-11.1-.5-19.8-.6-13.4-.1-16 .1-17.6 1.5-1.6 1.5-3.1 1.6-12.7.7-6-.5-14.2-1-18.1-1-4-.1-10.3-.8-13.9-1.7-5-1.1-9.3-1.3-16.8-.8-7.5.4-12.5.2-19.6-1.1-13.4-2.4-19.9-3.3-33-5-13.6-1.7-22.2-4-50.9-13.5-21.2-7-25.5-9-40.1-18.6-4.1-2.7-14.7-9.2-23.5-14.5-14-8.4-16-9.9-16.3-12.4-.3-2-3.4-5.7-11.9-13.9-6.3-6.1-13-12-14.8-13.1-6.1-3.8-21.6-22.6-28.9-35.2-1.8-3.2-4.6-9.2-6.1-13.3-3-8-7.4-13.4-10.2-12.8-1.3.3-1.7 1.2-1.5 3.3.4 4.4 1.9 7.7 8.9 20.4 7.6 13.7 8.2 14.5 19.6 28.8 9.5 12.1 10.2 14.2 4.7 16.1-2.3.9-4.4.4-12-2.4-12.2-4.6-22.1-7.4-43.6-12.4-9.9-2.3-27.8-7-39.9-10.5-23.6-6.7-36.3-10-43.5-11-2.5-.4-7.1-1.8-10.2-3.1-7.5-3.1-14.5-3.2-18.4-.1-2.8 2.2-16 5.2-34.8 7.8-10.7 1.5-28.1.7-32.3-1.4-7.1-3.8-9.7-12.4-5.3-18 2.3-2.9 11.5-6.7 16-6.7 1.6 0 5.9-1 9.6-2.2 5.4-1.8 7.2-2.9 9.5-6.1 7.1-9.8 1.3-20.6-13.1-24.3-3.6-.9-7.6-2.5-8.9-3.5-1.9-1.5-4.1-1.9-11.4-1.9-4.9 0-10.6.5-12.7 1.1-3 .9-5.1.8-10.5-.6-8.4-2.1-16.4-5.6-18.7-8.1-2.8-3.2-4.8-9-4.8-14.2 0-4.3.5-5.5 3.9-9.4 2.2-2.4 6.6-5.8 9.8-7.5 9.4-5 30.3-11.7 55.8-17.9 25-6.1 35.7-14 40.6-29.7 3.4-11 1.8-15.6-9.5-27.5-4-4.2-8.1-9.1-9-10.9-2-4-2-9.4-.1-17 .8-3.2 1.9-9.4 2.4-13.8 2.1-16.3 1.8-15.5 6.5-15.5 4.5 0 35.2 2.4 51.1 3.9 5.5.6 19 1.7 30 2.6 43.5 3.6 40.5 3.6 40.5-.1 0-3 .2-3-24.5-4.9-11-.8-27.4-2.2-36.5-3-36.8-3.4-50.7-4.5-55-4.5-2.5 0-6.1-.8-8.1-1.9-1.9-1-6.6-2.2-10.5-2.6-3.8-.5-8.9-1.7-11.4-2.7-2.5-1.1-9.9-3.9-16.5-6.3-25.1-9-59.6-25.1-65.5-30.6-1.8-1.6-3.4-4.7-4.5-8.5-.9-3.2-2-6.6-2.4-7.4-1.2-2.2-4-2.4-4.8-.4m108.6 63.6c-.1.7-.4 2.4-.8 3.8l-.7 2.5-1.7-3.2c-2.2-4.1-2.2-4.3.8-4.3 1.4 0 2.5.6 2.4 1.2M359 848.6c3.6 4.3 5.3 7 3.9 6.1-1.3-.9-6-3.4-10.4-5.5-7.7-3.9-7.9-4.1-5.4-5 1.5-.6 2.9-1.8 3.3-2.7.8-2.2 1.2-1.8 8.6 7.1M976.4 519.5c-.4.8.1 6.2 1 11.8 4 25.6 4.4 36.1 2.1 57.2-1.5 13.4-5.1 27.4-8.5 33.3-1.1 1.8-2 3.9-2 4.7 0 1.6 3.5 2.9 5 2 3.1-1.9 9.5-20.9 11-32.5 3.1-23.6 2-52.2-3-74.5-.7-3.4-4.6-4.8-5.6-2M446.7 593.7c-.4.3-.7 1.7-.7 2.9 0 1.8.7 2.4 3.3 2.8 1.7.2 6.7.9 11 1.5 7.7 1.1 34.1 7.2 48.2 11.2 3.9 1 9.7 2.7 13 3.6 49.1 13.4 94.8 29.9 131.2 47.3 9.1 4.4 17.4 8 18.3 8 1 0 2.3.6 2.9 1.4.7.8 5.8 4 11.4 7.2 24.7 13.9 50.5 31.5 66.1 45 14.7 12.9 14.5 12.7 16.1 11.4.8-.7 1.5-1.9 1.5-2.7 0-3.4-25.8-24.4-48.5-39.5-17.4-11.6-39.5-24.5-43.5-25.5-1.4-.3-3.2-1.1-4-1.8-2.6-2.2-23.9-12.5-41.5-20-31.5-13.5-77.6-28.9-120-40-7.7-2-17.1-4.5-21-5.5-12.2-3.3-19.8-4.9-30-6.5-11.3-1.7-12.9-1.8-13.8-.8"/>
        <path d="M272.6 607.7c-.1.2-21.7.3-48 .4-26.3 0-48.5.3-49.2.6-2.3.8-1.7 5 .7 5.6 1.2.3 30.3.3 64.8 0 65.4-.5 66.3-.6 64.8-4.7-.5-1.1-2.2-1.7-5.9-1.8-7.4-.3-26.9-.3-27.2-.1M968.4 653.8c-1.7 1.7-.7 4.1 2 4.7 1.1.2 6.8.7 12.6 1 5.8.4 11.5.9 12.8 1.2 2 .5 2.2.1 2.2-3.1 0-3-.3-3.6-2.2-3.7-1.3 0-7.7-.4-14.2-.7-9.1-.5-12.3-.4-13.2.6M976.3 677.5c-.3.9-.3 3.3 0 5.3s1.3 8.9 2.3 15.2c2.1 14.1 2.4 40 .6 53-1.6 11.5-3.4 18.3-7.4 27.3-3.2 7.3-3.1 9.7.2 9.7 1.6 0 2.9-1.7 5.5-7.3 4.4-9.3 6.1-16.1 8.1-32.2 1.2-9.3 1.5-17.3 1.1-28-.6-16.3-4.2-42.6-6.1-43.7-1.8-1.2-3.6-.9-4.3.7M960.3 797.6c-1.6.7-1.7 3.6-.1 5.2.7.7 2.3 1.2 3.8 1.2 5 0 6.7 1 6.2 3.5-.3 2 .1 2.5 3 3 1.9.4 5 .5 6.9.3l3.4-.3-.4-5c-.1-2.8-.8-5.3-1.3-5.6-.5-.4-4.4-.9-8.6-1.3-4.3-.3-8.6-.8-9.7-1.1-1.1-.2-2.6-.2-3.2.1"/>
      </g>


      {/* ── Inter-finger webbing ── */}
      {[[87,130],[130,173],[173,210]].map(([y1,y2],i)=>(
        <path key={i} d={`M ${PX},${y1} Q ${PX+14},${(y1+y2)/2} ${PX},${y2}`}
          fill="none" stroke="rgba(99,102,241,0.13)" strokeWidth="2" strokeLinecap="round"/>
      ))}

      {/* ── Fingers: back-to-front (C5 first, C2 last / on top) ── */}
      {[...HAND_FDEFS].reverse().map(({ label, cy, dist, idx, fixed }) => {
        const isFolded = !fixed && folded[idx];
        const fillId  = fixed ? 'url(#hg-fix)'  : isFolded ? 'url(#hg-fold)' : 'url(#hg-ext)';
        const sc      = fixed ? '#d97706'        : isFolded ? '#8b5cf6'       : '#6366f1';
        const lc      = fixed ? '#fcd34d'        : 'white';

        return (
          <g key={label} onClick={() => !fixed && onToggle(idx)}
            style={{ cursor: fixed ? 'default' : 'pointer' }}>

            {/* ── Proximal phalanx — tapered capsule, never rotates ── */}
            <path d={fSegPath(PX, KX, cy, FH, FH-1)} fill={fillId} stroke={sc} strokeWidth="1.5"/>
            <text x={PX+28} y={cy} textAnchor="middle" dominantBaseline="middle"
              fill={lc} fontSize="12" fontWeight="900" style={{pointerEvents:'none'}}>{label}</text>
            {/* Subtle fold-hint arrow on proximal */}
            {!fixed && (
              <text x={PX+50} y={cy} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.2)" fontSize="12" style={{pointerEvents:'none'}}>
                {isFolded ? '→' : '←'}
              </text>
            )}

            {/* ── Knuckle joint ── */}
            <circle cx={KX} cy={cy} r={FH/2+3}
              fill={fixed?'#a16207':isFolded?'#4c1d95':'#3730a3'} stroke={sc} strokeWidth="1.5"/>
            {/* Knuckle sheen + crease marks */}
            <ellipse cx={KX} cy={cy-4} rx={7} ry={4} fill="rgba(255,255,255,0.09)"/>
            {[-5,0,5].map(dx=>(
              <line key={dx} x1={KX+dx} y1={cy-FH/2-1} x2={KX+dx} y2={cy+FH/2+1}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinecap="round"/>
            ))}

            {/* ── Distal phalanx — rotates 175° when folded (tip points LEFT) ──
                  transformBox:'fill-box' + transformOrigin:'0% 50%' → pivot = (KX, cy).
                  At 175° the tip is almost perfectly pointing left, with a natural 5° droop. ── */}
            <g style={{
              transformBox:'fill-box' as React.CSSProperties['transformBox'],
              transformOrigin:'0% 50%',
              transform: isFolded ? 'rotate(175deg)' : 'rotate(0deg)',
              transition:'transform 0.5s cubic-bezier(0.34,1.05,0.64,1)',
            }}>
              {/* Tapered distal body — narrower at tip */}
              <path d={fSegPath(KX, KX+dist, cy, FH-1, FH-9)} fill={fillId} stroke={sc} strokeWidth="1.5"/>
              {/* Specular highlight */}
              <rect x={KX+9} y={cy-(FH-2)/2+4} width={Math.max(dist-32,8)} height={4} rx={2}
                fill="rgba(255,255,255,0.1)"/>
              {/* Fingernail detail */}
              <rect x={KX+dist-19} y={cy-(FH-9)/2+2} width={13} height={8} rx={4}
                fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
              {/* Distal knuckle crease */}
              <line x1={KX+20} y1={cy-(FH-4)/2} x2={KX+20} y2={cy+(FH-4)/2}
                stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
          </g>
        );
      })}

      {/* ── "OH" at fingertip — fades when finger folds ── */}
      {HAND_FDEFS.map(({ cy, dist, idx, fixed }) => {
        const isFolded = !fixed && folded[idx];
        return (
          <text key={`oh${idx}`}
            x={KX+dist+FH/2+10} y={cy} dominantBaseline="middle"
            fill={fixed?'#fbbf24':isFolded?'#f472b6':'#34d399'}
            fontSize="14" fontWeight="900"
            style={{pointerEvents:'none', opacity:isFolded?0:1, transition:'opacity 0.35s'}}>
            OH
          </text>
        );
      })}

      {/* ── "←OH" near knuckle — appears when folded ── */}
      {HAND_FDEFS.map(({ cy, idx, fixed }) => {
        const isFolded = !fixed && folded[idx];
        return !fixed ? (
          <text key={`loh${idx}`}
            x={KX-20} y={cy} textAnchor="end" dominantBaseline="middle"
            fill="#f472b6" fontSize="12" fontWeight="900"
            style={{pointerEvents:'none', opacity:isFolded?1:0, transition:'opacity 0.35s'}}>
            ←OH
          </text>
        ) : null;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FISCHER SVG (declarative React component for Phases 2 & 3)
// ─────────────────────────────────────────────────────────────────────────────

function FischerSVG({ rows, title, titleColor='#818cf8', subtitle, highlightRef=false, highlightFlipped=false, highlightCarbon }:
  { rows:FRow[]; title:string; titleColor?:string; subtitle?:string; highlightRef?:boolean; highlightFlipped?:boolean; highlightCarbon?:string }) {
  const cx=120, topY=45, sp=76;
  const bottomY = topY + (rows.length+1)*sp;
  // Only reserve space for the title row when a title is provided
  const h = bottomY + (title ? 88 : 42);

  return (
    <svg viewBox={`0 0 240 ${h}`} width="100%" style={{ maxWidth:220 }}>
      {/* Backbone — split into segments so the line stops at each carbon circle boundary (r=24) and restarts on the other side */}
      {[
        [topY + 22,                   topY + sp - 26],          // CHO bottom → C2 top
        ...rows.slice(0, -1).map((_, i) =>
          [topY + (i + 1) * sp + 26,  topY + (i + 2) * sp - 26] // between consecutive carbons
        ),
        [topY + rows.length * sp + 26, bottomY - 22],           // last carbon bottom → CH₂OH top
      ].map(([y1, y2], i) => (
        <line key={i} x1={cx} y1={y1} x2={cx} y2={y2}
          stroke="rgba(99,102,241,0.45)" strokeWidth="3.5" strokeLinecap="round"/>
      ))}
      {/* CHO */}
      <ellipse cx={cx} cy={topY} rx={30} ry={22} fill="#8b5cf6" stroke="#5b21b6" strokeWidth="2.5"/>
      <text x={cx} y={topY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="800">CHO</text>

      {rows.map((row,i)=>{
        const y=topY+(i+1)*sp;
        const sR=row.isRef&&highlightRef, sF=row.isFlipped&&highlightFlipped;
        const isCmp=row.label===highlightCarbon; // amber highlight for comparison carbon in D-Glucose side
        const lIsOH=row.left==='OH', rIsOH=row.right==='OH';
        const cc=sR?'#fbbf24':sF?'#f472b6':isCmp?'#fbbf24':'#6366f1';
        const cf=sR?'rgba(251,191,36,0.15)':sF?'rgba(244,114,182,0.15)':isCmp?'rgba(251,191,36,0.12)':'#2d3a5a';
        const lc=sR?'#fbbf24':sF?'#f472b6':isCmp?'rgba(251,191,36,0.6)':'rgba(99,102,241,0.45)';
        const sw=sR||sF||isCmp?3.5:3;
        // H atom: dark fill for legibility, bright stroke
        const hFill='#0a2218', hStroke='#34d399';
        return (
          <g key={row.label}>
            {/* Dotted highlight rectangle spanning full row — behind everything */}
            {(sF||isCmp)&&(
              <rect x={1} y={y-23} width={238} height={46} rx={23}
                fill={isCmp?'rgba(251,191,36,0.06)':'rgba(244,114,182,0.06)'}
                stroke={isCmp?'#fbbf24':'#f472b6'}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}
            {/* Bond lines — stop at the boundary of the center carbon (r=24) so they never cross through it */}
            <line x1={22} y1={y} x2={cx - 26} y2={y} stroke={lc} strokeWidth={sw} strokeLinecap="round"/>
            <line x1={cx + 26} y1={y} x2={218} y2={y} stroke={lc} strokeWidth={sw} strokeLinecap="round"/>
            <circle cx={cx} cy={y} r="24" fill={cf} stroke={cc} strokeWidth={sR||sF||isCmp?3:2.5}/>
            <text x={cx} y={y} textAnchor="middle" dominantBaseline="middle"
              fill={sR?'#fbbf24':sF?'#f472b6':isCmp?'#fbbf24':'white'} fontSize="13" fontWeight="800">{row.label}</text>
            {/* Left substituent */}
            <circle cx={18} cy={y} r="18" fill={lIsOH?'#7f1d1d':'#0a2218'} stroke={lIsOH?'#ef4444':hStroke} strokeWidth="2.5"/>
            <text x={18} y={y} textAnchor="middle" dominantBaseline="middle" fill={lIsOH?'#fca5a5':'#6ee7b7'} fontSize="11" fontWeight="800">{row.left}</text>
            {/* Right substituent */}
            <circle cx={222} cy={y} r="18" fill={rIsOH?'#7f1d1d':'#0a2218'} stroke={rIsOH?'#ef4444':hStroke} strokeWidth="2.5"/>
            <text x={222} y={y} textAnchor="middle" dominantBaseline="middle" fill={rIsOH?'#fca5a5':'#6ee7b7'} fontSize="11" fontWeight="800">{row.right}</text>
            {/* Reference C5 label (Phase 2 only) */}
            {sR&&<text x={cx} y={y+34} textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="900" letterSpacing="0.5">REFERENCE C5</text>}
          </g>
        );
      })}

      {/* CH₂OH */}
      <ellipse cx={cx} cy={bottomY} rx={36} ry={22} fill="#8b5cf6" stroke="#5b21b6" strokeWidth="2.5"/>
      <text x={cx} y={bottomY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="800">CH₂OH</text>
      {/* Title */}
      {title&&<text x={cx} y={bottomY+38} textAnchor="middle" fill={titleColor} fontSize="17" fontWeight="900">{title}</text>}
      {subtitle&&<text x={cx} y={title?bottomY+56:bottomY+38} textAnchor="middle" fill="rgba(148,163,184,0.85)" fontSize="10" fontWeight="600">{subtitle}</text>}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP BAR
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id:'cyclization' as Phase, label:'Ring Formation' },
  { id:'dl-naming'   as Phase, label:'D vs L Naming'  },
  { id:'epimers'     as Phase, label:'Epimers'        },
  { id:'hand-trick'  as Phase, label:'Hand Trick'     },
];

function StepBar({ current, onGo }: { current:Phase; onGo:(p:Phase)=>void }) {
  const ci = STEPS.findIndex(s=>s.id===current);
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {STEPS.map((s,i)=>{
        const active=s.id===current, done=i<ci;
        return (
          <button key={s.id}
            onClick={()=>done&&onGo(s.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
            style={{
              background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
              color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
              cursor: done ? 'pointer' : 'default',
            }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
              style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}>
              {done ? '✓' : i+1}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 — D vs L NAMING
// ─────────────────────────────────────────────────────────────────────────────

function DLPhase({ onNext, onBack }: { onNext:()=>void; onBack:()=>void }) {
  const [showRef, setShowRef] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      {/* Rule — plain text, no card */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'#6366f1'}}>The Rule</p>
        <p className="text-white font-bold text-lg leading-snug">
          The D/L label is set by the{' '}
          <span style={{color:'#fbbf24'}}>stereogenic center farthest from the carbonyl</span>
          {' '}— C5 in glucose.{' '}
          <span style={{color:'#34d399'}}>C5-OH on the Right</span> → D-sugar.{' '}
          <span style={{color:'#f87171'}}>C5-OH on the Left</span> → L-sugar.
        </p>
      </div>

      {/* Highlight toggle — plain underline link */}
      <button onClick={()=>setShowRef(v=>!v)}
        className="self-start text-xs font-semibold transition-colors pb-0.5"
        style={{
          color:showRef?'#fbbf24':'#475569',
          borderBottom:`1px solid ${showRef?'rgba(251,191,36,0.5)':'rgba(255,255,255,0.1)'}`,
          background:'none', outline:'none',
        }}>
        {showRef?'✓ C5 highlighted':'Highlight C5 reference carbon'}
      </button>

      {/* Side-by-side Fischer projections — no card wrappers */}
      <div className="grid grid-cols-[1fr_28px_1fr] gap-2 items-start">
        {/* D-glucose */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-black" style={{color:'#818cf8'}}>D-Glucose</div>
          <div className="text-[10px]" style={{color:'#475569'}}>Naturally occurring</div>
          <FischerSVG rows={D_GLU} highlightRef={showRef} title="D-Glucose" titleColor="#818cf8" subtitle="C5-OH on RIGHT →"/>
        </div>

        {/* Mirror plane — glowing vertical line with stacked letters */}
        <div className="flex flex-col items-center self-stretch justify-center relative" style={{width:44}}>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full"
            style={{
              background:'linear-gradient(to bottom,transparent 0%,rgba(148,163,184,0.55) 15%,rgba(148,163,184,0.55) 85%,transparent 100%)',
              boxShadow:'0 0 10px rgba(148,163,184,0.35), 0 0 24px rgba(148,163,184,0.12)',
            }}/>
          <div className="relative z-10 flex flex-col items-center gap-[5px] py-10"
            style={{background:'radial-gradient(ellipse at center,rgba(15,23,42,0.9) 60%,transparent)',borderRadius:8}}>
            {'MIRROR'.split('').map((ch,i)=>(
              <span key={i} className="font-black select-none"
                style={{fontSize:9,color:'rgba(203,213,225,0.75)',letterSpacing:'0.05em',textShadow:'0 0 6px rgba(148,163,184,0.6)'}}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* L-glucose */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-black" style={{color:'#f87171'}}>L-Glucose</div>
          <div className="text-[10px]" style={{color:'#475569'}}>Synthetic only</div>
          <FischerSVG rows={L_GLU} highlightRef={showRef} title="L-Glucose" titleColor="#f87171" subtitle="← C5-OH on LEFT"/>
        </div>
      </div>

      {/* Key insight — hairline + plain text */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem'}}>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'#475569'}}>JEE/NEET Key Point</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong className="text-white">L-glucose is the complete enantiomer</strong> of D-glucose — every OH group flips.
          It does <em>not</em> occur in nature. All naturally occurring monosaccharides belong to the{' '}
          <strong className="text-indigo-300">D-series</strong>.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8'}}>
          ← Back
        </button>
        <button onClick={onNext}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{background:'rgba(99,102,241,0.18)',border:'1px solid rgba(129,140,248,0.4)',color:'#c4b5fd'}}>
          Next: Epimers →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 — EPIMERS
// ─────────────────────────────────────────────────────────────────────────────

function EpimersPhase({ onBack, onNext }: { onBack:()=>void; onNext:()=>void }) {
  const [view, setView] = useState<EView>('mannose');
  const data = EPIMER_DATA[view];
  const epimerCarbon = view === 'mannose' ? 'C2' : 'C4';

  return (
    <div className="flex flex-col gap-6">
      {/* Concept — plain text, no card */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'#ec4899'}}>Epimers</p>
        <p className="text-white font-bold text-lg leading-snug">
          Epimers are sugars that differ at <span style={{color:'#f472b6'}}>exactly one chiral center</span>.
          They are diastereomers — <em>not</em> mirror images of each other.
        </p>
      </div>

      {/* Selector — underline tabs, no pill boxes */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider mr-2" style={{color:'#475569'}}>Compare with:</span>
        {(Object.keys(EPIMER_DATA) as EView[]).map(key=>{
          const d=EPIMER_DATA[key]; const active=view===key;
          return (
            <button key={key} onClick={()=>setView(key)}
              className="px-3 py-2 text-center transition-all"
              style={{
                borderBottom:`2px solid ${active?d.color:'rgba(255,255,255,0.06)'}`,
                opacity:active?1:0.5,
                background:'none', outline:'none',
              }}>
              <div className="text-xs font-black" style={{color:d.color}}>{d.title}</div>
              <div className="text-[10px]" style={{color:'#475569'}}>{d.subtitle.split(' ')[0]+' epimer'}</div>
            </button>
          );
        })}
      </div>

      {/* Side-by-side Fischer comparison — no card wrappers */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
        {/* D-Glucose */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-black" style={{color:'#818cf8'}}>D-Glucose</div>
          <div className="text-[10px]" style={{color:'#475569'}}>Base structure</div>
          <FischerSVG
            rows={D_GLU}
            highlightRef={false}
            highlightCarbon={epimerCarbon}
            title="D-Glucose"
            titleColor="#818cf8"
            subtitle={`${epimerCarbon} highlighted`}
          />
        </div>

        {/* 1-flip indicator — minimal */}
        <div className="flex flex-col items-center self-stretch justify-center gap-2 pt-12">
          <div className="flex-grow w-px" style={{background:'linear-gradient(to bottom,transparent,rgba(244,114,182,0.3) 20%,rgba(244,114,182,0.3) 80%,transparent)'}}/>
          <div className="flex flex-col items-center gap-1 px-1"
            style={{border:'1px solid rgba(244,114,182,0.3)',borderRadius:8,padding:'6px 4px'}}>
            <span style={{fontSize:10,color:data.color,fontWeight:900}}>1</span>
            <span style={{fontSize:7,color:'rgba(244,114,182,0.7)',fontWeight:900,letterSpacing:'0.1em',writingMode:'vertical-rl',transform:'rotate(180deg)'}}>FLIP</span>
          </div>
          <div className="flex-grow w-px" style={{background:'linear-gradient(to bottom,transparent,rgba(244,114,182,0.3) 20%,rgba(244,114,182,0.3) 80%,transparent)'}}/>
        </div>

        {/* Epimer */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-black" style={{color:data.color}}>{data.title}</div>
          <div className="text-[10px]" style={{color:'#475569'}}>{data.subtitle}</div>
          <FischerSVG
            rows={data.rows}
            highlightFlipped={true}
            title={data.title}
            titleColor={data.color}
            subtitle={`${epimerCarbon} flipped`}
          />
        </div>
      </div>

      {/* Explanation + exam tip — hairline + plain text */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem'}}>
        <p className="text-white font-bold text-sm mb-1">{data.info.heading}</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">{data.info.body}</p>
        {data.info.tip&&(
          <p className="text-sm leading-relaxed" style={{color:'#94a3b8'}}>
            <span className="text-[9px] font-black uppercase tracking-widest mr-2" style={{color:data.color}}>Exam Tip</span>
            {data.info.tip}
          </p>
        )}
      </div>

      {/* Summary — hairline + plain 2-col list */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem'}}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{color:'#475569'}}>JEE/NEET Summary</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300">
          <div>• <strong className="text-white">Epimers</strong> differ at exactly 1 chiral center</div>
          <div>• <strong style={{color:'#f472b6'}}>D-Mannose</strong> = C2 epimer of D-glucose</div>
          <div>• Epimers are diastereomers, not enantiomers</div>
          <div>• <strong style={{color:'#34d399'}}>D-Galactose</strong> = C4 epimer of D-glucose</div>
          <div>• Anomers (α/β) are C1 epimers — a special case</div>
          <div>• D-Galactose is a component of lactose</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8'}}>
          ← Back
        </button>
        <button onClick={onNext}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{background:'rgba(99,102,241,0.18)',border:'1px solid rgba(129,140,248,0.4)',color:'#c4b5fd'}}>
          Next: Hand Trick →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — HAND TRICK
// ─────────────────────────────────────────────────────────────────────────────

function HandTrickPhase({ onBack }: { onBack:()=>void }) {
  const [folded, setFolded] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) =>
    setFolded(prev => prev.map((v, j) => j === i ? !v : v));

  const key    = folded.map(f => f ? 'T' : 'F').join('');
  const aldose = ALDOSE_DB[key];
  const rows   = rowsFromFolded(folded);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Instructions — plain text, no card ── */}
      <div>
        <p className="text-white font-bold text-base leading-relaxed">
          Hold your <span style={{color:'#fbbf24'}}>left hand</span> with fingers pointing right, palm toward you.
          {' '}<span style={{color:'#34d399'}}>Extended finger</span> = OH on the right.
          {' '}<span style={{color:'#f472b6'}}>Folded finger</span> = OH on the left.
          {' '}<span style={{color:'#d97706'}}>C5 is always fixed</span> — it confirms the D-series.
        </p>
        <p className="text-slate-500 text-sm mt-1">Click C2, C3, C4 to fold or unfold. The structure updates instantly.</p>
      </div>

      {/* ── Main: Hand + Fischer side by side, no cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-center">

        {/* Hand */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest" style={{color:'#475569'}}>
            ← Your Left Hand (palm facing you)
          </p>
          <HandSVG folded={folded} onToggle={toggle}/>
          {/* D-SERIES label — below hand */}
          <div className="flex flex-col items-center gap-1 mt-1">
            <span className="text-[11px] font-black uppercase tracking-[2px]" style={{color:'#6366f1'}}>D-Series</span>
            <span className="text-[10px]" style={{color:'#475569'}}>C5-OH always on the right</span>
          </div>
          <button onClick={() => setFolded([false, false, false])}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all mt-1"
            style={{background:'rgba(99,102,241,0.10)',border:'1px solid rgba(129,140,248,0.3)',color:'#a5b4fc'}}>
            ↺ Reset to D-Allose
          </button>
        </div>

        {/* Fischer + name + state */}
        <div className="flex flex-col items-center gap-3">
          {/* Aldose name — the only prominent element here */}
          <div className="text-3xl font-black text-center transition-all duration-300" style={{color:aldose.color}}>
            {aldose.name}
          </div>

          <FischerSVG rows={rows} highlightFlipped={true} highlightRef={false}
            title="" titleColor={aldose.color}/>

          {/* Fact — plain text, no box */}
          <p className="text-sm text-center leading-snug" style={{color:'#64748b'}}>
            {aldose.fact}
          </p>

          {/* C2-C5 configuration state — enlarged, no wrapper box */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{color:'#475569'}}>Config:</span>
            {['C2','C3','C4','C5'].map((c, i) => {
              const isFixed = i === 3;
              const isFolded = !isFixed && folded[i];
              const col = isFixed ? '#d97706' : isFolded ? '#f472b6' : '#34d399';
              return (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                    style={{
                      background: isFixed ? 'rgba(217,119,6,0.15)' : isFolded ? 'rgba(244,114,182,0.15)' : 'rgba(52,211,153,0.15)',
                      border: `2px solid ${col}`,
                      color: col,
                    }}>
                    {isFixed ? 'R' : isFolded ? 'L' : 'R'}
                  </div>
                  <span className="text-xs font-bold" style={{color:'#64748b'}}>{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── All 8 D-Aldohexoses — thin divider, then plain grid ── */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem'}}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{color:'#475569'}}>
          All 8 D-Aldohexoses — click any to jump
        </p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(ALDOSE_DB).map(([k, v]) => {
            const active = k === key;
            return (
              <button key={k}
                onClick={() => setFolded([k[0]==='T', k[1]==='T', k[2]==='T'])}
                className="rounded-lg py-2 px-1 text-center transition-all"
                style={{
                  background: active ? `${v.color}14` : 'transparent',
                  borderBottom: `2px solid ${active ? v.color : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="text-xs font-black mb-1.5" style={{color: active ? v.color : '#64748b'}}>
                  {v.name.replace('D-','')}
                </div>
                {/* Mini finger-bar pattern */}
                <div className="flex justify-center gap-0.5 items-end" style={{height:14}}>
                  {[0,1,2,3].map(i => {
                    const isFold = i !== 3 && k[i] === 'T';
                    return (
                      <div key={i} style={{
                        width:5, borderRadius:2,
                        height: i===3 ? 10 : isFold ? 6 : 13,
                        background: i===3 ? '#d97706' : isFold ? '#f472b6' : '#34d399',
                      }}/>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── JEE/NEET Key Points — plain list under a divider ── */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem'}}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{color:'#475569'}}>
          JEE / NEET Key Points
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-400">
          <div>• Exactly <strong className="text-slate-200">8 D-aldohexoses</strong> exist — 2³ combinations of C2, C3, C4</div>
          <div>• <strong style={{color:'#34d399'}}>D-Glucose</strong> (FTF) is the most abundant monosaccharide</div>
          <div>• <strong style={{color:'#4ade80'}}>D-Galactose</strong> (FTT) is a component of lactose</div>
          <div>• <strong style={{color:'#60a5fa'}}>D-Mannose</strong> (TTF) is found in glycoproteins</div>
          <div>• All 8 are <strong className="text-slate-200">diastereomers</strong> of each other, not enantiomers</div>
          <div>• C5-OH on the right <strong className="text-amber-400">defines the D-series</strong></div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex justify-start pt-2">
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8'}}>
          ← Back to Epimers
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function BiomoleculesSimulator() {
  useEffect(() => {
    track('simulation_opened', { simulation_id: 'biomolecules', subject: 'organic' });
  }, []);

  const [phase,    setPhase]    = useState<Phase>('cyclization');
  const [progress, setProgress] = useState(0);
  const [anomer,   setAnomer]   = useState<Anomer>('alpha');
  const svgRef    = useRef<SVGSVGElement>(null);
  const bondsRef  = useRef<SVGGElement>(null);
  const atomsRef  = useRef<SVGGElement>(null);
  const attackRef = useRef<SVGPathElement>(null);
  const initDone  = useRef(false);

  // ── Phase 1: init SVG nodes ───────────────────────────────────────────────
  useEffect(()=>{
    const atoms=atomsRef.current, bonds=bondsRef.current;
    if (!atoms||!bonds) return;
    atoms.innerHTML=''; bonds.innerHTML='';
    for (const key of Object.keys(AF)) {
      atoms.appendChild(mkAtom(`node-${key}`, AF[key].type, AF[key].label));
      AF[key].sub?.forEach((s,i)=>atoms.appendChild(mkAtom(`sub-${key}-${i}`,s.t==='H'?'H':'O',s.l)));
    }
    atoms.appendChild(mkAtom('anomer-oh','O','OH'));
    atoms.appendChild(mkAtom('anomer-h','H','H'));
    atoms.appendChild(mkAtom('node-O','O','O'));
    for (let i=1;i<=5;i++) bonds.appendChild(mkEl('line',{id:`bond-${i}`,class:'bio-bond'}));
    bonds.appendChild(mkEl('line',{id:'ring-b-1',class:'bio-bond'}));
    bonds.appendChild(mkEl('line',{id:'ring-b-2',class:'bio-bond'}));
    initDone.current=true;
  },[]);

  // ── Phase 1: update positions ─────────────────────────────────────────────
  useEffect(()=>{
    if (!initDone.current) return;
    const svg=svgRef.current, bonds=bondsRef.current, attack=attackRef.current;
    if (!svg||!bonds||!attack) return;
    const p=progress;
    const gB=(id:string):SVGLineElement=>{let el=svg.querySelector<SVGLineElement>(`#${id}`);if(!el){el=mkBond(id);bonds.appendChild(el);}return el;};
    function gP(key:string){
      const n=AF[key];
      if(p<=40){const a=(p/40)*90*(Math.PI/180);const dx=n.x-400,dy=n.y-300;return{x:400+dx*Math.cos(a)-dy*Math.sin(a),y:300+dx*Math.sin(a)+dy*Math.cos(a)};}
      const lp=(p-40)/60;return{x:(400-(n.y-300))+(RG[key].x-(400-(n.y-300)))*lp,y:(300+(n.x-400))+(RG[key].y-(300+(n.x-400)))*lp};
    }
    const keys=Object.keys(AF);
    keys.forEach((key,idx)=>{
      const{x:tx,y:ty}=gP(key);
      const node=svg.querySelector<SVGGElement>(`#node-${key}`);
      if(node){node.setAttribute('transform',`translate(${tx},${ty})`);if(key==='C1'){const t=node.querySelector('text');if(t)t.textContent=p>=100?'C1':'CHO';node.classList.toggle('pulse-anomer',p>=100);}}
      AF[key].sub?.forEach((s,si)=>{
        const sn=svg.querySelector<SVGElement>(`#sub-${key}-${si}`);const sb=gB(`b-${key}-${si}`);
        let sx:number,sy:number;const off=65;
        if(p<=40){const a=(p/40)*90*(Math.PI/180);const bO=s.s==='R'?off:-off;sx=tx+bO*Math.cos(a);sy=ty+bO*Math.sin(a);}
        else{sx=tx;sy=s.s==='R'?ty+off:ty-off;if(p>=100&&key==='C5'&&s.t==='H')sy=ty+off;}
        const hide=p>=100&&key==='C5'&&s.s==='R';
        if(sn){sn.style.opacity=hide?'0':'1';if(!hide)sn.setAttribute('transform',`translate(${sx},${sy})`);}
        sb.style.opacity=hide?'0':'1';
        if(!hide){sb.setAttribute('x1',String(tx));sb.setAttribute('y1',String(ty));sb.setAttribute('x2',String(sx));sb.setAttribute('y2',String(sy));}
      });
      if(idx<keys.length-1){
        const bb=svg.querySelector<SVGLineElement>(`#bond-${idx+1}`);const{x:nx,y:ny}=gP(keys[idx+1]);
        if(bb){bb.setAttribute('x1',String(tx));bb.setAttribute('y1',String(ty));bb.setAttribute('x2',String(nx));bb.setAttribute('y2',String(ny));bb.style.opacity='1';}
      }
    });
    const c1n=svg.querySelector<SVGGElement>('#node-C1');
    const soh=svg.querySelector<SVGElement>('#anomer-oh'),sh=svg.querySelector<SVGElement>('#anomer-h');
    const boh=gB('b-anomer-oh'),bh=gB('b-anomer-h');
    if(p>=100&&c1n){
      const m=(c1n.getAttribute('transform')??'').match(/translate\(([^,]+),\s*([^)]+)\)/);
      const c1x=m?parseFloat(m[1]):RG.C1.x,c1y=m?parseFloat(m[2]):RG.C1.y;
      const ia=anomer==='alpha',ohY=ia?c1y+65:c1y-65,hY=ia?c1y-65:c1y+65;
      if(soh){soh.style.opacity='1';soh.setAttribute('transform',`translate(${c1x},${ohY})`);}
      if(sh){sh.style.opacity='1';sh.setAttribute('transform',`translate(${c1x},${hY})`);}
      boh.style.opacity='1';boh.setAttribute('x1',String(c1x));boh.setAttribute('y1',String(c1y));boh.setAttribute('x2',String(c1x));boh.setAttribute('y2',String(ohY));
      bh.style.opacity='1';bh.setAttribute('x1',String(c1x));bh.setAttribute('y1',String(c1y));bh.setAttribute('x2',String(c1x));bh.setAttribute('y2',String(hY));
    }else{if(soh)soh.style.opacity='0';if(sh)sh.style.opacity='0';boh.style.opacity='0';bh.style.opacity='0';}
    const nO=svg.querySelector<SVGElement>('#node-O'),rb1=svg.querySelector<SVGLineElement>('#ring-b-1'),rb2=svg.querySelector<SVGLineElement>('#ring-b-2');
    if(p>=100){
      if(nO){nO.style.opacity='1';nO.setAttribute('transform',`translate(${RG.O.x},${RG.O.y})`);}
      if(rb1){rb1.style.opacity='1';rb1.setAttribute('x1',String(RG.C5.x));rb1.setAttribute('y1',String(RG.C5.y));rb1.setAttribute('x2',String(RG.O.x));rb1.setAttribute('y2',String(RG.O.y));}
      if(rb2){rb2.style.opacity='1';rb2.setAttribute('x1',String(RG.O.x));rb2.setAttribute('y1',String(RG.O.y));rb2.setAttribute('x2',String(RG.C1.x));rb2.setAttribute('y2',String(RG.C1.y));}
    }else{if(nO)nO.style.opacity='0';if(rb1)rb1.style.opacity='0';if(rb2)rb2.style.opacity='0';}
    if(p>60&&p<100){
      const c5p={x:RG.C5.x,y:RG.C5.y+65},c1t={x:RG.C1.x-32,y:RG.C1.y};
      attack.style.opacity=String((p-60)/30);
      attack.setAttribute('d',`M ${c5p.x} ${c5p.y} Q ${c5p.x+100} ${RG.C1.y-120} ${c1t.x} ${c1t.y}`);
    }else attack.style.opacity='0';
  },[progress,anomer]);

  const step=progress>=100?4:progress>60?3:progress>20?2:1;
  const progLabel=['Fischer Form','90° Rigid Tilt','Attack Phase','Cyclic Anomers'][step-1];
  const mechSteps=[
    {id:1,title:'01. Open Chain',       body:'C1 is a planar aldehyde group. Chiral centers C2–C5 determine the glucose identity.'},
    {id:2,title:'02. 90° Rigid Tilt',   body:'The molecule rotates. All groups on the <strong>Right</strong> side of Fischer move <strong>Down</strong> into the 2D plane.'},
    {id:3,title:'03. Nucleophilic Attack',body:'The C5-OH oxygen targets the C1 carbon. The planar CHO group becomes the anomeric center.'},
    {id:4,title:'04. Cyclic Anomers',   body:'The ring is locked. C1 is now chiral. Use the toggles to switch between α and β forms.'},
  ];

  return (
    <>
      <style>{`
        .bio-atom-c    { fill:#2d3a5a; stroke:#6366f1; stroke-width:2.5; }
        .bio-atom-o    { fill:#d64545; stroke:#991b1b; stroke-width:2.5; }
        .bio-atom-h    { fill:#0a2218; stroke:#34d399; stroke-width:2.5; }
        .bio-atom-func { fill:#8b5cf6; stroke:#5b21b6; stroke-width:2.5; }
        .bio-text-label{ font-size:20px; font-weight:800; fill:white; pointer-events:none; }
        .bio-bond      { stroke:rgba(99,102,241,0.4); stroke-width:6; stroke-linecap:round; transition:opacity 0.3s ease; }
        .bio-attack-arrow{ stroke:#fbbf24; stroke-width:4; stroke-dasharray:10; fill:none; }
        .pulse-anomer  { animation:bio-pulse 2s infinite; }
        @keyframes bio-pulse{ 0%,100%{filter:brightness(1);}50%{filter:brightness(1.5);} }
      `}</style>

      <div className="p-4 md:p-6" style={{background:'#0d1117',color:'#e2e8f0',minHeight:'80vh'}}>

        {/* Header */}
        <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Biomolecules <span style={{color:'#7c3aed'}}>Lab</span>
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{color:'#475569'}}>
              Interactive Glucose Explorer
            </p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{color:'#64748b'}}>D-Glucose</div>
        </div>

        <StepBar current={phase} onGo={setPhase}/>

        {/* ── PHASE 1 — always in DOM (display toggled) so SVG refs stay valid ── */}
        <div style={{display:phase==='cyclization'?'block':'none'}}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Canvas */}
              <div className="relative overflow-hidden flex items-center justify-center rounded-3xl"
                style={{minHeight:420,background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',border:'1px solid rgba(99,102,241,0.2)'}}>
                <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 600" style={{minHeight:420}}>
                  <defs>
                    <marker id="bio-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0,10 3.5,0 7" fill="#fbbf24"/>
                    </marker>
                  </defs>
                  <g ref={bondsRef}/><g ref={atomsRef}/>
                  <path ref={attackRef} className="bio-attack-arrow" d="" style={{opacity:0}} markerEnd="url(#bio-arrowhead)"/>
                </svg>
                {progress>=100&&(
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-50">
                    {(['alpha','beta'] as const).map(t=>(
                      <button key={t} onClick={()=>{setAnomer(t);setProgress(100);}}
                        className="text-white px-4 py-1.5 rounded-lg font-black text-[9px] tracking-widest uppercase transition-all"
                        style={{background:anomer===t?'#6366f1':'rgba(15,23,42,0.9)',border:`2px solid ${anomer===t?'#818cf8':'rgba(99,102,241,0.3)'}`,transform:anomer===t?'scale(1.05)':'scale(1)',backdropFilter:'blur(10px)'}}>
                        {t==='alpha'?'Alpha (α)':'Beta (β)'}
                      </button>
                    ))}
                  </div>
                )}
                {progress>=100&&(
                  <div className="absolute bottom-6 left-6 max-w-sm pointer-events-none">
                    <p className="text-base font-bold italic" style={{color:'#a5b4fc'}}>
                      {anomer==='alpha'?'α-Anomer: C1-OH is DOWN (trans to C6).':'β-Anomer: C1-OH is UP (cis to C6).'}
                    </p>
                  </div>
                )}
              </div>

              {/* Slider */}
              <div className="px-1">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{color:'#818cf8'}}>{progLabel}</span>
                  <span className="text-xl font-black text-white">{progress}%</span>
                </div>
                <input type="range" min={0} max={100} value={progress}
                  onChange={e=>setProgress(parseInt(e.target.value))}
                  className="w-full" style={{accentColor:'#6366f1',height:'8px',cursor:'grab'}}/>
              </div>

              {/* Next CTA — appears when ring is formed */}
              {progress>=100&&(
                <button onClick={()=>setPhase('dl-naming')}
                  className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{background:'rgba(99,102,241,0.18)',border:'1px solid rgba(129,140,248,0.4)',color:'#c4b5fd'}}>
                  Ring formed! Next: Learn D vs L Naming →
                </button>
              )}
            </div>

            {/* Mechanism sidebar */}
            <div className="lg:col-span-4 flex flex-col py-1 gap-5">
              <h2 className="text-xl font-black uppercase tracking-tighter" style={{color:'#e2e8f0'}}>Mechanism Logic</h2>
              <div className="space-y-5 flex-grow">
                {mechSteps.map(({id,title,body})=>(
                  <div key={id} style={{transition:'all 0.3s ease',opacity:step===id?1:0.35,transform:step===id?'translateX(4px)':'none'}}>
                    <h4 className="font-black text-[13px] uppercase tracking-widest mb-1" style={{color:step===id?'#818cf8':'#94a3b8'}}>{title}</h4>
                    <p className="text-base leading-snug" style={{color:'#94a3b8'}} dangerouslySetInnerHTML={{__html:body}}/>
                  </div>
                ))}
              </div>
              <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{color:'#6366f1'}}>Expert Tip</h5>
                <p className="text-white text-base font-bold leading-tight italic">&ldquo;Right is Down.<br/>C5-H stays Down.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PHASE 2 ── */}
        {phase==='dl-naming'&&<DLPhase onNext={()=>setPhase('epimers')} onBack={()=>setPhase('cyclization')}/>}

        {/* ── PHASE 3 ── */}
        {phase==='epimers'&&<EpimersPhase onBack={()=>setPhase('dl-naming')} onNext={()=>setPhase('hand-trick')}/>}

        {/* ── PHASE 4 ── */}
        {phase==='hand-trick'&&<HandTrickPhase onBack={()=>setPhase('epimers')}/>}
      </div>
    </>
  );
}
