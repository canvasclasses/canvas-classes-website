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
      number: 13, title: 'Plant Growth and Development', slug: 'plant-growth-and-development',
      description: 'How a plant builds itself from a zygote — growth and its phases, arithmetic/geometric growth, differentiation and plasticity, and the five plant growth regulators (auxins, gibberellins, cytokinins, ethylene, abscisic acid).',
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
