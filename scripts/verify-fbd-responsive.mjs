/*
 * verify-fbd-responsive.mjs — RENDERS the stage and reads the grid it emits.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-fbd-responsive.mjs
 *
 * WHY THIS EXISTS. The mobile layout regressed once already and a code read did
 * not catch it: the threshold was written `w > 0 && w < 640`, which reads
 * correct and silently means "a stage I have not measured yet is a DESKTOP".
 * At a 375px stage the grid stayed two-column and the canvas collapsed to 48%
 * of the stage width.
 *
 * So this does not read the source. It compiles the REAL `StagePanels` with
 * esbuild, server-renders it with react-dom, and asserts the
 * `grid-template-columns` that actually comes out of the component — including
 * at width 0, which is the state the bug was stuck in.
 *
 * What it cannot do is run a live layout engine (no jsdom here), so it proves
 * the DECISION, not the pixels. The measured-pixel companion checks are
 * `scripts/verify-fbd-fill.mjs` (canvas fill, executed) and the browser sweep.
 *
 * Exits non-zero on any failure.
 */

import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('../', import.meta.url).pathname;
// The bundle has to live INSIDE the repo: react/react-dom are left external so
// the real installed copies are used, and node resolves those relative to the
// importing file. A tmpdir would resolve nothing.
const CACHE = join(ROOT, 'node_modules', '.cache', 'fbd-verify');
mkdirSync(CACHE, { recursive: true });
const out = join(CACHE, 'bundle.mjs');

await build({
  stdin: {
    contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { StagePanels, useStageBox } from '${ROOT}packages/book-renderer/blocks/mechanics-bench/fbd/canvas.tsx';
      import { stageColumns, stageAspect, isNarrowStage, NARROW_PX }
        from '${ROOT}packages/book-renderer/blocks/mechanics-bench/fbd/fit.ts';

      /** Render the real component at a given measured stage width. */
      export function renderAt(stageW) {
        const box = {
          rootRef: () => {}, boxRef: () => {},
          stageW,
          narrow: isNarrowStage(stageW),
          w: 400, h: 300, ready: true,
        };
        return renderToStaticMarkup(
          React.createElement(StagePanels, {
            box,
            side: React.createElement('p', null, 'panels'),
            footer: React.createElement('p', null, 'footer'),
          }, React.createElement('svg'))
        );
      }
      export { stageColumns, stageAspect, isNarrowStage, NARROW_PX, useStageBox };
    `,
    resolveDir: ROOT,
    loader: 'tsx',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/server', '@canvas/*'],
  outfile: out,
  logLevel: 'silent',
});

const mod = await import(pathToFileURL(out).href);

let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`);
};

/** Pull the grid template out of the rendered markup. */
const gridOf = (html) => {
  const m = html.match(/grid-template-columns:\s*([^;"]+)/);
  return m ? m[1].trim() : null;
};
const columnCount = (tpl) => (tpl ? tpl.split(/\)\s*,?\s*(?=minmax|\d|[a-z])/i).length : 0);

console.log('\n── The pure decision, executed ──────────────────────────────────────');
check('threshold is 640', mod.NARROW_PX, 640);
check('an UNMEASURED stage (0) is narrow — this was the bug', mod.isNarrowStage(0), true);
check('a 325px stage is narrow', mod.isNarrowStage(325), true);
check('a 375px stage is narrow', mod.isNarrowStage(375), true);
check('a 639px stage is narrow', mod.isNarrowStage(639), true);
check('a 640px stage is NOT narrow', mod.isNarrowStage(640), false);
check('a 1000px stage is NOT narrow', mod.isNarrowStage(1000), false);

console.log('\n── The rendered grid, from the real component ───────────────────────');
for (const [w, want] of [[0, 1], [325, 1], [375, 1], [500, 1], [639, 1], [640, 2], [1000, 2]]) {
  const tpl = gridOf(mod.renderAt(w));
  check(`stage ${String(w).padStart(4)}px renders ${want} column${want === 1 ? '' : 's'}  (${tpl})`,
    columnCount(tpl), want);
}

console.log('\n── The board aspect follows the same decision ───────────────────────');
check('narrow board is 4:3', mod.stageAspect(375), '4 / 3');
check('wide board is 3:2', mod.stageAspect(1000), '3 / 2');
check('unmeasured board is 4:3, not a desktop default', mod.stageAspect(0), '4 / 3');

console.log('\n── The grid is not the measured element ─────────────────────────────');
{
  // The measured wrapper must sit OUTSIDE the grid, so the grid's own template
  // can never feed back into the width it is decided from.
  const html = mod.renderAt(375);
  const gridAt = html.indexOf('grid-template-columns');
  const wrapAt = html.indexOf('width:100%');
  check('a plain full-width wrapper precedes the grid', wrapAt >= 0 && wrapAt < gridAt, true);
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
