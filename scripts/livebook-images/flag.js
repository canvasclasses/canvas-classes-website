// Flag a generated image that does NOT match its prompt, instead of publishing it.
// Appends a reviewable entry to _agents/livebook-image-flags/<book>-ch<n>.md and
// leaves the block's src EMPTY so it stays in the pending queue. No DB write.
//
// Usage:
//   node scripts/livebook-images/flag.js \
//     --page <id> --block <id> --book <id> --chapter 2 --slug "ch2-foo" \
//     --kind image --reason "Text in figure is garbled; arrows point wrong way" \
//     [--prompt "the prompt text"] [--saved /tmp/rejected.webp]
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const page = arg('page'), block = arg('block'), book = arg('book');
const chapter = arg('chapter'), slug = arg('slug') || '(unknown-slug)';
const kind = arg('kind') || 'image', reason = arg('reason') || '(no reason given)';
const prompt = arg('prompt') || '';
const saved = arg('saved') || '';

if (!page || !block || !book || !chapter) {
  console.error('Missing required arg. Need --page --block --book --chapter --reason');
  process.exit(2);
}

const dir = path.join(__dirname, '..', '..', '_agents', 'livebook-image-flags');
fs.mkdirSync(dir, { recursive: true });
const flagFile = path.join(dir, `${book}-ch${chapter}.md`);

if (!fs.existsSync(flagFile)) {
  fs.writeFileSync(flagFile,
    `# Livebook image flags — book ${book}, chapter ${chapter}\n\n` +
    `Images ChatGPT produced that did not match the prompt. Tweak the prompt in the\n` +
    `admin book editor (or here), then re-run the queue for this block.\n\n---\n\n`);
}

const entry =
  `## ${slug} — block \`${block}\`  (${kind})\n` +
  `- **Page id:** \`${page}\`\n` +
  `- **Flagged:** ${new Date().toISOString()}\n` +
  `- **Reason:** ${reason}\n` +
  (prompt ? `- **Prompt:** ${prompt}\n` : '') +
  (saved ? `- **Rejected image saved at:** \`${saved}\`\n` : '') +
  `\n---\n\n`;

fs.appendFileSync(flagFile, entry);
console.log(`FLAGGED ${block.slice(0, 8)} -> ${flagFile}`);
