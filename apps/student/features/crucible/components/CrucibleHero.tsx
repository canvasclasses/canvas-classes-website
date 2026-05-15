"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface CrucibleHeroProps {
  isMobile: boolean;
}

const FLAME_WORDS = /(\bfire\b|\brank\b|\bforge\b)/i;

const SAMPLE_QUESTIONS = [
  {
    subject: 'Chemistry',
    chapter: 'P Block (12th)',
    difficulty: 'JEE Advanced',
    body: 'Which of the following has the highest bond dissociation enthalpy?',
    options: ['F₂', 'Cl₂', 'Br₂', 'I₂'],
    correct: 1,
    accent: '#38bdf8',
  },
  {
    subject: 'Physics',
    chapter: 'Rotational Motion',
    difficulty: 'JEE Main',
    body: 'A solid sphere rolls without slipping down an incline of angle θ. The acceleration is:',
    options: ['g sinθ', '⁵⁄₇ g sinθ', '²⁄₃ g sinθ', '³⁄₅ g sinθ'],
    correct: 1,
    accent: '#a78bfa',
  },
  {
    subject: 'Maths',
    chapter: 'Definite Integrals',
    difficulty: 'JEE Advanced',
    body: 'Evaluate ∫₀^(π/2) ln(sin x) dx.',
    options: ['−π≄2 ln 2', 'π ln 2', '0', 'π≄4 ln 2'],
    correct: 0,
    accent: '#34d399',
  },
  {
    subject: 'Biology',
    chapter: 'Molecular Basis of Inheritance',
    difficulty: 'NEET',
    body: 'Okazaki fragments are joined together by the enzyme:',
    options: ['DNA helicase', 'DNA polymerase III', 'DNA ligase', 'Primase'],
    correct: 2,
    accent: '#fbbf24',
  },
];

function Ember({ intensity = 1.1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = () => ({
      x: w / 2 + (Math.random() - 0.5) * 60,
      y: h * 0.82 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.5 - Math.random() * 1.0 * intensity,
      life: 0,
      max: 90 + Math.random() * 110,
      size: 0.8 + Math.random() * 1.6,
      hue: 18 + Math.random() * 30,
    });

    const tick = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const target = Math.floor(22 * intensity);
      while (particlesRef.current.length < target) particlesRef.current.push(spawn());

      const cx = w / 2, cy = h * 0.82;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      grad.addColorStop(0,    'hsla(22,90%,55%,0.22)');
      grad.addColorStop(0.45, 'hsla(14,90%,42%,0.10)');
      grad.addColorStop(1,    'hsla(10,90%,30%,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      const next: typeof particlesRef.current = [];
      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx + Math.sin((p.life + p.y) * 0.04) * 0.3;
        p.y += p.vy;
        p.vy -= 0.004;
        const t = p.life / p.max;
        if (t >= 1) continue;
        const alpha = (1 - t) * 0.45;
        const r = p.size * (1 - t * 0.5);
        ctx.fillStyle = `hsla(${p.hue},90%,${58 - t * 30}%,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      particlesRef.current = next;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [intensity]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

function QuestionCard() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const q = SAMPLE_QUESTIONS[idx];
    const t = setTimeout(() => setPicked(q.correct), 1400);
    const r = setTimeout(() => setRevealed(true), 2200);
    const n = setTimeout(() => {
      setRevealed(false); setPicked(null);
      setIdx((i) => (i + 1) % SAMPLE_QUESTIONS.length);
    }, 4800);
    return () => { clearTimeout(t); clearTimeout(r); clearTimeout(n); };
  }, [idx]);

  const q = SAMPLE_QUESTIONS[idx];

  return (
    <div
      key={idx}
      style={{
        position: 'relative',
        width: 'min(420px, 88%)',
        padding: '18px 18px 14px',
        background: 'linear-gradient(180deg, rgba(20,20,32,0.88), rgba(14,14,22,0.94))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,138,61,0.06)',
        pointerEvents: 'auto',
        animation: 'crucibleHeroCardIn 380ms cubic-bezier(.2,.7,.2,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontWeight: 600,
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          padding: '3px 7px',
          borderRadius: 4,
          background: `${q.accent}2e`,
          color: q.accent,
        }}>{q.subject}</span>
        <span style={{ color: 'rgba(245,244,242,0.26)' }}>·</span>
        <span style={{ color: 'rgba(245,244,242,0.62)' }}>{q.chapter}</span>
        <span style={{
          marginLeft: 'auto',
          padding: '3px 8px',
          background: 'rgba(255,138,61,0.10)',
          color: '#FFD18A',
          border: '1px solid rgba(255,138,61,0.22)',
          borderRadius: 4,
          fontSize: 10,
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          letterSpacing: '0.06em',
        }}>{q.difficulty}</span>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.45, color: '#f5f4f2', marginBottom: 12 }}>{q.body}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {q.options.map((opt, i) => {
          const isCorrect = revealed && i === q.correct;
          const isPicked = picked === i && !revealed;
          const isWrong = revealed && picked === i && i !== q.correct;
          let bg = 'rgba(255,255,255,0.025)';
          let border = '1px solid rgba(255,255,255,0.06)';
          let color = 'rgba(245,244,242,0.86)';
          let keyBg = 'rgba(255,255,255,0.05)';
          let keyColor = 'rgba(245,244,242,0.62)';
          if (isCorrect) {
            border = '1px solid rgba(110,231,183,0.5)';
            bg = 'rgba(110,231,183,0.10)';
            color = 'rgb(180,255,220)';
            keyBg = 'rgba(110,231,183,0.18)';
            keyColor = 'rgb(110,231,183)';
          } else if (isPicked) {
            border = '1px solid rgba(255,138,61,0.45)';
            bg = 'rgba(255,138,61,0.08)';
            keyBg = 'rgba(255,138,61,0.18)';
            keyColor = '#FFD18A';
          } else if (isWrong) {
            border = '1px solid rgba(245,100,100,0.4)';
            bg = 'rgba(245,100,100,0.08)';
          }
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px',
              background: bg, border, borderRadius: 8,
              fontSize: 13, color,
              transition: 'all 220ms ease',
            }}>
              <span style={{
                width: 20, height: 20,
                display: 'grid', placeItems: 'center',
                background: keyBg, borderRadius: 4,
                fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                fontSize: 10, color: keyColor,
              }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {isCorrect && <span style={{ color: 'rgb(110,231,183)', fontWeight: 600 }}>✓</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            key={idx}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FFB46B, #FF8A3D)',
              animation: 'crucibleHeroTimer 4.8s linear forwards',
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: 'rgba(245,244,242,0.42)', fontFamily: 'ui-monospace, "JetBrains Mono", monospace' }}>
          avg <span style={{ color: 'rgba(245,244,242,0.86)' }}>1m 42s</span>
        </div>
      </div>
    </div>
  );
}

function StreakBadge() {
  const days = [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1];
  return (
    <div style={{
      position: 'absolute', bottom: 18, right: 18,
      background: 'linear-gradient(180deg, rgba(20,20,32,0.92), rgba(14,14,22,0.96))',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 12,
      padding: '12px 14px',
      pointerEvents: 'auto',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
      animation: 'crucibleHeroFloat 6s ease-in-out infinite 1s',
    }}>
      <div style={{
        fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
        fontSize: 9,
        letterSpacing: '0.16em',
        color: 'rgba(245,244,242,0.42)',
        marginBottom: 4,
      }}>STREAK</div>
      <div style={{ display: 'flex', gap: 3, margin: '4px 0' }}>
        {days.map((d, i) => (
          <span key={i} style={{
            width: 8, height: 12, borderRadius: 2,
            background: d ? 'linear-gradient(180deg, #FFB46B, #FF8A3D)' : 'rgba(255,255,255,0.08)',
            boxShadow: d ? '0 0 6px rgba(255,138,61,0.4)' : 'none',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(245,244,242,0.62)', marginTop: 2 }}>14 days · don&apos;t break it</div>
    </div>
  );
}

export default function CrucibleHero({ isMobile }: CrucibleHeroProps) {
  const headline = 'One question at a time. Until the rank is yours.';
  const sub = 'Crucible is where serious JEE, NEET & BITSAT aspirants drill. 7,000+ exam-grade questions, mode-based practice, and a rank that moves with every answer.';
  const differentiators = [
    'Audio & video explanations',
    'Hand-drawn, colour-coded mechanisms',
    'Detailed solutions with NCERT references',
  ];

  const headlineParts = headline.split(FLAME_WORDS);
  const headlineSize = isMobile ? 'clamp(28px, 8vw, 38px)' : 'clamp(34px, 4.2vw, 52px)';

  return (
    <>
      <style>{`
        @keyframes crucibleHeroCardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes crucibleHeroTimer { from { width: 0; } to { width: 100%; } }
        @keyframes crucibleHeroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes crucibleHeroRing {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.25; }
          50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.08; }
        }
      `}</style>

      <section style={{
        position: 'relative',
        margin: isMobile ? '0 0 20px' : '0 0 24px',
        padding: isMobile ? '32px 0 0' : '50px 0 0',
        animation: 'fadeUp 0.5s ease-out',
      }}>
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
          gap: 20,
          alignItems: 'stretch',
          minHeight: isMobile ? 'auto' : 340,
        }}>
          {/* LEFT: copy */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: 14, padding: '8px 0',
          }}>
            <h1 style={{
              fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
              fontWeight: 700,
              fontSize: headlineSize,
              lineHeight: 1.04,
              letterSpacing: '-0.025em',
              margin: 0,
              color: '#f5f4f2',
              textWrap: 'balance' as const,
            }}>
              {headlineParts.map((part, i) => {
                if (/^(fire|rank|forge)$/i.test(part)) {
                  return (
                    <span key={i} style={{
                      background: 'linear-gradient(180deg, #FFE08A 0%, #FF8A3D 50%, #B73B1F 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      fontStyle: 'italic',
                      fontFamily: '"Fraunces", "Georgia", serif',
                      fontWeight: 600,
                    }}>{part}</span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </h1>

            <p style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: 'rgba(245,244,242,0.62)',
              maxWidth: 520,
              margin: 0,
            }}>{sub}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: '0.16em',
                color: '#FFD18A',
                textTransform: 'uppercase',
              }}>
                <span style={{ width: 18, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,138,61,0.6))' }} />
                Only Crucible gives you
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                {differentiators.map((d) => (
                  <span key={d} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '7px 14px',
                    background: 'rgba(255,138,61,0.06)',
                    border: '1px solid rgba(255,138,61,0.22)',
                    borderRadius: 999,
                    fontSize: 14,
                    color: 'rgba(245,244,242,0.95)',
                    lineHeight: 1.25,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2 6l2.8 2.8L10 3.4" stroke="#FF8A3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {d}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: ember glow + question card + streak */}
          {!isMobile && (
            <div style={{
              position: 'relative',
              minHeight: 340,
            }}>
              {/* Soft radial glow behind the card */}
              <div style={{
                position: 'absolute',
                inset: '-60px -20% -180px -20%',
                background: 'radial-gradient(ellipse 55% 42% at 50% 36%, rgba(255,138,61,0.24), rgba(255,138,61,0.06) 50%, transparent 80%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <Ember intensity={0.85} />
                <div style={ringStyle(200, '5s', '0s', 0.18)} />
                <div style={ringStyle(340, '5s', '0.8s', 0.10)} />
                <div style={ringStyle(520, '5s', '1.6s', 0.05)} />
              </div>

              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                <QuestionCard />
                <StreakBadge />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ringStyle(size: number, duration: string, delay: string, opacity: number): CSSProperties {
  return {
    position: 'absolute',
    left: '50%', top: '78%',
    width: size, height: size,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    border: '1px solid rgba(255,138,61,0.10)',
    opacity,
    animation: `crucibleHeroRing ${duration} ease-in-out infinite ${delay}`,
  };
}

