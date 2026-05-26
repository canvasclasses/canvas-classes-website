/*
 * Per-career editorial content for "The shift" (old picture vs new picture)
 * section on the detail page. This is bespoke editorial copy — the kind of
 * thing that doesn't fit in the structured CareerSpec schema because the
 * "what parents picture" framing is uniquely shaped per career.
 *
 * Each entry includes two small SVG illustrations (old / new sides) that
 * visually anchor the contrast. Companies in the new-side bullets are
 * bolded inline with <b>.
 *
 * Editorial bar: keep headlines pithy (one line, ideally <100 chars).
 * Bullets should be 1-2 sentences max. The layout punishes paragraph
 * length visually.
 */

import type { ReactNode } from 'react';

export interface ShiftContent {
  oldHeadline: string;
  oldBullets: string[];
  newHeadline: string;
  newBullets: ReactNode[];
  oldIcon: ReactNode;
  newIcon: ReactNode;
}

// ── Small palette for icon strokes / fills ─────────────────────────────────
const muted = 'rgba(255,255,255,0.18)';
const mutedFill = 'rgba(255,255,255,0.06)';
const amber = 'rgba(247,161,59,0.7)';
const amberFill = 'rgba(247,161,59,0.4)';
const green = 'rgba(94,224,168,0.7)';
const greenFill = 'rgba(94,224,168,0.3)';
const blue = 'rgba(96,165,250,0.7)';
const blueFill = 'rgba(96,165,250,0.3)';
const purple = 'rgba(167,139,250,0.7)';
const purpleFill = 'rgba(167,139,250,0.3)';
const pink = 'rgba(236,72,153,0.7)';
const pinkFill = 'rgba(236,72,153,0.3)';

// ── Icons ──────────────────────────────────────────────────────────────────

const IconRefinery = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    <rect x="10" y="38" width="120" height="14" fill={mutedFill} stroke={muted} />
    <rect x="20" y="18" width="14" height="22" fill={mutedFill} stroke={muted} />
    <rect x="48" y="8" width="14" height="32" fill={mutedFill} stroke={muted} />
    <rect x="76" y="22" width="14" height="18" fill={mutedFill} stroke={muted} />
    <rect x="104" y="14" width="14" height="26" fill={mutedFill} stroke={muted} />
    <ellipse cx="55" cy="6" rx="6" ry="3" fill="rgba(255,255,255,0.1)" />
    <ellipse cx="111" cy="10" rx="4" ry="2" fill="rgba(255,255,255,0.1)" />
    <line x1="0" y1="52" x2="140" y2="52" stroke={muted} />
  </svg>
);

const IconBatteryBeakerHydrogen = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    <rect x="6" y="18" width="34" height="32" rx="3" fill="none" stroke={amber} />
    <rect x="16" y="14" width="14" height="4" fill={amberFill} />
    <rect x="10" y="30" width="26" height="16" fill={amberFill} />
    <path d="M52,22 L52,30 L46,48 L72,48 L66,30 L66,22 Z" fill={greenFill} stroke={green} />
    <path d="M46,42 L72,42" stroke={green} />
    <circle cx="56" cy="38" r="2" fill={green} />
    <circle cx="63" cy="44" r="1.5" fill={green} />
    <polygon points="98,18 116,18 124,33 116,48 98,48 90,33" fill={blueFill} stroke={blue} />
    <text x="107" y="38" fill={blue} fontSize="11" fontFamily="ui-monospace" textAnchor="middle">H₂</text>
  </svg>
);

const IconCubicles = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* office floor */}
    <rect x="6" y="36" width="128" height="16" fill={mutedFill} stroke={muted} />
    {/* cubicle dividers */}
    <line x1="38" y1="20" x2="38" y2="36" stroke={muted} />
    <line x1="70" y1="20" x2="70" y2="36" stroke={muted} />
    <line x1="102" y1="20" x2="102" y2="36" stroke={muted} />
    {/* monitors */}
    <rect x="14" y="28" width="14" height="7" fill={muted} />
    <rect x="46" y="28" width="14" height="7" fill={muted} />
    <rect x="78" y="28" width="14" height="7" fill={muted} />
    <rect x="110" y="28" width="14" height="7" fill={muted} />
    <line x1="0" y1="52" x2="140" y2="52" stroke={muted} />
  </svg>
);

const IconTerminal = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    <rect x="10" y="10" width="120" height="40" rx="4" fill="rgba(94,224,168,0.05)" stroke={green} />
    {/* traffic lights */}
    <circle cx="18" cy="18" r="1.5" fill={green} opacity="0.5" />
    <circle cx="24" cy="18" r="1.5" fill={green} opacity="0.5" />
    <circle cx="30" cy="18" r="1.5" fill={green} opacity="0.5" />
    {/* code lines */}
    <rect x="16" y="26" width="48" height="2" fill={green} opacity="0.55" />
    <rect x="16" y="32" width="70" height="2" fill={green} opacity="0.7" />
    <rect x="16" y="38" width="36" height="2" fill={green} opacity="0.55" />
    {/* cursor */}
    <rect x="56" y="36" width="2" height="6" fill={green} />
  </svg>
);

const IconSpreadsheet = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    <rect x="10" y="8" width="120" height="44" fill={mutedFill} stroke={muted} />
    {/* header row */}
    <rect x="10" y="8" width="120" height="10" fill="rgba(255,255,255,0.08)" />
    {/* rows */}
    {[20, 30, 40].map((y) => (
      <line key={y} x1="10" y1={y} x2="130" y2={y} stroke={muted} strokeOpacity="0.5" />
    ))}
    {/* cols */}
    {[40, 70, 100].map((x) => (
      <line key={x} x1={x} y1="8" x2={x} y2="52" stroke={muted} strokeOpacity="0.5" />
    ))}
    {/* "numbers" */}
    {[24, 34, 44].map((y) =>
      [14, 44, 74, 104].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="10" height="2" fill="rgba(255,255,255,0.35)" />)
    )}
  </svg>
);

const IconNeural = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* layer 1 */}
    {[15, 30, 45].map((y, i) => (
      <circle key={`l1-${i}`} cx="20" cy={y} r="3" fill={purple} />
    ))}
    {/* layer 2 */}
    {[12, 24, 36, 48].map((y, i) => (
      <circle key={`l2-${i}`} cx="70" cy={y} r="3" fill={purple} />
    ))}
    {/* layer 3 */}
    {[15, 30, 45].map((y, i) => (
      <circle key={`l3-${i}`} cx="120" cy={y} r="3" fill={purple} />
    ))}
    {/* edges layer 1→2 */}
    {[15, 30, 45].flatMap((y1) =>
      [12, 24, 36, 48].map((y2) => (
        <line key={`e1-${y1}-${y2}`} x1="20" y1={y1} x2="70" y2={y2} stroke={purple} strokeOpacity="0.25" />
      ))
    )}
    {/* edges layer 2→3 */}
    {[12, 24, 36, 48].flatMap((y1) =>
      [15, 30, 45].map((y2) => (
        <line key={`e2-${y1}-${y2}`} x1="70" y1={y1} x2="120" y2={y2} stroke={purple} strokeOpacity="0.25" />
      ))
    )}
  </svg>
);

const IconGlobe = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    <circle cx="40" cy="30" r="20" stroke={muted} fill="none" />
    <ellipse cx="40" cy="30" rx="20" ry="8" stroke={muted} fill="none" />
    <ellipse cx="40" cy="30" rx="8" ry="20" stroke={muted} fill="none" />
    {/* arrow to text */}
    <line x1="65" y1="30" x2="100" y2="30" stroke={muted} strokeWidth="1" markerEnd="url(#arr)" />
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
      </marker>
    </defs>
    <text x="103" y="33" fontSize="10" fill={muted} fontFamily="ui-monospace">USA</text>
  </svg>
);

const IconChip = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* die */}
    <rect x="42" y="14" width="56" height="32" rx="3" fill="#0a0a0c" stroke={purple} />
    {/* traces */}
    <line x1="6" y1="20" x2="42" y2="20" stroke={purple} strokeOpacity="0.5" />
    <line x1="6" y1="30" x2="42" y2="30" stroke={purple} strokeOpacity="0.5" />
    <line x1="6" y1="40" x2="42" y2="40" stroke={purple} strokeOpacity="0.5" />
    <line x1="98" y1="20" x2="134" y2="20" stroke={purple} strokeOpacity="0.5" />
    <line x1="98" y1="30" x2="134" y2="30" stroke={purple} strokeOpacity="0.5" />
    <line x1="98" y1="40" x2="134" y2="40" stroke={purple} strokeOpacity="0.5" />
    {/* pin */}
    <circle cx="48" cy="20" r="1.5" fill={purple} />
    {/* SOC text */}
    <text x="70" y="34" fontSize="9" fill={purple} fontFamily="ui-monospace" textAnchor="middle" fontWeight="600">SOC</text>
  </svg>
);

const IconFactory = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* chimneys */}
    <rect x="20" y="10" width="10" height="30" fill={mutedFill} stroke={muted} />
    <rect x="42" y="6" width="10" height="34" fill={mutedFill} stroke={muted} />
    {/* smoke */}
    <ellipse cx="25" cy="6" rx="6" ry="3" fill="rgba(255,255,255,0.1)" />
    <ellipse cx="47" cy="2" rx="6" ry="2" fill="rgba(255,255,255,0.1)" />
    {/* building */}
    <path d="M10,40 L10,30 L70,30 L70,40 L80,40 L80,52 L10,52 Z" fill={mutedFill} stroke={muted} />
    {/* worker silhouette */}
    <circle cx="100" cy="34" r="4" fill={mutedFill} stroke={muted} />
    <path d="M96,40 L96,52 M104,40 L104,52 M92,46 L108,46" stroke={muted} />
    <line x1="0" y1="52" x2="140" y2="52" stroke={muted} />
  </svg>
);

const IconRoboticArm = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* base */}
    <rect x="56" y="48" width="28" height="6" fill={mutedFill} stroke={muted} />
    {/* lower arm */}
    <rect x="66" y="22" width="8" height="26" fill="#1a1a1a" stroke="rgba(248,113,113,0.6)" />
    <circle cx="70" cy="48" r="3" fill="rgba(248,113,113,0.7)" />
    {/* upper arm */}
    <g transform="translate(70 22) rotate(-25)">
      <rect x="-3" y="-22" width="6" height="22" fill="#1a1a1a" stroke="rgba(248,113,113,0.6)" />
      <circle cx="0" cy="0" r="2.5" fill="rgba(248,113,113,0.7)" />
      {/* gripper */}
      <g transform="translate(0 -22)">
        <rect x="-6" y="-3" width="12" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
      </g>
    </g>
    {/* package */}
    <rect x="20" y="42" width="14" height="10" fill={amberFill} stroke={amber} />
    {/* AI / camera */}
    <rect x="100" y="14" width="22" height="14" rx="2" fill={greenFill} stroke={green} />
    <circle cx="111" cy="21" r="2" fill={green} />
    <line x1="0" y1="54" x2="140" y2="54" stroke={muted} />
  </svg>
);

const IconStethoscope = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* stethoscope tubing */}
    <path d="M30,12 Q30,30 50,40 Q70,50 70,30 L70,20" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="2" />
    <path d="M50,12 Q50,30 50,40" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="2" />
    {/* earpieces */}
    <circle cx="30" cy="10" r="3" fill="rgba(255,255,255,0.5)" />
    <circle cx="50" cy="10" r="3" fill="rgba(255,255,255,0.5)" />
    {/* chestpiece */}
    <circle cx="70" cy="20" r="6" fill={mutedFill} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    {/* caduceus / cross */}
    <rect x="105" y="14" width="20" height="20" fill="rgba(255,255,255,0.05)" stroke={muted} />
    <line x1="115" y1="18" x2="115" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <line x1="109" y1="24" x2="121" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
  </svg>
);

const IconLongRamp = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* clock */}
    <circle cx="22" cy="30" r="14" fill={mutedFill} stroke="rgba(248,113,113,0.6)" />
    <line x1="22" y1="30" x2="22" y2="20" stroke="rgba(248,113,113,0.8)" strokeWidth="2" />
    <line x1="22" y1="30" x2="30" y2="34" stroke="rgba(248,113,113,0.8)" strokeWidth="1.5" />
    {/* ramp / years */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
      <rect key={i} x={48 + i * 7} y={40 - i * 1.8} width="5" height={12 + i * 1.8} fill="rgba(248,113,113,0.18)" stroke="rgba(248,113,113,0.45)" />
    ))}
    <text x="100" y="58" fontSize="8" fill="rgba(248,113,113,0.7)" fontFamily="ui-monospace" textAnchor="middle">12 YEARS</text>
  </svg>
);

const IconPillFactory = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* factory building */}
    <path d="M10,40 L10,28 L34,18 L34,28 L58,18 L58,40 Z" fill={mutedFill} stroke={muted} />
    <ellipse cx="20" cy="14" rx="4" ry="2" fill="rgba(255,255,255,0.1)" />
    {/* pill bottles */}
    <rect x="74" y="26" width="14" height="22" rx="1" fill={mutedFill} stroke={muted} />
    <rect x="76" y="22" width="10" height="5" fill="rgba(255,255,255,0.2)" />
    <rect x="76" y="32" width="10" height="8" fill="rgba(255,255,255,0.15)" />
    {/* pills */}
    <ellipse cx="100" cy="40" rx="5" ry="2.5" fill={mutedFill} stroke={muted} />
    <ellipse cx="112" cy="36" rx="5" ry="2.5" fill={mutedFill} stroke={muted} />
    <ellipse cx="122" cy="42" rx="5" ry="2.5" fill={mutedFill} stroke={muted} />
    <line x1="0" y1="50" x2="140" y2="50" stroke={muted} />
  </svg>
);

const IconDNA = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {[...Array(8)].map((_, i) => {
      const x = 20 + i * 14;
      const t = i * 0.7;
      const y1 = 30 + Math.sin(t) * 18;
      const y2 = 30 - Math.sin(t) * 18;
      return (
        <g key={i}>
          <line x1={x} y1={y1} x2={x} y2={y2} stroke={green} strokeWidth="1" strokeOpacity="0.55" />
          <circle cx={x} cy={y1} r="2.5" fill={green} />
          <circle cx={x} cy={y2} r="2.5" fill="#34d399" />
        </g>
      );
    })}
    <text x="6" y="14" fontSize="8" fill={green} fontFamily="ui-monospace">ATGC</text>
  </svg>
);

const IconExcelPlain = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* simple Excel-style grid */}
    <rect x="20" y="10" width="100" height="40" fill={mutedFill} stroke={muted} />
    <rect x="20" y="10" width="100" height="8" fill="rgba(255,255,255,0.1)" />
    {[18, 26, 34, 42].map((y) => (
      <line key={y} x1="20" y1={y} x2="120" y2={y} stroke={muted} strokeOpacity="0.5" />
    ))}
    {[45, 70, 95].map((x) => (
      <line key={x} x1={x} y1="10" x2={x} y2="50" stroke={muted} strokeOpacity="0.5" />
    ))}
    {/* "X" Excel mark */}
    <text x="70" y="36" fontSize="14" fill="rgba(255,255,255,0.35)" fontFamily="ui-monospace" fontWeight="600" textAnchor="middle">SQL</text>
  </svg>
);

const IconPipeline = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* 3 source nodes */}
    {[14, 30, 46].map((y, i) => (
      <g key={i}>
        <circle cx="14" cy={y} r="5" fill={blueFill} stroke={blue} />
        <line x1="19" y1={y} x2="60" y2="30" stroke={blue} strokeOpacity="0.55" />
      </g>
    ))}
    {/* central transform */}
    <rect x="60" y="22" width="20" height="16" rx="3" fill={blueFill} stroke={blue} />
    {/* output */}
    <line x1="80" y1="30" x2="120" y2="30" stroke={blue} strokeOpacity="0.55" />
    <rect x="120" y="22" width="12" height="16" rx="2" fill="#0a0a0c" stroke={blue} />
    <rect x="120" y="22" width="12" height="4" fill={blueFill} />
    {/* flow dots */}
    <circle cx="40" cy="30" r="1.5" fill={blue} />
    <circle cx="100" cy="30" r="1.5" fill={blue} />
  </svg>
);

const IconNYSE = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* Wall St facade */}
    <rect x="20" y="18" width="100" height="32" fill={mutedFill} stroke={muted} />
    {/* columns */}
    {[28, 44, 60, 76, 92, 108].map((x) => (
      <rect key={x} x={x} y="22" width="6" height="24" fill="rgba(255,255,255,0.04)" stroke={muted} />
    ))}
    {/* pediment */}
    <path d="M16,18 L70,8 L124,18 Z" fill={mutedFill} stroke={muted} />
    <line x1="0" y1="50" x2="140" y2="50" stroke={muted} />
    <text x="70" y="58" fontSize="7" fill={muted} fontFamily="ui-monospace" textAnchor="middle">NYSE / LON</text>
  </svg>
);

const IconCandlestick = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {[
      { x: 14, y: 36, h: 8, up: true },
      { x: 24, y: 32, h: 12, up: false },
      { x: 34, y: 28, h: 14, up: true },
      { x: 44, y: 22, h: 18, up: true },
      { x: 54, y: 26, h: 10, up: false },
      { x: 64, y: 18, h: 16, up: true },
      { x: 74, y: 14, h: 20, up: true },
      { x: 84, y: 10, h: 22, up: true },
      { x: 94, y: 14, h: 14, up: false },
      { x: 104, y: 8, h: 24, up: true },
      { x: 114, y: 6, h: 22, up: true },
      { x: 124, y: 4, h: 18, up: true },
    ].map((c) => (
      <g key={c.x}>
        <line x1={c.x + 3} y1={c.y - 4} x2={c.x + 3} y2={c.y + c.h + 4} stroke={c.up ? green : 'rgba(248,113,113,0.7)'} strokeWidth="1" />
        <rect x={c.x} y={c.y} width="6" height={c.h} fill={c.up ? green : 'rgba(248,113,113,0.7)'} />
      </g>
    ))}
    <line x1="14" y1="40" x2="128" y2="14" stroke={green} strokeDasharray="2 2" />
  </svg>
);

const IconHospitalDesk = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* hospital building */}
    <rect x="20" y="14" width="40" height="38" fill={mutedFill} stroke={muted} />
    <text x="40" y="28" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="ui-monospace" textAnchor="middle">＋</text>
    {/* "?" representing uncertainty */}
    <text x="100" y="38" fontSize="32" fill={muted} fontFamily="ui-monospace" textAnchor="middle">?</text>
    <line x1="0" y1="52" x2="140" y2="52" stroke={muted} />
  </svg>
);

const IconStethoscopeAI = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* heart outline */}
    <path d="M30,28 C18,18 8,8 18,2 C22,-4 32,0 30,12 C28,0 38,-4 42,2 C52,8 42,18 30,28 Z" transform="translate(8 14)" fill="none" stroke={pink} strokeWidth="1.5" />
    {/* neural overlay on heart */}
    {[[24, 18], [32, 12], [40, 18], [28, 26], [36, 26]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1.6" fill={pink} />
    ))}
    {/* code prediction text */}
    <text x="80" y="22" fontSize="9" fill={pink} fontFamily="ui-monospace">vitals</text>
    <text x="80" y="34" fontSize="9" fill={pink} fontFamily="ui-monospace">.predict()</text>
    {/* small ekg */}
    <path d="M80,42 L88,42 L92,38 L96,46 L100,34 L104,46 L108,42 L130,42" fill="none" stroke={pink} strokeWidth="1" />
  </svg>
);

const IconPaintbrush = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* paintbrush */}
    <rect x="20" y="20" width="8" height="30" rx="1" transform="rotate(-20 24 35)" fill={muted} stroke={muted} />
    <rect x="20" y="14" width="8" height="10" transform="rotate(-20 24 35)" fill="rgba(255,255,255,0.3)" />
    {/* canvas */}
    <rect x="50" y="14" width="60" height="40" fill={mutedFill} stroke={muted} />
    {/* squiggle "art" */}
    <path d="M58,42 Q70,28 80,38 T100,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
  </svg>
);

const IconWireframes = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* layered frames */}
    <rect x="10" y="14" width="50" height="38" rx="3" fill="rgba(129,140,248,0.06)" stroke="rgba(129,140,248,0.5)" />
    <rect x="14" y="20" width="36" height="6" fill="rgba(129,140,248,0.3)" />
    <rect x="14" y="30" width="28" height="3" fill="rgba(255,255,255,0.2)" />
    <rect x="14" y="36" width="22" height="3" fill="rgba(255,255,255,0.2)" />
    <rect x="14" y="44" width="20" height="6" rx="1" fill="rgba(129,140,248,0.5)" />

    <rect x="70" y="10" width="50" height="38" rx="3" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.6)" />
    <circle cx="95" cy="24" r="6" fill="none" stroke="rgba(129,140,248,0.7)" strokeWidth="1.5" />
    <rect x="76" y="36" width="38" height="3" fill="rgba(255,255,255,0.2)" />
    {/* cursor */}
    <path d="M52,38 L52,52 L56,49 L58,54 L60,53 L57,49 L62,49 Z" fill="#fff" stroke="#000" strokeWidth="0.5" />
  </svg>
);

const IconQuestionGrid = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* test grid placeholder */}
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3, 4, 5, 6].map((c) => (
        <rect key={`${r}-${c}`} x={20 + c * 14} y={14 + r * 14} width="10" height="10" rx="1" fill={mutedFill} stroke={muted} />
      ))
    )}
    {/* "?" overlay */}
    <text x="70" y="40" fontSize="18" fill={muted} fontFamily="ui-monospace" textAnchor="middle">?</text>
  </svg>
);

const IconTestGrid = (
  <svg viewBox="0 0 140 60" width="140" height="60" fill="none" aria-hidden>
    {/* pass/fail grid with scanline */}
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => {
        const state = (r * 7 + c * 3) % 11;
        const status = state < 7 ? 'pass' : state < 9 ? 'fail' : 'warn';
        const color = status === 'pass' ? '#5ee0a8' : status === 'fail' ? '#f87171' : '#f6c454';
        const op = status === 'pass' ? 0.55 : 0.85;
        return (
          <rect key={`${r}-${c}`} x={10 + c * 14} y={14 + r * 12} width="10" height="9" rx="1" fill={color} opacity={op} />
        );
      })
    )}
  </svg>
);

// ── Per-career editorial entries ────────────────────────────────────────────

export const SHIFT_CONTENT: Record<string, ShiftContent> = {
  'energy-materials-engineer': {
    oldHeadline: 'Refinery jobs at IOCL / Reliance. Cement plants. Petrochemicals. PhD required for anything interesting.',
    oldBullets: [
      '"Chem Eng = refinery job." That track still exists — it\'s just the legacy one.',
      '"You need a PhD." For deep R&D often yes. For battery / EV companies, often no.',
      '"Indian battery industry is too small." It\'s small but real: ~2,000+ engineers across Ola, Ather, Tata, Reliance, JSW.',
      '"It pays less than IT." True at entry. Gap closes by year 5–7 — especially at funded EV startups with ESOPs.',
      '"It\'s all wet-lab work." Increasingly, materials informatics + simulation + ML-augmented discovery is a real fraction of the hours.',
    ],
    newHeadline: 'EV companies, green-hydrogen startups, materials labs — smaller teams, closer to research, real growth.',
    newBullets: [
      <>Battery teams at <b>Ola Electric, Ather, Tata, Mahindra</b>. Most are hiring this admissions cycle.</>,
      <>Grid-scale storage at <b>Reliance, Adani, NTPC</b> — pilots becoming production.</>,
      <>Green hydrogen at <b>Reliance, Adani, NTPC</b> + IIT Bombay incubated startups.</>,
      <>Materials informatics — the AI-augmented side of new-material discovery — is the fastest-growing sub-path.</>,
      <>The field has finally moved past "Chem Eng = work at a refinery." It&apos;s modernising — just slower than tech.</>,
    ],
    oldIcon: IconRefinery,
    newIcon: IconBatteryBeakerHydrogen,
  },

  'software-engineer-product': {
    oldHeadline: 'Sit in a TCS / Infosys office writing whatever the client demands. Get a 4 % yearly hike. Settle.',
    oldBullets: [
      '"Software engineering" = IT services job. That track exists but is hollowing out fast.',
      '"You need an IIT degree." Many strong product engineers come from mid-NITs, IIITs, private colleges with real portfolios.',
      '"AI will take this job in 2 years." AI is reshaping the role, not ending it. Junior end squeezed, senior end more valuable.',
      '"You can\'t do this from a tier-3 town." True for the first job (Bangalore-heavy). Remote-friendly later.',
      '"You need to be a coding genius." Judgment + reliability beat raw IQ in product engineering.',
    ],
    newHeadline: 'Product engineers shape what gets built at companies that sell software — not service companies executing tickets.',
    newBullets: [
      <>Indian product cos like <b>Razorpay, CRED, Swiggy, Flipkart, Zerodha</b> hiring competitively this cycle.</>,
      <>India-arms of <b>Google, Microsoft, Meta, Atlassian</b> pay ₹40-80L by year 5 for senior product engineers.</>,
      <>The role&apos;s value shifted upward — judgment, system design, end-to-end ownership.</>,
      <>Junior dev hiring at service companies thinned since 2023. Product side stayed roughly stable.</>,
      <>Open-source contribution + a real GitHub portfolio is now the credential. CGPA matters less.</>,
    ],
    oldIcon: IconCubicles,
    newIcon: IconTerminal,
  },

  'ml-engineer': {
    oldHeadline: '"AI" = data analysis with extra steps. Or it needs a PhD. Or it\'s only at OpenAI.',
    oldBullets: [
      '"You need a PhD." ~70 % of working MLEs in India don\'t. PhDs are for research, not applied work.',
      '"It\'s just data analysis." Data scientists, analysts, and ML engineers are different roles in 2026.',
      '"AI is a bubble." Some sub-areas will fizzle. The core engineering market is structural.',
      '"You\'ll be making the next ChatGPT." Most MLEs wire existing models into specific applications.',
      '"Anyone with Coursera certs can do this." Hiring bar is higher than SWE now — supply huge, real signal rare.',
    ],
    newHeadline: 'Engineers wiring foundation models + custom-trained ML into real products. The actual "AI engineer" career.',
    newBullets: [
      <>Indian AI labs like <b>Sarvam, Krutrim, Ai4Bharat</b> hiring across the 2026 admissions cycle.</>,
      <>Indian arms of <b>Anthropic, OpenAI, DeepMind</b> plus FAANG India research teams.</>,
      <>LLM applications is the hottest entry pool. RAG, agents, evaluations.</>,
      <>Compensation higher-variance than SWE — top quartile dominated by AI lab hires with significant equity.</>,
      <>~85 % concentration in Bangalore. Hyderabad + Mumbai have smaller scenes.</>,
    ],
    oldIcon: IconSpreadsheet,
    newIcon: IconNeural,
  },

  'semiconductor-engineer': {
    oldHeadline: 'Chip design happens in Silicon Valley. India just does call centers + ETL work.',
    oldBullets: [
      '"All semiconductor work is in the US." Wrong. NVIDIA Bangalore alone has 5,000+ engineers.',
      '"India only does verification — lower-value work." Verification engineers at top semis earn ₹40-80L by year 5-7.',
      '"Semiconductor = working in a fab." Chip DESIGN happens in office buildings with EDA tools. Different career from fabs.',
      '"Tata Electronics fab will be the future." Maybe — but fab process engineering is different from chip design.',
      '"AI will design chips by itself." EDA-tools work is accelerating. Architecture + verification stays human for years.',
    ],
    newHeadline: 'NVIDIA, Intel, AMD, Qualcomm India host 2k-8k engineers each. India Semi Mission ₹76,000 cr is funded.',
    newBullets: [
      <>Design teams at <b>NVIDIA, Intel, AMD, Qualcomm, Apple, Broadcom</b> India arms.</>,
      <>Verification is India&apos;s largest sub-discipline by headcount. Pays comparably to SWE-product at senior levels.</>,
      <>New fabs from <b>Tata Electronics, Vedanta-Foxconn</b> create manufacturing roles — different career from chip design.</>,
      <>India is unusually strong in verification + back-end design. Architecture still concentrates at US HQs.</>,
      <>Compensation is mostly cash + RSU. Rarely ESOP-heavy unlike software startups.</>,
    ],
    oldIcon: IconGlobe,
    newIcon: IconChip,
  },

  'robotics-engineer': {
    oldHeadline: 'Robotics = sci-fi humanoids. Or it\'s the same factory job your uncle had in 1990.',
    oldBullets: [
      '"Robotics = humanoid robots." Most robotics jobs in India are wheeled or arm-based industrial systems.',
      '"You need a PhD." For research labs — often. For applied robotics — strong CS + controls + portfolio is enough.',
      '"It\'s just mechanical engineering with extra steps." Modern robotics is increasingly software-heavy.',
      '"India doesn\'t make robots." Addverb, GreyOrange, Ati Motors are real Indian companies shipping real robots.',
      '"AI will automate robotics jobs." The opposite — AI is the unlock that creates more robotics jobs.',
    ],
    newHeadline: 'Software-heavy career building warehouse robots, factory automation, mobile platforms. Real Indian companies, real growth.',
    newBullets: [
      <>Indian companies <b>Addverb, GreyOrange, Ati Motors</b> shipping warehouse + manipulation robots to e-commerce.</>,
      <>India arms of <b>NVIDIA Isaac, ABB, Siemens, Bosch</b> on the multinational side.</>,
      <>Mech-eng graduates with software skills are unusually valuable — supply is thin.</>,
      <>Hardware delivery cycles are slow (18+ months). Different rhythm from consumer tech.</>,
      <>Pay ceiling somewhat lower than top ML / SWE — trade-off is AI-resistance + durable growth.</>,
    ],
    oldIcon: IconFactory,
    newIcon: IconRoboticArm,
  },

  'clinical-doctor': {
    oldHeadline: 'Stable. Respected. ₹1L+/month from day one. The "safe" default career.',
    oldBullets: [
      '"Once you clear NEET-UG, the hard part is over." Not in 2026. NEET-PG is harder. ~70 % don\'t get the specialty they want first attempt.',
      '"All MBBS doctors make ₹1L+/month." Median government MO income (years 1-5) is ₹50-70K/month.',
      '"Private MBBS is fine if family can afford it." At ₹50L-1.5Cr cost, expected income may not justify investment without PG specialisation.',
      '"AI will replace doctors." Not in 10 years. AI compresses diagnostic-screening. Patient relationship + procedure + judgment stay human.',
      '"Doctors have stable family lives." First 7-10 years post-MBBS include 18-hour residency days + geographic constraint.',
    ],
    newHeadline: '12-year ramp to clinical autonomy. NEET-PG bottleneck worse than NEET-UG. Income back-loaded by a decade.',
    newBullets: [
      <>Specialist roles at <b>Apollo, Fortis, Manipal</b> corporate hospital chains pay ₹40L-1.5Cr by year 12+.</>,
      <>Government MO income years 1-5: ₹50-70K/month. Sub-engineering pay for a decade.</>,
      <>NEET-PG is the real bottleneck. Many MBBS graduates wait 1-2 years to crack it.</>,
      <>Tier-3 private MBBS at ₹50L-1.5Cr rarely matches expected income without PG specialisation.</>,
      <>Specialties with AI exposure: radiology, pathology. Procedure-heavy specialties (surgery, anaesthesia) much less.</>,
    ],
    oldIcon: IconStethoscope,
    newIcon: IconLongRamp,
  },

  'biotech-research': {
    oldHeadline: 'Biotech = working at a pharma factory making generics. Low pay. Lab-coat job.',
    oldBullets: [
      '"Biotech = working at a pharma factory." That\'s pharma manufacturing. Biotech research is upstream of that.',
      '"You need NEET / MBBS." Most biotech researchers are B.Tech Biotech + MS/PhD, or BSc + MSc + PhD biology.',
      '"It pays terribly." Entry pay below tech, true. Computational biology + drug discovery at funded biotechs can match SWE by year 5-7.',
      '"India biotech is too small." Strand, Aragen, Syngene + pharma India captives employ 30,000+ research scientists.',
      '"AI will replace drug discovery scientists." AI augments drug discovery. Wet-lab validation still required.',
    ],
    newHeadline: 'Drug discovery, computational biology, biotech R&D. The NEET path that doesn\'t involve clinical practice.',
    newBullets: [
      <>Indian biotech startups <b>Strand Life Sciences, Mapmygenome, Aragen, Syngene</b> hiring researchers in 2026.</>,
      <>Pharma R&D at <b>Dr. Reddy&apos;s, Sun Pharma, Cipla, Biocon</b> for clinical + computational roles.</>,
      <>Computational biology + AI-augmented drug discovery is the fastest-growing + highest-paid sub-path.</>,
      <>~85 % concentration in Bangalore + Hyderabad (Genome Valley) + Mumbai.</>,
      <>Industry typically requires masters or PhD. Direct B.Tech-only roles pay modestly.</>,
    ],
    oldIcon: IconPillFactory,
    newIcon: IconDNA,
  },

  'data-engineer': {
    oldHeadline: 'Data engineering = SQL + Excel. Or just glorified ETL grunt work. Lower-skill than "real" engineering.',
    oldBullets: [
      '"It\'s just SQL + Excel." Modern data engineering uses Python, Spark, Kafka, AWS / GCP, software engineering rigour.',
      '"Data scientists and data engineers are the same job." They are not. Different skills, different teams, often confused in titles.',
      '"AI will automate data engineering away." AI accelerates writing. Judgment-heavy work (schema, debug, design) stays human.',
      '"You need a math background." For pure data engineering — no. Programming + systems thinking + clear writing matter more.',
      '"It\'s a backup plan for failed ML engineers." Some pivot in — but the career has its own trajectory + ceiling.',
    ],
    newHeadline: 'Build the pipelines analytics, dashboards, and ML rely on. Lower-hype, more-durable middle ground.',
    newBullets: [
      <>Indian product companies <b>Razorpay, Swiggy, PhonePe, CRED</b> hiring data engineers competitively.</>,
      <>Analytics engineering with <b>dbt</b> is the fastest-growing sub-path in 2026.</>,
      <>Less competition for entry roles than MLE. Same Bangalore / Hyderabad / Pune concentration.</>,
      <>Career mobility excellent — can pivot to ML / SWE-product / platform with 1-2 years of focus.</>,
      <>Talent supply is thinner than MLE — especially at the dbt + modern-data-stack end.</>,
    ],
    oldIcon: IconExcelPlain,
    newIcon: IconPipeline,
  },

  'quant-developer': {
    oldHeadline: 'Quants are math wizards who broke 2008. Or it\'s all NYC / London. Doesn\'t exist in India.',
    oldBullets: [
      '"You need a math PhD." For quant developer / engineering roles — no. For research / pricing — yes, often.',
      '"Quants are gambling with extra steps." Modern quant work is systematic, model-driven, risk-controlled.',
      '"AI / ChatGPT will replace quants." Wrong. Value is in proprietary research + low-latency systems. Hard to replicate.',
      '"All quant work is in NYC / London." Bangalore + Mumbai host serious teams across HFT + sell-side.',
      '"Once you\'re in, you\'re set." Not true. Brutal performance reviews + sudden team closures.',
    ],
    newHeadline: 'Build the systems and models trading firms use. Hard to enter, concentrated, very well paid.',
    newBullets: [
      <>India hires at <b>Tower Research, Jane Street, Citadel India, Optiver, Da Vinci Trading</b>.</>,
      <>Sell-side bank quant roles at <b>Goldman, Morgan Stanley, JP Morgan</b> in Mumbai + Bangalore.</>,
      <>~200-300 entry-level quant roles in India per year against ~5,000+ serious applicants.</>,
      <>Top HFT firms pay 2-3x what mid-tier sell-side pays — picking the firm matters more than the title.</>,
      <>Bonus-weighted comp. Year 5 senior quant: ₹60L-2.2Cr depending on firm + individual performance.</>,
    ],
    oldIcon: IconNYSE,
    newIcon: IconCandlestick,
  },

  'healthcare-ai': {
    oldHeadline: 'Niche tech role at a hospital. Pays poorly. Doesn\'t really exist in India.',
    oldBullets: [
      '"You need an MBBS." Many top healthcare-AI engineers don\'t. CS + biology background also works.',
      '"It\'s just data science at a hospital." Real clinical informatics needs workflows, regulation, procurement understanding.',
      '"AI will replace doctors so this career is short-term." Wrong framing — AI augments specific tasks. Clinical informatics is a 20+ year project.',
      '"India doesn\'t have a market for this." Market grew from ~30 dedicated hires in 2022 to ~400+ in 2026.',
      '"You need a US degree." Not anymore — IISc, IIT Madras, Indian healthtech startups hire directly.',
    ],
    newHeadline: 'The bridge between medicine and tech — clinical AI products, hospital informatics, medical data engineering.',
    newBullets: [
      <>Indian healthtech startups <b>Qure.ai, Niramai, Strand</b> have dedicated clinical AI teams.</>,
      <>Corporate hospital chains <b>Apollo, Manipal, Fortis</b> building in-house AI / informatics groups.</>,
      <>Pharma R&D at <b>Pfizer, Novartis, Merck</b> India captives for medical-data work.</>,
      <>MBBS-pivot path: rare and well-paid. Dual fluency is scarce — ~200 such people in India total.</>,
      <>~85 % Bangalore + Hyderabad + Mumbai concentration. Remote unlikely — clinical integration needs presence.</>,
    ],
    oldIcon: IconHospitalDesk,
    newIcon: IconStethoscopeAI,
  },

  'product-designer': {
    oldHeadline: 'Graphic design at a marketing agency. Pretty pixels. Low pay. Not a "real" engineering job.',
    oldBullets: [
      '"You need to be artistic / good at drawing." False. Modern product design is empathy + problem-solving + systems thinking.',
      '"You need a design degree." False. Many strong Indian product designers came from engineering / commerce + self-taught portfolios.',
      '"It pays less than engineering." Used to be true. Not anymore at top product companies. Senior designers match senior SWE comp.',
      '"It\'s mostly making things look pretty." Small fraction. Most work is research, interaction design, systems thinking.',
      '"AI will replace designers." Partially — AI compresses production work. Research + strategy + judgment becomes MORE valuable.',
    ],
    newHeadline: 'Design the experience users have with software. The bridge between engineering, business, and the people who use the product.',
    newBullets: [
      <>Senior product designers at <b>Razorpay, CRED, Swiggy, Zerodha</b> match senior SWE compensation in 2026.</>,
      <>India design community on design Twitter / Read.cv / Layers is unusually generous — relationships compound.</>,
      <>Top compensation concentrated at ~30 Indian companies. Outside that, design pay drops sharply.</>,
      <>Career mobility moderate — PM / design management pivot is natural, engineering pivot is harder.</>,
      <>AI tools (Figma AI, Galileo) compress junior work fast. Plan for senior / research / strategy trajectory.</>,
    ],
    oldIcon: IconPaintbrush,
    newIcon: IconWireframes,
  },

  'ai-evaluations-engineer': {
    oldHeadline: 'AI evals = QA testing for chatbots. Fad role, will disappear in 2 years.',
    oldBullets: [
      '"It\'s just QA testing for AI." Far from it. Statistical thinking, ML depth, creative adversarial thinking required.',
      '"It\'s a fad — will disappear." Unlikely. EU AI Act + India\'s draft AI policies create structural demand.',
      '"You need to be at OpenAI / Anthropic." False. Every company shipping LLM products to real users needs evals engineers.',
      '"It\'s not as prestigious as ML research." Misconception. Evals roles at frontier labs are among the most respected technical positions.',
      '"You need a PhD." For deep safety research, sometimes. For applied evaluations, no.',
    ],
    newHeadline: 'Figure out how AI systems actually work — design benchmarks, red-team, evaluate behaviour at scale. Brand-new career.',
    newBullets: [
      <>Anthropic India captive, <b>Sarvam, Krutrim, Ai4Bharat</b> hiring evals engineers.</>,
      <>Applied AI startups + product companies shipping LLM features need dedicated trust + safety teams.</>,
      <>~500-800 open positions across India in 2026 — up from near-zero in 2022.</>,
      <>Comparable comp to ML engineering at frontier labs. Tiny talent pool, high pay variance.</>,
      <>~90 % concentration in Bangalore + Hyderabad. Outside these cities, the role is essentially absent.</>,
    ],
    oldIcon: IconQuestionGrid,
    newIcon: IconTestGrid,
  },
};
