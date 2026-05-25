#!/usr/bin/env node
/**
 * Migrate existing `user_roles` documents into `user_access` documents.
 *
 * Usage:
 *   node scripts/migrate-user-roles-to-user-access.js           # apply
 *   node scripts/migrate-user-roles-to-user-access.js --dry-run # report only
 *
 * Idempotent: re-running is safe — already-migrated users are skipped.
 *
 * Rules:
 *   - role === 'super_admin' → log email for env review (no DB write)
 *   - role === 'subject_admin' with subjects: [...] → user_access doc with one
 *     grant per subject: { subject, chapters: 'all', level: 'edit' }
 *   - role === 'viewer' with subjects: [...] → grants with level: 'view'
 *   - is_active: false → skip
 *
 * After running, manually copy the listed super_admins into SUPER_ADMIN_EMAILS
 * in Vercel env (prod + preview) and confirm.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const mongoose = require('mongoose');

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const userRolesCol = db.collection('user_roles');
  const userAccessCol = db.collection('user_access');

  const roles = await userRolesCol.find({ is_active: true }).toArray();

  const superAdmins = [];
  const migrated = [];
  const skipped = [];

  for (const role of roles) {
    const email = (role.email || '').toLowerCase().trim();
    if (!email) {
      skipped.push({ reason: 'empty email', _id: role._id });
      continue;
    }

    if (role.role === 'super_admin') {
      superAdmins.push(email);
      continue;
    }

    const level = role.role === 'subject_admin' ? 'edit' : role.role === 'viewer' ? 'view' : null;
    if (!level) {
      skipped.push({ email, reason: `unknown role: ${role.role}` });
      continue;
    }

    const subjects = Array.isArray(role.subjects) ? role.subjects : [];
    if (subjects.length === 0) {
      skipped.push({ email, reason: 'no subjects on role' });
      continue;
    }

    const existing = await userAccessCol.findOne({ email });
    if (existing) {
      skipped.push({ email, reason: 'user_access doc already exists' });
      continue;
    }

    const grants = subjects.map((s) => ({ subject: s, chapters: 'all', level }));
    const doc = {
      email,
      grants,
      granted_by: role.granted_by || 'migration-script',
      granted_at: role.granted_at || new Date(),
      is_active: true,
      notes: role.notes || 'Migrated from user_roles on 2026-05-23',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!DRY_RUN) {
      await userAccessCol.insertOne(doc);
    }
    migrated.push({ email, grants });
  }

  // Write super_admins list to a tracked file for env update.
  const outPath = path.join(__dirname, '..', 'scripts', 'super-admins-to-add.txt');
  fs.writeFileSync(outPath, superAdmins.join('\n') + '\n', 'utf8');

  console.log(`\n=== Migration Summary (${DRY_RUN ? 'DRY RUN' : 'APPLIED'}) ===`);
  console.log(`Migrated ${migrated.length} user_access docs:`);
  for (const m of migrated) {
    console.log(`  + ${m.email}: ${m.grants.map((g) => `${g.subject}/${g.chapters === 'all' ? 'all' : g.chapters.length + ' ch'}/${g.level}`).join(', ')}`);
  }
  console.log(`\nSuper admins flagged for env (written to ${outPath}):`);
  for (const e of superAdmins) console.log(`  ★ ${e}`);
  console.log(`\nSkipped: ${skipped.length}`);
  for (const s of skipped) console.log(`  - ${s.email ?? s._id}: ${s.reason}`);
  console.log('\nNext step: add the super admin emails above to SUPER_ADMIN_EMAILS in Vercel env (prod + preview).');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
