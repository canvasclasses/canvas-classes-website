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
      number: 12, title: 'Respiration in Plants', slug: 'respiration-in-plants',
      description: 'How cells release the energy locked in food — glycolysis, fermentation, the Krebs cycle, the electron transport system and oxidative phosphorylation, the respiratory balance sheet of 38 ATP, the amphibolic pathway, and the respiratory quotient.',
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
