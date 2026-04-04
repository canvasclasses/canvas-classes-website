'use client';

import React, { useState, useMemo } from 'react';
import { 
  Atom, 
  ChevronRight, 
  Info, 
  CircleDot,
  ArrowRightLeft,
  Settings2,
  BookOpen,
  FlaskConical,
  TriangleAlert,
  Zap,
  Swords,
  CheckCircle2,
  XCircle,
  Lightbulb
} from 'lucide-react';

// --- Extracted Data ---
const CONCEPT_GROUPS = [
  {
    id: 'g15',
    title: "Group 15 Hydrides (EN ↓ down group)",
    description: "As we move down the group, the central atom's electronegativity decreases and its orbitals become larger. The bond pairs are pulled further from the center, decreasing bond-pair repulsion and allowing the lone pair to crush the angle. Drago's rule collapses angles near 90° for P, As, and Sb.",
    molecules: [
      { id: 'nh3', formula: 'NH3', idealAngle: 109.5, angle: 107.0, c_en: 3.04, t_en: 2.20, lp: 1, c_label: 'N', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'ph3', formula: 'PH3', idealAngle: 109.5, angle: 93.8, c_en: 2.19, t_en: 2.20, lp: 1, c_label: 'P', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'ash3', formula: 'AsH3', idealAngle: 109.5, angle: 91.8, c_en: 2.18, t_en: 2.20, lp: 1, c_label: 'As', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'sbh3', formula: 'SbH3', idealAngle: 109.5, angle: 91.3, c_en: 2.05, t_en: 2.20, lp: 1, c_label: 'Sb', t_label: 'H', leftBond: 'single', rightBond: 'single' },
    ]
  },
  {
    id: 'g16',
    title: "Group 16 Hydrides (Drago's Rule)",
    description: "From H₂S downwards, the central atom is 3rd period or below and the terminal atom (H) isn't highly electronegative. Drago's Rule tells us hybridization is heavily suppressed here. Bonding occurs via nearly pure, unhybridized p-orbitals, anchoring angles near 90°.",
    molecules: [
      { id: 'h2o', formula: 'H2O', idealAngle: 109.5, angle: 104.5, c_en: 3.44, t_en: 2.20, lp: 2, c_label: 'O', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'h2s', formula: 'H2S', idealAngle: 109.5, angle: 92.0, c_en: 2.58, t_en: 2.20, lp: 2, c_label: 'S', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'h2se', formula: 'H2Se', idealAngle: 109.5, angle: 91.0, c_en: 2.55, t_en: 2.20, lp: 2, c_label: 'Se', t_label: 'H', leftBond: 'single', rightBond: 'single' },
      { id: 'h2te', formula: 'H2Te', idealAngle: 109.5, angle: 89.5, c_en: 2.10, t_en: 2.20, lp: 2, c_label: 'Te', t_label: 'H', leftBond: 'single', rightBond: 'single' },
    ]
  },
  {
    id: 'halides',
    title: "Phosphorus Trihalides (Bent's Rule)",
    description: "As the electronegativity of the terminal halogen increases (I -> Br -> Cl -> F), electron density is pulled further from the central Phosphorus. This reduces steric crowding at the center, allowing the lone pair to compress the angle more tightly. Notice the massive size of the Iodine atoms compared to Fluorine!",
    molecules: [
      { id: 'pi3', formula: 'PI3', idealAngle: 109.5, angle: 102.0, c_en: 2.19, t_en: 2.66, lp: 1, c_label: 'P', t_label: 'I', leftBond: 'single', rightBond: 'single' },
      { id: 'pbr3', formula: 'PBr3', idealAngle: 109.5, angle: 101.5, c_en: 2.19, t_en: 2.96, lp: 1, c_label: 'P', t_label: 'Br', leftBond: 'single', rightBond: 'single' },
      { id: 'pcl3', formula: 'PCl3', idealAngle: 109.5, angle: 100.0, c_en: 2.19, t_en: 3.16, lp: 1, c_label: 'P', t_label: 'Cl', leftBond: 'single', rightBond: 'single' },
      { id: 'pf3', formula: 'PF3', idealAngle: 109.5, angle: 97.8, c_en: 2.19, t_en: 3.98, lp: 1, c_label: 'P', t_label: 'F', leftBond: 'backbond', rightBond: 'backbond' },
    ]
  },
  {
    id: 'opx3',
    title: "Phosphorus Oxyhalides (pπ-dπ & Bent's)",
    description: "In OPX₃, highly electronegative halogens (like F) contract the central phosphorus d-orbitals. This actually strengthens the O=P pπ-dπ back-bond, pulling it closer and making it 'fatter'. This massive double bond exerts immense downward repulsion, violently crushing the X-P-X angle!",
    molecules: [
      { id: 'opbr3', formula: 'OPBr3', idealAngle: 109.5, angle: 108.0, c_en: 2.19, t_en: 2.96, lp: 0, c_label: 'P', t_label: 'Br', leftBond: 'single', rightBond: 'single', top_label: 'O', top_en: 3.44, topBond: 'double' },
      { id: 'opcl3', formula: 'OPCl3', idealAngle: 109.5, angle: 103.3, c_en: 2.19, t_en: 3.16, lp: 0, c_label: 'P', t_label: 'Cl', leftBond: 'single', rightBond: 'single', top_label: 'O', top_en: 3.44, topBond: 'double' },
      { id: 'opf3', formula: 'OPF3', idealAngle: 109.5, angle: 101.3, c_en: 2.19, t_en: 3.98, lp: 0, c_label: 'P', t_label: 'F', leftBond: 'single', rightBond: 'single', top_label: 'O', top_en: 3.44, topBond: 'double' },
    ]
  },
  {
    id: 'steric',
    title: "Nitrogen Oxides (Charge & Radicals)",
    description: "Observe the drastic impact of specific bond types and charges. NO₂⁺ has rigid double bonds forcing a 180° linear geometry. NO₂ is an odd-electron radical, repelling weakly. NO₂⁻ gains a full lone pair, crushing the angle down.",
    molecules: [
      { id: 'no2plus', formula: 'NO2+', idealAngle: 180.0, angle: 180.0, c_en: 3.04, t_en: 3.44, lp: 0, c_label: 'N', t_label: 'O', leftBond: 'double', rightBond: 'double', charge: '+' },
      { id: 'no2', formula: 'NO2', idealAngle: 120.0, angle: 132.0, c_en: 3.04, t_en: 3.44, lp: 0.5, c_label: 'N', t_label: 'O', leftBond: 'double', rightBond: 'single', charge: null }, 
      { id: 'no2minus', formula: 'NO2-', idealAngle: 120.0, angle: 115.0, c_en: 3.04, t_en: 3.44, lp: 1, c_label: 'N', t_label: 'O', leftBond: 'double', rightBond: 'coordinate', charge: '-' },
    ]
  }
];

const CHALLENGES = [
  {
    id: 'ph3_pf3',
    title: "The Fluorine Anomaly",
    question: "Bent's Rule dictates that highly electronegative Fluorine should pull electron density away, decreasing the bond angle. Based on this logic vs actual reality, which molecule has a LARGER bond angle?",
    molA: { id: 'ph3', formula: 'PH3', idealAngle: 109.5, angle: 93.8, c_en: 2.19, t_en: 2.20, lp: 1, c_label: 'P', t_label: 'H', leftBond: 'single', rightBond: 'single' },
    molB: { id: 'pf3', formula: 'PF3', idealAngle: 109.5, angle: 97.8, c_en: 2.19, t_en: 3.98, lp: 1, c_label: 'P', t_label: 'F', leftBond: 'backbond', rightBond: 'backbond' },
    correct: 'B',
    explanation: "Surprise! Fluorine's full 2p-orbitals back-bond into Phosphorus's empty 3d-orbitals (pπ-dπ). This creates partial double bonds, increasing electron density and forcing the angle wider than PH₃."
  },
  {
    id: 'h2o_cl2o',
    title: "The Chlorine Squeeze",
    question: "Both molecules have 2 lone pairs. Oxygen is highly electronegative, but Chlorine is massive. Which molecule is forced into a wider angle?",
    molA: { id: 'h2o', formula: 'H2O', idealAngle: 109.5, angle: 104.5, c_en: 3.44, t_en: 2.20, lp: 2, c_label: 'O', t_label: 'H', leftBond: 'single', rightBond: 'single' },
    molB: { id: 'cl2o', formula: 'Cl2O', idealAngle: 109.5, angle: 111.0, c_en: 3.44, t_en: 3.16, lp: 2, c_label: 'O', t_label: 'Cl', leftBond: 'backbond', rightBond: 'backbond' },
    correct: 'B',
    explanation: "Cl₂O is much larger (111°)! Oxygen donates its lone pairs into Chlorine's empty 3d-orbitals. This back-bonding, combined with the massive steric bulk of Chlorine atoms clashing together (notice their size!), forces the angle wide open."
  },
  {
    id: 'ether_siloxane',
    title: "Ether vs. Siloxane",
    question: "Carbon and Silicon belong to the same group. Which of these oxygen-centered molecules has a wider angle?",
    molA: { id: 'ether', formula: 'O(CH3)2', idealAngle: 109.5, angle: 111.0, c_en: 3.44, t_en: 2.55, lp: 2, c_label: 'O', t_label: 'CH3', leftBond: 'single', rightBond: 'single' },
    molB: { id: 'siloxane', formula: 'O(SiH3)2', idealAngle: 109.5, angle: 144.0, c_en: 3.44, t_en: 1.90, lp: 2, c_label: 'O', t_label: 'SiH3', leftBond: 'backbond', rightBond: 'backbond' },
    correct: 'B',
    explanation: "An extreme anomaly! Silicon has empty 3d-orbitals, allowing massive pπ-dπ back-bonding from Oxygen. Carbon (in period 2) has no d-orbitals, so dimethyl ether stays near tetrahedral (111°), while disiloxane rips open to a massive 144°."
  }
];

// --- Insight Engine ---
const getInsight = (tab: string, molId: string) => {
  if (tab === 'sandbox') return { title: "The Ghost Scaffold", text: "Notice the faint dashed lines? That's the 'Ghost Scaffold' showing the mathematically perfect, ideal geometry (109.5° for 4 domains). Watch how changing the electronegativity and adding lone pairs physically warps the molecule away from perfection!" };
  if (tab === 'challenges') return { title: "Trust the Visuals", text: "Look closely at the lone pair orbitals and the glowing electron clouds. The answers to these anomalies are physically rendered right in front of you. Pay special attention to the dashed pπ-dπ back-bonds!" };
  
  if (['nh3', 'h2o'].includes(molId)) return { title: "sp³ Hybridized", text: "The central atom perfectly mixes its s and p orbitals to create four identical sp³ hybrid orbitals. They want to sit exactly at 109.5° (the ghost outline!), but the bulky lone pair(s) squish them slightly together."};
  if (['ph3', 'ash3', 'sbh3', 'h2s', 'h2se', 'h2te'].includes(molId)) return { title: "Pure p-Orbitals (Drago's Rule)", text: "Look at the lone pair—it morphed into a perfectly round circle! Because the central atom is large, it doesn't bother hybridizing. It uses pure p-orbitals (which are 90° apart) for the bonds. The lone pair just sits in a perfectly round, stereochemically inactive s-orbital."};
  if (['pi3', 'pbr3', 'pcl3'].includes(molId)) return { title: "Bent's Rule in Action", text: "Notice the bond thickness? More electronegative halogens pull the electron density away, increasing the p-character of the bond. This relieves crowding at the center, letting the lone pair crush the angle even further."};
  if (['pf3', 'opbr3', 'opcl3', 'opf3'].includes(molId)) return { title: "pπ-dπ Back-bonding", text: "The textbook rules are broken! Empty d-orbitals on the central atom pull in lone pairs from the halogens, creating partial double bonds (the dashed lines). This massive spike in electron density forces the angle violently wider."};
  if (['no2plus', 'no2', 'no2minus'].includes(molId)) return { title: "Radicals & Steric Charge", text: "NO₂⁺ is sp hybridized (180° ideal). NO₂ is an odd-electron radical—notice the tiny single-electron lobe! It pushes the 120° ideal angle open to 132°. NO₂⁻ is sp² hybridized, and its full lone pair crushes the 120° ideal down to 115°."};
  
  return { title: "Molecular Mechanics", text: "Observe how the physical forces of electronegativity and steric repulsion dictate the final geometry of the molecule."};
};

const getBulkRadius = (label: string, isCentral = false) => {
  if (!label) return isCentral ? 36 : 22;
  const clean = label.replace(/[^a-zA-Z]/g, '');
  let sizeLevel = 1; 
  
  if (clean === 'H') sizeLevel = 0; 
  else if (['F', 'O', 'N', 'C'].includes(clean)) sizeLevel = 1; 
  else if (['Cl', 'S', 'P', 'Si', 'CH'].includes(clean)) sizeLevel = 2; 
  else if (['Br', 'Se', 'As', 'SiH'].includes(clean)) sizeLevel = 3; 
  else if (['I', 'Te', 'Sb'].includes(clean)) sizeLevel = 4; 
  
  return isCentral ? 30 + (sizeLevel * 3) : 18 + (sizeLevel * 4);
};

const getTerminalTextClass = (radius: number) => {
  if (radius <= 18) return "text-sm";
  if (radius <= 22) return "text-xl";
  if (radius <= 26) return "text-2xl";
  return "text-3xl";
};

const getCentralTextClass = (radius: number) => {
  if (radius <= 33) return "text-2xl";
  if (radius <= 36) return "text-3xl";
  return "text-4xl";
};

// --- Custom SVG Formula Formatter ---
const formatSvgLabel = (label: string) => {
  if (!label) return null;
  return label.split(/(\d+|\+|-)/).map((part: string, i: number) => {
    if (/\d+/.test(part)) return <tspan key={i} baselineShift="sub" fontSize="0.75em">{part}</tspan>;
    if (part === '+' || part === '-') return <tspan key={i} baselineShift="super" fontSize="0.75em">{part}</tspan>;
    return <tspan key={i}>{part}</tspan>;
  });
};

interface MoleculeData {
  id: string;
  formula: string;
  idealAngle: number;
  angle: number;
  c_en: number;
  t_en: number;
  lp: number;
  c_label: string;
  t_label: string;
  leftBond: string;
  rightBond: string;
  charge?: string | null;
  top_label?: string;
  top_en?: number;
  topBond?: string;
}

// --- Reusable Visualizer Component ---
const MoleculeVisualizer = ({ data, hideAngle = false, idSuffix = "main" }: { data: MoleculeData; hideAngle?: boolean; idSuffix?: string }) => {
  const cx = 200;
  const cy = 145; 
  const bondLen = 120; 
  
  const cRadius = getBulkRadius(data.c_label, true);
  const tRadius = getBulkRadius(data.t_label, false);
  const topRadius = data.top_label ? getBulkRadius(data.top_label, false) : 0;

  const halfRad = (data.angle / 2) * (Math.PI / 180);
  
  const dx = Math.sin(halfRad) * bondLen;
  const dy = Math.cos(halfRad) * bondLen;
  const leftX = cx - dx;
  const leftY = cy + dy;
  const rightX = cx + dx;
  const rightY = cy + dy;

  const arcRadius = 54;
  const arcDx = Math.sin(halfRad) * arcRadius;
  const arcDy = Math.cos(halfRad) * arcRadius;

  // --- Ghost Scaffold Physics ---
  const idealAngle = data.idealAngle || 109.5;
  const idealHalfRad = (idealAngle / 2) * (Math.PI / 180);
  const idX = Math.sin(idealHalfRad) * bondLen;
  const idY = Math.cos(idealHalfRad) * bondLen;

  // --- Orbital Morphing Physics ---
  let morphFactor = 0;
  if (idealAngle === 109.5 && data.angle <= 109.5) {
    morphFactor = Math.min(1, (109.5 - data.angle) / 19.5);
  }

  const lp1Rx = 22 + (morphFactor * 5); 
  const lp1Ry = 36 - (morphFactor * 9); 
  const lp1CyOffset = cRadius + 20 - (morphFactor * 10); 

  const lp2Rx = 19 + (morphFactor * 7); 
  const lp2Ry = 34 - (morphFactor * 8); 
  const lp2CyOffset = cRadius + 20 - (morphFactor * 10);

  // Vectors
  const lVx = leftX - cx;
  const lVy = leftY - cy;
  const lUx = lVx / bondLen;
  const lUy = lVy / bondLen;
  const lPx = -lUy; 
  const lPy = lUx;  

  const rVx = rightX - cx;
  const rVy = rightY - cy;
  const rUx = rVx / bondLen;
  const rUy = rVy / bondLen;
  const rPx = -rUy;
  const rPy = rUx;

  const topX = cx;
  const topY = cy - bondLen;
  const topUx = 0;
  const topUy = -1;
  const topPx = 1;
  const topPy = 0;

  // Tug of war
  const enDiff = data.t_en - data.c_en;
  const minT = (cRadius + 8) / bondLen; 
  const maxT = 1 - ((tRadius + 8) / bondLen); 
  const bondT = Math.max(minT, Math.min(maxT, 0.5 + (enDiff * 0.12)));

  const lEx = cx + lVx * bondT;
  const lEy = cy + lVy * bondT;
  const rEx = cx + rVx * bondT;
  const rEy = cy + rVy * bondT;

  const repulsionFactor = 1 - ((bondT - minT) / (maxT - minT)); 
  const cloudHue = 60 - (repulsionFactor * 60); 
  const cloudColor = `hsla(${cloudHue}, 100%, 50%, ${0.2 + repulsionFactor * 0.4})`;

  let topBondT = 0;
  let topEx = 0;
  let topEy = 0;
  let topRepulsionFactor = 0;
  let topCloudColor = '';

  if (data.top_label) {
    const topEnDiff = (data.top_en ?? 0) - data.c_en;
    const topMinT = (cRadius + 8) / bondLen;
    const topMaxT = 1 - ((topRadius + 8) / bondLen);
    topBondT = Math.max(topMinT, Math.min(topMaxT, 0.5 + (topEnDiff * 0.12)));
    topEx = cx + topUx * bondLen * topBondT;
    topEy = cy + topUy * bondLen * topBondT;
    topRepulsionFactor = 1 - ((topBondT - topMinT) / (topMaxT - topMinT));
    const topCloudHue = 60 - (topRepulsionFactor * 60);
    topCloudColor = `hsla(${topCloudHue}, 100%, 50%, ${0.2 + topRepulsionFactor * 0.4})`;
  }

  const renderBond = (startX: number, startY: number, endX: number, endY: number, type: string, ux: number, uy: number, px: number, py: number, targetRadius: number) => {
    const baseStroke = 7 - (repulsionFactor * 2); 

    if (type === 'double') {
      return (
        <g className="transition-all duration-300">
          <line x1={startX + px*6} y1={startY + py*6} x2={endX + px*6} y2={endY + py*6} stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
          <line x1={startX - px*6} y1={startY - py*6} x2={endX - px*6} y2={endY - py*6} stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    } else if (type === 'coordinate') {
      const tipDist = bondLen - targetRadius - 6; 
      const tipX = startX + ux * tipDist;
      const tipY = startY + uy * tipDist;
      const baseX = startX + ux * (tipDist - 14);
      const baseY = startY + uy * (tipDist - 14);
      return (
        <g className="transition-all duration-300">
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <polygon points={`${tipX},${tipY} ${baseX + px*8.5},${baseY + py*8.5} ${baseX - px*8.5},${baseY - py*8.5}`} fill="#64748b" />
        </g>
      );
    } else if (type === 'backbond') {
      return (
        <g className="transition-all duration-300">
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <line x1={startX + px*7} y1={startY + py*7} x2={endX + px*7} y2={endY + py*7} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" opacity="0.8" />
        </g>
      );
    }
    return <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#64748b" strokeWidth={baseStroke} strokeLinecap="round" className="transition-all duration-300" />;
  };

  const renderElectrons = (type: string, ex: number, ey: number, px: number, py: number, ux: number, uy: number) => {
    const radius = 3;
    if (type === 'double') {
      return (
        <>
          <circle cx={ex + px*6 + ux*5} cy={ey + py*6 + uy*5} r={radius} fill="#ffffff" />
          <circle cx={ex + px*6 - ux*5} cy={ey + py*6 - uy*5} r={radius} fill="#ffffff" />
          <circle cx={ex - px*6 + ux*5} cy={ey - py*6 + uy*5} r={radius} fill="#ffffff" />
          <circle cx={ex - px*6 - ux*5} cy={ey - py*6 - uy*5} r={radius} fill="#ffffff" />
        </>
      );
    } else if (type === 'backbond') {
      return (
        <>
          <circle cx={ex + px*2.5} cy={ey + py*2.5} r={radius} fill="#ffffff" />
          <circle cx={ex - px*2.5} cy={ey - py*2.5} r={radius} fill="#ffffff" />
          <circle cx={ex + px*7 + ux*3.5} cy={ey + py*7 + uy*3.5} r={1.8} fill="#fde047" opacity="0.9" filter={`url(#glow-${idSuffix})`} />
          <circle cx={ex + px*7 - ux*3.5} cy={ey + py*7 - uy*3.5} r={1.8} fill="#fde047" opacity="0.9" filter={`url(#glow-${idSuffix})`} />
        </>
      );
    }
    return (
      <>
        <circle cx={ex + px*4} cy={ey + py*4} r={radius} fill="#ffffff" />
        <circle cx={ex - px*4} cy={ey - py*4} r={radius} fill="#ffffff" />
      </>
    );
  };

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full max-w-xl drop-shadow-2xl mx-auto">
      <defs>
        <radialGradient id={`centerGrad-${idSuffix}`}><stop offset="10%" stopColor="#3b82f6" /><stop offset="95%" stopColor="#1e40af" /></radialGradient>
        <radialGradient id={`termGrad-${idSuffix}`}><stop offset="10%" stopColor="#10b981" /><stop offset="95%" stopColor="#065f46" /></radialGradient>
        <radialGradient id={`topGrad-${idSuffix}`}><stop offset="10%" stopColor="#ef4444" /><stop offset="95%" stopColor="#991b1b" /></radialGradient>
        <filter id={`glow-${idSuffix}`}><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id={`cloudGlow-${idSuffix}`}><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Ghost Scaffold */}
      <g className="opacity-25 transition-all duration-500">
        <line x1={cx} y1={cy} x2={cx - idX} y2={cy + idY} stroke="white" strokeWidth="2.5" strokeDasharray="4 4" />
        <line x1={cx} y1={cy} x2={cx + idX} y2={cy + idY} stroke="white" strokeWidth="2.5" strokeDasharray="4 4" />
        {idealAngle < 180 && (
          <path 
            d={`M ${cx - Math.sin(idealHalfRad)*40} ${cy + Math.cos(idealHalfRad)*40} A 40 40 0 0 0 ${cx + Math.sin(idealHalfRad)*40} ${cy + Math.cos(idealHalfRad)*40}`}
            fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="2 3"
          />
        )}
      </g>

      {/* Orbitals */}
      {data.lp === 0.5 && (
        <g className="animate-pulse transition-all duration-500">
          <ellipse cx={cx} cy={cy-cRadius-18} rx="17" ry="29" fill="rgba(245, 158, 11, 0.12)" />
          <circle cx={cx} cy={cy-cRadius-18} r="5.5" fill="#fde047" filter={`url(#glow-${idSuffix})`} />
        </g>
      )}
      {data.lp === 1 && (
        <g className="animate-pulse transition-all duration-500">
          <ellipse cx={cx} cy={cy-lp1CyOffset} rx={lp1Rx} ry={lp1Ry} fill="rgba(245, 158, 11, 0.2)" className="transition-all duration-500" />
          <circle cx={cx-7} cy={cy-lp1CyOffset} r="5" fill="#f59e0b" className="transition-all duration-500" />
          <circle cx={cx+7} cy={cy-lp1CyOffset} r="5" fill="#f59e0b" className="transition-all duration-500" />
        </g>
      )}
      {data.lp === 2 && (
        <>
          <g className="animate-pulse transition-all duration-500" transform={`rotate(-40, ${cx}, ${cy})`}>
            <ellipse cx={cx} cy={cy-lp2CyOffset} rx={lp2Rx} ry={lp2Ry} fill="rgba(245, 158, 11, 0.2)" className="transition-all duration-500" />
            <circle cx={cx-6} cy={cy-lp2CyOffset} r="4" fill="#f59e0b" className="transition-all duration-500" />
            <circle cx={cx+6} cy={cy-lp2CyOffset} r="4" fill="#f59e0b" className="transition-all duration-500" />
          </g>
          <g className="animate-pulse transition-all duration-500" transform={`rotate(40, ${cx}, ${cy})`}>
            <ellipse cx={cx} cy={cy-lp2CyOffset} rx={lp2Rx} ry={lp2Ry} fill="rgba(245, 158, 11, 0.2)" className="transition-all duration-500" />
            <circle cx={cx-6} cy={cy-lp2CyOffset} r="4" fill="#f59e0b" className="transition-all duration-500" />
            <circle cx={cx+6} cy={cy-lp2CyOffset} r="4" fill="#f59e0b" className="transition-all duration-500" />
          </g>
        </>
      )}

      {/* Bonds */}
      {data.top_label && renderBond(cx, cy, topX, topY, data.topBond ?? 'single', topUx, topUy, topPx, topPy, topRadius)}
      {renderBond(cx, cy, leftX, leftY, data.leftBond, lUx, lUy, lPx, lPy, tRadius)}
      {renderBond(cx, cy, rightX, rightY, data.rightBond, rUx, rUy, rPx, rPy, tRadius)}

      <g className="bond-electrons">
        {data.top_label && (
          <>
            <circle cx={topEx} cy={topEy} r={12 + topRepulsionFactor * 17 + (data.topBond === 'double' ? 7 : 0)} fill={topCloudColor} filter={`url(#cloudGlow-${idSuffix})`} className="transition-all duration-300" />
            {renderElectrons(data.topBond ?? 'single', topEx, topEy, topPx, topPy, topUx, topUy)}
          </>
        )}
      
        <circle cx={lEx} cy={lEy} r={12 + repulsionFactor * 17 + (data.leftBond === 'double' ? 7 : 0)} fill={cloudColor} filter={`url(#cloudGlow-${idSuffix})`} className="transition-all duration-300" />
        <circle cx={rEx} cy={rEy} r={12 + repulsionFactor * 17 + (data.rightBond === 'double' ? 7 : 0)} fill={cloudColor} filter={`url(#cloudGlow-${idSuffix})`} className="transition-all duration-300" />
        
        {renderElectrons(data.leftBond, lEx, lEy, lPx, lPy, lUx, lUy)}
        {renderElectrons(data.rightBond, rEx, rEy, rPx, rPy, rUx, rUy)}
      </g>

      {/* Actual Arc */}
      {(!hideAngle && data.angle < 180) && (
        <path 
          d={`M ${cx - arcDx} ${cy + arcDy} A ${arcRadius} ${arcRadius} 0 0 0 ${cx + arcDx} ${cy + arcDy}`}
          fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3"
        />
      )}

      {/* Atoms */}
      {data.top_label && (
        <circle cx={topX} cy={topY} r={topRadius} fill={`url(#topGrad-${idSuffix})`} filter={`url(#glow-${idSuffix})`} className="transition-all duration-500" />
      )}
      <circle cx={cx} cy={cy} r={cRadius} fill={`url(#centerGrad-${idSuffix})`} filter={`url(#glow-${idSuffix})`} className="transition-all duration-500" />
      <circle cx={leftX} cy={leftY} r={tRadius} fill={`url(#termGrad-${idSuffix})`} className="transition-all duration-500" />
      <circle cx={rightX} cy={rightY} r={tRadius} fill={`url(#termGrad-${idSuffix})`} className="transition-all duration-500" />
      
      {/* Labels */}
      {data.top_label && (
        <text x={topX} y={topY} textAnchor="middle" dy=".3em" fill="white" className={`font-bold pointer-events-none ${getTerminalTextClass(topRadius)}`}>
          {formatSvgLabel(data.top_label)}
        </text>
      )}
      <text x={cx} y={cy} textAnchor="middle" dy=".3em" fill="white" className={`font-bold pointer-events-none ${getCentralTextClass(cRadius)}`}>
        {formatSvgLabel(data.c_label)}
      </text>
      <text x={leftX} y={leftY} textAnchor="middle" dy=".3em" fill="white" className={`font-bold pointer-events-none ${getTerminalTextClass(tRadius)}`}>
        {formatSvgLabel(data.t_label)}
      </text>
      <text x={rightX} y={rightY} textAnchor="middle" dy=".3em" fill="white" className={`font-bold pointer-events-none ${getTerminalTextClass(tRadius)}`}>
        {formatSvgLabel(data.t_label)}
      </text>
      
      {/* Angle Readout */}
      {!hideAngle && (
        <text x={cx} y={cy + arcDy + 55} textAnchor="middle" className="text-2xl font-bold fill-slate-100 drop-shadow-md">
          {data.angle.toFixed(1)}°
        </text>
      )}
      {hideAngle && (
        <text x={cx} y={cy + arcDy + 55} textAnchor="middle" className="text-2xl font-black fill-slate-500 tracking-widest drop-shadow-md">
          ???
        </text>
      )}

      {/* Ghost Angle Readout */}
      {!hideAngle && data.idealAngle && (
        <text x={cx} y={cy + arcDy + 75} textAnchor="middle" className="text-xs font-bold fill-slate-400/90 tracking-widest uppercase drop-shadow-sm">
          Ideal {data.idealAngle}°
        </text>
      )}
    </svg>
  );
};

// --- Main Application ---
const App = () => {
  const [activeTab, setActiveTab] = useState('trends'); 
  const [showInsight, setShowInsight] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  
  const [customCEN, setCustomCEN] = useState(3.0);
  const [customTEN, setCustomTEN] = useState(2.1);
  const [customLP, setCustomLP] = useState(1);

  const [activeGroupId, setActiveGroupId] = useState(CONCEPT_GROUPS[0].id);
  const [activeMoleculeId, setActiveMoleculeId] = useState(CONCEPT_GROUPS[0].molecules[0].id);

  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [challengeGuess, setChallengeGuess] = useState<'A' | 'B' | null>(null); 
  const activeChallenge = CHALLENGES[activeChallengeIdx];

  const activeGroup = CONCEPT_GROUPS.find(g => g.id === activeGroupId)!;
  const activeMolecule = activeGroup.molecules.find(m => m.id === activeMoleculeId)!;

  const displayData = useMemo(() => {
    if (activeTab === 'trends') {
      return {
        id: activeMolecule.id,
        formula: activeMolecule.formula,
        idealAngle: activeMolecule.idealAngle,
        angle: activeMolecule.angle,
        c_label: activeMolecule.c_label,
        t_label: activeMolecule.t_label,
        lp: activeMolecule.lp,
        c_en: activeMolecule.c_en,
        t_en: activeMolecule.t_en,
        leftBond: activeMolecule.leftBond || 'single',
        rightBond: activeMolecule.rightBond || 'single',
        charge: ('charge' in activeMolecule ? (activeMolecule as unknown as Record<string, unknown>).charge : null) || null,
        top_label: ('top_label' in activeMolecule ? (activeMolecule as unknown as Record<string, unknown>).top_label : null) || null,
        top_en: ('top_en' in activeMolecule ? (activeMolecule as unknown as Record<string, unknown>).top_en : null) || null,
        topBond: ('topBond' in activeMolecule ? (activeMolecule as unknown as Record<string, unknown>).topBond : null) || null,
      };
    } else {
      let base = 109.5; 
      base -= (customLP * 5); 
      const enDiff = customTEN - customCEN;
      base -= (enDiff * 2.5);
      if (customCEN < 2.5 && customLP > 0) base = 90 + (customCEN * 2);
      
      return {
        id: 'sandbox',
        formula: 'Custom',
        idealAngle: 109.5,
        angle: Math.max(85, Math.min(180, base)),
        c_label: 'C',
        t_label: 'T',
        lp: customLP,
        c_en: customCEN,
        t_en: customTEN,
        leftBond: 'single',
        rightBond: 'single',
        charge: null,
        top_label: null,
        top_en: null,
        topBond: null,
      };
    }
  }, [activeTab, activeMolecule, customCEN, customTEN, customLP]);

  const insightData = getInsight(activeTab, displayData.id);

  const formatFormula = (formula: string) => {
    return formula.split(/(\d+|\+|-)/).map((part: string, i: number) => {
      if (/\d+/.test(part)) return <sub key={i} className="font-sans text-[0.7em] relative top-1 opacity-90">{part}</sub>;
      if (part === '+' || part === '-') return <sup key={i} className="font-sans text-[0.7em] relative -top-1 opacity-90">{part}</sup>;
      return part;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      <header className="max-w-7xl mx-auto mb-6 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-900/20 text-indigo-300 text-[11px] font-bold tracking-widest uppercase mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
          INTERACTIVE SIMULATION
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Bond Angle <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Simulator</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed mb-5">
          Explore how electronegativity, lone pairs, and orbital hybridization shape bond angles. Watch VSEPR theory, Bent's Rule, and Drago's Rule come alive with interactive molecular visualizations.
        </p>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-semibold">
            Group 15 & 16 Hydrides
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-semibold">
            Phosphorus Halides
          </div>
          <div className="px-4 py-2 rounded-full bg-rose-900/30 border border-rose-700/50 text-rose-300 text-sm font-semibold">
            Anomaly Challenges
          </div>
          <button 
            onClick={() => setShowTheory(!showTheory)}
            className="px-4 py-2 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-sm font-semibold hover:bg-blue-900/50 transition-all"
          >
            {showTheory ? "Hide Theory Cards" : "Show Theory Cards"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-grow">
        
        {/* Left Column: Visualization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="relative bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-purple-900/40 rounded-[32px] shadow-2xl border border-indigo-500/20 overflow-hidden min-h-[400px] flex items-center justify-center p-8">
            
            {/* The Curiosity Button */}
            {activeTab === 'trends' && (
              <div className="absolute top-6 right-6 z-30 flex flex-col items-end">
                <button 
                  onClick={() => setShowInsight(!showInsight)} 
                  className={`bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md border border-indigo-400 text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] ${showInsight ? 'ring-2 ring-white/50' : ''}`}
                >
                  <Lightbulb size={18} className={showInsight ? "fill-white" : ""} /> 
                  {showInsight ? "Close Insight" : "Reveal Hybridization"}
                </button>

                {showInsight && (
                  <div className="mt-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-indigo-500/50 p-6 rounded-2xl shadow-2xl animate-fade-in text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <h4 className="text-indigo-300 font-black text-xl mb-3">{insightData.title}</h4>
                    <p className="text-slate-200 text-base leading-relaxed">{insightData.text}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'challenges' ? (
              <div className="w-full flex flex-col gap-6 items-center justify-center py-2">
                
                {/* Molecule A Row - Horizontal Layout */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:pr-6">
                  <div className="flex-1 flex flex-col items-center w-full relative">
                    <h3 className="text-2xl font-bold text-slate-200 z-10 mb-2 tracking-wide drop-shadow-lg">
                      {formatFormula(activeChallenge.molA.formula)}
                    </h3>
                    <div className="w-full max-w-[220px] lg:max-w-[300px] transform scale-110 lg:scale-[1.4] origin-center transition-all duration-500 py-6">
                      <MoleculeVisualizer data={activeChallenge.molA} hideAngle={!challengeGuess} idSuffix="molA" />
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center">
                    <button 
                      disabled={challengeGuess !== null}
                      onClick={() => setChallengeGuess('A')}
                      className={`px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-xl border-2 min-w-[180px] ${
                        challengeGuess === 'A' 
                          ? (activeChallenge.correct === 'A' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white')
                          : challengeGuess !== null 
                            ? 'bg-slate-800 border-slate-700 text-slate-600 opacity-50'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-indigo-400 hover:text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                      }`}
                    >
                      Select {formatFormula(activeChallenge.molA.formula)}
                    </button>
                  </div>
                </div>

                {/* VS Divider - Centered */}
                <div className="w-full flex items-center justify-center relative my-4">
                  <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-50"></div>
                  <span className="relative bg-slate-900 px-6 py-1.5 rounded-full text-sm font-black text-slate-500 tracking-widest border border-slate-700/50 shadow-inner">
                    VS
                  </span>
                </div>
                
                {/* Molecule B Row - Horizontal Layout */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:pr-6">
                  <div className="flex-1 flex flex-col items-center w-full relative">
                    <h3 className="text-2xl font-bold text-slate-200 z-10 mb-2 tracking-wide drop-shadow-lg">
                      {formatFormula(activeChallenge.molB.formula)}
                    </h3>
                    <div className="w-full max-w-[220px] lg:max-w-[300px] transform scale-110 lg:scale-[1.4] origin-center transition-all duration-500 py-6">
                      <MoleculeVisualizer data={activeChallenge.molB} hideAngle={!challengeGuess} idSuffix="molB" />
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center">
                    <button 
                      disabled={challengeGuess !== null}
                      onClick={() => setChallengeGuess('B')}
                      className={`px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-xl border-2 min-w-[180px] ${
                        challengeGuess === 'B' 
                          ? (activeChallenge.correct === 'B' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white')
                          : challengeGuess !== null 
                            ? 'bg-slate-800 border-slate-700 text-slate-600 opacity-50'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-indigo-400 hover:text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                      }`}
                    >
                      Select {formatFormula(activeChallenge.molB.formula)}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <MoleculeVisualizer data={displayData as MoleculeData} />
            )}
          </div>

          {/* Dynamic Observation Area (Hidden for Challenges) */}
          {activeTab !== 'challenges' && (
            <div className="px-2">
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">
                      {activeTab === 'trends' ? activeGroup.title : "Theoretical Trend"}
                    </h3>
                    {activeTab === 'fundamentals' && (
                      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-amber-900/40 text-amber-400 px-3 py-1 rounded-full border border-amber-700/50 shrink-0 whitespace-nowrap">
                        <TriangleAlert size={14} /> Simulated Math
                      </span>
                    )}
                  </div>
                </div>
                
                {activeTab === 'trends' ? (
                  <p className="text-slate-300 text-lg leading-relaxed mt-2">{activeGroup.description}</p>
                ) : (
                  <div className="mt-2 space-y-4">
                    {displayData.lp === 0.5 && (
                      <div className="p-4 bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl flex gap-3 items-start">
                        <Zap className="text-amber-400 shrink-0 mt-1" size={20} />
                        <p className="text-amber-100/90 text-lg leading-relaxed">
                          <strong>Odd-Electron Radical:</strong> Notice the single electron on the central atom! An unpaired electron exerts significantly <em>less</em> repulsive force than a full lone pair. This is why the bond angle doesn't get crushed as severely as it would with a full pair.
                        </p>
                      </div>
                    )}
                    <p className="text-slate-300 text-lg leading-relaxed">
                      <strong>Keep an eye on the glowing electron clouds!</strong> Right now, they are pulled closer to the <strong className="text-white">{displayData.t_en > displayData.c_en ? "Terminal" : "Central"} atom</strong>. 
                      {displayData.t_en > displayData.c_en 
                        ? " Since the electrons are pulled further away from the center, there's more room to breathe. This gives the lone pair(s) plenty of space to push the bonds closer together, making the angle smaller." 
                        : " Because the electrons are pulled tight against the center, it gets super crowded (notice the red glow!). They repel each other strongly, forcing the bonds to spread apart to make room."}
                    </p>
                  </div>
                )}
              </>
            </div>
          )}

          {showTheory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-indigo-900/80 border border-indigo-700 p-6 rounded-3xl text-white shadow-lg backdrop-blur">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-300">
                  <CircleDot size={24} /> Bent's Rule
                </h3>
                <p className="text-indigo-100 text-base leading-relaxed">
                  More electronegative substituents prefer orbitals with <strong className="text-white">less s-character</strong> (more p-character). Since higher s-character increases bond angles, adding electronegative atoms (like Fluorine) naturally decreases the bond angle.
                </p>
              </div>
              <div className="bg-emerald-900/80 border border-emerald-700 p-6 rounded-3xl text-white shadow-lg backdrop-blur">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-300">
                  <ArrowRightLeft size={24} /> VSEPR & Drago
                </h3>
                <p className="text-emerald-100 text-base leading-relaxed">
                  Lone pairs repel more strongly than bond pairs. However, if the central atom is heavy (Period 3+) and terminal atoms aren't highly electronegative, <strong>Drago's Rule</strong> kicks in: hybridization is ignored, and bonds form via 90° p-orbitals.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="flex bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-lg gap-2">
            <button 
              onClick={() => { setActiveTab('fundamentals'); setShowInsight(false); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'fundamentals' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <Settings2 size={20} /> <span className="font-bold text-sm tracking-wide">Fundamentals</span>
            </button>
            <button 
              onClick={() => { setActiveTab('trends'); setShowInsight(false); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'trends' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <FlaskConical size={20} /> <span className="font-bold text-sm tracking-wide">Periodic Trends</span>
            </button>
            <button 
              onClick={() => { setActiveTab('challenges'); setChallengeGuess(null); setShowInsight(false); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'challenges' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <Zap size={20} /> <span className="font-bold text-sm tracking-wide">Anomalies Quiz</span>
            </button>
          </div>

          {activeTab === 'challenges' ? (
            <section className="bg-slate-800/80 backdrop-blur p-6 rounded-3xl shadow-xl border border-slate-700 flex-grow flex flex-col gap-5">
              
              {/* Ultra-Compact Header (Removed useless text & huge padding) */}
              <div className="flex items-center gap-4 border-b border-slate-700 pb-4 shrink-0">
                 <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-500/50 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                   <Swords className="text-indigo-400 w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-white tracking-wide">Interactive Challenges</h2>
              </div>

              {/* Tightly Packed Challenge Navigation Menu */}
              <div className="flex-none space-y-2">
                {CHALLENGES.map((chal, idx) => {
                  const isActive = activeChallengeIdx === idx;
                  return (
                    <button
                      key={chal.id}
                      onClick={() => {
                        setActiveChallengeIdx(idx);
                        setChallengeGuess(null); 
                      }}
                      className={`w-full text-left py-2.5 px-4 rounded-xl transition-all border outline-none group ${
                        isActive
                          ? 'bg-indigo-900/40 border-indigo-500/50 shadow-md'
                          : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-[10px] font-bold tracking-widest uppercase block mb-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                            Challenge {idx + 1}
                          </span>
                          <span className={`text-sm font-bold block ${isActive ? 'text-blue-100' : 'text-slate-300 group-hover:text-white'}`}>
                            {chal.title}
                          </span>
                        </div>
                        <ChevronRight size={18} className={`transition-transform ${isActive ? 'text-indigo-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Persistent HUD - Now flush with the menu, no useless empty space */}
              <div className="flex-grow flex flex-col border-t border-slate-700 pt-5">
                {!challengeGuess ? (
                  <div className="animate-fade-in">
                    <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-lg">
                      <Info size={20} /> Current Mission
                    </h3>
                    <p className="text-slate-200 text-base leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-700 shadow-inner">
                      {activeChallenge.question}
                    </p>
                  </div>
                ) : (
                  <div className="animate-fade-in flex flex-col h-full justify-start gap-4">
                    <div>
                      <div className={`flex items-center gap-3 p-3 rounded-xl border-l-4 font-bold text-base mb-3 shadow-lg ${
                        challengeGuess === activeChallenge.correct 
                          ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' 
                          : 'bg-rose-900/30 border-rose-500 text-rose-400'
                      }`}>
                        {challengeGuess === activeChallenge.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        {challengeGuess === activeChallenge.correct ? "Spot on! You nailed it." : "Not quite! The textbooks lied to you."}
                      </div>
                      <p className="text-slate-200 text-base leading-relaxed">
                        {activeChallenge.explanation}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setChallengeGuess(null);
                        setActiveChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
                      }}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 uppercase tracking-wide text-sm mt-2"
                    >
                      Next Challenge <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </section>
          ) : activeTab === 'trends' ? (
            <section className="bg-slate-800/80 backdrop-blur p-6 rounded-3xl shadow-xl border border-slate-700 flex-grow flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-white border-b border-slate-700 pb-3">Periodic Trends</h2>
              
              <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {CONCEPT_GROUPS.map(group => {
                  const isActiveGroup = activeGroupId === group.id;
                  const sortedMolecules = [...group.molecules].sort((a, b) => b.angle - a.angle);

                  return (
                    <div key={group.id} className="flex flex-col">
                      <button 
                        onClick={() => {
                          setActiveGroupId(group.id);
                          setActiveMoleculeId(sortedMolecules[0].id); 
                          setShowInsight(false);
                        }}
                        className={`w-full flex items-center justify-between text-left py-4 transition-all border-b ${
                          isActiveGroup 
                            ? 'border-blue-500/50 text-blue-300' 
                            : 'border-slate-700/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-lg font-semibold tracking-wide">{group.title}</span>
                        <ChevronRight size={20} className={`transition-transform duration-300 ${isActiveGroup ? 'rotate-90 text-blue-400' : 'text-slate-600'}`} />
                      </button>
                      
                      {isActiveGroup && (
                        <div className="pt-5 pb-6">
                          <div className="flex items-center gap-1 overflow-x-auto pb-4 custom-scrollbar px-2">
                            {sortedMolecules.map((mol, idx) => {
                              const isActiveMol = activeMoleculeId === mol.id;
                              return (
                                <React.Fragment key={mol.id}>
                                  <button
                                    onClick={() => { setActiveMoleculeId(mol.id); setShowInsight(false); }}
                                    className="relative flex flex-col items-center justify-center shrink-0 min-w-[72px] py-1 transition-all group outline-none"
                                  >
                                    <span className={`text-lg transition-colors duration-200 ${isActiveMol ? 'text-blue-300 font-semibold drop-shadow-md' : 'text-slate-400 font-medium group-hover:text-slate-200'}`}>
                                      {formatFormula(mol.formula)}
                                    </span>
                                    <span className={`text-sm tracking-wide mt-1.5 transition-colors duration-200 ${isActiveMol ? 'text-blue-100 font-medium' : 'text-slate-500 font-normal group-hover:text-slate-400'}`}>
                                      {mol.angle}°
                                    </span>
                                    {isActiveMol && (
                                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                    )}
                                  </button>
                                  
                                  {idx < sortedMolecules.length - 1 && (
                                    <span className="text-lg font-light text-slate-600 shrink-0 select-none mb-6">
                                      {sortedMolecules[idx].angle > sortedMolecules[idx+1].angle ? '>' : '='}
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="bg-slate-800/80 backdrop-blur p-6 rounded-3xl shadow-xl border border-slate-700 flex-grow flex flex-col">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-3 flex items-center justify-between">
                Custom Parameters
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider w-32 shrink-0 leading-tight">Central EN</label>
                  <input 
                    type="range" min="1.0" max="4.0" step="0.1" 
                    value={customCEN} onChange={(e) => setCustomCEN(parseFloat(e.target.value))}
                    className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xl font-mono font-bold text-blue-400 w-12 text-right shrink-0">{customCEN.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider w-32 shrink-0 leading-tight">Terminal EN</label>
                  <input 
                    type="range" min="1.0" max="4.0" step="0.1" 
                    value={customTEN} onChange={(e) => setCustomTEN(parseFloat(e.target.value))}
                    className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xl font-mono font-bold text-emerald-400 w-12 text-right shrink-0">{customTEN.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider w-32 shrink-0 leading-tight">Lone Pairs</label>
                  <div className="flex flex-grow bg-slate-900/60 p-1 rounded-xl border border-slate-700/50">
                    {[{v: 0, l: '0'}, {v: 0.5, l: '1e⁻'}, {v: 1, l: '1'}, {v: 2, l: '2'}].map(opt => (
                      <button
                        key={opt.v} onClick={() => setCustomLP(opt.v)}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-lg transition-all ${customLP === opt.v ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                  <div className="w-12 shrink-0"></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700 flex-grow">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-xl">
                  <Info size={22} /> Live Analysis
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {customLP === 0 
                    ? "Without any lone pairs to bully them, the bonds spread out perfectly to balance their own repulsion. " 
                    : customLP === 0.5 
                      ? "The single odd electron creates a 'half-strength' repulsive field. It pushes the bonds down, but not nearly as hard as a full lone pair. "
                      : `The ${customLP} lone pair(s) act like big invisible balloons, pushing down hard on the bonds and squishing the angle. `}
                  {customTEN > customCEN 
                    ? <span className="text-emerald-300">Since the terminal atoms are pulling the electron clouds outward, there is less crowding in the middle. This makes it super easy for the lone pairs to push the bonds closer together.</span>
                    : customCEN > customTEN 
                      ? <span className="text-blue-300">The central atom is acting like an electron-hog, pulling the pairs super close. This creates a massive 'traffic jam' of electrons at the center, so they repel each other and force the angle to widen out.</span>
                      : "With a perfectly even tug-of-war, the electron cloud is balanced smoothly along the bond."}
                </p>
              </div>
            </section>
          )}

        </div>
      </main>
      
    </div>
  );
};

export default App;
