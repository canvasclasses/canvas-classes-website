/*
 * Career-guide card visuals — 12 unique animated SVG components, one per
 * career. Ported from the Claude Design hand-off (career-guide/project/
 * visuals.jsx). Each component fills the 132px-tall .cg-visual container
 * at the top of a card.
 *
 * Keyframe animations are declared in apps/student/app/career-guide/
 * career-guide.css with `cg-` prefixed names. The `--vAccent` CSS variable
 * (set per-card via VBox below) controls the radial-gradient glow behind
 * each SVG so each card has its own subtle colour signature.
 *
 * These are server-renderable — pure declarative SVG + CSS-driven animation,
 * no React state.
 */

import type { CSSProperties, ReactNode, ReactElement } from 'react';

interface VBoxProps {
  children: ReactNode;
  accent: string;
}

function VBox({ children, accent }: VBoxProps) {
  return (
    <div
      className="cg-visual"
      style={{ ['--vAccent' as string]: accent } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ── 1. Energy / materials engineer — battery cells charging + ion flow ── */
function VEnergy() {
  return (
    <VBox accent="rgba(247, 161, 59, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cg-batFill" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 30 + i * 48;
          const delay = i * 0.18;
          const cap = 0.45 + (i % 3) * 0.18;
          return (
            <g key={i} transform={`translate(${x}, 22)`}>
              <rect x="0" y="0" width="32" height="88" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <rect x="12" y="-4" width="8" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
              <g style={{ transformOrigin: 'bottom', animation: `cg-fillUp 2.4s ${delay}s ease-out infinite alternate` }}>
                <rect x="3" y={88 - 84 * cap} width="26" height={84 * cap} rx="2" fill="url(#cg-batFill)" opacity="0.85" />
              </g>
              <text x="16" y="108" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="ui-monospace" textAnchor="middle">
                {['Li', 'H₂', 'Na', 'K', 'Mg', 'Zn', 'Ni'][i]}
              </text>
            </g>
          );
        })}
        <line x1="0" y1="66" x2="400" y2="66" stroke="rgba(247,161,59,0.2)" strokeWidth="0.5" strokeDasharray="2 4" />
      </svg>
    </VBox>
  );
}

/* ── 2. ML / Applied AI engineer — neural network with activating nodes ── */
function VML() {
  const layers = [3, 5, 5, 3];
  const xs = [60, 150, 250, 340];
  const cy = 66;
  const ySpread = 90;
  const nodes: Array<{ x: number; y: number; layer: number; idx: number }> = [];
  layers.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      const y = cy + (i - (count - 1) / 2) * (ySpread / (count - 1 || 1));
      nodes.push({ x: xs[li], y, layer: li, idx: i });
    }
  });
  const edges: Array<{ a: typeof nodes[number]; b: typeof nodes[number] }> = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const from = nodes.filter((n) => n.layer === li);
    const to = nodes.filter((n) => n.layer === li + 1);
    from.forEach((a) => to.forEach((b) => edges.push({ a, b })));
  }
  return (
    <VBox accent="rgba(96, 165, 250, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke="rgba(147, 197, 253, 0.18)"
            strokeWidth="0.5"
            style={{ animation: `cg-traceGlow ${2 + (i % 4) * 0.5}s ${(i % 7) * 0.2}s ease-in-out infinite` }}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="2.5"
            fill="#93c5fd"
            style={{ animation: `cg-activate ${1.8 + (i % 5) * 0.3}s ${(i % 4) * 0.25}s ease-in-out infinite` }}
          />
        ))}
      </svg>
    </VBox>
  );
}

/* ── 3. Robotics — articulated arm picking and moving ── */
function VRobotics() {
  return (
    <VBox accent="rgba(248, 113, 113, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect x="180" y="110" width="40" height="14" rx="2" fill="rgba(255,255,255,0.18)" />
        <line x1="0" y1="124" x2="400" y2="124" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {[...Array(20)].map((_, i) => (
          <line key={i} x1={i * 22} y1="124" x2={i * 22 + 6} y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        ))}
        <g transform="translate(200, 110)">
          <g style={{ transformOrigin: '0 0', animation: 'cg-armSwing 4s ease-in-out infinite' }}>
            <rect x="-4" y="-58" width="8" height="58" rx="2" fill="#1a1a1a" stroke="rgba(255,255,255,0.22)" />
            <circle cx="0" cy="0" r="4" fill="#f87171" />
            <g transform="translate(0, -58)">
              <g style={{ transformOrigin: '0 0', animation: 'cg-armSwing2 4s ease-in-out infinite' }}>
                <rect x="-3" y="-50" width="6" height="50" rx="2" fill="#1a1a1a" stroke="rgba(255,255,255,0.22)" />
                <circle cx="0" cy="0" r="3" fill="#f87171" />
                <g transform="translate(0, -50)">
                  <rect x="-7" y="-4" width="14" height="6" rx="1" fill="rgba(255,255,255,0.2)" />
                  <rect x="-9" y="2" width="4" height="6" fill="rgba(255,255,255,0.3)" />
                  <rect x="5" y="2" width="4" height="6" fill="rgba(255,255,255,0.3)" />
                </g>
              </g>
            </g>
          </g>
        </g>
        <rect x="40" y="100" width="22" height="24" rx="2" fill="rgba(247,161,59,0.35)" stroke="rgba(247,161,59,0.5)" />
        <rect x="80" y="106" width="18" height="18" rx="2" fill="rgba(96,165,250,0.3)" stroke="rgba(96,165,250,0.5)" />
        <rect x="320" y="100" width="22" height="24" rx="2" fill="rgba(94,224,168,0.25)" stroke="rgba(94,224,168,0.5)" />
      </svg>
    </VBox>
  );
}

/* ── 4. Semiconductor / chip design — PCB traces + die ── */
function VSemi() {
  return (
    <VBox accent="rgba(167, 139, 250, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(167, 139, 250, 0.45)" fill="none" strokeWidth="1">
          <path d="M0,30 L70,30 L80,40 L160,40" style={{ strokeDasharray: '4 3', animation: 'cg-flow 3s linear infinite' }} />
          <path d="M0,60 L80,60 L90,50 L160,50" style={{ strokeDasharray: '4 3', animation: 'cg-flow 2.2s linear infinite' }} />
          <path d="M0,90 L60,90 L70,80 L160,80" style={{ strokeDasharray: '4 3', animation: 'cg-flow 2.8s linear infinite' }} />
          <path d="M400,40 L320,40 L310,50 L240,50" style={{ strokeDasharray: '4 3', animation: 'cg-flow 2.5s linear infinite reverse' }} />
          <path d="M400,70 L340,70 L330,80 L240,80" style={{ strokeDasharray: '4 3', animation: 'cg-flow 3.4s linear infinite reverse' }} />
          <path d="M400,100 L300,100 L290,90 L240,90" style={{ strokeDasharray: '4 3', animation: 'cg-flow 2s linear infinite reverse' }} />
        </g>
        {[30, 60, 90].map((y) => (
          <circle key={'l' + y} cx="160" cy={y === 90 ? 80 : y === 60 ? 50 : 40} r="2" fill="#a78bfa" />
        ))}
        {[40, 70, 100].map((y) => (
          <circle key={'r' + y} cx="240" cy={y === 100 ? 90 : y === 70 ? 80 : 50} r="2" fill="#a78bfa" />
        ))}
        <g transform="translate(160, 26)">
          <rect width="80" height="80" rx="6" fill="#0a0a0c" stroke="rgba(167,139,250,0.55)" strokeWidth="1" />
          <circle cx="10" cy="10" r="1.5" fill="#a78bfa" />
          <g stroke="rgba(167,139,250,0.18)" strokeWidth="0.5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <g key={i}>
                <line x1={i * 10} y1="6" x2={i * 10} y2="74" />
                <line x1="6" y1={i * 10} x2="74" y2={i * 10} />
              </g>
            ))}
          </g>
          <text x="40" y="46" textAnchor="middle" fill="rgba(167,139,250,0.85)" fontSize="9" fontFamily="ui-monospace" fontWeight="600">SOC</text>
        </g>
      </svg>
    </VBox>
  );
}

/* ── 5. Software engineer — terminal w/ typing + cursor ── */
function VSoftware() {
  return (
    <VBox accent="rgba(94, 224, 168, 0.18)">
      <div
        style={{
          height: '100%',
          padding: '16px 22px',
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>$ git push origin main</div>
        <div>
          <span style={{ color: '#5ee0a8' }}>✓</span> build · <span style={{ color: 'rgba(255,255,255,0.5)' }}>43.2s</span>
        </div>
        <div>
          <span style={{ color: '#5ee0a8' }}>✓</span> tests · <span style={{ color: 'rgba(255,255,255,0.5)' }}>1,284 passed</span>
        </div>
        <div>
          <span style={{ color: '#f6c454' }}>→</span> deploying
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 12,
              background: '#5ee0a8',
              marginLeft: 4,
              verticalAlign: 'middle',
              animation: 'cg-blink 1s steps(1) infinite',
            }}
          />
        </div>
      </div>
    </VBox>
  );
}

/* ── 6. Biotech / drug discovery — DNA helix translating ── */
function VBiotech() {
  return (
    <VBox accent="rgba(94, 224, 168, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g style={{ animation: 'cg-helix 2.4s linear infinite' }}>
          {[...Array(24)].map((_, i) => {
            const x = i * 28;
            const t = i * 0.5;
            const y1 = 66 + Math.sin(t) * 26;
            const y2 = 66 - Math.sin(t) * 26;
            const opacity = 0.4 + Math.abs(Math.cos(t)) * 0.5;
            return (
              <g key={i}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="rgba(94,224,168,0.35)" strokeWidth={Math.abs(Math.cos(t)) * 1.5 + 0.3} />
                <circle cx={x} cy={y1} r="2.5" fill="#5ee0a8" opacity={opacity} />
                <circle cx={x} cy={y2} r="2.5" fill="#34d399" opacity={opacity} />
              </g>
            );
          })}
        </g>
        <text x="20" y="20" fill="rgba(94,224,168,0.45)" fontSize="9" fontFamily="ui-monospace">A·T·G·C</text>
      </svg>
    </VBox>
  );
}

/* ── 7. Clinical doctor (MBBS) — EKG trace ── */
function VClinical() {
  return (
    <VBox accent="rgba(248, 113, 113, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(248, 113, 113, 0.08)" strokeWidth="0.5">
          {[...Array(11)].map((_, i) => (
            <line key={'h' + i} x1="0" y1={i * 13.2} x2="400" y2={i * 13.2} />
          ))}
          {[...Array(31)].map((_, i) => (
            <line key={'v' + i} x1={i * 13.2} y1="0" x2={i * 13.2} y2="132" />
          ))}
        </g>
        <line x1="0" y1="66" x2="400" y2="66" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <path
          d="M0,66 L40,66 L48,66 L52,60 L56,72 L60,40 L64,90 L68,66 L80,66 L120,66 L128,66 L132,60 L136,72 L140,40 L144,90 L148,66 L160,66 L200,66 L208,66 L212,60 L216,72 L220,40 L224,90 L228,66 L240,66 L280,66 L288,66 L292,60 L296,72 L300,40 L304,90 L308,66 L320,66 L360,66 L368,66 L372,60 L376,72 L380,40 L384,90 L388,66 L400,66"
          fill="none"
          stroke="#f87171"
          strokeWidth="1.5"
          strokeDasharray="600"
          style={{ animation: 'cg-ekg 3.2s linear infinite' }}
        />
        <text x="380" y="22" textAnchor="end" fill="rgba(248,113,113,0.85)" fontSize="11" fontFamily="ui-monospace">72 BPM</text>
      </svg>
    </VBox>
  );
}

/* ── 8. AI safety / evaluations — test grid with pass/fail + scanline ── */
function VSafety() {
  const cells: Array<{ r: number; c: number; status: 'pass' | 'fail' | 'warn'; delay: number }> = [];
  const cols = 22;
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const state = (r * 7 + c * 3) % 11;
      const status: 'pass' | 'fail' | 'warn' = state < 7 ? 'pass' : state < 9 ? 'fail' : 'warn';
      cells.push({ r, c, status, delay: (r * cols + c) * 0.012 });
    }
  }
  const colorMap: Record<'pass' | 'fail' | 'warn', string> = { pass: '#5ee0a8', fail: '#f87171', warn: '#f6c454' };
  const opMap: Record<'pass' | 'fail' | 'warn', number> = { pass: 0.55, fail: 0.85, warn: 0.75 };
  return (
    <VBox accent="rgba(96, 165, 250, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={14 + cell.c * 17}
            y={12 + cell.r * 16}
            width="11"
            height="11"
            rx="1.5"
            fill={colorMap[cell.status]}
            opacity={opMap[cell.status]}
            style={{ animation: `cg-gridReveal 0.5s ${cell.delay}s ease-out backwards` }}
          />
        ))}
        <rect x="0" y="0" width="60" height="132" fill="url(#cg-scanGrad)" style={{ animation: 'cg-scan 3.6s ease-in-out infinite' }} />
        <defs>
          <linearGradient id="cg-scanGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(96,165,250,0)" />
            <stop offset="50%" stopColor="rgba(96,165,250,0.25)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0)" />
          </linearGradient>
        </defs>
      </svg>
    </VBox>
  );
}

/* ── 9. Data engineer — pipeline with flowing dots ── */
function VData() {
  const flowPaths = [
    { path: 'M40,30 Q140,30 200,66 T360,66', color: '#60a5fa', delay: 0 },
    { path: 'M40,30 Q140,30 200,66 T360,66', color: '#60a5fa', delay: 1.2 },
    { path: 'M40,66 L360,66', color: '#93c5fd', delay: 0.4 },
    { path: 'M40,66 L360,66', color: '#93c5fd', delay: 1.6 },
    { path: 'M40,102 Q140,102 200,66 T360,66', color: '#3b82f6', delay: 0.8 },
    { path: 'M40,102 Q140,102 200,66 T360,66', color: '#3b82f6', delay: 2.0 },
  ];
  return (
    <VBox accent="rgba(96, 165, 250, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(96, 165, 250, 0.4)" fill="none" strokeWidth="1">
          <path d="M40,30 Q140,30 200,66 T360,66" />
          <path d="M40,66 L360,66" />
          <path d="M40,102 Q140,102 200,66 T360,66" />
        </g>
        {['events', 'clicks', 'orders'].map((label, i) => (
          <g key={label} transform={`translate(8, ${30 + i * 36})`}>
            <circle cx="0" cy="0" r="5" fill="rgba(96,165,250,0.25)" stroke="#60a5fa" />
            <text x="-14" y="2" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="ui-monospace">{label}</text>
          </g>
        ))}
        <g transform="translate(372, 66)">
          <rect x="-6" y="-10" width="14" height="20" rx="2" fill="#0a0a0c" stroke="#60a5fa" />
          <rect x="-6" y="-10" width="14" height="4" fill="rgba(96,165,250,0.4)" />
        </g>
        {flowPaths.map((p, i) => (
          <circle
            key={i}
            r="2.5"
            fill={p.color}
            style={
              {
                offsetPath: `path("${p.path}")`,
                animation: `cg-dataFlow 2.6s ${p.delay}s linear infinite`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
    </VBox>
  );
}

/* ── 10. Healthcare AI / clinical informatics — heart + neural overlay ── */
function VHealthAI() {
  const nodes: Array<[number, number]> = [
    [-30, -10], [-15, -22], [0, -8], [15, -22], [30, -10],
    [-22, 6], [0, 12], [22, 6], [-10, 24], [10, 24],
  ];
  return (
    <VBox accent="rgba(236, 72, 153, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(200, 66)">
          <path
            d="M0,30 C-30,10 -60,-10 -50,-25 C-42,-38 -22,-32 0,-12 C22,-32 42,-38 50,-25 C60,-10 30,10 0,30 Z"
            fill="none"
            stroke="rgba(236, 72, 153, 0.55)"
            strokeWidth="1.5"
          />
          {nodes.map(([x, y], i) => (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={nodes[i - 1][0]}
                  y1={nodes[i - 1][1]}
                  x2={x}
                  y2={y}
                  stroke="rgba(236,72,153,0.3)"
                  strokeWidth="0.5"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r="2.5"
                fill="#ec4899"
                style={{ animation: `cg-activate ${1.6 + (i % 4) * 0.4}s ${(i % 5) * 0.18}s ease-in-out infinite` }}
              />
            </g>
          ))}
        </g>
        <path d="M20,30 L40,30 L48,30 L52,22 L56,38 L60,18 L64,42 L68,30 L100,30" fill="none" stroke="rgba(236,72,153,0.5)" strokeWidth="1" />
        <text x="20" y="20" fill="rgba(236,72,153,0.7)" fontSize="8" fontFamily="ui-monospace">vitals.predict()</text>
      </svg>
    </VBox>
  );
}

/* ── 11. Product designer — wireframe layers + cursor ── */
function VProduct() {
  return (
    <VBox accent="rgba(129, 140, 248, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g style={{ animation: 'cg-float 3.6s ease-in-out infinite' }}>
          <rect x="50" y="20" width="120" height="92" rx="4" fill="rgba(129,140,248,0.06)" stroke="rgba(129,140,248,0.3)" />
          <rect x="60" y="30" width="100" height="8" rx="1" fill="rgba(129,140,248,0.35)" />
          <rect x="60" y="44" width="70" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
          <rect x="60" y="54" width="90" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
          <rect x="60" y="64" width="60" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
          <rect x="60" y="84" width="42" height="18" rx="3" fill="rgba(129,140,248,0.45)" />
        </g>
        <g style={{ animation: 'cg-float 3.6s 1.2s ease-in-out infinite' }}>
          <rect x="160" y="34" width="120" height="92" rx="4" fill="rgba(129,140,248,0.08)" stroke="rgba(129,140,248,0.4)" />
          <rect x="170" y="44" width="60" height="6" rx="1" fill="rgba(255,255,255,0.3)" />
          <rect x="170" y="56" width="100" height="50" rx="3" fill="rgba(129,140,248,0.15)" />
        </g>
        <g style={{ animation: 'cg-float 3.6s 2.4s ease-in-out infinite' }}>
          <rect x="266" y="14" width="116" height="92" rx="4" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.5)" />
          <circle cx="324" cy="50" r="14" fill="none" stroke="rgba(129,140,248,0.6)" strokeWidth="1.5" />
          <rect x="280" y="74" width="88" height="6" rx="1" fill="rgba(255,255,255,0.25)" />
          <rect x="280" y="86" width="64" height="6" rx="1" fill="rgba(255,255,255,0.18)" />
        </g>
        <g transform="translate(220, 70)">
          <path d="M0,0 L0,14 L4,11 L7,17 L9,16 L6,10 L11,10 Z" fill="#fff" stroke="#000" strokeWidth="0.5" />
        </g>
      </svg>
    </VBox>
  );
}

/* ── 12. Quant developer — candlestick chart climbing ── */
function VQuant() {
  const candles = [
    { h: 24, o: 18, c: 22, dir: 1 },
    { h: 28, o: 22, c: 19, dir: -1 },
    { h: 32, o: 19, c: 30, dir: 1 },
    { h: 38, o: 30, c: 35, dir: 1 },
    { h: 36, o: 35, c: 28, dir: -1 },
    { h: 42, o: 28, c: 40, dir: 1 },
    { h: 48, o: 40, c: 45, dir: 1 },
    { h: 52, o: 45, c: 50, dir: 1 },
    { h: 56, o: 50, c: 46, dir: -1 },
    { h: 58, o: 46, c: 56, dir: 1 },
    { h: 64, o: 56, c: 62, dir: 1 },
    { h: 68, o: 62, c: 66, dir: 1 },
    { h: 72, o: 66, c: 60, dir: -1 },
    { h: 76, o: 60, c: 74, dir: 1 },
    { h: 82, o: 74, c: 80, dir: 1 },
  ];
  return (
    <VBox accent="rgba(94, 224, 168, 0.18)">
      <svg viewBox="0 0 400 132" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
          {[20, 50, 80, 110].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>
        <g fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="ui-monospace">
          <text x="8" y="24">$240</text>
          <text x="8" y="84">$180</text>
        </g>
        {candles.map((c, i) => {
          const x = 50 + i * 22;
          const top = 110 - c.h;
          const bot = 110;
          const bodyTop = 110 - Math.max(c.o, c.c);
          const bodyH = Math.max(2, Math.abs(c.c - c.o));
          const color = c.dir > 0 ? '#5ee0a8' : '#f87171';
          return (
            <g key={i} style={{ transformOrigin: `${x + 4}px 110px`, animation: `cg-candleRise 0.5s ${i * 0.08}s ease-out backwards` }}>
              <line x1={x + 4} y1={top} x2={x + 4} y2={bot} stroke={color} strokeWidth="1" opacity="0.7" />
              <rect x={x} y={bodyTop} width="8" height={bodyH} fill={color} opacity="0.9" />
            </g>
          );
        })}
        <line x1="50" y1="92" x2="358" y2="32" stroke="rgba(94,224,168,0.35)" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    </VBox>
  );
}

/* ── Export dictionary keyed by visualKey ─────────────────────────────── */
export const Visuals: Record<string, () => ReactElement> = {
  energy: VEnergy,
  ml: VML,
  robotics: VRobotics,
  semi: VSemi,
  software: VSoftware,
  biotech: VBiotech,
  clinical: VClinical,
  safety: VSafety,
  data: VData,
  healthAI: VHealthAI,
  product: VProduct,
  quant: VQuant,
};

export type VisualKey = keyof typeof Visuals;
