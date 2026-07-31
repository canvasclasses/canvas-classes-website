'use client';

/*
 * pulley/RealWorldTab.tsx — five machines, one trade.
 * ─────────────────────────────────────────────────────────────────────────────
 * The misconception this tab exists to kill: "a pulley system makes the work
 * easier." It does not. It makes the FORCE smaller and the DISTANCE longer by
 * the same factor, and the product — the work — does not move. Students who
 * believe otherwise go on to believe a machine can create energy.
 *
 * So every card prints all three numbers together, computed from the same load
 * the student picked, and the joules column is deliberately identical down the
 * whole list. Reading it as a column is the argument.
 *
 * ACADEMIC ACCURACY. `n` here is the VELOCITY RATIO — the number of rope
 * segments supporting the moving block — which is a counting fact about the
 * rigging, not an estimate. The IDEAL mechanical advantage equals it. Real
 * systems lose to sheave friction and rope stiffness, so the actual MA is
 * lower and efficiency = MA / VR < 1; that is stated on the card rather than
 * quietly ignored. (Standard machines treatment: MA = load / effort,
 * VR = effort distance / load distance, η = MA / VR.)
 */

import * as React from 'react';
import {
  BORDER, ExpertTip, Frac, SectionLabel, SimSlider, TEXT, TYPE,
} from '../../simulations/_shared';

interface Machine {
  name: string;
  where: string;
  n: number;
  /** What the rigging actually is — the countable claim behind `n`. */
  rigging: string;
  /** Why this machine is rigged the way it is. */
  why: string;
}

const MACHINES: Machine[] = [
  {
    name: 'Well pulley',
    where: 'Any village well',
    n: 1,
    rigging: 'One fixed sheave on the frame. One segment holds the bucket.',
    why: 'It saves you nothing in force — a 12 kg bucket still needs 12 kg of pull. What it changes is the DIRECTION: you pull down, using your own weight, instead of hauling straight up with your back. That is worth a great deal and it is not mechanical advantage at all.',
  },
  {
    name: 'Lift counterweight',
    where: 'Every apartment building',
    n: 1,
    rigging: 'One sheave at the top of the shaft. Car on one side, counterweight on the other.',
    why: 'Also MA = 1 — but the counterweight is set to the car plus about 45% of full load, so the motor only ever lifts the difference. This is an Atwood machine with a gearbox, which is why a lift motor is far smaller than the car it carries.',
  },
  {
    name: 'Gym cable stack',
    where: 'Lat pulldown, cable crossover',
    n: 2,
    rigging: 'A movable sheave rides on the weight stack; two segments hold it.',
    why: 'Pick the 40 kg plate and the handle feels like 20 kg — and you pull two metres of cable for every metre the stack rises. Machines labelled 1:1 have the stack on a rope end instead, which is why the same "40 kg" feels different on different machines.',
  },
  {
    name: 'Tower crane hook block',
    where: 'Any construction site',
    n: 4,
    rigging: 'The hoist rope is reeved four times between the trolley and the hook block.',
    why: 'The hoist drum can only pull so hard. Four falls quarter the rope tension for a given load, at the cost of winding four times the length of rope — which is why the hook rises slowly on heavy lifts and quickly on light ones.',
  },
  {
    name: 'Z-drag haul system',
    where: 'Crevasse and swiftwater rescue',
    n: 3,
    rigging: 'Rope from the load, through an anchor pulley, back to a progress-capture pulley on the load. Three segments cross the gap.',
    why: 'Three rescuers pulling a 3:1 can move a casualty one metre for every three metres of rope hauled. Built from two pulleys and two prusiks in under a minute — the reason it is taught before anything else.',
  },
];

const G = 9.8;

export default function RealWorldTab({ accent }: { accent: string }) {
  const [loadKg, setLoadKg] = React.useState(60);
  const W = loadKg * G;                       // weight of the load, N
  const lift = 1;                             // metres raised, fixed at 1 for comparison
  const workJ = W * lift;                     // the column that never changes

  return (
    <div className="flex flex-col gap-5">
      <div>
        <SectionLabel accent={accent}>The trade, in one line</SectionLabel>
        <p className="mt-2 text-lg font-bold leading-snug text-white">
          Effort force =
          <Frac num="load" den="n" />
          · Rope pulled = n × height · Work =
          <span style={{ color: accent }}> the same either way</span>.
        </p>
        <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
          n is not a formula to remember. It is how many rope segments you can
          count holding the moving block — the same number the constraint
          equation puts in front of that body&apos;s acceleration.
        </p>
      </div>

      <SimSlider label="Load" value={loadKg} min={10} max={200} step={5}
        unit="kg" accent={accent} onChange={setLoadKg} />

      <div className="flex flex-col">
        {/* Header row */}
        <div className="flex items-baseline gap-3 pb-1.5"
          style={{ borderBottom: `1px solid ${BORDER.divider}` }}>
          <span className={`${TYPE.sectionLabel} flex-1`} style={{ color: TEXT.muted }}>
            Machine
          </span>
          <span className={TYPE.sectionLabel} style={{ color: TEXT.muted, minWidth: 34, textAlign: 'right' }}>n</span>
          <span className={TYPE.sectionLabel} style={{ color: TEXT.muted, minWidth: 76, textAlign: 'right' }}>You pull</span>
          <span className={TYPE.sectionLabel} style={{ color: TEXT.muted, minWidth: 66, textAlign: 'right' }}>Rope</span>
          <span className={TYPE.sectionLabel} style={{ color: TEXT.muted, minWidth: 74, textAlign: 'right' }}>Work</span>
        </div>

        {MACHINES.map((m) => (
          <div key={m.name} className="py-3" style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
            <div className="flex items-baseline gap-3">
              <span className="flex-1 text-sm font-semibold" style={{ color: TEXT.primary }}>
                {m.name}
                <span className="ml-2 text-xs font-normal" style={{ color: TEXT.muted }}>
                  {m.where}
                </span>
              </span>
              <span className="tabular-nums text-sm font-semibold"
                style={{ color: accent, minWidth: 34, textAlign: 'right' }}>{m.n}</span>
              <span className="tabular-nums text-sm"
                style={{ color: TEXT.primary, minWidth: 76, textAlign: 'right' }}>
                {(W / m.n).toFixed(0)} N
              </span>
              <span className="tabular-nums text-sm"
                style={{ color: TEXT.primary, minWidth: 66, textAlign: 'right' }}>
                {(m.n * lift).toFixed(0)} m
              </span>
              <span className="tabular-nums text-sm font-semibold"
                style={{ color: accent, minWidth: 74, textAlign: 'right' }}>
                {workJ.toFixed(0)} J
              </span>
            </div>
            <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.ghost }}>
              {m.rigging}
            </p>
            <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.secondary }}>
              {m.why}
            </p>
          </div>
        ))}
      </div>

      <p className={TYPE.body} style={{ color: TEXT.secondary }}>
        Read the last column down. Five completely different machines, five
        different pulls, five different lengths of rope — and one number that
        never moves. Lifting a {loadKg} kg load one metre costs {workJ.toFixed(0)} joules,
        and no arrangement of ropes and wheels has ever changed that.
      </p>

      <p className={TYPE.body} style={{ color: TEXT.ghost }}>
        These are IDEAL figures. Real sheaves have friction and real rope
        resists bending, so the force you actually need is somewhat more than
        load / n. The rope length is not affected — the velocity ratio n is
        fixed by the rigging — which is why efficiency is defined as the actual
        mechanical advantage divided by n, and is always below 1.
      </p>

      <ExpertTip accent={accent}>
        If a machine ever seems to give you something for nothing, you have
        forgotten to measure how far something moved.
      </ExpertTip>
    </div>
  );
}
