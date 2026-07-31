/*
 * scripts/physics-checks/check-circular.ts
 * Node verification of motion-lab/lib/circular.ts — the academic-accuracy gate
 * for the Circular Motion Arena. Run: npx tsx scripts/physics-checks/check-circular.ts
 */
import {
  readout, vMinAtTop, vMinAtBottom, bankedSafeBand, releaseState,
  conicalPendulum, rotorMinSpeed, crestAirborneSpeed, speedAt, posAt, tangentAt, G_EARTH,
} from '../../packages/book-renderer/blocks/motion-lab/lib/circular';
import type { CircularSpec } from '../../packages/book-renderer/blocks/motion-lab/types';
import {
  CIRCULAR_ARCHETYPES, circularSpecOf,
} from '../../packages/book-renderer/blocks/motion-lab/archetypes.circular';

let fails = 0;
const near = (name: string, got: number, want: number, tol = 1e-3) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${got.toFixed(4)}  want ${want.toFixed(4)}`);
};
const is = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${String(got)}  want ${String(want)}`);
};

// 1. v_min at the top of a 2 m vertical circle = sqrt(g r) = 4.427 m/s
near('vMinAtTop(2)', vMinAtTop(2), Math.sqrt(9.8 * 2));
near('vMinAtTop(2) numeric', vMinAtTop(2), 4.4272, 1e-3);
near('vMinAtBottom(2) = sqrt(5gr)', vMinAtBottom(2), Math.sqrt(5 * 9.8 * 2));

// 2. 45 deg frictionless bank, r = 50 m -> v = 22.14 m/s, band collapses to a point
const band = bankedSafeBand(50, 45, 0);
near('banked 45deg mu=0 vMin', band.vMin, 22.1359, 1e-3);
near('banked 45deg mu=0 vMax', band.vMax, 22.1359, 1e-3);

// 2b. with friction the band opens around it
const band2 = bankedSafeBand(50, 45, 0.2);
console.log(`      mu=0.2 band = [${band2.vMin.toFixed(2)}, ${band2.vMax.toFixed(2)}] m/s`);
is('mu=0.2 band brackets the frictionless value',
  band2.vMin < 22.1359 && band2.vMax > 22.1359, true);
// flat road (0 deg bank): vMax = sqrt(mu g r)
near('flat road mu=0.5 vMax', bankedSafeBand(50, 0, 0.5).vMax, Math.sqrt(0.5 * 9.8 * 50));
is('mu*tan >= 1 -> no upper limit', bankedSafeBand(50, 80, 0.4).vMax, Infinity);

// 3. Vertical circle tension. r=1, m=1, at the BOTTOM with v=5:
//    T = mv^2/r + mg = 25 + 9.8 = 34.8 N
const vert: CircularSpec = { radius: 1, mass: 1, omega: 5, plane: 'vertical', agent: 'string' };
const atBottom = readout(vert, Math.PI);
near('bottom speed = omega*r', atBottom.speed, 5);
near('bottom tension', atBottom.agentForce, 25 + 9.8);
is('bottom not released', atBottom.released, false);

// at the TOP: v^2 = 25 - 4gr = 25 - 39.2 < 0 -> cannot reach
const atTop = readout(vert, 0);
is('v=5 at bottom cannot reach the top of r=1', atTop.released, true);

// exactly critical: v_bottom = sqrt(5gr) = 7 for r=1 -> v_top = sqrt(gr), T_top = 0
const crit: CircularSpec = { radius: 1, mass: 1, omega: Math.sqrt(5 * 9.8), plane: 'vertical', agent: 'string' };
near('critical top speed', readout(crit, 0).speed, Math.sqrt(9.8));
near('critical top tension = 0', readout(crit, 0).agentForce, 0, 1e-6);
is('critical case not flagged released', readout(crit, 0).released, false);
near('critical vMinTop reported', readout(crit, 0).vMinTop ?? -1, Math.sqrt(9.8));

// just below critical -> tension goes NEGATIVE and released fires (not clamped)
const slack: CircularSpec = { ...crit, omega: Math.sqrt(5 * 9.8) - 0.3 };
const st = readout(slack, 0);
is('sub-critical string goes slack', st.released, true);
is('sub-critical tension is negative (not clamped)', st.agentForce < 0, true);

// a ROD never releases, even at zero speed at the top
const rod: CircularSpec = { ...slack, agent: 'rod' };
is('rod never releases', readout(rod, 0).released, false);

// 4. Bridge crest: r = 20 m -> airborne at sqrt(g r) = 14 m/s
near('crest airborne speed r=20', crestAirborneSpeed(20), Math.sqrt(9.8 * 20));
const crest: CircularSpec = { radius: 20, mass: 1000, omega: 10 / 20, plane: 'vertical', agent: 'track-outside' };
// v = 10 m/s at the crest: N = m(g - v^2/r) = 1000*(9.8 - 5) = 4800 N
near('crest normal at 10 m/s', readout(crest, 0).agentForce, 1000 * (9.8 - 100 / 20));
const fast: CircularSpec = { ...crest, omega: 15 / 20 };
is('crest airborne above sqrt(gr)', readout(fast, 0).released, true);

// 5. Conical pendulum: L = 1 m, 30 deg -> omega = sqrt(g/(L cos30)), T/m = g/cos30
const cp = conicalPendulum(1, 30);
near('conical omega', cp.omega, Math.sqrt(9.8 / Math.cos(30 * Math.PI / 180)));
near('conical tension per kg', cp.tension, 9.8 / Math.cos(30 * Math.PI / 180));
near('conical radius', cp.radius, Math.sin(30 * Math.PI / 180));
console.log(`      conical period = ${(2 * Math.PI / cp.omega).toFixed(3)} s`);

// 6. Rotor: r = 2 m, mu = 0.4 -> v_min = sqrt(gr/mu) = 7.0 m/s
near('rotor min speed', rotorMinSpeed(2, 0.4), Math.sqrt(9.8 * 2 / 0.4));

// 7. Tangential departure. Ball at the TOP going CCW leaves horizontally.
const rel = releaseState({ radius: 2, mass: 1, omega: 3, plane: 'horizontal', agent: 'string' }, 0, { x: 0, y: 0 });
near('release pos x at top', rel.pos.x, 0);
near('release pos y at top', rel.pos.y, 2);
near('release vel is horizontal (vy = 0)', rel.vel.y, 0);
near('release speed = omega r', Math.hypot(rel.vel.x, rel.vel.y), 6);
is('release vel is NOT radial (vx nonzero)', Math.abs(rel.vel.x) > 1e-6, true);
// perpendicularity: v . (pos - centre) = 0 at every angle, both directions
for (const om of [3, -3]) {
  const s: CircularSpec = { radius: 2, mass: 1, omega: om, plane: 'horizontal', agent: 'string' };
  let worst = 0;
  for (let i = 0; i < 40; i++) {
    const th = (i / 40) * 2 * Math.PI;
    const p = posAt(s, th, { x: 0, y: 0 });
    const t = tangentAt(s, th);
    worst = Math.max(worst, Math.abs(p.x * t.x + p.y * t.y));
  }
  near(`velocity perpendicular to radius (omega=${om})`, worst, 0, 1e-12);
}
// and the travel direction: omega>0 must move CCW (cross(pos, vel) > 0)
const ccw = releaseState({ radius: 2, mass: 1, omega: 3, plane: 'horizontal', agent: 'string' }, Math.PI / 3, { x: 0, y: 0 });
const pccw = posAt({ radius: 2, mass: 1, omega: 3, plane: 'horizontal', agent: 'string' }, Math.PI / 3, { x: 0, y: 0 });
is('omega > 0 runs counter-clockwise', pccw.x * ccw.vel.y - pccw.y * ccw.vel.x > 0, true);

// 8. Energy conservation round a vertical loop: v_top^2 = v_bottom^2 - 4gr
const e: CircularSpec = { radius: 1.5, mass: 2, omega: 8 / 1.5, plane: 'vertical', agent: 'string' };
near('energy: v_top^2 = v_bot^2 - 4gr',
  speedAt(e, 0) ** 2, 64 - 4 * 9.8 * 1.5, 1e-6);
near('energy: side speed', speedAt(e, Math.PI / 2) ** 2, 64 - 2 * 9.8 * 1.5, 1e-6);

// 9. Uniform circular motion still has acceleration (the headline misconception)
const ucm: CircularSpec = { radius: 4, mass: 1, omega: 2, plane: 'horizontal', agent: 'string' };
const r9 = readout(ucm, 1.234);
near('UCM speed constant', r9.speed, 8);
near('UCM centripetal = omega^2 r', r9.centripetal, 4 * 4);
near('UCM tangential = 0', r9.tangential, 0);
near('UCM total = centripetal', r9.total, 16);

// 10. Non-uniform: alpha adds tangential accel and speeds it up over the arc
const nu: CircularSpec = { radius: 2, mass: 1, omega: 1, plane: 'horizontal', agent: 'friction', mu_s: 5, alphaTangential: 1.5 };
near('non-uniform tangential = alpha', readout(nu, 0.9).tangential, 1.5);
near('non-uniform v^2 = v0^2 + 2*a*s', speedAt(nu, 1) ** 2, 4 + 2 * 1.5 * 2 * 1, 1e-9);
is('non-uniform total > centripetal alone',
  readout(nu, 0.5).total > readout(nu, 0.5).centripetal, true);

// ── 11. Every archetype must build a spec that STARTS in a sane state ───────
// (a "find the critical speed" exercise that starts already broken teaches
//  nothing, and a "safe band" exercise that starts outside the band is worse)
console.log('\n--- archetypes ---');
for (const [id, a] of Object.entries(CIRCULAR_ARCHETYPES)) {
  const s = circularSpecOf(id);
  // A crest only exists near the top; evaluating it at the bottom of its
  // circle is meaningless (and produced a bogus 'STARTS AIRBORNE').
  const start = s.plane === 'vertical' && s.agent !== 'track-outside' ? Math.PI : 0;
  const rd = readout(s, start, G_EARTH);
  const okShape = s.radius > 0 && s.mass > 0 && Number.isFinite(s.omega) && Number.isFinite(rd.speed);
  if (!okShape) fails++;
  const notes: string[] = [];
  if (s.plane === 'vertical' && (s.agent === 'string' || s.agent === 'track-inside')) {
    const needed = vMinAtBottom(s.radius);
    const have = Math.abs(s.omega) * s.radius;
    if (have <= needed) { fails++; notes.push(`STARTS BROKEN: v_bottom ${have.toFixed(2)} <= sqrt(5gr) ${needed.toFixed(2)}`); }
    else notes.push(`completes the loop (${have.toFixed(2)} > ${needed.toFixed(2)} m/s)`);
  }
  if (s.bankDeg !== undefined) {
    const b = bankedSafeBand(s.radius, s.bankDeg, s.mu_s ?? 0);
    const v = Math.abs(s.omega) * s.radius;
    if (v < b.vMin || v > b.vMax) { fails++; notes.push(`STARTS OUTSIDE BAND: ${v.toFixed(1)} not in [${b.vMin.toFixed(1)}, ${b.vMax.toFixed(1)}]`); }
    else notes.push(`inside the band [${b.vMin.toFixed(1)}, ${b.vMax.toFixed(1)}] m/s`);
  }
  if (id === 'bridge-crest') {
    const v = Math.abs(s.omega) * s.radius;
    if (rd.released) { fails++; notes.push('STARTS AIRBORNE'); }
    else notes.push(`on the road (${v.toFixed(1)} < sqrt(gr) ${crestAirborneSpeed(s.radius).toFixed(1)} m/s)`);
  }
  if (!a.targets) { fails++; notes.push('NO MISCONCEPTION TARGET'); }
  if (!a.defaultSteps?.length) { fails++; notes.push('NO GUIDED SCRIPT'); }
  console.log(`${okShape ? 'PASS' : 'FAIL'}  ${id.padEnd(24)} v=${(Math.abs(s.omega) * s.radius).toFixed(2)} m/s  a_c=${rd.centripetal.toFixed(1)} m/s^2  -> ${a.targets}${notes.length ? '  [' + notes.join('; ') + ']' : ''}`);
}

console.log(fails === 0 ? '\nALL CHECKS PASSED' : `\n${fails} CHECK(S) FAILED`);
process.exit(fails === 0 ? 0 : 1);
