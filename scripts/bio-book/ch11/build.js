'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.local') });
const fs = require('fs');
const { MongoClient } = require('mongodb');
const { buildChapter } = require('../build-lib');

function loadPages() {
  const dir = path.join(__dirname, 'pages');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => require(path.join(dir, f)));
}

async function main() {
  const pages = loadPages();
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    await buildChapter(client.db('crucible'), {
      number: 11, title: 'Photosynthesis in Higher Plants', slug: 'photosynthesis-in-higher-plants',
      description: 'How green plants turn sunlight, water and CO2 into food — the pigments, the light reaction and Z-scheme, chemiosmosis, the Calvin cycle, the C4 pathway and Kranz anatomy, photorespiration, and the factors that limit the whole process.',
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
