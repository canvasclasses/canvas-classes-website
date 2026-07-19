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
      number: 18, title: 'Neural Control and Coordination', slug: 'neural-control-and-coordination',
      description: 'How the nervous system coordinates the body — the CNS and PNS, the neuron, how a nerve impulse is generated and conducted, transmission across a synapse, and the human brain.',
    }, pages);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
