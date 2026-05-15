'use client';

// Wave Dynamics: Interference + Diffraction
// Canvas is the stage — click it to pause/resume.
// All typography inherits Geist Sans from the book's root font.

import { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useAnimationFrame, useResolvedFont } from './_shared';

// Canvas display bounds
const CANVAS_W = 900;
const CANVAS_H = 560;
// Clamp amplitude so the resultant (= 2 * amp) stays inside the canvas.
const AMP_MAX = 60;

export default function WaveDynamicsSim() {
  const [view, setView] = useState<'interference' | 'diffraction'>('interference');
  const [phase, setPhase] = useState(0);
  const [amplitude, setAmplitude] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [slitSpacing, setSlitSpacing] = useState(40);
  const [showGuides, setShowGuides] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFont = useResolvedFont();

  // ── Animation loop ───────────────────────────────────────────────────────
  // Wave aesthetics looked sluggish at real wall-clock pace, so the old loop
  // advanced `time` by 0.05 per frame (= 3.0/sec at 60 fps). We preserve that
  // cadence by scaling delta by 3.0, and gain the shared hook's viewport +
  // tab-visibility pause for free.
  useAnimationFrame(
    (delta) => {
      setTime((prev) => prev + delta * 3.0);
    },
    { target: canvasRef, enabled: isPlaying }
  );

  const togglePlayback = useCallback(() => setIsPlaying(p => !p), []);

  // ── Drawing: Interference ────────────────────────────────────────────────
  const drawInterference = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Three horizontal lanes
    const laneA = 130;
    const laneB = 290;
    const laneR = 440;

    const offsetX = 90;
    const waveWidth = width - offsetX - 40;

    // Lane midlines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.10)';
    ctx.lineWidth = 1;
    [laneA, laneB, laneR].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + waveWidth, y);
      ctx.stroke();
    });

    const drawWave = (
      offsetY: number,
      shift: number,
      color: string,
      label: string,
      weight = 2
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = weight;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      for (let x = 0; x <= waveWidth; x++) {
        const y = Math.sin((x / 30) - time + shift) * amplitude;
        if (x === 0) ctx.moveTo(x + offsetX, y + offsetY);
        else ctx.lineTo(x + offsetX, y + offsetY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.font = `600 14px ${canvasFont}`;
      ctx.fillText(label, 14, offsetY + 4);
    };

    drawWave(laneA, 0, '#60a5fa', 'Wave A');
    drawWave(laneB, phase, '#fb923c', 'Wave B');

    // Resultant (sum)
    ctx.beginPath();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#c084fc';
    for (let x = 0; x <= waveWidth; x++) {
      const w1 = Math.sin((x / 30) - time) * amplitude;
      const w2 = Math.sin((x / 30) - time + phase) * amplitude;
      const y = w1 + w2;
      if (x === 0) ctx.moveTo(x + offsetX, y + laneR);
      else ctx.lineTo(x + offsetX, y + laneR);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#c084fc';
    ctx.font = `600 14px ${canvasFont}`;
    ctx.fillText('Resultant', 14, laneR + 4);
  };

  // ── Drawing: Diffraction ─────────────────────────────────────────────────
  const drawDiffraction = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const slitX = 120;
    const centerY = height / 2;
    const slit1Y = centerY - slitSpacing;
    const slit2Y = centerY + slitSpacing;
    const detectorX = width - 180;
    const lambda = 30;
    const d = slitSpacing * 2;

    // Incoming plane waves
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < slitX; i += 20) {
      const waveX = i + ((time * 15) % 20);
      if (waveX < slitX) {
        ctx.beginPath();
        ctx.moveTo(waveX, height / 4);
        ctx.lineTo(waveX, (height * 3) / 4);
        ctx.stroke();
      }
    }

    // Slit plate
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(slitX, 0); ctx.lineTo(slitX, slit1Y - 8);
    ctx.moveTo(slitX, slit1Y + 8); ctx.lineTo(slitX, slit2Y - 8);
    ctx.moveTo(slitX, slit2Y + 8); ctx.lineTo(slitX, height);
    ctx.stroke();

    // Huygens circular wavelets from each slit
    const drawCircularWaves = (cx: number, cy: number) => {
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#fb923c';
      for (let r = (time * 15) % 30; r < width; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };
    drawCircularWaves(slitX, slit1Y);
    drawCircularWaves(slitX, slit2Y);

    // Intensity pattern on "detector"
    const patternWidth = 50;
    for (let y = 0; y < height; y++) {
      const d1 = Math.sqrt(Math.pow(detectorX - slitX, 2) + Math.pow(y - slit1Y, 2));
      const d2 = Math.sqrt(Math.pow(detectorX - slitX, 2) + Math.pow(y - slit2Y, 2));
      const pathDiff = d1 - d2;
      const k = (2 * Math.PI) / lambda;
      const intensity = Math.pow(Math.cos((k * pathDiff) / 2), 2);

      ctx.fillStyle = `rgba(251, 146, 60, ${intensity * 0.9})`;
      ctx.fillRect(detectorX, y, patternWidth, 1);
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.25})`;
      ctx.fillRect(detectorX, y, patternWidth, 1);
    }

    // Guide lines for maxima / minima
    if (showGuides) {
      const drawGuide = (m: number, type: 'constructive' | 'destructive') => {
        const factor = type === 'constructive' ? m : m + 0.5;
        const val = (factor * lambda) / d;
        if (Math.abs(val) > 1) return;

        const theta = Math.asin(val);
        const endX = detectorX;
        const endY = centerY + Math.tan(theta) * (detectorX - slitX);

        if (endY < 10 || endY > height - 10) return;

        ctx.setLineDash(type === 'constructive' ? [] : [4, 4]);
        ctx.strokeStyle =
          type === 'constructive' ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(slitX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = `600 12px ${canvasFont}`;
        const labelText = type === 'constructive' ? `MAX (m=${m})` : `MIN`;
        const metrics = ctx.measureText(labelText);
        const textWidth = metrics.width;

        ctx.fillStyle = '#0f0b1a';
        ctx.beginPath();
        ctx.roundRect(endX + 5, endY - 11, textWidth + 14, 22, 4);
        ctx.fill();

        ctx.fillStyle = type === 'constructive' ? '#4ade80' : '#f87171';
        ctx.fillText(labelText, endX + 12, endY + 4);
      };

      for (let m = -3; m <= 3; m++) {
        drawGuide(m, 'constructive');
        drawGuide(m, 'destructive');
      }
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 14px ${canvasFont}`;
    ctx.fillText('SLITS', slitX - 60, centerY + 4);
  };

  // ── Render on state change ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;

    if (view === 'interference') {
      drawInterference(ctx, width, height);
    } else {
      drawDiffraction(ctx, width, height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, phase, amplitude, time, slitSpacing, showGuides, canvasFont]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="font-sans my-6 text-purple-100">
      {/* Mode switch */}
      <div className="flex justify-center md:justify-end gap-2 mb-4">
        <button
          onClick={() => setView('interference')}
          className={`font-sans px-4 py-1.5 rounded-full font-bold transition-all text-[11px] border tracking-wider ${
            view === 'interference'
              ? 'bg-purple-600 border-purple-400 text-white'
              : 'bg-transparent border-purple-900/40 text-purple-400 hover:text-purple-300'
          }`}
        >
          INTERFERENCE
        </button>
        <button
          onClick={() => setView('diffraction')}
          className={`font-sans px-4 py-1.5 rounded-full font-bold transition-all text-[11px] border tracking-wider ${
            view === 'diffraction'
              ? 'bg-purple-600 border-purple-400 text-white'
              : 'bg-transparent border-purple-900/40 text-purple-400 hover:text-purple-300'
          }`}
        >
          DIFFRACTION
        </button>
      </div>

      {/* Canvas stage — click to pause/resume */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background: '#150e26',
          border: '1px solid rgba(139,92,246,0.15)',
        }}
        onClick={togglePlayback}
        role="button"
        aria-label={isPlaying ? 'Pause animation' : 'Resume animation'}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full h-auto block"
        />
        {/* Paused indicator — only visible when stopped */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-full bg-black/70 border border-purple-500/40 text-purple-100 text-[11px] font-bold uppercase tracking-[0.18em]">
              Paused · click to resume
            </div>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="font-sans mt-4 flex flex-col md:flex-row md:items-center md:gap-8 gap-5">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-[10px] uppercase tracking-[0.22em] opacity-80 shrink-0">
          <Settings size={13} />
          <span>Controls</span>
        </div>

        {view === 'interference' ? (
          <>
            <SliderControl
              label="Phase Shift"
              value={`${(phase / Math.PI).toFixed(2)}π`}
              min={0}
              max={Math.PI * 2}
              step={0.05}
              raw={phase}
              onChange={setPhase}
            />
            <SliderControl
              label="Amplitude"
              value={`${amplitude}`}
              min={10}
              max={AMP_MAX}
              step={1}
              raw={amplitude}
              onChange={v => setAmplitude(Math.round(v))}
            />
          </>
        ) : (
          <>
            <SliderControl
              label="Slit Spacing"
              value={`${slitSpacing}`}
              min={15}
              max={80}
              step={1}
              raw={slitSpacing}
              onChange={v => setSlitSpacing(Math.round(v))}
            />
            <button
              onClick={() => setShowGuides(!showGuides)}
              className={`font-sans flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[11px] font-bold tracking-wider shrink-0 ${
                showGuides
                  ? 'bg-purple-600/15 border-purple-500 text-purple-100'
                  : 'bg-transparent border-purple-900/40 text-purple-400'
              }`}
            >
              {showGuides ? <Eye size={14} className="text-cyan-400" /> : <EyeOff size={14} />}
              {showGuides ? 'GUIDES ON' : 'GUIDES OFF'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Compact inline slider ────────────────────────────────────────────────
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  raw,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  raw: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="font-sans flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-purple-400 text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
        <span className="text-cyan-400 font-mono text-sm font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={raw}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-purple-900/40 rounded-full appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
}
