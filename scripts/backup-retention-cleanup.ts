/**
 * Backup Retention Cleanup Script
 * 
 * Manages backup retention policies:
 * - Keep daily backups for 30 days
 * - Keep weekly backups for 90 days
 * - Keep monthly backups for 1 year
 * - Delete older backups
 * 
 * Usage:
 *   npx tsx scripts/backup-retention-cleanup.ts [--dry-run]
 * 
 * Environment Variables Required:
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME (default: canvas-chemistry-assets)
 */

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';

const isDryRun = process.argv.includes('--dry-run');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

interface BackupFile {
  key: string;
  date: Date;
  age_days: number;
}

async function listBackups(): Promise<BackupFile[]> {
  const backups: BackupFile[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'backups/mongodb/',
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (!obj.Key || !obj.LastModified) continue;
        
        const age_days = (Date.now() - obj.LastModified.getTime()) / (1000 * 60 * 60 * 24);
        
        backups.push({
          key: obj.Key,
          date: obj.LastModified,
          age_days,
        });
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return backups;
}

async function deleteBackups(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const command = new DeleteObjectsCommand({
    Bucket: R2_BUCKET_NAME,
    Delete: {
      Objects: keys.map(key => ({ Key: key })),
    },
  });

  await r2Client.send(command);
}

async function cleanupBackups(): Promise<void> {
  console.log('🧹 Backup Retention Cleanup');
  console.log('━'.repeat(70));
  console.log(`📦 Bucket:        ${R2_BUCKET_NAME}`);
  console.log(`🎯 Mode:          ${isDryRun ? 'DRY RUN (no deletions)' : 'LIVE CLEANUP'}`);
  console.log('━'.repeat(70));
  console.log('');

  console.log('📋 Listing all backups...');
  const allBackups = await listBackups();
  console.log(`✅ Found ${allBackups.length.toLocaleString()} backup files\n`);

  // Retention policy
  const DAILY_RETENTION_DAYS = 30;
  const WEEKLY_RETENTION_DAYS = 90;
  const MONTHLY_RETENTION_DAYS = 365;

  const now = new Date();
  const toDelete: string[] = [];
  const toKeep: string[] = [];

  // Group backups by folder (each backup session creates a folder)
  const backupFolders = new Map<string, BackupFile[]>();
  
  for (const backup of allBackups) {
    const folderMatch = backup.key.match(/backups\/mongodb\/([^\/]+)\//);
    if (!folderMatch) continue;
    
    const folder = folderMatch[1];
    if (!backupFolders.has(folder)) {
      backupFolders.set(folder, []);
    }
    backupFolders.get(folder)!.push(backup);
  }

  console.log(`📁 Found ${backupFolders.size} backup sessions\n`);

  // Determine which backup sessions to keep/delete
  const sortedFolders = Array.from(backupFolders.entries())
    .sort((a, b) => b[1][0].date.getTime() - a[1][0].date.getTime());

  for (const [folder, files] of sortedFolders) {
    const age_days = files[0].age_days;
    const backupDate = files[0].date;
    
    let shouldKeep = false;
    let reason = '';

    if (age_days <= DAILY_RETENTION_DAYS) {
      // Keep all backups from last 30 days
      shouldKeep = true;
      reason = 'Daily retention (< 30 days)';
    } else if (age_days <= WEEKLY_RETENTION_DAYS) {
      // Keep weekly backups (Sundays) for 90 days
      if (backupDate.getDay() === 0) {
        shouldKeep = true;
        reason = 'Weekly retention (Sunday backup < 90 days)';
      } else {
        reason = 'Not a Sunday backup (31-90 days)';
      }
    } else if (age_days <= MONTHLY_RETENTION_DAYS) {
      // Keep monthly backups (1st of month) for 1 year
      if (backupDate.getDate() === 1) {
        shouldKeep = true;
        reason = 'Monthly retention (1st of month < 1 year)';
      } else {
        reason = 'Not 1st of month (91-365 days)';
      }
    } else {
      reason = 'Older than 1 year';
    }

    if (shouldKeep) {
      toKeep.push(...files.map(f => f.key));
      console.log(`  ✅ KEEP: ${folder} (${age_days.toFixed(0)} days old) - ${reason}`);
    } else {
      toDelete.push(...files.map(f => f.key));
      console.log(`  🗑️  DELETE: ${folder} (${age_days.toFixed(0)} days old) - ${reason}`);
    }
  }

  console.log('\n' + '━'.repeat(70));
  console.log('📊 Summary:');
  console.log(`  ✅ Keep:   ${toKeep.length.toLocaleString()} files`);
  console.log(`  🗑️  Delete: ${toDelete.length.toLocaleString()} files`);
  console.log('━'.repeat(70));
  console.log('');

  if (toDelete.length === 0) {
    console.log('✅ No backups to delete\n');
    return;
  }

  if (isDryRun) {
    console.log('🔍 DRY RUN: No files were deleted\n');
    return;
  }

  // Delete in batches of 1000 (S3 limit)
  console.log('🗑️  Deleting old backups...\n');
  const batchSize = 1000;
  
  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    await deleteBackups(batch);
    console.log(`  ✅ Deleted batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)`);
  }

  console.log('\n✅ Cleanup complete!\n');
}

// Run
cleanupBackups()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });
