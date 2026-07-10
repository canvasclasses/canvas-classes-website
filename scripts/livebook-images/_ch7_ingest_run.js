'use strict';
/**
 * One-off driver: ingest the 24 verified Ch.7 images (pages 144–155).
 *
 * Unlike the Ch11/Ch12 drivers, this does NOT rely on download order — Ch7's
 * generation had a skipped diagram (p145, made last in batch 2) and a recreated
 * hero (p151), so file order ≠ block order. Instead every file is mapped to its
 * block EXPLICITLY, after the agent content-verified each PNG 1:1 against the
 * intended page/diagram. Runs ingest.js per pair (cwebp -q42 → R2 → write block
 * src → journal). Pass --dry to print the mapping without writing.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const DL = path.join(os.homedir(), 'Downloads');
const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = '7';
const INGEST = path.join(__dirname, 'ingest.js');
const DRY = process.argv.includes('--dry');
const f = (name) => path.join(DL, name);

// file → { pageId, blockId } — content-verified by the agent.
const MAP = [
  // p144 work-scientific-definition
  { file: f('ChatGPT Image Jun 22, 2026, 07_59_41 PM.png'), slug: 'p144 hero (wall/cart)',        pageId: 'c862fe22-f91c-4d56-a0a1-3d4d38cde702', blockId: '93ac6514-fbe6-4567-b007-017a9b6b5ffe' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_00_31 PM.png'), slug: 'p144 diagram (3 cases)',        pageId: 'c862fe22-f91c-4d56-a0a1-3d4d38cde702', blockId: '5c205f8c-bde0-458f-8ba0-25074cfe9d81' },
  // p145 work-energy-theorem
  { file: f('ChatGPT Image Jun 22, 2026, 08_02_05 PM.png'), slug: 'p145 hero (cricket)',           pageId: '0ab107f9-1234-46f9-a7c6-647835aedd68', blockId: 'b505787b-8dc3-4c49-8771-df99fd708476' },
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_31 PM.png'), slug: 'p145 diagram (arm→ball→wicket)',pageId: '0ab107f9-1234-46f9-a7c6-647835aedd68', blockId: 'ca622aaa-cff8-4798-b5ec-122a9cc9d7bc' },
  // p146 forms-of-energy
  { file: f('ChatGPT Image Jun 22, 2026, 08_02_08 PM.png'), slug: 'p146 hero (sun chain)',         pageId: '2b3f9c76-3438-44f1-a150-8695637555b7', blockId: 'f5dcfb1b-45b8-4404-a51f-7491ada38428' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_02_15 PM.png'), slug: 'p146 diagram (forms icons)',    pageId: '2b3f9c76-3438-44f1-a150-8695637555b7', blockId: '6b846cce-743a-4e86-9c96-d8357c559f5e' },
  // p147 kinetic-energy
  { file: f('ChatGPT Image Jun 22, 2026, 08_05_25 PM.png'), slug: 'p147 hero (car wake)',          pageId: 'a59f112e-4f5d-45e7-b96e-1b565fb5d50e', blockId: '4d2da25b-2ebe-4b14-88ef-8f80f6d8e6e3' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_05_48 PM.png'), slug: 'p147 diagram (K=½mv²)',         pageId: 'a59f112e-4f5d-45e7-b96e-1b565fb5d50e', blockId: 'cd73a98c-57b7-46ff-b76b-4d2a0b319862' },
  // p148 potential-energy
  { file: f('ChatGPT Image Jun 22, 2026, 08_05_54 PM.png'), slug: 'p148 hero (bow/hammer)',        pageId: '0c2514e6-dccd-4b05-8ab7-7e72eeb64314', blockId: 'aa00c7c2-ba69-420c-90d2-600a4366be78' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_06_43 PM.png'), slug: 'p148 diagram (mgh + spring)',   pageId: '0c2514e6-dccd-4b05-8ab7-7e72eeb64314', blockId: '82d010c3-d5f9-476d-8023-8c5d807ad937' },
  // p149 conservation-of-energy
  { file: f('ChatGPT Image Jun 22, 2026, 08_06_50 PM.png'), slug: 'p149 hero (pendulum trail)',    pageId: '76273c17-aa8a-49fd-b279-f9007c671ad2', blockId: '195b8270-5d05-4ae3-bc83-f57bfda638aa' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_06_52 PM.png'), slug: 'p149 diagram (pendulum energy)',pageId: '76273c17-aa8a-49fd-b279-f9007c671ad2', blockId: '13404586-fe1c-45d0-8cf5-f5b69f6a3b0b' },
  // p150 power
  { file: f('ChatGPT Image Jun 22, 2026, 08_06_55 PM.png'), slug: 'p150 hero (staircase)',         pageId: '75b15363-3b46-4afb-94aa-1d784b0363aa', blockId: '68edf3e5-d382-48b7-8ecd-705f11e725a7' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_10_27 PM.png'), slug: 'p150 diagram (P=W/t)',          pageId: '75b15363-3b46-4afb-94aa-1d784b0363aa', blockId: '4df321bc-35f0-43ff-b230-958fdb882582' },
  // p151 simple-machines
  { file: f('ChatGPT Image Jun 22, 2026, 08_15_00 PM.png'), slug: 'p151 hero (3 ways)',            pageId: '4ef316b4-2a2b-400c-b469-8aadf92fd7e9', blockId: '27b05fd7-0168-4c00-8d08-67b972ca7067' },
  { file: f('ChatGPT Image Jun 22, 2026, 08_15_22 PM.png'), slug: 'p151 diagram (lever MA)',       pageId: '4ef316b4-2a2b-400c-b469-8aadf92fd7e9', blockId: 'da81bdea-a9fe-4a62-938d-31d5712503ed' },
  // p152 levers
  { file: f('ChatGPT Image Jun 22, 2026, 10_04_43 PM.png'), slug: 'p152 hero (seesaw)',            pageId: '1e78177c-62f8-455d-8dec-61bb9bae879d', blockId: '1c062b7d-e316-46ca-bf9e-58ac146f313f' },
  { file: f('ChatGPT Image Jun 22, 2026, 10_04_53 PM.png'), slug: 'p152 diagram (lever arms)',     pageId: '1e78177c-62f8-455d-8dec-61bb9bae879d', blockId: 'c57d1df3-9186-4cc2-8642-17a2104932d0' },
  // p153 pulleys
  { file: f('ChatGPT Image Jun 22, 2026, 10_04_58 PM.png'), slug: 'p153 hero (flag/pulley)',       pageId: '43482717-f8e8-485c-9dd4-1dd551cf3fdc', blockId: 'd8443c2c-3bae-4e19-9223-05a20f7c35ac' },
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_05 PM.png'), slug: 'p153 diagram (fixed/movable)',  pageId: '43482717-f8e8-485c-9dd4-1dd551cf3fdc', blockId: 'fb9bef46-b32f-4fa4-8001-d693708250a6' },
  // p154 inclined-planes
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_10 PM.png'), slug: 'p154 hero (switchbacks)',       pageId: '37c5fb42-9c5c-43d0-a6c2-d57bfdbe8837', blockId: '19a3829d-725e-4755-b13c-fefb9300cc22' },
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_19 PM.png'), slug: 'p154 diagram (L/h≈1.67)',       pageId: '37c5fb42-9c5c-43d0-a6c2-d57bfdbe8837', blockId: '175d17af-7632-45de-88fa-1738c70c0704' },
  // p155 machines-in-indian-traditional-life
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_24 PM.png'), slug: 'p155 hero (charkha/chakki/well)',pageId: '2e271b8d-7d44-423a-beb4-a5f28b1b5976', blockId: 'ae32524d-d858-4d10-80f2-becf690e60dd' },
  { file: f('ChatGPT Image Jun 22, 2026, 10_05_28 PM.png'), slug: 'p155 diagram (3 tools)',        pageId: '2e271b8d-7d44-423a-beb4-a5f28b1b5976', blockId: 'ae1d4bb8-bd0c-43fc-85b2-9bd089c4d40f' },
];

// preflight: every file must exist; abort otherwise
const missing = MAP.filter((m) => !fs.existsSync(m.file));
if (missing.length) {
  console.error('MISSING FILES — aborting:');
  missing.forEach((m) => console.error(`  ${m.slug}: ${path.basename(m.file)}`));
  process.exit(1);
}

console.log(`Ch7 ingest — ${MAP.length} images:`);
MAP.forEach((m, i) => console.log(`  ${String(i + 1).padStart(2)}. ${path.basename(m.file)}  →  ${m.slug}`));
console.log('');
if (DRY) { console.log('[dry run] no writes performed.'); process.exit(0); }

let ok = 0;
MAP.forEach((m) => {
  const args = [INGEST,
    '--file', m.file,
    '--page', m.pageId,
    '--block', m.blockId,
    '--field', 'src',
    '--lang', 'en',
    '--book', BOOK,
    '--chapter', CH,
  ];
  try {
    const out = execFileSync('node', args, { encoding: 'utf8' });
    const last = out.trim().split('\n').filter(Boolean).pop() || '';
    console.log(`✅ ${m.slug}: ${last}`);
    ok++;
  } catch (e) {
    console.error(`❌ ${m.slug}: ${(e.stdout || '') + (e.stderr || e.message)}`);
  }
});
console.log(`\nDone: ${ok}/${MAP.length} ingested.`);
