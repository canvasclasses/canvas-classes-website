'use strict';
// Ingest the 28 verified ch8 "Journey Inside the Atom" images (29 pending minus
// the Rutherford gold-foil labeled diagram, which the founder rejected and will
// replace manually — block b094059f-2662-48d6-a9cc-86e18d6fb99d stays pending).
// Each entry mapped by visual content match against its stored generation_prompt.
const { execFileSync } = require('child_process');
const path = require('path');

const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = '8';
const DL = '/Users/CanvasClasses/Downloads';

const items = [
  // p84 what-is-an-atom
  { file: 'ChatGPT Image Jul 11, 2026, 11_17_18 PM.png', page: 'c159457f-abcb-43d1-be3c-e15c7c544e67', block: 'bd6dfb26-c99a-45e2-b065-12e6d7a41d31', alt: 'Everyday objects — a house, a brick, a leaf — zooming down step by step to the tiny atoms they are made of' },
  // p85 acharya-kanads-parmanu
  { file: 'ChatGPT Image Jul 11, 2026, 11_17_23 PM.png', page: 'd4fc3a8d-4594-4f6c-9ac0-be2ec51960fa', block: '31be3fef-2f01-4c04-8610-c3ef10b26a7f', alt: 'An ancient Indian sage deep in thought, with faint glowing particles of matter dividing into ever-smaller points around him' },
  // p86 thomsons-model
  { file: 'ChatGPT Image Jul 11, 2026, 11_17_26 PM.png', page: '8d8d3ef7-5592-494c-ad93-67776df178f4', block: '63533f3b-bfba-40df-8389-54f3040e217c', alt: 'A halved watermelon split open, its red pulp and dark seeds standing in for an atom\'s positive charge and electrons' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_17_30 PM.png', page: '8d8d3ef7-5592-494c-ad93-67776df178f4', block: '00c69228-e166-4f16-b3af-975d3f8e04f7', alt: 'Thomson\'s model: a positive sphere with negatively charged electrons embedded throughout it' },
  // p87 rutherfords-model — hero only; diagram (b094059f) skipped, founder replacing manually
  { file: 'ChatGPT Image Jul 11, 2026, 11_17_38 PM.png', page: '4a91a67f-7d7c-4d24-be13-a8fa6a1476f7', block: '6ca0ba68-a652-4067-adda-5ce8b500c6de', alt: 'A beam of glowing particles striking a thin sheet of gold foil — most passing through, a single one rebounding sharply backward' },
  // p88 bohrs-model
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_02 PM.png', page: 'a149f930-6ca9-4899-aec8-6372fbaaf12f', block: 'ee3648da-012b-46bf-b17c-39c48baca5df', alt: 'An atom with electrons travelling on glowing concentric rings around a bright central nucleus' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_10 PM.png', page: 'a149f930-6ca9-4899-aec8-6372fbaaf12f', block: '0257742c-4bdc-4676-bf19-3eaac887f051', alt: 'Bohr model showing the nucleus and the K, L, M, N energy shells at increasing distances' },
  // p89 subatomic-particles
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_14 PM.png', page: 'd18e12ab-3424-493f-9221-9f83988f1a24', block: 'e51da50a-da87-4892-b21d-e775c66a37cd', alt: 'A glowing atomic nucleus packed with protons and neutrons, with a faint electron circling far outside' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_18 PM.png', page: 'd18e12ab-3424-493f-9221-9f83988f1a24', block: 'f0c41b28-58b6-420d-a1a7-ef0914ddd664', alt: 'A simple atom showing protons and neutrons in the nucleus and electrons in shells around it' },
  // p90 electron-distribution
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_25 PM.png', page: '5a6b2243-c0d7-4c3a-ab42-2008823c1d47', block: '71605f2a-8817-4574-b450-a8211eb29565', alt: 'A row of atoms from hydrogen onward, each with its electrons filling glowing shells one by one' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_29 PM.png', page: '5a6b2243-c0d7-4c3a-ab42-2008823c1d47', block: '0a07e554-5d34-4fdc-af1e-7ba521f15b88', alt: 'A chart showing the maximum electrons each shell holds by the 2n-squared rule' },
  // p91 valence-electrons-and-valency
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_34 PM.png', page: '960f186b-471b-4942-ba67-d07d3961857b', block: 'f3090721-831d-4122-bae7-2ce6b260d06a', alt: 'Split scene: a violently reacting metal throwing off sparks on one side, a calm glowing noble-gas atom on the other' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_38 PM.png', page: '960f186b-471b-4942-ba67-d07d3961857b', block: 'e718f442-774f-4953-a5d9-d76f48bb4967', alt: 'Outer shells compared: sodium with 1 valence electron, oxygen with 6, and neon with a full octet of 8' },
  // p92 atomic-number-and-mass-number
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_42 PM.png', page: '4deb7d94-75f8-486c-9410-0a9206edb7a0', block: 'b981000b-044c-49e6-bb99-1b0b77438a01', alt: 'A glowing nucleus on a pedestal like an identity badge, its proton count marking which element it is' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_53 PM.png', page: '4deb7d94-75f8-486c-9410-0a9206edb7a0', block: '9ac16a35-9fb3-4499-9d2e-1d5a99d21e2a', alt: 'The standard atom notation showing mass number on top and atomic number below the element symbol, with carbon as the example' },
  // p93 isotopes
  { file: 'ChatGPT Image Jul 11, 2026, 11_18_58 PM.png', page: 'b1b5b106-9121-48ba-996a-f9fc5a00e095', block: 'd64574d4-3909-4b8f-900c-5e22a057b1b4', alt: 'An archaeologist examining an ancient bone, with three carbon atoms of slightly different weight glowing beside it' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_03 PM.png', page: 'b1b5b106-9121-48ba-996a-f9fc5a00e095', block: 'c71b4fda-b487-447c-a0b4-b8eb4453b497', alt: 'The three isotopes of hydrogen — protium, deuterium, tritium — each with one proton but different neutron counts' },
  // p94 isobars
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_07 PM.png', page: 'febdcd71-1b7e-461d-90d5-5c133e996fcb', block: '989489d3-2778-44a9-84cc-c4702f25ed00', alt: 'A balance scale holding three clearly different element-atoms that rest perfectly level, all weighing the same' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_10 PM.png', page: 'febdcd71-1b7e-461d-90d5-5c133e996fcb', block: 'ebc89a11-3468-457f-8914-1ff2af638db5', alt: 'Calcium-40, potassium-40 and argon-40 shown with different proton counts but the same total mass number' },
  // p95 iupac-symbols
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_16 PM.png', page: 'fbb9775c-a868-4c96-ac1f-f19ef627ac5b', block: 'e85336f8-32e1-48b5-a6b4-5cccf81c83be', alt: 'A glowing wall of chemical element symbols, with a few Latin-rooted ones like Au, Na and Fe shining brightest' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_22 PM.png', page: 'fbb9775c-a868-4c96-ac1f-f19ef627ac5b', block: 'bf120da4-13ab-448a-abb3-c10c2be9eb93', alt: 'A few elements whose symbols come from Latin names, shown beside those Latin names' },
  // p96 atomic-mass-unit
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_27 PM.png', page: '4d682f0f-8c93-4d5e-affb-8fa2391288fc', block: '63e04b57-7cd5-4d07-b03e-d7d6143d6ee1', alt: 'A large crowd of chlorine atoms, most of one weight and a smaller share heavier, averaging to a single value' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_31 PM.png', page: '4d682f0f-8c93-4d5e-affb-8fa2391288fc', block: '571d7e54-c4be-4f3b-b7cb-38289ba08a69', alt: 'A worked weighted-average calculation for chlorine using its two isotopes and their abundances' },
  // p97 indian-scientists-atomic-science
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_37 PM.png', page: '24fd37cf-73ff-478f-aede-854db0331d47', block: 'b887cdaf-d509-4c71-a60b-cf3f654f0bbb', alt: 'A thoughtful Indian scientist before a modern atomic research centre, with a faint nucleus motif linking past and present' },
  // p98 journey-inside-the-atom
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_41 PM.png', page: 'd281b694-92d4-4f89-a694-07bac6885584', block: '79be11c6-11ec-4f5f-a90b-d1d0bfaee671', alt: 'A sweeping timeline of atomic models from a solid ball to a fuzzy electron cloud, glowing left to right' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_19_48 PM.png', page: 'd281b694-92d4-4f89-a694-07bac6885584', block: 'af6b2722-0fb8-4771-a9a1-25d07215a3f6', alt: 'A labelled timeline of the atomic models from Dalton to the modern quantum model' },
  // p99 frontier-understanding-atom
  { file: 'ChatGPT Image Jul 11, 2026, 11_20_04 PM.png', page: 'f876961b-5e32-44a7-ad77-daaf8d01534a', block: '429ac27b-fd74-4e49-a988-40e0e4ed3dcd', alt: 'A glowing fuzzy electron cloud around a bright nucleus, half-resolved like a frontier still being explored' },
  { file: 'ChatGPT Image Jul 11, 2026, 11_20_09 PM.png', page: 'f876961b-5e32-44a7-ad77-daaf8d01534a', block: '8a1e5640-f674-4f82-b0ce-8a2bea062a96', alt: 'Bohr\'s fixed orbits compared side by side with the modern electron-cloud model' },
];

(async () => {
  let ok = 0, fail = 0;
  for (const it of items) {
    const filePath = path.join(DL, it.file);
    const args = [
      path.join(__dirname, 'ingest.js'),
      '--file', filePath,
      '--page', it.page,
      '--block', it.block,
      '--field', 'src',
      '--lang', 'en',
      '--book', BOOK,
      '--chapter', CH,
      '--alt', it.alt,
    ];
    try {
      const out = execFileSync('node', args, { encoding: 'utf8', cwd: path.join(__dirname, '..', '..') });
      process.stdout.write(out);
      ok++;
    } catch (e) {
      console.error(`FAIL ${it.block.slice(0,8)}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} ok, ${fail} failed, ${items.length} total.`);
})();
