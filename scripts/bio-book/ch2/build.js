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
      number: 2, title: 'Biological Classification', slug: 'biological-classification',
      description: "Whittaker's five kingdoms — Monera, Protista, Fungi, Plantae, Animalia — plus the acellular oddities (viruses, viroids, prions) and lichens that fit none of them.",
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
