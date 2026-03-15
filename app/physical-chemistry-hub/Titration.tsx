'use client';

import { useEffect, useRef } from 'react';

export default function Titration() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const stateRef = useRef({
    type: 'SA-SB',
    indicator: 'phenolphthalein',
    vAdded: 0,
    currentPH: 1.0,
    ka: 1e-5,
    kb: 1e-5,
    c: 0.1,
    v0: 50
  });

  useEffect(() => {
    // Load Chart.js dynamically if not already loaded
    const loadChart = async () => {
      if (!(window as any).Chart) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      initAll();
    };
    loadChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  function calculatePH(v: number): number {
    const state = stateRef.current;
    const v0 = state.v0;
    const c = state.c;

    if (state.type === 'SA-SB') {
      if (v < v0) {
        const h = (v0 * c - v * c) / (v0 + v);
        return -Math.log10(h);
      } else if (v === v0) {
        return 7.0;
      } else {
        const oh = (v * c - v0 * c) / (v0 + v);
        return 14.0 + Math.log10(oh);
      }
    } else if (state.type === 'WA-SB') {
      const pKa = -Math.log10(state.ka);
      if (v === 0) {
        return 0.5 * (pKa - Math.log10(c));
      } else if (v < v0) {
        return pKa + Math.log10(v / (v0 - v));
      } else if (v === v0) {
        const cSalt = (v0 * c) / (v0 + v);
        const pOH = 0.5 * (14 - pKa - Math.log10(cSalt));
        return 14.0 - pOH;
      } else {
        const oh = (v * c - v0 * c) / (v0 + v);
        return 14.0 + Math.log10(oh);
      }
    } else if (state.type === 'SB-SA') {
      if (v < v0) {
        const oh = (v0 * c - v * c) / (v0 + v);
        return 14.0 + Math.log10(oh);
      } else if (v === v0) {
        return 7.0;
      } else {
        const h = (v * c - v0 * c) / (v0 + v);
        return -Math.log10(h);
      }
    } else if (state.type === 'WB-SA') {
      const pKb = -Math.log10(state.kb);
      if (v === 0) {
        const pOH = 0.5 * (pKb - Math.log10(c));
        return 14.0 - pOH;
      } else if (v < v0) {
        const pOH = pKb + Math.log10(v / (v0 - v));
        return 14.0 - pOH;
      } else if (v === v0) {
        const cSalt = (v0 * c) / (v0 + v);
        return 0.5 * (14 - pKb - Math.log10(cSalt));
      } else {
        const h = (v * c - v0 * c) / (v0 + v);
        return -Math.log10(h);
      }
    }
    return 7.0;
  }

  function generateCurveData() {
    const data: { x: number; y: number }[] = [];
    for (let v = 0; v <= 100; v += 0.5) {
      if (Math.abs(v - 50) < 1 && v !== 50) {
        data.push({ x: v - 0.1, y: calculatePH(v - 0.1) });
        data.push({ x: v, y: calculatePH(v) });
        data.push({ x: v + 0.1, y: calculatePH(v + 0.1) });
      } else {
        data.push({ x: v, y: calculatePH(v) });
      }
    }
    return data.sort((a, b) => a.x - b.x);
  }

  function getIndicatorColor(ph: number): string {
    const state = stateRef.current;
    if (state.indicator === 'phenolphthalein') {
      if (ph < 8.2) return 'transparent';
      if (ph >= 8.2 && ph < 10.0) return 'rgba(244, 114, 182, 0.5)';
      return 'rgba(219, 39, 119, 0.9)';
    } else if (state.indicator === 'methylOrange') {
      if (ph < 3.2) return 'rgba(239, 68, 68, 0.85)';
      if (ph >= 3.2 && ph < 4.4) return 'rgba(249, 115, 22, 0.85)';
      return 'rgba(250, 204, 21, 0.85)';
    }
    return 'transparent';
  }

  function getPHColor(ph: number): string {
    if (ph < 3) return '#ef4444';
    if (ph < 6) return '#f97316';
    if (ph < 8) return '#22c55e';
    if (ph < 11) return '#3b82f6';
    return '#a855f7';
  }

  function getPHDesc(ph: number): string {
    if (ph < 2) return 'Strongly Acidic';
    if (ph < 5) return 'Acidic';
    if (ph < 6.8) return 'Weakly Acidic';
    if (ph <= 7.2) return 'Neutral';
    if (ph < 10) return 'Weakly Basic';
    if (ph < 12) return 'Basic';
    return 'Strongly Basic';
  }

  function updateExplainer(hotspotIndex: number) {
    const state = stateRef.current;
    const card = document.getElementById('tit-explainer-card');
    const titleEl = document.getElementById('tit-exp-title');
    const textEl = document.getElementById('tit-explainer-text');
    if (!card || !titleEl || !textEl) return;

    let title = '', html = '';

    if (hotspotIndex === 0) {
      title = 'Region 1: Initial State (0 mL added)';
      if (state.type === 'SA-SB') html = `Flask contains purely Strong Acid. Dissociation is 100%.<br><em>[H⁺] = C = 0.1 M</em> &nbsp;⇒&nbsp; <strong>pH = 1.00</strong>`;
      else if (state.type === 'WA-SB') html = `Flask contains purely Weak Acid. Partial dissociation.<br><em>pH = ½(pKₐ - log C)</em> &nbsp;⇒&nbsp; <strong>pH = 3.00</strong>`;
      else if (state.type === 'SB-SA') html = `Flask contains purely Strong Base. Dissociation is 100%.<br><em>[OH⁻] = C = 0.1 M</em> &nbsp;⇒&nbsp; <strong>pH = 13.00</strong>`;
      else if (state.type === 'WB-SA') html = `Flask contains purely Weak Base. Partial dissociation.<br><em>pOH = ½(pKb - log C)</em> &nbsp;⇒&nbsp; <strong>pH = 11.00</strong>`;
    } else if (hotspotIndex === 1) {
      title = 'Region 2: Pre-Equivalence (25 mL added)';
      if (state.type === 'SA-SB' || state.type === 'SB-SA') {
        html = `The strong titrant neutralizes the strong analyte, but unreacted analyte still remains. The pH changes gradually but it is <strong>NOT a true buffer</strong>.`;
      } else if (state.type === 'WA-SB') {
        html = `<strong style="color:#fbbf24;">Buffer Region!</strong> Unreacted Weak Acid coexists with its conjugate base salt. At exactly half-equivalence (25 mL), [Salt] = [Acid], so <em>pH = pKₐ = 5.0</em>.`;
      } else if (state.type === 'WB-SA') {
        html = `<strong style="color:#fbbf24;">Buffer Region!</strong> Unreacted Weak Base coexists with its conjugate acid salt. At exactly half-equivalence, [Salt] = [Base], so <em>pOH = pKb = 5.0</em>.`;
      }
    } else if (hotspotIndex === 2) {
      title = 'Region 3: Equivalence Point (50 mL added)';
      if (state.type === 'SA-SB' || state.type === 'SB-SA') {
        html = `Moles of acid exactly equal moles of base. Only a neutral salt and water remain. Neither ion hydrolyzes. <strong style="color:#2dd4bf;">pH is exactly 7.00.</strong> Both indicators work because the vertical jump spans pH 3 to 11.`;
      } else if (state.type === 'WA-SB') {
        html = `Moles are equal, but the salt undergoes <strong style="color:#2dd4bf;">Anionic Hydrolysis</strong>. The conjugate base grabs H⁺ from water, releasing OH⁻. <strong>pH &gt; 7 (Basic).</strong> Phenolphthalein is the correct indicator.`;
      } else if (state.type === 'WB-SA') {
        html = `Moles are equal, but the salt undergoes <strong style="color:#2dd4bf;">Cationic Hydrolysis</strong>. The conjugate acid grabs OH⁻, releasing H⁺. <strong>pH &lt; 7 (Acidic).</strong> Methyl Orange is the correct indicator.`;
      }
    } else if (hotspotIndex === 3) {
      title = 'Region 4: Post-Equivalence / Excess (80 mL added)';
      if (state.type.endsWith('SB')) html = `The flask is now flooded with excess Strong Base titrant from the burette. The pH is dominated entirely by the excess [OH⁻].`;
      else html = `The flask is now flooded with excess Strong Acid titrant from the burette. The pH is dominated entirely by the excess [H⁺].`;
    }

    titleEl.textContent = title;
    textEl.innerHTML = html;
    card.classList.remove('tit-active');
    void (card as HTMLElement).offsetWidth;
    card.classList.add('tit-active');
  }

  function updateDOM() {
    const state = stateRef.current;
    state.currentPH = calculatePH(state.vAdded);

    const slider = document.getElementById('tit-vol-slider') as HTMLInputElement;
    if (slider) slider.value = String(state.vAdded);

    const volVal = document.getElementById('tit-vol-val');
    if (volVal) volVal.innerHTML = `${state.vAdded.toFixed(1)} <span style="font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-family:Inter,sans-serif">mL</span>`;

    const phEl = document.getElementById('tit-ph-readout');
    if (phEl) {
      phEl.textContent = state.currentPH.toFixed(2);
      (phEl as HTMLElement).style.color = getPHColor(state.currentPH);
    }

    const phDesc = document.getElementById('tit-ph-desc');
    if (phDesc) phDesc.textContent = getPHDesc(state.currentPH);

    const marker = document.getElementById('tit-ph-marker');
    if (marker) (marker as HTMLElement).style.left = `${(state.currentPH / 14) * 100}%`;

    const liquid = document.getElementById('tit-flask-liquid');
    if (liquid) {
      (liquid as HTMLElement).style.background = getIndicatorColor(state.currentPH);
      (liquid as HTMLElement).style.height = `${20 + (state.vAdded / 100) * 60}%`;
    }

    const analyteName = state.type.split('-')[0];
    const map: Record<string, string> = { SA: 'Strong Acid', WA: 'Weak Acid', SB: 'Strong Base', WB: 'Weak Base' };
    const flaskContents = document.getElementById('tit-flask-contents');
    if (flaskContents) flaskContents.textContent = `Analyte: ${map[analyteName]}`;

    const drop = document.getElementById('tit-burette-drop');
    if (drop) (drop as HTMLElement).style.display = state.vAdded > 0 && state.vAdded < 100 ? 'block' : 'none';

    updateChartData();
  }

  function updateChartData() {
    const state = stateRef.current;
    const chart = chartInstanceRef.current;
    if (!chart) return;

    chart.data.datasets[0].data = generateCurveData();
    const hotspots = [
      { x: 0, y: calculatePH(0) },
      { x: 25, y: calculatePH(25) },
      { x: 50, y: calculatePH(50) },
      { x: 80, y: calculatePH(80) }
    ];
    chart.data.datasets[1].data = hotspots;
    chart.data.datasets[2].data = [{ x: state.vAdded, y: state.currentPH }];
    chart.data.datasets[2].borderColor = getPHColor(state.currentPH);
    chart.update();
  }

  function initChart() {
    const Chart = (window as any).Chart;
    if (!Chart || !chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const state = stateRef.current;

    const indicatorBandsPlugin = {
      id: 'titIndicatorBands',
      beforeDatasetsDraw(chart: any) {
        const ctx = chart.ctx;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;
        const left = xAxis.left;
        const right = xAxis.right;

        function drawBand(minPH: number, maxPH: number, color: string) {
          const top = yAxis.getPixelForValue(maxPH);
          const bottom = yAxis.getPixelForValue(minPH);
          ctx.fillStyle = color;
          ctx.fillRect(left, top, right - left, bottom - top);
        }

        if (state.indicator === 'phenolphthalein') drawBand(8.2, 10.0, 'rgba(244,114,182,0.15)');
        if (state.indicator === 'methylOrange') drawBand(3.2, 4.4, 'rgba(251,146,60,0.15)');
      }
    };

    chartInstanceRef.current = new Chart(chartRef.current.getContext('2d'), {
      type: 'line',
      plugins: [indicatorBandsPlugin],
      data: {
        datasets: [
          {
            label: 'Curve',
            data: generateCurveData(),
            borderColor: '#2dd4bf',
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.1
          },
          {
            label: 'Hotspots',
            data: [],
            backgroundColor: '#080c14',
            borderColor: '#fbbf24',
            borderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            showLine: false
          },
          {
            label: 'Current',
            data: [{ x: 0, y: 1 }],
            backgroundColor: '#fff',
            borderColor: '#3b82f6',
            borderWidth: 4,
            pointRadius: 10,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: true },
        scales: {
          x: {
            type: 'linear', min: 0, max: 100,
            grid: { display: false },
            ticks: { color: '#64748b' },
            title: { display: true, text: 'Volume of Titrant Added (mL)', color: '#94a3b8', font: { size: 12 } }
          },
          y: {
            type: 'linear', min: 0, max: 14,
            ticks: { stepSize: 2, color: '#64748b' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            title: { display: true, text: 'pH', color: '#94a3b8', font: { size: 12 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx: any) {
                if (ctx.datasetIndex === 1) return 'Click to Analyze Region';
                return `Vol: ${ctx.parsed.x} mL | pH: ${ctx.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        onClick: (_event: any, elements: any[]) => {
          if (elements.length > 0 && elements[0].datasetIndex === 1) {
            updateExplainer(elements[0].index);
          }
        }
      }
    });

    updateDOM();
  }

  function initAll() {
    initChart();
    updateDOM();
  }

  function addVol(amt: number) {
    stateRef.current.vAdded = Math.max(0, Math.min(100, stateRef.current.vAdded + amt));
    updateDOM();
  }

  function goToEq() {
    stateRef.current.vAdded = stateRef.current.v0;
    updateDOM();
    updateExplainer(2);
  }

  function resetSim() {
    stateRef.current.vAdded = 0;
    const card = document.getElementById('tit-explainer-card');
    if (card) card.classList.remove('tit-active');
    updateDOM();
  }

  function onTypeChange(val: string) {
    stateRef.current.type = val;
    // re-init chart to update indicatorBands plugin closure
    initChart();
    resetSim();
  }

  function onIndicatorChange(val: string) {
    stateRef.current.indicator = val;
    // re-init chart so indicatorBands plugin re-reads stateRef
    initChart();
    updateDOM();
  }

  function onSliderChange(val: string) {
    stateRef.current.vAdded = parseFloat(val);
    updateDOM();
  }

  return (
    <>
      <style>{`
        .tit-eqn { font-family: 'Crimson Pro', serif; font-size: 18px; letter-spacing: 0.5px; display: inline-block; padding: 0 2px; }
        .tit-mono { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .tit-section-title { font-size: 17px; font-weight: 600; color: #d6e0f5; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tit-section-title::before { content: ''; width: 4px; height: 18px; background: #2dd4bf; border-radius: 4px; flex-shrink: 0; }

        .tit-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; }
        .tit-page-header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .tit-page-header h1 span { color: #2dd4bf; font-style: italic; font-family: 'Crimson Pro', serif; }
        .tit-bc { font-size: 12px; color: #64748b; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
        .tit-live-badge { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #2dd4bf; background: rgba(45,212,191,0.1); padding: 6px 14px; border-radius: 30px; border: 1px solid rgba(45,212,191,0.2); text-transform: uppercase; letter-spacing: 1px; }
        .tit-pulse-dot { width: 8px; height: 8px; background: #2dd4bf; border-radius: 50%; animation: titPulse 2s infinite; flex-shrink: 0; }
        @keyframes titPulse { 0% { box-shadow: 0 0 0 0 rgba(45,212,191,0.7); } 70% { box-shadow: 0 0 0 10px rgba(45,212,191,0); } 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0); } }

        .tit-dashboard { display: flex; flex-direction: column; gap: 20px; }
        .tit-setup-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        @media(max-width: 960px) { .tit-setup-row { grid-template-columns: 1fr; } }

        .tit-dash-card { background: #111827; border: 1px solid #374151; border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); position: relative; }
        .tit-card-header { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }

        .tit-seg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 12px; border: 1px solid #374151; }
        .tit-seg-lbl { text-align: center; cursor: pointer; position: relative; }
        .tit-seg-lbl input[type="radio"] { opacity: 0; position: absolute; width: 0; height: 0; }
        .tit-seg-btn { display: block; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #64748b; transition: all 0.2s; }
        .tit-seg-lbl:hover .tit-seg-btn { color: #d6e0f5; }
        .tit-seg-lbl input[type="radio"]:checked + .tit-seg-btn { color: #fff; background: #1f2937; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid #374151; }
        .tit-ind-lbl { text-align: left; cursor: pointer; position: relative; display: block; }
        .tit-ind-lbl input[type="radio"] { opacity: 0; position: absolute; width: 0; height: 0; }
        .tit-ind-btn { display: block; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #64748b; transition: all 0.2s; border: 1px solid #374151; background: rgba(0,0,0,0.2); }
        .tit-ind-lbl input[type="radio"]:checked + .tit-ind-btn { color: #fff; background: #1f2937; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-color: #2dd4bf; }

        .tit-main-stage { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
        @media(max-width: 960px) { .tit-main-stage { grid-template-columns: 1fr; } }

        .tit-chart-container { height: 440px; position: relative; }

        .tit-sensor-pod { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 28px; }
        .tit-ph-readout-wrapper { text-align: center; width: 100%; }
        .tit-ph-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
        .tit-ph-value { font-family: 'JetBrains Mono', monospace; font-size: 60px; font-weight: 800; line-height: 1; margin: 4px 0 16px; transition: color 0.3s ease; color: #ef4444; }
        .tit-spectrum-track { width: 100%; height: 12px; border-radius: 10px; background: linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #6366f1, #8b5cf6, #d946ef); position: relative; margin-bottom: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.4); }
        .tit-spectrum-marker { position: absolute; top: -6px; left: 0%; width: 4px; height: 24px; background: #fff; border-radius: 4px; box-shadow: 0 0 10px rgba(255,255,255,0.8); transition: left 0.3s cubic-bezier(0.4,0,0.2,1); transform: translateX(-50%); z-index: 2; }
        .tit-spectrum-labels { display: flex; justify-content: space-between; width: 100%; font-size: 10px; font-weight: 700; color: #64748b; font-family: 'JetBrains Mono', monospace; }

        .tit-flask-container { position: relative; display: flex; flex-direction: column; align-items: center; margin-top: 10px; }
        .tit-burette-tip { width: 6px; height: 20px; background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4)); border-radius: 0 0 3px 3px; position: relative; }
        .tit-drop { width: 6px; height: 10px; background: rgba(255,255,255,0.6); border-radius: 50%; position: absolute; left: 0; top: 100%; animation: titDrip 1s infinite; display: none; }
        @keyframes titDrip { 0% { transform: translateY(0) scale(0.8); opacity: 1; } 50% { transform: translateY(30px) scale(1); opacity: 1; } 100% { transform: translateY(60px) scale(0.5); opacity: 0; } }
        .tit-flask { width: 100px; height: 100px; margin-top: 8px; position: relative; clip-path: polygon(35% 0%, 65% 0%, 65% 25%, 100% 100%, 0% 100%, 35% 25%); background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.2); overflow: hidden; display: flex; align-items: flex-end; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); }
        .tit-flask-liquid { width: 100%; height: 50%; background: transparent; transition: background 0.4s ease, height 0.3s ease; box-shadow: inset 0 4px 15px rgba(255,255,255,0.2); }

        .tit-action-bar { display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); border: 1px solid #374151; border-radius: 16px; padding: 20px 24px; }
        .tit-vol-display { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; color: #2dd4bf; }
        .tit-action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .tit-btn-action { background: #1f2937; border: 1px solid #374151; color: #d6e0f5; padding: 10px 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .tit-btn-action:hover { background: rgba(45,212,191,0.1); border-color: #2dd4bf; color: #2dd4bf; transform: translateY(-2px); }
        .tit-btn-action:active { transform: translateY(0); }
        .tit-btn-primary { background: rgba(45,212,191,0.15); color: #2dd4bf; border-color: #2dd4bf; }
        .tit-btn-reset { background: rgba(244,63,94,0.1); color: #f43f5e; border-color: rgba(244,63,94,0.3); }
        .tit-btn-reset:hover { background: #f43f5e; color: #fff; border-color: #f43f5e; }
        .tit-action-slider { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 12px; }
        .tit-action-slider input[type="range"] { flex: 1; accent-color: #2dd4bf; }

        .tit-theory-section { margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 36px; }
        .tit-bento-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .tit-bento-card { background: #111827; border: 1px solid #374151; border-radius: 16px; padding: 24px; }
        .tit-ind-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13.5px; }
        .tit-ind-table th { text-align: left; padding: 8px; color: #64748b; border-bottom: 1px solid #374151; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        .tit-ind-table td { padding: 10px 8px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #9eb1d1; }

        .tit-explainer-card { background: rgba(192,132,252,0.05); border: 1px solid #c084fc; border-radius: 8px; padding: 16px; margin-top: 16px; font-size: 14px; color: #d6e0f5; display: none; line-height: 1.6; }
        .tit-explainer-card.tit-active { display: block; animation: titFadeIn 0.3s ease; }
        @keyframes titFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Page Header */}
      <div className="tit-page-header">
        <div>
          <div className="tit-bc">Chemistry Visualized · Ionic Equilibrium</div>
          <h1>Acid-Base <span>Titrations</span></h1>
        </div>
        <div className="tit-live-badge"><div className="tit-pulse-dot"></div> Live Simulator</div>
      </div>

      <div className="tit-dashboard">

        {/* ROW 1: SETUP */}
        <div className="tit-setup-row">
          {/* Reaction System */}
          <div className="tit-dash-card">
            <div className="tit-card-header">1. Reaction System Configurator</div>
            <div className="tit-seg-grid">
              {[
                { val: 'SA-SB', label: 'Strong Acid + Strong Base' },
                { val: 'WA-SB', label: 'Weak Acid + Strong Base' },
                { val: 'SB-SA', label: 'Strong Base + Strong Acid' },
                { val: 'WB-SA', label: 'Weak Base + Strong Acid' },
              ].map(opt => (
                <label key={opt.val} className="tit-seg-lbl">
                  <input type="radio" name="tit_titration_type" value={opt.val} defaultChecked={opt.val === 'SA-SB'} onChange={() => onTypeChange(opt.val)} />
                  <span className="tit-seg-btn">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Indicator Selection */}
          <div className="tit-dash-card">
            <div className="tit-card-header">2. Indicator Dye</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { val: 'phenolphthalein', label: 'Phenolphthalein', range: 'pH 8.2 – 10' },
                { val: 'methylOrange', label: 'Methyl Orange', range: 'pH 3.2 – 4.4' },
              ].map(ind => (
                <label key={ind.val} className="tit-ind-lbl">
                  <input type="radio" name="tit_ind_type" value={ind.val} defaultChecked={ind.val === 'phenolphthalein'} onChange={() => onIndicatorChange(ind.val)} />
                  <span className="tit-ind-btn">
                    {ind.label} <span style={{ color: '#64748b', fontWeight: 400, float: 'right' }}>{ind.range}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: MAIN STAGE */}
        <div className="tit-main-stage">
          {/* Chart */}
          <div className="tit-dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="tit-card-header" style={{ margin: 0, border: 'none', padding: 0 }}>Titration Curve</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>*Click glowing nodes for chemical analysis</div>
            </div>
            <div className="tit-chart-container" style={{ flex: 1 }}>
              <canvas ref={chartRef} id="titrationChart"></canvas>
            </div>
            <div className="tit-explainer-card" id="tit-explainer-card">
              <strong style={{ color: '#c084fc' }} id="tit-exp-title">Region Analysis</strong>
              <div style={{ marginTop: '8px' }} id="tit-explainer-text"></div>
            </div>
          </div>

          {/* Live Sensor Pod */}
          <div className="tit-dash-card tit-sensor-pod">
            <div className="tit-ph-readout-wrapper">
              <div className="tit-ph-label">Live pH Sensor</div>
              <div className="tit-ph-value" id="tit-ph-readout">1.00</div>
              <div style={{ padding: '0 10px' }}>
                <div className="tit-spectrum-track">
                  <div className="tit-spectrum-marker" id="tit-ph-marker"></div>
                </div>
                <div className="tit-spectrum-labels">
                  <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '16px', fontWeight: 600, textTransform: 'uppercase' }} id="tit-ph-desc">Strongly Acidic</div>
            </div>

            <div className="tit-flask-container">
              <div className="tit-burette-tip">
                <div className="tit-drop" id="tit-burette-drop"></div>
              </div>
              <div className="tit-flask">
                <div className="tit-flask-liquid" id="tit-flask-liquid"></div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }} id="tit-flask-contents">Analyte: Strong Acid</div>
            </div>
          </div>
        </div>

        {/* ROW 3: ACTION BAR */}
        <div className="tit-action-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Titrant Added</div>
              <div className="tit-vol-display" id="tit-vol-val">0.0 <span style={{ fontSize: '14px', color: '#64748b' }}>mL</span></div>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#374151' }}></div>
            <div className="tit-action-slider">
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>0</span>
              <input type="range" id="tit-vol-slider" min="0" max="100" step="0.5" defaultValue="0" onChange={e => onSliderChange(e.target.value)} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>100</span>
            </div>
          </div>
          <div className="tit-action-buttons">
            <button className="tit-btn-action" onClick={() => addVol(-5)}>-5</button>
            <button className="tit-btn-action" onClick={() => addVol(-1)}>-1</button>
            <button className="tit-btn-action" onClick={() => addVol(1)}>+1</button>
            <button className="tit-btn-action" onClick={() => addVol(5)}>+5</button>
            <button className="tit-btn-action tit-btn-primary" onClick={goToEq}>→ Eq. Point</button>
            <button className="tit-btn-action tit-btn-reset" onClick={resetSim}>↺ Reset</button>
          </div>
        </div>
      </div>

      {/* THEORY SECTION */}
      <section className="tit-theory-section">
        <div className="tit-section-title">Theory &amp; Concepts</div>
        <p style={{ color: '#9eb1d1', marginBottom: '24px' }}>Mastering the terminology and logic behind the curves.</p>
        <div className="tit-bento-grid">
          <div className="tit-bento-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2dd4bf', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What is Titration?</div>
            <p style={{ color: '#9eb1d1', fontSize: '14px' }}>A quantitative technique to calculate the <strong>unknown concentration</strong> of an analyte (in the flask) by slowly adding a <strong>known concentration</strong> of titrant (from the burette).</p>
            <div style={{ marginTop: '20px', borderTop: '1px dashed #374151', paddingTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>🎯 Equivalence Point (Theoretical)</div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>The exact mathematical point where stoichiometrically equivalent moles of acid and base have reacted completely.</p>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6', marginBottom: '4px' }}>👁️ End Point (Visual)</div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>The point where the physical indicator changes color. It should ideally overlap with the steep jump of the equivalence point.</p>
            </div>
          </div>

          <div className="tit-bento-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2dd4bf', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Indicator Reference</div>
            <p style={{ color: '#9eb1d1', fontSize: '13px' }}>Indicators are weak organic acids/bases that change color over a specific pH range. An indicator is only suitable if its range falls entirely within the vertical portion of the titration curve.</p>
            <table className="tit-ind-table" style={{ marginTop: '16px' }}>
              <tbody>
                <tr><th>Indicator</th><th>Acid Color</th><th>Base Color</th><th>pH Range</th></tr>
                <tr><td>Methyl Orange</td><td style={{ color: '#f87171', fontWeight: 600 }}>Red</td><td style={{ color: '#fde047', fontWeight: 600 }}>Yellow</td><td style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>3.2 – 4.4</td></tr>
                <tr><td>Bromothymol Blue</td><td style={{ color: '#fde047', fontWeight: 600 }}>Yellow</td><td style={{ color: '#60a5fa', fontWeight: 600 }}>Blue</td><td style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>6.0 – 7.6</td></tr>
                <tr><td>Phenolphthalein</td><td style={{ color: '#9ca3af', fontStyle: 'italic' }}>Colorless</td><td style={{ color: '#f472b6', fontWeight: 600 }}>Pink</td><td style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>8.2 – 10.0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
