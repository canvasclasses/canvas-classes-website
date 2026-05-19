'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { GlowingEffect } from '@/components/ui/glowing-effect';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });
}

export default function GasLaws() {
  useEffect(() => {
    let cancelled = false;

    // Tab switching logic
    const tabBtns = document.querySelectorAll(`.${styles.tabBtn}`);
    const tabPanels = document.querySelectorAll(`.${styles.tabPanel}`);
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = (btn as HTMLElement).dataset.tab;
        tabBtns.forEach(b => b.classList.remove(styles.active));
        tabPanels.forEach(p => p.classList.remove(styles.active));
        btn.classList.add(styles.active);
        const panel = document.getElementById(`tab-${target}`);
        if (panel) panel.classList.add(styles.active);
      });
    });

    // Load Chart.js → simulation JS → init, all in sequence
    (async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
        await loadScript('/physchem-simulation.js');
        if (cancelled) return;
        // Two rAF frames to ensure React has fully painted the DOM
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) (window as unknown as {initPhysChemHub?: () => void}).initPhysChemHub?.();
          });
        });
      } catch (e) {
        console.error('[PhysChemHub] Script load failed:', e);
      }
    })();

    return () => {
      cancelled = true;
      // Cancel canvas animation loops on unmount to prevent stale rAF callbacks
      const w = window as unknown as {_gcAnimId?: number; _dcAnimId?: number};
      if (w._gcAnimId) { cancelAnimationFrame(w._gcAnimId); (w as unknown as {_gcAnimId: null})._gcAnimId = null; }
      if (w._dcAnimId) { cancelAnimationFrame(w._dcAnimId); (w as unknown as {_dcAnimId: null})._dcAnimId = null; }
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>

      {/* ── PAGE HEADER ── */}
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.bc}>Chemistry Visualized · States of Matter</div>
          <h1>Physical <span style={{color:'var(--pc-teal)'}}>Chemistry Hub</span></h1>
        </div>
        <span className={styles.badge}>JEE / NEET HUD</span>
      </header>

      {/* ── TAB BAR ── */}
      <nav className={styles.tabBar}>
        <button className={`${styles.tabBtn} ${styles.active}`} data-tab="ideal">1. Ideal Gas Law</button>
        <button className={styles.tabBtn} data-tab="boyle">2. Boyle&apos;s Law</button>
        <button className={styles.tabBtn} data-tab="charles">3. Charles&apos; Law</button>
        <button className={styles.tabBtn} data-tab="diffusion">4. Diffusion &amp; Effusion</button>
        <button className={styles.tabBtn} data-tab="mindmap">5. Concept Map</button>
      </nav>

      {/* ══════════════════════════════════════════
          TAB 1 — IDEAL GAS LAW
      ══════════════════════════════════════════ */}
      <section id="tab-ideal" className={`${styles.tabPanel} ${styles.active}`}>
        <div className={styles.sectionTitle} style={{fontSize:'22px'}}>Ideal Gas Equation</div>
        <p style={{color:'var(--pc-t2)',fontSize:'15px',marginBottom:'20px',lineHeight:1.6}}>
          The <strong>Ideal Gas Law</strong> unifies Boyle&apos;s, Charles&apos;, and Avogadro&apos;s laws:&nbsp;
          <span className={styles.eqn}>PV = nRT</span>. Real gases deviate at high pressure and low temperature.
        </p>

        <div className={styles.dashboardGrid}>
          {/* LEFT: CONTROLS */}
          <div className={styles.controlsPanel}>
            <div className={styles.minControlsCard} style={{position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div className={styles.sectionTitle} style={{marginBottom:'4px'}}>Variables</div>
              <div style={{fontSize:'12px',color:'var(--pc-t2)',marginBottom:'16px'}}>Select one variable to auto-calculate.</div>
              <div className={styles.minRow} style={{marginBottom:'12px'}}>
                <div/><div/><div/>
                <div style={{fontSize:'10px',fontWeight:700,color:'var(--pc-t3)',textTransform:'uppercase',textAlign:'center'}}>Auto</div>
              </div>
              {/* P */}
              <div className={styles.minRow}>
                <div className={styles.minSym}>P</div>
                <div className={styles.minVal} id="i-val-P">2.45</div>
                <div className={styles.minSlider}><input type="range" id="i-sl-P" min="0.1" max="10" step="0.05" defaultValue="2.45" disabled/></div>
                <div className={styles.minRadio}><input type="radio" name="solve_ig" value="P" defaultChecked/><div className={styles.minRadioCustom}/></div>
              </div>
              {/* V */}
              <div className={styles.minRow}>
                <div className={styles.minSym}>V</div>
                <div className={styles.minVal} id="i-val-V">10.0</div>
                <div className={styles.minSlider}><input type="range" id="i-sl-V" min="1" max="20" step="0.5" defaultValue="10.0"/></div>
                <div className={styles.minRadio}><input type="radio" name="solve_ig" value="V"/><div className={styles.minRadioCustom}/></div>
              </div>
              {/* n */}
              <div className={styles.minRow}>
                <div className={styles.minSym}>n</div>
                <div className={styles.minVal} id="i-val-n">1.00</div>
                <div className={styles.minSlider}><input type="range" id="i-sl-n" min="0.1" max="5" step="0.05" defaultValue="1.0"/></div>
                <div className={styles.minRadio}><input type="radio" name="solve_ig" value="n"/><div className={styles.minRadioCustom}/></div>
              </div>
              {/* T */}
              <div className={styles.minRow}>
                <div className={styles.minSym}>T</div>
                <div className={styles.minVal} id="i-val-T">298</div>
                <div className={styles.minSlider}><input type="range" id="i-sl-T" min="100" max="1000" step="1" defaultValue="298"/></div>
                <div className={styles.minRadio}><input type="radio" name="solve_ig" value="T"/><div className={styles.minRadioCustom}/></div>
              </div>

              {/* Live Equation */}
              <div className={styles.eqShowcase}>
                <div className={styles.eqMain}>PV = nRT</div>
                <div className={styles.eqLive}>
                  <span className={styles.val} id="live-P">2.45</span>
                  <span className={styles.op}>×</span>
                  <span className={styles.val} id="live-V">10.0</span>
                  <span className={styles.op}>=</span>
                  <span className={styles.val} id="live-n">1.0</span>
                  <span className={styles.op}>×</span>0.0821<span className={styles.op}>×</span>
                  <span className={styles.val} id="live-T">298</span>
                </div>
                <div style={{fontSize:'11px',color:'var(--pc-green)',fontWeight:600,letterSpacing:'1px',textTransform:'uppercase'}} id="i-status">✔ Equation Balanced</div>
                {/* R Reference */}
                <div className={styles.rRef}>
                  <div className={styles.rRefTitle}>Universal Gas Constant (R) Values</div>
                  <div className={styles.rGrid}>
                    <span className={styles.rVal}>0.0821</span><span>L·atm / (mol·K)</span>
                    <span className={styles.rVal}>8.314</span><span>J / (mol·K)</span>
                    <span className={styles.rVal}>0.0831</span><span>L·bar / (mol·K)</span>
                    <span className={styles.rVal}>1.987</span><span>cal / (mol·K)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: VISUALS */}
          <div className={styles.visualsPanel}>
            <div>
              <div className={styles.canvasHeader}>
                <div className={styles.sectionTitle} style={{margin:0}}>Gas Chamber</div>
                <div className={styles.chipRow}>
                  <div className={styles.chip}><span className={styles.ck}>Mol</span><span className={styles.cv} id="chip-mol">14</span></div>
                  <div className={styles.chip}><span className={styles.ck}>KE</span><span className={styles.cv} id="chip-spd">1.0×</span></div>
                  <div className={styles.chip}><span className={styles.ck}>°C</span><span className={styles.cv} id="chip-tc">25.0°C</span></div>
                </div>
              </div>
              <div className={styles.canvasContainer}>
                <canvas id="gasCanvas" width="500" height="260" style={{maxWidth:'100%',height:'auto'}}/>
              </div>
            </div>
            <div className={styles.graphsRow}>
              <div className={styles.chartCard} style={{position:'relative'}}>
                <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
                <div className={styles.label}>P vs V (Isotherm)</div>
                <div className={styles.chartContainer}><canvas id="chart-pv"/></div>
              </div>
              <div className={styles.chartCard} style={{position:'relative'}}>
                <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
                <div className={styles.label}>Compressibility (Z vs P)</div>
                <div className={styles.chartContainer}><canvas id="chart-z"/></div>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className={styles.sectionTitle} style={{marginTop:'32px'}}>Teacher&apos;s Desk</div>
        <div className={styles.mediaGrid}>
          <div className={styles.embedBox}>
            <div className={styles.label} style={{color:'var(--pc-t1)',marginBottom:'12px'}}>Video Lecture</div>
            <iframe width="100%" height="240" src="https://www.youtube.com/embed/e_Xw7s5pL7s" title="Ideal Gas Law" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{borderRadius:'8px'}}/>
          </div>
          <div className={styles.embedBox}>
            <div className={styles.label} style={{color:'var(--pc-t1)',marginBottom:'12px'}}>Handwritten Notes</div>
            <div style={{height:'240px',display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed var(--pc-s3)',borderRadius:'8px',color:'var(--pc-t3)',fontSize:'13px'}}>
              Add your Google Drive embed URL here
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TAB 2 — BOYLE'S LAW
      ══════════════════════════════════════════ */}
      <section id="tab-boyle" className={styles.tabPanel}>
        <div className={styles.sectionTitle} style={{fontSize:'22px'}}>Boyle&apos;s Law</div>
        <p style={{color:'var(--pc-t2)',fontSize:'15px',marginBottom:'24px',lineHeight:1.6}}>
          <strong>Boyle&apos;s Law</strong> states that at a constant temperature, the pressure of a fixed mass of an ideal gas is inversely proportional to its volume (<span className={styles.eqn}>P ∝ 1/V</span> or <span className={styles.eqn}>PV = k</span>).
        </p>

        {/* Intro Grid: Derivation + Molecular Note side by side */}
        <div className={styles.introGrid}>
          <div className={styles.derivationContainer}>
            <div className={`${styles.dBox} ${styles.accent}`}>PV = const.</div>
            <div className={styles.dBox}>P₁V₁ = P₂V₂ = P₃V₃</div>
            <div className={styles.dSteps}>
              <div><span className={styles.eqn}>PV = K</span></div>
              <div><span className={styles.eqn}>log P + log V = log K</span></div>
              <div style={{display:'grid',gridTemplateColumns:'auto auto auto auto auto',gap:'6px 12px',textAlign:'center',alignItems:'center',marginTop:'12px'}}>
                <span className={styles.eqn}>log P</span><span className={styles.eqn}>=</span><span className={styles.eqn}>log K</span><span className={styles.eqn}>+</span><span className={styles.eqn}>log (1/V)</span>
                <span className={styles.eqn} style={{color:'var(--pc-red)',fontWeight:600,fontSize:'24px'}}>y</span><span className={styles.eqn} style={{color:'var(--pc-red)',fontWeight:600,fontSize:'24px'}}>=</span><span className={styles.eqn} style={{color:'var(--pc-red)',fontWeight:600,fontSize:'24px'}}>c</span><span className={styles.eqn} style={{color:'var(--pc-red)',fontWeight:600,fontSize:'24px'}}>+</span><span className={styles.eqn} style={{color:'var(--pc-red)',fontWeight:600,fontSize:'24px'}}>mx</span>
              </div>
            </div>
          </div>
          <div className={styles.molecularNote} style={{margin:0,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div>
              <strong>Molecular Note:</strong> The molecular explanation of the law is based on the fact that the pressure exerted by a gas arises from the impact of its particles on the walls of the vessel. If the volume is halved, the density of particles is doubled, and so twice as many particles strike the walls in a given period of time. The average force exerted by the gas is therefore doubled, and so, is the pressure it exerts.
            </div>
          </div>
        </div>

        {/* Dashboard Grid: Controls + Big Isotherm Graph */}
        <div className={styles.dashboardGrid} style={{marginBottom:'32px'}}>
          <div className={styles.controlsPanel}>
            <div className={styles.minControlsCard} style={{position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div className={styles.sectionTitle} style={{marginBottom:'24px'}}>System State</div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>P</div>
                <div className={styles.minVal} id="b-val-P">2.45</div>
                <div className={styles.minSlider}><input type="range" id="b-sl-P" min="0.2" max="10" step="0.05" defaultValue="2.45"/></div>
                <div style={{width:'20px'}}/>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>V</div>
                <div className={styles.minVal} id="b-val-V">10.0</div>
                <div className={styles.minSlider}><input type="range" id="b-sl-V" min="1" max="20" step="0.5" defaultValue="10.0"/></div>
                <div style={{width:'20px'}}/>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>T</div>
                <div className={styles.minVal} id="b-val-T">298</div>
                <div className={styles.minSlider}><input type="range" id="b-sl-T" min="100" max="1000" step="10" defaultValue="298"/></div>
                <div style={{width:'20px'}}/>
              </div>
              <div className={styles.eqShowcase} style={{marginTop:'32px'}}>
                <div className={styles.eqMain}>P₁V₁ = P₂V₂</div>
                <div className={styles.eqLive}>
                  <span className={styles.val} id="b-live-P">2.45</span>
                  <span className={styles.op}>×</span>
                  <span className={styles.val} id="b-live-V">10.0</span>
                  <span className={styles.op}>=</span>
                  <span className={styles.val} id="b-live-k">24.50</span>
                  <span className={styles.op}>(constant k)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Big Isotherm Family Graph with temp buttons INSIDE */}
          <div className={styles.visualsPanel} style={{height:'100%'}}>
            <div className={styles.chartCard} style={{height:'100%',display:'flex',flexDirection:'column',position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div className={styles.sectionTitle} style={{marginBottom:'4px'}}>Isotherm Families (P vs V)</div>
              <p style={{color:'var(--pc-t2)',fontSize:'13px',marginBottom:'8px'}}>Click a temperature below to force the system state to that isotherm.</p>
              <div className={styles.tempSelector} id="boyle-temp-legend">
                <button className={styles.tempBtn} data-t="200">200 K</button>
                <button className={styles.tempBtn} data-t="298" data-active="true">298 K</button>
                <button className={styles.tempBtn} data-t="400">400 K</button>
                <button className={styles.tempBtn} data-t="600">600 K</button>
                <button className={styles.tempBtn} data-t="800">800 K</button>
              </div>
              <div className={styles.chartContainer} style={{flex:1,minHeight:'280px'}}><canvas id="chart-boyle-family"/></div>
            </div>
          </div>
        </div>

        {/* Graphical Transformations: 2x2 grid */}
        <div className={styles.sectionTitle} style={{marginTop:'40px'}}>Graphical Transformations</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',marginBottom:'20px'}}>These standard curves frequently appear in multiple-choice questions to test your understanding of proportionality constants.</p>
        <div className={styles.graphsGrid2x2} style={{marginBottom:'40px'}}>
          <div className={styles.chartCard} style={{position:'relative'}}>
            <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
            <div className={styles.label} style={{textTransform:'none',textAlign:'center',marginBottom:'12px'}}>Pressure (P) vs 1 / Volume (1/V) <span style={{color:'var(--pc-teal)',fontWeight:700}}>[Interactive]</span></div>
            <div className={styles.chartContainer} style={{height:'320px'}}><canvas id="chart-boyle-inv"/></div>
          </div>
          <div className={styles.chartCard} style={{position:'relative'}}>
            <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
            <div className={styles.label} style={{textTransform:'none',textAlign:'center',marginBottom:'12px'}}>PV vs Pressure (P) <span style={{color:'var(--pc-teal)',fontWeight:700}}>[Interactive]</span></div>
            <div className={styles.chartContainer} style={{height:'320px'}}><canvas id="chart-boyle-pvp"/></div>
          </div>
          <div className={styles.chartCard} style={{position:'relative'}}>
            <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
            <div className={styles.label} style={{textTransform:'none',textAlign:'center',marginBottom:'12px'}}>Pressure (P) vs 1 / Volume (1/V) <span style={{color:'var(--pc-amber)',fontWeight:700}}>[Static Reference]</span></div>
            <div className={styles.chartContainer} style={{height:'320px'}}><canvas id="static-boyle-inv"/></div>
            <div style={{textAlign:'center',fontFamily:"'Crimson Pro',serif",fontSize:'18px',color:'var(--pc-t1)',marginTop:'12px',fontWeight:600}}>T₃ &gt; T₂ &gt; T₁</div>
          </div>
          <div className={styles.chartCard} style={{position:'relative'}}>
            <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
            <div className={styles.label} style={{textTransform:'none',textAlign:'center',marginBottom:'12px'}}>Pressure (P) vs Volume (V) <span style={{color:'var(--pc-amber)',fontWeight:700}}>[Static Reference]</span></div>
            <div className={styles.chartContainer} style={{height:'320px'}}><canvas id="static-boyle-pv"/></div>
            <div style={{textAlign:'center',fontFamily:"'Crimson Pro',serif",fontSize:'18px',color:'var(--pc-t1)',marginTop:'12px',fontWeight:600}}>T₃ &gt; T₂ &gt; T₁</div>
          </div>
        </div>

        {/* Solved Examples — FULL original content */}
        <div className={styles.sectionTitle} style={{marginTop:'40px'}}>Application: Solved Examples</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',marginBottom:'20px'}}>Mastering how Boyle&apos;s Law is tested in competitive exams.</p>
        <div className={styles.exampleGrid}>
          {/* Example 1 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-teal)'}}>Example 1</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Gas Mixing</span></div>
            <div className={styles.exQ}>What will be the pressure of the gaseous mixture when 0.5 L of H₂ at 0.8 bar and 2.0 L of dioxygen at 0.7 bar are introduced in a 1 L vessel at 27°C?</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle}>Solution</div>
              <div className={styles.exBody}>
                For H₂: <span className={styles.eqn}>p₁V₁ = p₂V₂</span><br/>
                <span className={styles.eqn}>0.8 × 0.5 = p<sub style={{fontSize:'11px'}}>H₂</sub> × 1</span> &nbsp;⇒&nbsp; <strong>p<sub style={{fontSize:'11px'}}>H₂</sub> = 0.4 bar</strong><br/><br/>
                For O₂: <span className={styles.eqn}>p₁V₁ = p₂V₂</span><br/>
                <span className={styles.eqn}>0.7 × 2.0 = p<sub style={{fontSize:'11px'}}>O₂</sub> × 1</span> &nbsp;⇒&nbsp; <strong>p<sub style={{fontSize:'11px'}}>O₂</sub> = 1.4 bar</strong><br/><br/>
                Therefore, <span className={styles.eqn}>p<sub style={{fontSize:'11px'}}>total</sub> = p<sub style={{fontSize:'11px'}}>H₂</sub> + p<sub style={{fontSize:'11px'}}>O₂</sub> = 0.4 + 1.4</span> = <strong>1.8 bar</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> Treat each gas completely independently first. Calculate their new partial pressures using Boyle&apos;s Law, then simply add them up (Dalton&apos;s Law of Partial Pressures).</div>
            </div>
          </div>
          {/* Example 2 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-teal)'}}>Example 2</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Fractional Change</span></div>
            <div className={styles.exQ}>A gas is present at a pressure of 2 atm. What should be the <em>increase</em> in pressure so that the volume of the gas can be decreased to 1/4th of the initial value if the temperature is maintained constant?</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle}>Solution</div>
              <div className={styles.exBody}>
                <span className={styles.eqn}>p₁V₁ = p₂V₂</span> (constant mass &amp; T)<br/>
                Given: <span className={styles.eqn}>p₁ = 2 atm, V₂ = V₁/4</span><br/><br/>
                <span className={styles.eqn}>2 × V₁ = p₂ × (V₁ / 4)</span><br/>
                <strong>p₂ = 8 atm</strong><br/><br/>
                Total <em>increase</em> in pressure = <span className={styles.eqn}>8 - 2</span> = <strong>6 atm</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> Be very careful with wording! Examiners love asking for the &quot;increase&quot; or &quot;change&quot; rather than the final value. Always read the last line of the question twice.</div>
            </div>
          </div>
          {/* Example 3 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-teal)'}}>Example 3</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Connected Bulbs</span></div>
            <div className={styles.exQ}>Two glass bulbs A and B at same temperature are connected by a small tube having a stop cock. Bulb A has a volume of 100 cm³ and contained the gas while bulb B was empty. On opening the stop cock, the pressure fell down to 20%. What is the volume of bulb B?</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle}>Solution</div>
              <div className={styles.exBody}>
                <span className={styles.eqn}>V₁ = 100 cm³, p₁ = 100 atm</span> (let initial be 100%)<br/>
                <span className={styles.eqn}>p₂ = 20 atm</span> (fell <em>down to</em> 20%)<br/><br/>
                <span className={styles.eqn}>V₂ = (p₁V₁) / p₂ = (100 × 100) / 20</span> = <strong>500 cm³</strong><br/><br/>
                Total Volume (<span className={styles.eqn}>V₂</span>) = <span className={styles.eqn}>V<sub style={{fontSize:'11px'}}>A</sub> + V<sub style={{fontSize:'11px'}}>B</sub></span><br/>
                Volume of B = <span className={styles.eqn}>500 - 100</span> = <strong>400 cm³</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> The trick here is that the final volume (V₂) is the <em>combined</em> volume of both bulbs. Subtract the original bulb&apos;s volume to find the unknown bulb&apos;s volume.</div>
            </div>
          </div>
          {/* Example 4 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-teal)'}}>Example 4</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Composite Systems</span></div>
            <div className={styles.exQ}>
              Consider a composite system at 300K with 3 compartments separated by barriers. Assuming ideal gas behavior, calculate the total pressure if the barriers separating the compartments are removed.
              <div className={styles.compositeDiagram}>
                <div className={styles.cdBox}><div className={styles.cdGas}>He</div><div className={styles.cdProp}>2 L</div><div className={styles.cdProp}>1.50 atm</div></div>
                <div className={styles.cdBox}><div className={styles.cdGas}>Ne</div><div className={styles.cdProp}>4 L</div><div className={styles.cdProp}>2.50 atm</div></div>
                <div className={styles.cdBox}><div className={styles.cdGas}>Xe</div><div className={styles.cdProp}>1 L</div><div className={styles.cdProp}>1.00 atm</div></div>
              </div>
            </div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle}>Solution</div>
              <div className={styles.exBody}>
                <span className={styles.eqn}>p₁V₁ + p₂V₂ + p₃V₃ = p<sub style={{fontSize:'11px'}}>T</sub>V<sub style={{fontSize:'11px'}}>total</sub></span><br/>
                <span className={styles.eqn}>V<sub style={{fontSize:'11px'}}>total</sub> = 2 + 4 + 1 = 7 L</span><br/><br/>
                <span className={styles.eqn}>(2 × 1.5) + (4 × 2.5) + (1 × 1) = 7 × p<sub style={{fontSize:'11px'}}>T</sub></span><br/>
                <span className={styles.eqn}>3 + 10 + 1 = 7 × p<sub style={{fontSize:'11px'}}>T</sub></span><br/>
                <span className={styles.eqn}>14 = 7 × p<sub style={{fontSize:'11px'}}>T</sub></span> &nbsp;⇒&nbsp; <strong>p<sub style={{fontSize:'11px'}}>T</sub> = 2 atm</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> Since PV is proportional to moles (n) at constant T, summing up the PV products of individual compartments gives you the PV product of the final combined system.</div>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div className={styles.sectionTitle} style={{marginTop:'48px',justifyContent:'center'}}>Test Your Understanding</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',textAlign:'center'}}>Swipe cards left/right to skip, or click an answer to reveal the solution.</p>
        <div className={styles.quizStackContainer}>
          <div className={styles.quizStackWrapper}>
            <div className={styles.stackBg2}/>
            <div className={styles.stackBg1}/>
            <div className={styles.quizCard} id="bq-active-card" style={{position:'relative'}}>
              <GlowingEffect spread={50} glow={true} disabled={false} proximity={100} inactiveZone={0.2} borderWidth={2.5} />
              <div className={styles.quizHeader}>
                <div className={styles.quizNum} id="bq-q-num">Question 1 of 7</div>
                <div className={styles.chip} style={{background:'rgba(0,0,0,0.2)',border:'none',padding:'4px 8px'}}><span className={styles.ck}>Score</span><span className={styles.cv} style={{color:'var(--pc-teal)'}} id="bq-score">0</span></div>
              </div>
              <div className={styles.quizText} id="bq-text">Loading...</div>
              <div className={styles.quizOpts} id="bq-opts"/>
              <div className={styles.quizSolBox} id="bq-sol-box">
                <div className={styles.quizSolTitle}>Solution &amp; Insight</div>
                <div className={styles.quizSolText} id="bq-sol-text"/>
              </div>
              <div className={styles.quizActionsRow}>
                <button className={styles.quizBtnSkip} id="bq-skip-btn" onClick={() => (window as unknown as {bqSwipeOut?: (n: number) => void}).bqSwipeOut?.(-1)}>Skip ⏭</button>
                <button className={styles.quizNextBtn} id="bq-next-btn" onClick={() => (window as unknown as {bqSwipeOut?: (n: number) => void}).bqSwipeOut?.(1)}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TAB 3 — CHARLES' LAW
      ══════════════════════════════════════════ */}
      <section id="tab-charles" className={styles.tabPanel}>
        <div className={styles.dashboardGrid}>
          {/* LEFT: CONTROLS */}
          <div className={styles.controlsPanel}>
            <div className={styles.minControlsCard} style={{position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div className={styles.sectionTitle}>Charles&apos; Law Controls</div>
              <p style={{color:'var(--pc-t2)',fontSize:'13px',marginBottom:'24px'}}>At constant P and n: <strong>V ∝ T</strong>.</p>
              <div className={styles.minRow}>
                <div className={styles.minSym}>V</div>
                <div className={styles.minVal} id="c-val-V">12.2</div>
                <div className={styles.minSlider}><input type="range" id="c-sl-V" min="1" max="50" step="0.5" defaultValue="12.2"/></div>
                <div style={{width:'20px'}}/>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>T</div>
                <div className={styles.minVal} id="c-val-T">298</div>
                <div className={styles.minSlider}><input type="range" id="c-sl-T" min="50" max="1000" step="1" defaultValue="298"/></div>
                <div style={{width:'20px'}}/>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>P</div>
                <div className={styles.minVal} id="c-val-P">2.00</div>
                <div className={styles.minSlider}><input type="range" id="c-sl-P" min="0.2" max="10" step="0.05" defaultValue="2.00"/></div>
                <div style={{width:'20px'}}/>
              </div>

              <div className={styles.eqShowcase} style={{marginTop:'32px'}}>
                <div className={styles.eqMain}>V₁ / T₁ = V₂ / T₂</div>
                <div className={styles.eqLive}>
                  <span className={styles.val} id="c-live-V">12.2</span>
                  <span className={styles.op}>/</span>
                  <span className={styles.val} id="c-live-T">298</span>
                  <span className={styles.op}>=</span>
                  <span className={styles.val} id="c-live-k">0.041</span>
                  <span className={styles.op}>(constant k₂)</span>
                </div>
              </div>

              <div className={styles.molecularNote}>
                <strong>Key Observations:</strong> All lines for different pressures intersect at <strong>-273.15 °C (0 K)</strong>, known as Absolute Zero. At this theoretical temperature, the volume of an ideal gas becomes zero.<br/><br/>
                <em>Note: Charles&apos;s law is most strictly obeyed by all gases at high temperatures and very low pressures.</em>
              </div>
            </div>
          </div>

          {/* RIGHT: GRAPHS */}
          <div className={styles.visualsPanel}>
            {/* Main Isobar Family with buttons INSIDE */}
            <div className={styles.chartCard} style={{position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div className={styles.sectionTitle} style={{marginBottom:'4px'}}>Isobar Families (Volume vs Temp °C)</div>
              <p style={{color:'var(--pc-t2)',fontSize:'13px',marginBottom:'8px'}}>Lower pressures result in steeper slopes (p₁ &lt; p₂ &lt; p₃ &lt; p₄). Click to change P.</p>
              <div className={styles.tempSelector} id="charles-p-legend">
                <button className={styles.tempBtn} data-p="0.5">0.5 atm (p₁)</button>
                <button className={styles.tempBtn} data-p="1.0">1.0 atm (p₂)</button>
                <button className={styles.tempBtn} data-p="2.0" data-active="true">2.0 atm (p₃)</button>
                <button className={styles.tempBtn} data-p="4.0">4.0 atm (p₄)</button>
              </div>
              <div className={styles.chartContainer} style={{height:'280px'}}><canvas id="chart-charles-vtc"/></div>
            </div>

            {/* 2-column sub-graphs */}
            <div className={styles.graphsRow}>
              <div className={styles.chartCard} style={{position:'relative'}}>
                <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
                <div className={styles.label} style={{textTransform:'none'}}>Volume vs Temp (K)</div>
                <div className={styles.chartContainer} style={{height:'180px'}}><canvas id="chart-charles-vt"/></div>
              </div>
              <div className={styles.chartCard} style={{position:'relative'}}>
                <GlowingEffect spread={35} glow={true} disabled={false} proximity={60} inactiveZone={0.4} borderWidth={1.5} />
                <div className={styles.label} style={{textTransform:'none'}}>log V vs log T (45° slope)</div>
                <div className={styles.chartContainer} style={{height:'180px'}}><canvas id="chart-charles-log"/></div>
              </div>
            </div>
          </div>
        </div>

        {/* Solved Examples — FULL original content */}
        <div className={styles.sectionTitle} style={{marginTop:'40px'}}>Application: Solved Examples</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',marginBottom:'20px'}}>Mastering how Charles&apos; Law is tested in competitive exams.</p>
        <div className={styles.exampleGrid}>
          {/* Example 1 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-purple)'}}>Example 1</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Fraction Expelled</span></div>
            <div className={styles.exQ}>A student forgot to add the reaction mixture to the round bottomed flask at 27°C but put it on the flame. After a lapse of time, he realized his mistake. Using a pyrometer, he found the temperature of the flask was 477°C. What fraction of the air would have been expelled out?</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle} style={{color:'var(--pc-purple)'}}>Solution</div>
              <div className={styles.exBody}>
                Let volume of air at 27°C (300 K) be <span className={styles.eqn}>V₁</span> and at 477°C (750 K) be <span className={styles.eqn}>V₂</span>.<br/><br/>
                According to Charles&apos; Law: <span className={styles.eqn}>V₁ / T₁ = V₂ / T₂</span><br/>
                Fraction expelled = <span className={styles.eqn}>(V₂ - V₁) / V₂</span> = <span className={styles.eqn}>1 - (V₁ / V₂)</span><br/><br/>
                Substituting <span className={styles.eqn}>V₁ / V₂ = T₁ / T₂</span>, we get:<br/>
                Fraction expelled = <span className={styles.eqn}>1 - (300 / 750) = 450 / 750</span> = <strong>0.6</strong> <span style={{color:'var(--pc-t3)'}}>(or 3/5)</span>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> The volume of the <em>flask</em> itself is constant, but the volume of the <em>gas sample</em> expands. The fraction of gas expelled is based on the new, expanded volume (V₂) trying to fit back into the original rigid container (V₁).</div>
            </div>
          </div>
          {/* Example 2 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-purple)'}}>Example 2</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Connected Vessels</span></div>
            <div className={styles.exQ}>Two vessels are connected by a valve of negligible volume. Container (I) has 2.8 g of N₂ at temperature <span className={styles.eqn}>T₁</span>. Container (II) is completely evacuated. Container (I) is heated to <span className={styles.eqn}>T₂</span> while (II) is maintained at <span className={styles.eqn}>T₂/3</span>. Volume of (I) is half of (II). If the valve is opened, what is the weight ratio of N₂ in both vessels (<span className={styles.eqn}>w₁/w₂</span>)?</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle} style={{color:'var(--pc-purple)'}}>Solution</div>
              <div className={styles.exBody}>
                Since the valve is open, the final pressure <span className={styles.eqn}>P</span> is equalized in both vessels.<br/>
                From PV=nRT, <span className={styles.eqn}>n ∝ V/T</span> (which implies <span className={styles.eqn}>w ∝ V/T</span>).<br/><br/>
                <span className={styles.eqn}>w₁ / w₂ = (V₁ / T₁) / (V₂ / T₂)</span><br/>
                Given: <span className={styles.eqn}>V₁ = V₂ / 2</span> and Temp for II = <span className={styles.eqn}>T₂ / 3</span><br/><br/>
                <span className={styles.eqn}>w₁ / w₂ = (V₂/2) / T₂ &nbsp;/&nbsp; [V₂ / (T₂/3)]</span><br/>
                <span className={styles.eqn}>w₁ / w₂ = 1 / (2 × 3)</span> = <strong>1 / 6</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> Don&apos;t calculate actual pressures! When containers are connected, gas flows until pressures are equal. Since R is constant, the moles (or weight) distributed in each compartment is simply proportional to V/T for that specific compartment.</div>
            </div>
          </div>
          {/* Example 3 */}
          <div className={styles.exCard} style={{position:'relative'}}>
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
            <div className={styles.exHeader}><span className={styles.exBadge} style={{background:'var(--pc-purple)'}}>Example 3</span><span style={{fontSize:'12px',color:'var(--pc-t3)',fontWeight:600}}>Graphical Derivation</span></div>
            <div className={styles.exQ}>For a closed (not rigid) container containing an ideal gas fitted with a movable piston operating such that pressure remains constant. Draw and explain the graph that represents the variation of log V vs log T.</div>
            <div className={styles.exSol}>
              <div className={styles.exSolTitle} style={{color:'var(--pc-purple)'}}>Solution</div>
              <div className={styles.exBody}>
                From Charles&apos; Law: <span className={styles.eqn}>V = k T</span><br/>
                Taking log on both sides: <span className={styles.eqn}>log V = log T + log k</span><br/><br/>
                Comparing with the straight line equation <span className={styles.eqn}>y = mx + c</span>:<br/>
                <span className={styles.eqn}>y = log V</span>, <span className={styles.eqn}>x = log T</span>, <span className={styles.eqn}>m = 1</span>, <span className={styles.eqn}>c = log k</span><br/><br/>
                Slope <span className={styles.eqn}>m = tan(θ) = 1</span> &nbsp;⇒&nbsp; <strong>θ = 45°</strong>
              </div>
              <div className={styles.exInsight}><strong>Teacher&apos;s Insight:</strong> Logarithmic graphs of power laws always yield straight lines. The exponent of the variable becomes the slope. Since V is proportional to T¹, the slope is exactly 1 (an angle of 45 degrees). Look at the graph above to visualize this!</div>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div className={styles.sectionTitle} style={{marginTop:'48px',justifyContent:'center'}}>Test Your Understanding</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',textAlign:'center'}}>Swipe cards left/right to skip, or click an answer to reveal the solution.</p>
        <div className={styles.quizStackContainer}>
          <div className={styles.quizStackWrapper} id="charles-stack-wrapper">
            <div className={styles.stackBg2}/>
            <div className={styles.stackBg1}/>
            <div className={styles.quizCard} id="cq-active-card" style={{position:'relative'}}>
              <GlowingEffect spread={50} glow={true} disabled={false} proximity={100} inactiveZone={0.2} borderWidth={2.5} />
              <div className={styles.quizHeader}>
                <div className={styles.quizNum} id="cq-q-num" style={{color:'var(--pc-purple)'}}>Question 1 of 6</div>
                <div className={styles.chip} style={{background:'rgba(0,0,0,0.2)',border:'none',padding:'4px 8px'}}><span className={styles.ck}>Score</span><span className={styles.cv} style={{color:'var(--pc-purple)'}} id="cq-score">0</span></div>
              </div>
              <div className={styles.quizText} id="cq-text">Loading...</div>
              <div className={styles.quizOpts} id="cq-opts"/>
              <div className={styles.quizSolBox} id="cq-sol-box">
                <div className={styles.quizSolTitle}>Solution &amp; Insight</div>
                <div className={styles.quizSolText} id="cq-sol-text"/>
              </div>
              <div className={styles.quizActionsRow}>
                <button className={styles.quizBtnSkip} id="cq-skip-btn" onClick={() => (window as unknown as {cqSwipeOut?: (n: number) => void}).cqSwipeOut?.(-1)}>Skip ⏭</button>
                <button className={styles.quizNextBtn} id="cq-next-btn" onClick={() => (window as unknown as {cqSwipeOut?: (n: number) => void}).cqSwipeOut?.(1)} style={{background:'var(--pc-purple-d)',color:'var(--pc-purple)',borderColor:'var(--pc-purple)'}}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TAB 4 — DIFFUSION & EFFUSION
      ══════════════════════════════════════════ */}
      <section id="tab-diffusion" className={styles.tabPanel}>
        <div className={styles.sectionTitle} style={{fontSize:'22px'}}>Graham&apos;s Law of Diffusion &amp; Effusion</div>
        <p style={{color:'var(--pc-t2)',fontSize:'15px',marginBottom:'24px',lineHeight:1.6}}>
          The rate at which a gas diffuses or effuses is dependent on its macroscopic properties. According to kinetic theory, the rate is directly proportional to the pressure and the area of the opening, and inversely proportional to the square root of the temperature and its molar mass.
        </p>

        {/* Definition boxes */}
        <div className={styles.introGrid} style={{marginBottom:'32px'}}>
          <div className={styles.molecularNote} style={{margin:0,borderLeftColor:'#3b82f6',background:'rgba(59,130,246,0.05)'}}>
            <strong style={{color:'#3b82f6'}}>Diffusion</strong> is the mixing of gas molecules by random motion under conditions where molecular collisions occur (e.g., two gases mixing in a room).
          </div>
          <div className={styles.molecularNote} style={{margin:0,borderLeftColor:'var(--pc-red)',background:'rgba(244,63,94,0.05)'}}>
            <strong style={{color:'var(--pc-red)'}}>Effusion</strong> is the escape of a gas through a pinhole into a vacuum without molecular collisions.
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* LEFT: CONTROLS */}
          <div className={styles.controlsPanel}>
            <div className={styles.minControlsCard} style={{position:'relative'}}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
                <div className={styles.sectionTitle} style={{margin:0,fontSize:'16px',whiteSpace:'nowrap'}}>Gas 1 Controls</div>
                <button className={styles.btnReset} id="df-reset-btn">
                  <svg style={{width:'14px',height:'14px'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Reset
                </button>
              </div>

              <div className={styles.segmentedControl}>
                <label className={styles.segLbl}>
                  <input type="radio" name="df_mode" value="effusion" defaultChecked/>
                  <span className={`${styles.segBtn} ${styles.eff}`}>Effusion (Vacuum)</span>
                </label>
                <label className={styles.segLbl}>
                  <input type="radio" name="df_mode" value="diffusion"/>
                  <span className={`${styles.segBtn} ${styles.diff}`}>Diffusion (Mixing)</span>
                </label>
              </div>

              <div className={styles.minRow}>
                <div className={styles.minSym}>P</div>
                <div className={styles.minVal} id="d-val-P">5.0</div>
                <div className={styles.minSlider}><input type="range" id="d-sl-P" min="1" max="10" step="0.5" defaultValue="5.0"/></div>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>T</div>
                <div className={styles.minVal} id="d-val-T">300</div>
                <div className={styles.minSlider}><input type="range" id="d-sl-T" min="100" max="1000" step="10" defaultValue="300"/></div>
              </div>
              <div className={styles.minRow}>
                <div className={styles.minSym}>M</div>
                <div className={styles.minVal} id="d-val-M">32</div>
                <div className={styles.minSlider}><input type="range" id="d-sl-M" min="2" max="100" step="1" defaultValue="32"/></div>
              </div>
              <div className={styles.minRow} style={{marginBottom:'8px'}}>
                <div className={styles.minSym}>A</div>
                <div className={styles.minVal} id="d-val-A">20</div>
                <div className={styles.minSlider}><input type="range" id="d-sl-A" min="4" max="60" step="2" defaultValue="20" title="Area of Opening"/></div>
              </div>
            </div>
          </div>

          {/* RIGHT: CANVAS + Teacher's Insight */}
          <div className={styles.visualsPanel}>
            <div>
              <div className={styles.canvasHeader}>
                <div className={styles.sectionTitle} style={{margin:0}} id="df-canvas-title">Effusion Chamber</div>
                <div className={styles.chipRow}>
                  <div className={styles.chip} id="df-stat-chip" style={{background:'rgba(244,63,94,0.1)',borderColor:'rgba(244,63,94,0.3)'}}>
                    <span className={styles.ck} style={{color:'var(--pc-red)'}}>Escaped</span>
                    <span className={styles.cv} id="df-escaped" style={{color:'var(--pc-red)'}}>0</span>
                  </div>
                </div>
              </div>
              <div className={styles.canvasContainer}>
                <canvas id="diffCanvas" width="500" height="260" style={{maxWidth:'100%',height:'auto'}}/>
              </div>
            </div>
            <div className={styles.molecularNote} style={{marginTop:0}}>
              <strong>Teacher&apos;s Insight:</strong> In <em>Effusion mode</em>, particles that escape the hole are teleported back to the left chamber to maintain a constant pressure, allowing you to visually observe a steady macroscopic flow rate. Heavy molecules ($M$) move slower, while higher temperatures ($T$) increase velocity.
            </div>
          </div>
        </div>

        {/* Full Width Rate Formulas Card */}
        <div className={styles.fullWidthCard} style={{position:'relative'}}>
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} inactiveZone={0.3} borderWidth={2} />
          <div className={styles.formulaSplitGrid}>
            <div className={styles.fsgLeft}>
              <div className={styles.eqMain} style={{fontSize:'28px',color:'var(--pc-amber)',textAlign:'center',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px'}}>
                <span style={{fontStyle:'italic'}}>Rate</span>
                <span style={{fontFamily:'Inter',fontStyle:'normal',color:'var(--pc-t3)',fontSize:'20px'}}>∝</span>
                <span style={{display:'inline-flex',flexDirection:'column',alignItems:'center'}}>
                  <span style={{borderBottom:'2px solid var(--pc-amber)',padding:'0 12px 6px'}}>P × A</span>
                  <span style={{padding:'6px 12px 0'}}>√(T × M)</span>
                </span>
              </div>
              <div className={styles.varDefs}>
                <div><span className={styles.eqn} style={{color:'var(--pc-teal)',fontWeight:600}}>P</span> = Pressure</div>
                <div><span className={styles.eqn} style={{color:'var(--pc-teal)',fontWeight:600}}>A</span> = Area of pinhole</div>
                <div><span className={styles.eqn} style={{color:'var(--pc-teal)',fontWeight:600}}>T</span> = Temperature</div>
                <div><span className={styles.eqn} style={{color:'var(--pc-teal)',fontWeight:600}}>M</span> = Molecular Wt.</div>
              </div>
            </div>
            <div className={styles.fsgRight}>
              <div className={styles.altRates}>
                <div className={styles.arRow}>
                  <span className={styles.arLbl}>Rate</span>
                  <span className={styles.arEq}>=</span>
                  <div className={styles.arFrac}>
                    <div className={styles.arNum}>dist. travelled by gas</div>
                    <div className={styles.arDen}>Time taken</div>
                  </div>
                  <span className={styles.arEq}>=</span>
                  <span className={styles.arVal}>dx/dt</span>
                </div>
                <div className={styles.arRow}>
                  <span className={styles.arLbl} style={{visibility:'hidden'}}>Rate</span>
                  <span className={styles.arEq}>=</span>
                  <div className={styles.arFrac}>
                    <div className={styles.arNum}>vol. of gas escaped</div>
                    <div className={styles.arDen}>Time taken</div>
                  </div>
                  <span className={styles.arEq}>=</span>
                  <span className={styles.arVal}>dV/dt</span>
                </div>
                <div className={styles.arRow}>
                  <span className={styles.arLbl} style={{visibility:'hidden'}}>Rate</span>
                  <span className={styles.arEq}>=</span>
                  <div className={styles.arFrac}>
                    <div className={styles.arNum}>mole of gas escaped</div>
                    <div className={styles.arDen}>Time taken</div>
                  </div>
                  <span className={styles.arEq}>=</span>
                  <span className={styles.arVal}>dn/dt</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{marginTop:'40px',background:'rgba(0,0,0,0.3)',padding:'16px',borderRadius:'12px',border:'1px solid var(--pc-s3)',fontWeight:600,textAlign:'center',fontSize:'16px',color:'var(--pc-t1)'}}>
            Relative Rate Factor = <span style={{color:'var(--pc-amber)',fontFamily:"'JetBrains Mono',monospace",fontSize:'22px',marginLeft:'8px'}} id="d-live-rate">1.00x</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TAB 5 — CONCEPT MAP
      ══════════════════════════════════════════ */}
      <section id="tab-mindmap" className={styles.tabPanel}>
        <div className={styles.sectionTitle}>Gas States Concept Matrix</div>
        <p style={{color:'var(--pc-t2)',fontSize:'14px',marginBottom:'24px'}}>A structured breakdown of empirical laws, microscopic theories, and real gas deviations.</p>

        <div className={styles.bentoGrid}>
          {/* COLUMN 1: MACROSCOPIC LAWS */}
          <div className={styles.bentoCol}>
            <div className={`${styles.bentoCard} ${styles.cTeal}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={`${styles.bentoBadge} ${styles.bTeal}`}>Macroscopic Laws</div>
              <div className={styles.bentoTitle}>Boyle&apos;s Law</div>
              <div className={`${styles.bentoFormula} ${styles.fTeal}`}>P ∝ 1/V &nbsp;&nbsp;⇒&nbsp;&nbsp; P₁V₁ = P₂V₂</div>
              <div className={styles.bentoDesc}>At a constant temperature <strong>(T)</strong> and moles <strong>(n)</strong>, the pressure of a gas is inversely proportional to its volume.</div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cTeal}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Charles&apos; &amp; Gay-Lussac&apos;s</div>
              <div className={`${styles.bentoFormula} ${styles.fTeal}`}>V₁/T₁ = V₂/T₂ &nbsp;&nbsp;|&nbsp;&nbsp; P₁/T₁ = P₂/T₂</div>
              <div className={styles.bentoDesc}><strong>Charles&apos;:</strong> Volume is directly proportional to absolute Temp (constant P).<br/><br/><strong>Gay-Lussac&apos;s:</strong> Pressure is directly proportional to absolute Temp (constant V).</div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cTeal}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Dalton&apos;s Law of Partial Pressures</div>
              <div className={`${styles.bentoFormula} ${styles.fTeal}`}>P<sub style={{fontSize:'12px'}}>total</sub> = p₁ + p₂ + p₃...</div>
              <div className={styles.bentoDesc}>Total pressure is the sum of partial pressures. Partial pressure is calculated as: <strong>p₁ = x₁ · P<sub style={{fontSize:'11px'}}>total</sub></strong> (where x is mole fraction).</div>
            </div>
          </div>

          {/* COLUMN 2: MICROSCOPIC THEORY */}
          <div className={styles.bentoCol}>
            <div className={`${styles.bentoCard} ${styles.cPurple}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={`${styles.bentoBadge} ${styles.bPurple}`}>Microscopic Theory</div>
              <div className={styles.bentoTitle}>Kinetic Molecular Theory (KMT)</div>
              <div className={styles.bentoDesc}>
                <ul>
                  <li>Actual volume of molecules is negligible (point masses).</li>
                  <li>No intermolecular forces of attraction or repulsion.</li>
                  <li>Continuous, random motion with perfectly elastic collisions.</li>
                  <li>Gas pressure is caused by collisions with container walls.</li>
                </ul>
              </div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cPurple}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Kinetic Gas Equation</div>
              <div className={`${styles.bentoFormula} ${styles.fPurple}`}>PV = ⅓ mnu²</div>
              <div className={styles.bentoDesc}>Relates macroscopic properties (PV) to microscopic motion (u = root mean square speed).<br/><br/><strong>Average K.E. / mole</strong> = ¾ RT</div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cPurple}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Molecular Velocities</div>
              <div className={`${styles.bentoFormula} ${styles.fPurple}`} style={{fontSize:'18px'}}>U<sub style={{fontSize:'11px'}}>rms</sub> = √(3RT/M)</div>
              <div className={styles.bentoDesc}>
                <strong>U<sub style={{fontSize:'10px'}}>rms</sub></strong> (Root Mean Square) &gt; <strong>U<sub style={{fontSize:'10px'}}>av</sub></strong> (Average) &gt; <strong>U<sub style={{fontSize:'10px'}}>mp</sub></strong> (Most Probable)<br/><br/>
                Ratio of <strong>U<sub style={{fontSize:'10px'}}>mp</sub> : U<sub style={{fontSize:'10px'}}>av</sub> : U<sub style={{fontSize:'10px'}}>rms</sub></strong> = 1 : 1.128 : 1.224
              </div>
            </div>
          </div>

          {/* COLUMN 3: REAL GASES */}
          <div className={styles.bentoCol}>
            <div className={`${styles.bentoCard} ${styles.cAmber}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={`${styles.bentoBadge} ${styles.bAmber}`}>Real Deviations</div>
              <div className={styles.bentoTitle}>Van der Waals Equation</div>
              <div className={`${styles.bentoFormula} ${styles.fAmber}`}>(P + an²/V²)(V - nb) = nRT</div>
              <div className={styles.bentoDesc}>
                Corrects ideal gas behavior for real conditions:<br/>
                <strong>&apos;a&apos;</strong> = measure of intermolecular attractive forces.<br/>
                <strong>&apos;b&apos;</strong> = effective volume occupied by gas molecules.
              </div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cAmber}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Compressibility Factor (Z)</div>
              <div className={`${styles.bentoFormula} ${styles.fAmber}`}>Z = PV / nRT</div>
              <div className={styles.bentoDesc}>
                <strong>Z = 1:</strong> Ideal behavior.<br/>
                <strong>Z &lt; 1:</strong> Negative deviation (attractive forces dominate, easily compressible).<br/>
                <strong>Z &gt; 1:</strong> Positive deviation (repulsive forces dominate, hard to compress).
              </div>
            </div>
            <div className={`${styles.bentoCard} ${styles.cAmber}`} style={{position:'relative'}}>
              <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.5} borderWidth={1.5} />
              <div className={styles.bentoTitle}>Critical Constants</div>
              <div className={`${styles.bentoFormula} ${styles.fAmber}`} style={{fontSize:'18px'}}>T<sub style={{fontSize:'11px'}}>c</sub> = 8a / 27Rb</div>
              <div className={styles.bentoDesc}>
                <strong>T<sub style={{fontSize:'10px'}}>c</sub></strong>: Highest temp at which gas can be liquefied.<br/>
                <strong>P<sub style={{fontSize:'10px'}}>c</sub></strong> = a / 27b² (Pressure at T<sub style={{fontSize:'10px'}}>c</sub>)<br/>
                <strong>V<sub style={{fontSize:'10px'}}>c</sub></strong> = 3b (Volume of 1 mol at T<sub style={{fontSize:'10px'}}>c</sub>)
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
