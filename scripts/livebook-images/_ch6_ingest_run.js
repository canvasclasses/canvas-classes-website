'use strict';
// Ingest the 22 verified ch6 "How Force Affects Motion" images.
// Each entry mapped by visual content match against its stored generation_prompt.
const { execFileSync } = require('child_process');
const path = require('path');

const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = '6';
const DL = '/Users/CanvasClasses/Downloads';

const items = [
  // p135 what-is-force
  { file: 'ChatGPT Image Jul 10, 2026, 10_21_42 PM.png', page: '3ebf8795-cdf0-4e44-90bf-b01ac8f7a67d', block: 'e96de85e-91db-4bf0-bdca-c7b964c702ba', alt: 'A football leaving a foot, a hand squeezing a lemon, and a hand stretching a spring balance — three everyday forces at work' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_21_46 PM.png', page: '3ebf8795-cdf0-4e44-90bf-b01ac8f7a67d', block: '89b1303d-7f67-4157-a0ca-8e2f4660c818', alt: 'A crate with a long terracotta arrow pushing right and a shorter teal friction arrow pointing left' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_09 PM.png', page: '3ebf8795-cdf0-4e44-90bf-b01ac8f7a67d', block: 'fd69772f-9f69-4cb3-830e-c35be7e2902e', alt: 'A hand holding a vertical spring balance with a small bag of vegetables on its hook, the internal spring stretched' },
  // p136 balanced-and-unbalanced-forces
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_21 PM.png', page: '63138c72-e1b8-4ef9-b1b6-1e21c8887633', block: 'f3e26651-d65a-447e-b076-bcf4550c27f8', alt: 'Two tug-of-war teams straining on a taut rope that barely moves' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_25 PM.png', page: '63138c72-e1b8-4ef9-b1b6-1e21c8887633', block: '37e8aa8b-44cc-4a3f-b061-f4718959f947', alt: 'A box with two equal opposite arrows, and a ball on water with equal up and down arrows' },
  // p137 friction
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_30 PM.png', page: 'fbdf3b27-c5bf-49e6-9c0e-8baec969cbc9', block: 'da86237a-1cb9-4164-9ddb-c69106eb3387', alt: 'A wooden box being pushed across a floor, slowing to a stop' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_44 PM.png', page: 'fbdf3b27-c5bf-49e6-9c0e-8baec969cbc9', block: 'aa00aabc-db4e-4691-afcd-181cfe1d7433', alt: 'A box with a forward push arrow, a backward friction arrow, plus normal force up and weight down' },
  // p138 newtons-first-law
  { file: 'ChatGPT Image Jul 10, 2026, 10_22_52 PM.png', page: '62f2aa47-43f9-408a-872a-d1cae5a23762', block: '650784aa-f45b-40bd-ba6b-786959bbb2c0', alt: 'A spacecraft drifting silently through deep space with its engines off' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_23_29 PM.png', page: '62f2aa47-43f9-408a-872a-d1cae5a23762', block: 'f4fce47e-3412-4abf-976d-56cea8a72f87', alt: 'Two pairs of graphs: at rest (flat lines) and constant velocity (a level v-t line, a sloped p-t line)' },
  // p139 newtons-second-law
  { file: 'ChatGPT Image Jul 10, 2026, 10_23_40 PM.png', page: 'c7fe2f75-3c8e-4588-a960-bfca55a6d1a2', block: '6446aae9-ab90-4552-a6ff-4cb2b9efabdd', alt: 'An empty trolley leaping forward and a loaded trolley barely moving under the same push' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_23_46 PM.png', page: 'c7fe2f75-3c8e-4588-a960-bfca55a6d1a2', block: 'b8a8cf15-60a9-4f8f-9ffb-802a6a57705a', alt: 'A cart on wheels pulled by a string over a pulley, with a small cup of weights hanging down' },
  // p140 weight-and-gravity
  { file: 'ChatGPT Image Jul 10, 2026, 10_23_50 PM.png', page: '71e9190c-84f1-4c8f-ba37-a6f5b8ee3569', block: '20484d81-b59e-4fae-ad7c-c0f6b4ea7bf4', alt: 'A heavy iron ball and a light wooden ball falling side by side from the same height' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_23_54 PM.png', page: '71e9190c-84f1-4c8f-ba37-a6f5b8ee3569', block: '6f4a32e6-a3da-48b0-907d-02af4d4972db', alt: 'A heavy ball and a light ball at the same height with equal-length downward acceleration arrows' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_01 PM.png', page: '71e9190c-84f1-4c8f-ba37-a6f5b8ee3569', block: '7ac5bdea-2849-4287-b1e9-93445e0800aa', alt: 'An astronaut floating inside the Space Station with Earth below, gravity still pulling, on a curved "falling around Earth" path' },
  // p141 second-law-in-everyday-life
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_05 PM.png', page: 'ae384b2e-6120-4cac-b416-5f2b09272dee', block: 'ed7f120f-a6d1-47da-a883-9653fb29f57a', alt: 'A cricketer catching a fast ball while drawing both hands back toward the body' },
  // p142 newtons-third-law
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_11 PM.png', page: 'f2120103-2064-4c61-b9de-9257321f5ee6', block: '3ef3ef0f-4bfb-4b1b-a5cc-2fdd2c4cc44e', alt: 'A swimmer pushing water back while gliding forward, mirrored by a person pushing both palms against a wall as it pushes back' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_21 PM.png', page: 'f2120103-2064-4c61-b9de-9257321f5ee6', block: '2b4e022f-b4b9-4596-bc86-214eac501b4f', alt: 'Two identical spring balances connected hook-to-hook, pulled in opposite directions, both dials reading the same' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_32 PM.png', page: 'f2120103-2064-4c61-b9de-9257321f5ee6', block: '2649d1d4-e41d-48ae-b8a0-be6eaeca8906', alt: 'Four panels showing a walking human, a swimming fish, a flying bird, and a jetting squid, each with action and reaction arrows' },
  // p143 third-law-in-action
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_41 PM.png', page: '02f613f8-b4cb-458a-a4c0-45ae05163dd3', block: '28456593-9a4f-4917-9c29-8f3484f0259a', alt: 'A rocket lifting off on a column of downward exhaust, a runner stepping off the ground beside it' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_45 PM.png', page: '02f613f8-b4cb-458a-a4c0-45ae05163dd3', block: 'b8e711df-6329-4558-9dda-09ed96936831', alt: 'A balloon zipping along a thread as air rushes out behind it, beside a rocket with downward exhaust' },
  // p144 forces-on-a-system
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_49 PM.png', page: '8b475f1a-9cf4-436f-9a3e-6de3e6cf62f3', block: 'c6802afb-ecb5-4a05-bf25-2c692f581713', alt: 'A toy engine pulling a line of three linked wagons across a smooth floor' },
  { file: 'ChatGPT Image Jul 10, 2026, 10_24_53 PM.png', page: '8b475f1a-9cf4-436f-9a3e-6de3e6cf62f3', block: '2e7748ac-e429-49e7-9b30-910c848e434a', alt: 'Two boxes joined by a string on a smooth floor, an external pull F at the front and equal tension arrows inside' },
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
