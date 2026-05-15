/**
 * scripts/_audit_status_null_origin.js
 *
 * READ-ONLY. Find out who created the 311 status:null docs and
 * compare schemas between audit_logs and auditlogs.
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('crucible');

    // ──────────── 1. Who created the null-status docs? ─────────────────
    console.log('\n=== WHO created the 311 status:null docs? ===');
    const v2 = db.collection('questions_v2');
    const nullStatus = await v2.find({
        deleted_at: null,
        $or: [{ status: { $exists: false } }, { status: null }],
    }).limit(3).toArray();

    console.log('  Sample doc — TOP-LEVEL FIELDS PRESENT:');
    for (let i = 0; i < nullStatus.length; i++) {
        const d = nullStatus[i];
        console.log(`\n  ── Doc ${i + 1}: ${d.display_id} (${d.metadata?.chapter_id})`);
        console.log('     top-level keys:', Object.keys(d).join(', '));
        console.log('     created_at:    ', d.created_at);
        console.log('     updated_at:    ', d.updated_at);
        console.log('     created_by:    ', d.created_by);
        console.log('     updated_by:    ', d.updated_by);
        console.log('     metadata keys: ', Object.keys(d.metadata || {}).join(', '));
        console.log('     metadata.created_by:', d.metadata?.created_by);
        console.log('     metadata.source_script:', d.metadata?.source_script);
        console.log('     question_text preview:', String(d.question_text?.markdown || '').slice(0, 100).replace(/\n/g, ' '));
    }

    // Cross-reference: search audit_logs and auditlogs for these display_ids
    console.log('\n=== AUDIT TRAIL for one of the null-status docs ===');
    const targetIds = nullStatus.slice(0, 2).map((d) => d.display_id);
    const targetEntityIds = nullStatus.slice(0, 2).map((d) => d._id);

    for (const did of targetIds) {
        console.log(`\n  Searching audit_logs and auditlogs for display_id="${did}":`);
        const inAuditLogs = await db.collection('audit_logs').find({ $or: [{ entity_id: did }, { 'entity.display_id': did }, { display_id: did }] }).toArray();
        const inAuditlogs = await db.collection('auditlogs').find({ $or: [{ entity_id: did }, { display_id: did }] }).toArray();
        console.log(`    audit_logs hits: ${inAuditLogs.length}`);
        console.log(`    auditlogs  hits: ${inAuditlogs.length}`);
        for (const a of inAuditlogs.slice(0, 3)) {
            console.log(`      auditlogs entry: action=${a.action} script=${a.script_name} actor=${a.actor} timestamp=${a.timestamp}`);
        }
        for (const a of inAuditLogs.slice(0, 3)) {
            console.log(`      audit_logs entry: action=${a.action} user=${a.user_email} timestamp=${a.timestamp}`);
        }
    }

    // Also look up by the entity _id (uuid)
    for (const eid of targetEntityIds) {
        const inAuditLogs = await db.collection('audit_logs').countDocuments({ entity_id: eid });
        const inAuditlogs = await db.collection('auditlogs').countDocuments({ entity_id: eid });
        console.log(`\n  By _id ${eid}: audit_logs=${inAuditLogs}, auditlogs=${inAuditlogs}`);
    }

    // ──────────── 2. audit_logs vs auditlogs schema comparison ──────────
    console.log('\n=== SCHEMA COMPARISON ===');
    for (const name of ['audit_logs', 'auditlogs']) {
        const c = db.collection(name);
        const sample = await c.findOne({});
        const recent = await c.find({}).sort({ timestamp: -1, _id: -1 }).limit(1).toArray();
        console.log(`\n  ── ${name} sample doc keys:`);
        console.log('     ', sample ? Object.keys(sample).sort().join(', ') : '(empty)');
        if (recent[0]) {
            console.log(`  ── ${name} most recent doc:`);
            console.log('     ', JSON.stringify({
                _id: recent[0]._id,
                entity_type: recent[0].entity_type,
                entity_id: recent[0].entity_id,
                action: recent[0].action,
                display_id: recent[0].display_id,
                user_id: recent[0].user_id,
                user_email: recent[0].user_email,
                actor: recent[0].actor,
                script_name: recent[0].script_name,
                reason: recent[0].reason,
                timestamp: recent[0].timestamp,
            }));
        }
    }

    // ──────────── 3. action breakdown for both collections ──────────────
    console.log('\n=== ACTION BREAKDOWN ===');
    for (const name of ['audit_logs', 'auditlogs']) {
        const c = db.collection(name);
        const byAction = await c.aggregate([
            { $group: { _id: '$action', n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            { $limit: 15 },
        ]).toArray();
        console.log(`\n  ── ${name} top actions:`);
        for (const r of byAction) console.log(`      ${String(r._id || '(null)').padEnd(30)} ${r.n}`);
    }

    // ──────────── 4. entity_type breakdown ──────────────────────────────
    console.log('\n=== ENTITY_TYPE BREAKDOWN ===');
    for (const name of ['audit_logs', 'auditlogs']) {
        const c = db.collection(name);
        const byEntity = await c.aggregate([
            { $group: { _id: '$entity_type', n: { $sum: 1 } } },
            { $sort: { n: -1 } },
        ]).toArray();
        console.log(`\n  ── ${name}:`);
        for (const r of byEntity) console.log(`      ${String(r._id || '(null)').padEnd(30)} ${r.n}`);
    }

    // ──────────── 5. script_name breakdown for auditlogs ─────────────────
    console.log('\n=== auditlogs by script_name ===');
    const byScript = await db.collection('auditlogs').aggregate([
        { $group: { _id: '$script_name', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 20 },
    ]).toArray();
    for (const r of byScript) console.log(`  ${String(r._id || '(null)').padEnd(40)} ${r.n}`);

    // ──────────── 6. user breakdown for audit_logs ──────────────────────
    console.log('\n=== audit_logs by user_email ===');
    const byUser = await db.collection('audit_logs').aggregate([
        { $group: { _id: '$user_email', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 10 },
    ]).toArray();
    for (const r of byUser) console.log(`  ${String(r._id || '(null)').padEnd(40)} ${r.n}`);

    await client.close();
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1); });
