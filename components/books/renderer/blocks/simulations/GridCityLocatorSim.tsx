'use client';

// GridCityLocatorSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 1 ("Where Am I?")
// Sindhu-Sarasvati grid-city locator. Two interactive games:
//   - Find: a target shop is highlighted; type the (east, north) numbers to locate it.
//   - Drop: a pair of numbers is given; click the right block on the city.
// Coordinates are non-negative integer block-counts from the centre.

import { useState, useCallback, useMemo, useRef } from 'react';

// ── Geometry ──────────────────────────────────────────────────────────────────
const BLOCKS_E = 6;          // blocks east of centre (each direction)
const BLOCKS_N = 4;          // blocks north of centre (each direction)
const CELL = 38;             // px per block
const PAD = 26;
const SVG_W = (BLOCKS_E * 2) * CELL + PAD * 2;
const SVG_H = (BLOCKS_N * 2) * CELL + PAD * 2;

// Centre is (0, 0) in world; world ranges -BLOCKS_E..BLOCKS_E and -BLOCKS_N..BLOCKS_N
function toSvg(eb: number, nb: number) {
  return {
    px: PAD + (eb + BLOCKS_E) * CELL,
    py: PAD + (BLOCKS_N - nb) * CELL,
  };
}

function fromSvg(px: number, py: number) {
  const e = Math.round((px - PAD) / CELL) - BLOCKS_E;
  const n = BLOCKS_N - Math.round((py - PAD) / CELL);
  return { e, n };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// Simple deterministic shop names so each lattice point has personality
const SHOP_NAMES = [
  'Cotton Bazaar', 'Bead Workshop', 'Pottery Lane', 'Granary',
  'Spice Hall', 'Dyer\'s Yard', 'Coppersmith', 'Weaver\'s Stall',
  'Salt Store', 'Sealmaker', 'Brick Kiln', 'Fish Market',
];

function shopFor(e: number, n: number) {
  const idx = ((e * 7) + (n * 11) + 100) % SHOP_NAMES.length;
  return SHOP_NAMES[idx];
}

// Pre-baked "Find" prompts — pick a shop, hide its name, ask for its coordinates
const FIND_TARGETS: { e: number; n: number }[] = [
  { e: 4, n: 3 }, { e: -3, n: 2 }, { e: 5, n: -2 },
  { e: -2, n: -3 }, { e: 0, n: 4 }, { e: -5, n: 0 },
];

// Pre-baked "Drop" prompts — give numbers, ask for the click
const DROP_TARGETS: { e: number; n: number }[] = [
  { e: 3, n: 1 }, { e: -4, n: 2 }, { e: 2, n: -3 },
  { e: -1, n: -2 }, { e: 6, n: 0 }, { e: 0, n: -3 },
];

type Mode = 'find' | 'drop';

// ── Component ─────────────────────────────────────────────────────────────────

export default function GridCityLocatorSim() {
  const [mode, setMode] = useState<Mode>('drop');

  // Find mode
  const [findIdx, setFindIdx] = useState(0);
  const [eInput, setEInput] = useState('');
  const [nInput, setNInput] = useState('');
  const [findStatus, setFindStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');

  // Drop mode
  const [dropIdx, setDropIdx] = useState(0);
  const [dropPlaced, setDropPlaced] = useState<{ e: number; n: number } | null>(null);
  const [dropStatus, setDropStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const findTarget = FIND_TARGETS[findIdx];
  const dropTarget = DROP_TARGETS[dropIdx];

  const checkFind = useCallback(() => {
    const ge = parseInt(eInput, 10);
    const gn = parseInt(nInput, 10);
    if (Number.isNaN(ge) || Number.isNaN(gn)) {
      setFindStatus('wrong'); return;
    }
    setFindStatus(ge === findTarget.e && gn === findTarget.n ? 'correct' : 'wrong');
  }, [eInput, nInput, findTarget]);

  const nextFind = useCallback(() => {
    setFindIdx(i => (i + 1) % FIND_TARGETS.length);
    setEInput(''); setNInput(''); setFindStatus('pending');
  }, []);

  const handleSvgClick = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'drop') return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { e: ce, n: cn } = fromSvg(px, py);
    const placed = {
      e: clamp(ce, -BLOCKS_E, BLOCKS_E),
      n: clamp(cn, -BLOCKS_N, BLOCKS_N),
    };
    setDropPlaced(placed);
    setDropStatus(placed.e === dropTarget.e && placed.n === dropTarget.n ? 'correct' : 'wrong');
  }, [mode, dropTarget]);

  const nextDrop = useCallback(() => {
    setDropIdx(i => (i + 1) % DROP_TARGETS.length);
    setDropPlaced(null); setDropStatus('pending');
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setFindStatus('pending'); setDropStatus('pending');
    setEInput(''); setNInput(''); setDropPlaced(null);
  }, []);

  // Render helpers
  const centre = toSvg(0, 0);
  const allLattice = useMemo(() => {
    const pts: { e: number; n: number }[] = [];
    for (let n = -BLOCKS_N; n <= BLOCKS_N; n++) {
      for (let e = -BLOCKS_E; e <= BLOCKS_E; e++) {
        pts.push({ e, n });
      }
    }
    return pts;
  }, []);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Sindhu-Sarasvati <span style={{ color: '#f59e0b' }}>City Locator</span>
        </h1>
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#475569', marginTop: 4, marginBottom: 0,
        }}>
          Two-Number Coordinates · Class 9 Mathematics
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {([
          ['drop', 'Find the Shop'],
          ['find', 'Read the Coordinates'],
        ] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button
              key={m} onClick={() => switchMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Instruction */}
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
        {mode === 'drop' && (
          <>
            A merchant tells you their shop is <b style={{ color: '#fbbf24' }}>{Math.abs(dropTarget.e)} blocks {dropTarget.e >= 0 ? 'east' : 'west'}</b>
            {' '}and <b style={{ color: '#fbbf24' }}>{Math.abs(dropTarget.n)} blocks {dropTarget.n >= 0 ? 'north' : 'south'}</b> of the city centre. Click the matching block.
          </>
        )}
        {mode === 'find' && (
          <>
            The highlighted shop is somewhere on the grid. How many blocks <b style={{ color: '#fbbf24' }}>east</b> (positive) or <b style={{ color: '#fbbf24' }}>west</b> (negative) of the centre is it? How many <b style={{ color: '#fbbf24' }}>north</b> (positive) or <b style={{ color: '#fbbf24' }}>south</b> (negative)?
          </>
        )}
      </p>

      {/* SVG city */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#1a120a',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: mode === 'drop' ? 'pointer' : 'default', touchAction: 'none' }}
          onPointerDown={handleSvgClick}
        >
          {/* Earth-toned ground */}
          <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="#241710" />

          {/* Grid streets — east-west */}
          {Array.from({ length: BLOCKS_N * 2 + 1 }, (_, i) => {
            const n = BLOCKS_N - i;
            const { py } = toSvg(0, n);
            return (
              <line key={`ew${n}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
                stroke="rgba(245,158,11,0.18)" strokeWidth={1.2} />
            );
          })}
          {/* Grid streets — north-south */}
          {Array.from({ length: BLOCKS_E * 2 + 1 }, (_, i) => {
            const e = i - BLOCKS_E;
            const { px } = toSvg(e, 0);
            return (
              <line key={`ns${e}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
                stroke="rgba(245,158,11,0.18)" strokeWidth={1.2} />
            );
          })}

          {/* Lattice point markers — small mud-brick squares */}
          {allLattice.map(({ e, n }) => {
            const p = toSvg(e, n);
            const isCentre = e === 0 && n === 0;
            return (
              <rect
                key={`shop${e}.${n}`}
                x={p.px - 4} y={p.py - 4} width={8} height={8}
                fill={isCentre ? '#f59e0b' : 'rgba(245,158,11,0.5)'}
                stroke={isCentre ? '#fbbf24' : 'transparent'}
                strokeWidth={isCentre ? 2 : 0}
              />
            );
          })}

          {/* Centre label */}
          <text x={centre.px} y={centre.py + 18} fill="#fbbf24" fontSize={9} fontWeight={700} textAnchor="middle">
            CENTRE
          </text>

          {/* Find-mode highlighted target */}
          {mode === 'find' && (() => {
            const t = toSvg(findTarget.e, findTarget.n);
            return (
              <g>
                <circle cx={t.px} cy={t.py} r={14} fill="none" stroke="#34d399" strokeWidth={2} />
                <circle cx={t.px} cy={t.py} r={5} fill="#34d399" stroke="#0B0F15" strokeWidth={2} />
                <text x={t.px} y={t.py - 18} fill="#34d399" fontSize={10} fontWeight={700} textAnchor="middle">
                  {shopFor(findTarget.e, findTarget.n)}
                </text>
              </g>
            );
          })()}

          {/* Drop-mode placed marker */}
          {mode === 'drop' && dropPlaced && (() => {
            const p = toSvg(dropPlaced.e, dropPlaced.n);
            const colour = dropStatus === 'correct' ? '#34d399' : '#f87171';
            return (
              <g>
                <circle cx={p.px} cy={p.py} r={8} fill={colour} stroke="#0B0F15" strokeWidth={2} />
                <text x={p.px} y={p.py - 14} fill={colour} fontSize={10} fontWeight={700} textAnchor="middle">
                  ({dropPlaced.e >= 0 ? '+' : ''}{dropPlaced.e}, {dropPlaced.n >= 0 ? '+' : ''}{dropPlaced.n})
                </text>
              </g>
            );
          })()}

          {/* Compass rose */}
          <g transform={`translate(${SVG_W - 38}, ${28})`}>
            <text x={0} y={-8} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="middle">N</text>
            <text x={0} y={20} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="middle">S</text>
            <text x={-12} y={6} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="middle">W</text>
            <text x={12} y={6} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="middle">E</text>
            <line x1={0} y1={-4} x2={0} y2={16} stroke="#94a3b8" strokeWidth={1} />
            <line x1={-8} y1={6} x2={8} y2={6} stroke="#94a3b8" strokeWidth={1} />
          </g>
        </svg>
      </div>

      {/* Controls */}
      {mode === 'find' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>east:</label>
          <input
            type="number" value={eInput} onChange={e => setEInput(e.target.value)} placeholder="±E"
            style={{
              width: 60, padding: '6px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
            }}
          />
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>north:</label>
          <input
            type="number" value={nInput} onChange={e => setNInput(e.target.value)} placeholder="±N"
            style={{
              width: 60, padding: '6px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
            }}
          />
          <button
            onClick={checkFind}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            }}
          >
            Check
          </button>
          <button
            onClick={nextFind}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
            }}
          >
            New Shop →
          </button>
          {findStatus === 'correct' && (
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
              ✓ Yes — that&rsquo;s the correct location for this shop.
            </span>
          )}
          {findStatus === 'wrong' && (
            <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>
              Not quite — the shop is at ({findTarget.e >= 0 ? '+' : ''}{findTarget.e}, {findTarget.n >= 0 ? '+' : ''}{findTarget.n}). Try another.
            </span>
          )}
        </div>
      )}

      {mode === 'drop' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <button
            onClick={nextDrop}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
            }}
          >
            New Shop →
          </button>
          {dropStatus === 'correct' && (
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
              ✓ Bullseye — you found the {shopFor(dropTarget.e, dropTarget.n)}.
            </span>
          )}
          {dropStatus === 'wrong' && dropPlaced && (
            <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>
              Off by ({Math.abs(dropPlaced.e - dropTarget.e)} east-west, {Math.abs(dropPlaced.n - dropTarget.n)} north-south). Click again.
            </span>
          )}
        </div>
      )}

      {/* Footer caption */}
      <div style={{
        borderRadius: 10, padding: '10px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 12, color: '#fbbf24', margin: 0, fontWeight: 700, letterSpacing: '0.06em' }}>
          ✦ A glowing dot at the centre is the city centre. Every other dot is a possible shop, located by two simple numbers — exactly the way the people of Mohenjo-daro did, 5,000 years ago.
        </p>
      </div>
    </div>
  );
}
