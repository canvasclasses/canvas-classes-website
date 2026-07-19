'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.local') });
const fs = require('fs');
const { MongoClient } = require('mongodb');
const { buildChapter } = require('../build-lib');
function loadPages(){const dir=path.join(__dirname,'pages');return fs.readdirSync(dir).filter(f=>f.endsWith('.js')).map(f=>require(path.join(dir,f)));}
async function main(){
  const pages=loadPages();
  const client=new MongoClient(process.env.MONGODB_URI); await client.connect();
  try{ await buildChapter(client.db('crucible'),{ number:7, title:"Human Health and Disease", slug:"human-health-and-disease", description:"Common human diseases and their pathogens, innate and acquired immunity, AIDS, cancer, and drugs and alcohol abuse." }, pages);}
  finally{ await client.close(); }
}
main().catch(e=>{console.error(e);process.exit(1);});
