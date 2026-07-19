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
      number: 7, title: 'Structural Organisation in Animals', slug: 'structural-organisation-in-animals',
      description: 'A frog as the complete case study — morphology and every organ system, from the digestive tract to the tadpole that becomes it.',
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
