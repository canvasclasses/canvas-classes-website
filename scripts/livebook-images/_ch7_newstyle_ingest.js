'use strict';
/**
 * Ingest the 24 NEW hand-drawn-dark-style Ch7 images, REPLACING the old
 * orange-glow ones on pages p144–p155. File→block map is content-verified by
 * the agent (each PNG read 1:1). Uses --force (block src already set) and
 * --suffix v2 (new R2 filename → busts the CDN cache so the new image shows).
 * cwebp -q42 → R2 → block src → journal. published stays false. --dry to preview.
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

// content-verified file → { pageId, blockId }
const PAGE = {
  p144: 'c862fe22-f91c-4d56-a0a1-3d4d38cde702',
  p145: '0ab107f9-1234-46f9-a7c6-647835aedd68',
  p146: '2b3f9c76-3438-44f1-a150-8695637555b7',
  p147: 'a59f112e-4f5d-45e7-b96e-1b565fb5d50e',
  p148: '0c2514e6-dccd-4b05-8ab7-7e72eeb64314',
  p149: '76273c17-aa8a-49fd-b279-f9007c671ad2',
  p150: '75b15363-3b46-4afb-94aa-1d784b0363aa',
  p151: '4ef316b4-2a2b-400c-b469-8aadf92fd7e9',
  p152: '1e78177c-62f8-455d-8dec-61bb9bae879d',
  p153: '43482717-f8e8-485c-9dd4-1dd551cf3fdc',
  p154: '37c5fb42-9c5c-43d0-a6c2-d57bfdbe8837',
  p155: '2e271b8d-7d44-423a-beb4-a5f28b1b5976',
};
const MAP = [
  { file: f('ChatGPT Image Jun 24, 2026, 02_10_34 AM.png'), slug: 'p144 hero (wall/cart)',         page: PAGE.p144, blockId: '93ac6514-fbe6-4567-b007-017a9b6b5ffe' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_10_51 AM.png'), slug: 'p144 diagram (3 cases)',         page: PAGE.p144, blockId: '5c205f8c-bde0-458f-8ba0-25074cfe9d81' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_10_57 AM.png'), slug: 'p145 hero (cricket)',            page: PAGE.p145, blockId: 'b505787b-8dc3-4c49-8771-df99fd708476' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_11_03 AM.png'), slug: 'p145 diagram (arm→ball→wicket)', page: PAGE.p145, blockId: 'ca622aaa-cff8-4798-b5ec-122a9cc9d7bc' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_11_07 AM.png'), slug: 'p146 hero (sun chain)',          page: PAGE.p146, blockId: 'f5dcfb1b-45b8-4404-a51f-7491ada38428' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_11_15 AM.png'), slug: 'p146 diagram (forms icons)',     page: PAGE.p146, blockId: '6b846cce-743a-4e86-9c96-d8357c559f5e' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_11_27 AM.png'), slug: 'p147 hero (car wake)',           page: PAGE.p147, blockId: '4d2da25b-2ebe-4b14-88ef-8f80f6d8e6e3' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_11_52 AM.png'), slug: 'p147 diagram (K=½mv²)',          page: PAGE.p147, blockId: 'cd73a98c-57b7-46ff-b76b-4d2a0b319862' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_12_03 AM.png'), slug: 'p148 hero (bow/hammer)',         page: PAGE.p148, blockId: 'aa00c7c2-ba69-420c-90d2-600a4366be78' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_16_57 AM.png'), slug: 'p148 diagram (mgh + spring)',    page: PAGE.p148, blockId: '82d010c3-d5f9-476d-8023-8c5d807ad937' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_17_12 AM.png'), slug: 'p149 hero (pendulum)',           page: PAGE.p149, blockId: '195b8270-5d05-4ae3-bc83-f57bfda638aa' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_17_16 AM.png'), slug: 'p149 diagram (pendulum energy)', page: PAGE.p149, blockId: '13404586-fe1c-45d0-8cf5-f5b69f6a3b0b' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_17_19 AM.png'), slug: 'p150 hero (staircase)',          page: PAGE.p150, blockId: '68edf3e5-d382-48b7-8ecd-705f11e725a7' },
  { file: f('ChatGPT Image Jun 24, 2026, 02_17_22 AM.png'), slug: 'p150 diagram (P=W/t)',           page: PAGE.p150, blockId: '4df321bc-35f0-43ff-b230-958fdb882582' },
  { file: f('ChatGPT Image Jun 24, 2026, 08_18_34 AM.png'), slug: 'p151 hero (3 ways)',             page: PAGE.p151, blockId: '27b05fd7-0168-4c00-8d08-67b972ca7067' },
  { file: f('ChatGPT Image Jun 24, 2026, 08_24_49 AM.png'), slug: 'p151 diagram (lever)',           page: PAGE.p151, blockId: 'da81bdea-a9fe-4a62-938d-31d5712503ed' },
  { file: f('ChatGPT Image Jun 24, 2026, 08_25_09 AM.png'), slug: 'p152 hero (seesaw)',             page: PAGE.p152, blockId: '1c062b7d-e316-46ca-bf9e-58ac146f313f' },
  { file: f('ChatGPT Image Jun 24, 2026, 08_25_16 AM.png'), slug: 'p152 diagram (lever arms)',      page: PAGE.p152, blockId: 'c57d1df3-9186-4cc2-8642-17a2104932d0' },
  { file: f('ChatGPT Image Jun 24, 2026, 08_25_20 AM.png'), slug: 'p153 hero (flag/pulley)',        page: PAGE.p153, blockId: 'd8443c2c-3bae-4e19-9223-05a20f7c35ac' },
  { file: f('ChatGPT Image Jun 24, 2026, 11_01_12 AM.png'), slug: 'p153 diagram (fixed/movable)',   page: PAGE.p153, blockId: 'fb9bef46-b32f-4fa4-8001-d693708250a6' },
  { file: f('ChatGPT Image Jun 24, 2026, 11_01_48 AM.png'), slug: 'p154 hero (switchbacks)',        page: PAGE.p154, blockId: '19a3829d-725e-4755-b13c-fefb9300cc22' },
  { file: f('ChatGPT Image Jun 24, 2026, 07_09_25 PM.png'), slug: 'p154 diagram (L/h≈1.67)',        page: PAGE.p154, blockId: '175d17af-7632-45de-88fa-1738c70c0704' },
  { file: f('ChatGPT Image Jun 24, 2026, 07_09_34 PM.png'), slug: 'p155 hero (charkha/chakki/well)',page: PAGE.p155, blockId: 'ae32524d-d858-4d10-80f2-becf690e60dd' },
  { file: f('ChatGPT Image Jun 24, 2026, 07_09_38 PM.png'), slug: 'p155 diagram (3 tools)',         page: PAGE.p155, blockId: 'ae1d4bb8-bd0c-43fc-85b2-9bd089c4d40f' },
];

const missing = MAP.filter((m) => !fs.existsSync(m.file));
if (missing.length) { console.error('MISSING:\n' + missing.map((m) => '  ' + m.slug).join('\n')); process.exit(1); }

console.log(`Ch7 NEW-STYLE ingest — ${MAP.length} images (overwrite + cache-bust):`);
MAP.forEach((m, i) => console.log(`  ${String(i + 1).padStart(2)}. ${path.basename(m.file)}  →  ${m.slug}`));
if (DRY) { console.log('\n[dry] no writes.'); process.exit(0); }

let ok = 0;
MAP.forEach((m) => {
  const args = [INGEST, '--file', m.file, '--page', m.page, '--block', m.blockId,
    '--field', 'src', '--lang', 'en', '--book', BOOK, '--chapter', CH, '--force', '--suffix', 'v2'];
  try {
    const out = execFileSync('node', args, { encoding: 'utf8' });
    console.log(`✅ ${m.slug}: ${out.trim().split('\n').filter(Boolean).pop() || ''}`);
    ok++;
  } catch (e) { console.error(`❌ ${m.slug}: ${(e.stdout || '') + (e.stderr || e.message)}`); }
});
console.log(`\nDone: ${ok}/${MAP.length} ingested.`);
