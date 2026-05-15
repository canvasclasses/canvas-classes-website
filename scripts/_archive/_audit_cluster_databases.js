/**
 * scripts/_audit_cluster_databases.js
 *
 * READ-ONLY cluster-wide audit. Lists every database on the cluster,
 * every collection in each, doc counts, sizes, and a sample doc's keys.
 *
 * Goal: explain what `admin`, `canvas`, `canvas classes`, `crucible`,
 *       `local`, `test` actually contain.
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const SYSTEM_DBS = new Set(['admin', 'local', 'config']);

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error('FATAL: MONGODB_URI not set'); process.exit(1); }

    // Connect WITHOUT a default db so we can list all of them
    const client = new MongoClient(uri);
    await client.connect();

    const admin = client.db().admin();
    const { databases } = await admin.listDatabases();

    console.log('\n================================================================');
    console.log(' CLUSTER-WIDE DATABASE AUDIT');
    console.log('================================================================');
    console.log('\nDatabases found on cluster:');
    for (const d of databases) {
        const sizeMB = (d.sizeOnDisk / 1024 / 1024).toFixed(2);
        console.log(`  ${d.name.padEnd(25)} ${sizeMB.padStart(10)} MB  ${d.empty ? '(empty)' : ''}`);
    }

    for (const d of databases) {
        const dbName = d.name;
        console.log('\n================================================================');
        console.log(` DB: ${dbName}    [${(d.sizeOnDisk / 1024 / 1024).toFixed(2)} MB]`);
        if (SYSTEM_DBS.has(dbName)) {
            console.log(' (MongoDB SYSTEM database — leave alone)');
        }
        console.log('================================================================');

        const db = client.db(dbName);
        let cols;
        try {
            cols = await db.listCollections().toArray();
        } catch (e) {
            console.log('  (cannot list collections:', e.message, ')');
            continue;
        }
        if (cols.length === 0) {
            console.log('  (no collections)');
            continue;
        }

        // Sort: largest first
        const entries = [];
        for (const c of cols) {
            let count = 'n/a';
            let sizeMB = 'n/a';
            try {
                const stats = await db.command({ collStats: c.name });
                count = stats.count || 0;
                sizeMB = ((stats.size || 0) / 1024 / 1024).toFixed(2);
            } catch (e) { /* views or system colls */ }
            entries.push({ name: c.name, type: c.type, count, sizeMB });
        }
        entries.sort((a, b) => parseFloat(b.sizeMB || 0) - parseFloat(a.sizeMB || 0));

        console.log('  collection'.padEnd(40), 'docs'.padStart(10), 'sizeMB'.padStart(10), 'sample keys');
        console.log('  ' + '-'.repeat(100));
        for (const e of entries) {
            let keys = '';
            try {
                const sample = await db.collection(e.name).findOne({});
                if (sample) keys = Object.keys(sample).slice(0, 10).join(', ');
            } catch (_) { /* no perms */ }
            const line =
                '  ' +
                String(e.name).padEnd(38) +
                String(e.count).padStart(10) +
                String(e.sizeMB).padStart(11) + '   ' +
                keys.slice(0, 90);
            console.log(line);
        }
    }

    console.log('\n================================================================');
    console.log(' END');
    console.log('================================================================\n');

    await client.close();
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1); });
