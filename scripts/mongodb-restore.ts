/**
 * MongoDB Restore Script
 * 
 * Restores MongoDB collections from backup files
 * Supports both local filesystem and R2 cloud storage
 * 
 * Usage:
 *   npx tsx scripts/mongodb-restore.ts <backup-folder> [--collections=col1,col2] [--dry-run]
 * 
 * Examples:
 *   npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00
 *   npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00 --collections=questions_v2
 *   npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00 --dry-run
 * 
 * WARNING: This will OVERWRITE existing data in the specified collections!
 *          Always backup current data before restoring.
 * 
 * Environment Variables Required:
 *   MONGODB_URI - MongoDB connection string
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as readline from 'readline';

const MONGODB_URI = process.env.MONGODB_URI!;

// Parse command line arguments
const args = process.argv.slice(2);
const backupFolder = args[0];
const collectionsArg = args.find(arg => arg.startsWith('--collections='));
const specificCollections = collectionsArg 
  ? collectionsArg.split('=')[1].split(',')
  : null;
const isDryRun = args.includes('--dry-run');

if (!backupFolder) {
  console.error('❌ Error: Backup folder path required');
  console.log('\nUsage: npx tsx scripts/mongodb-restore.ts <backup-folder> [--collections=col1,col2] [--dry-run]');
  process.exit(1);
}

if (!fs.existsSync(backupFolder)) {
  console.error(`❌ Error: Backup folder not found: ${backupFolder}`);
  process.exit(1);
}

async function askConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function restoreCollection(
  collectionName: string,
  backupFolder: string
): Promise<{ count: number; inserted: number }> {
  // Try compressed file first, then uncompressed
  const gzPath = path.join(backupFolder, `${collectionName}.json.gz`);
  const jsonPath = path.join(backupFolder, `${collectionName}.json`);
  
  let jsonData: string;
  
  if (fs.existsSync(gzPath)) {
    const compressed = fs.readFileSync(gzPath);
    jsonData = zlib.gunzipSync(compressed).toString('utf8');
  } else if (fs.existsSync(jsonPath)) {
    jsonData = fs.readFileSync(jsonPath, 'utf8');
  } else {
    throw new Error(`Backup file not found for collection: ${collectionName}`);
  }
  
  const documents = JSON.parse(jsonData);
  const count = documents.length;
  
  if (count === 0) {
    console.log(`  ⚠️  ${collectionName}: No documents to restore`);
    return { count: 0, inserted: 0 };
  }
  
  if (isDryRun) {
    console.log(`  🔍 ${collectionName}: Would restore ${count.toLocaleString()} documents (DRY RUN)`);
    return { count, inserted: 0 };
  }
  
  // Get collection
  const collection = mongoose.connection.collection(collectionName);
  
  // Clear existing data
  const deleteResult = await collection.deleteMany({});
  console.log(`  🗑️  ${collectionName}: Deleted ${deleteResult.deletedCount.toLocaleString()} existing documents`);
  
  // Insert backup data
  const insertResult = await collection.insertMany(documents);
  const inserted = insertResult.insertedCount;
  
  console.log(`  ✅ ${collectionName}: Restored ${inserted.toLocaleString()} documents`);
  
  return { count, inserted };
}

async function performRestore(): Promise<void> {
  console.log('🔄 MongoDB Restore Tool');
  console.log('━'.repeat(70));
  console.log(`📁 Backup folder: ${path.resolve(backupFolder)}`);
  console.log(`🎯 Mode:          ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE RESTORE'}`);
  console.log('━'.repeat(70));
  console.log('');
  
  // Read backup metadata if available
  const metadataPath = path.join(backupFolder, 'backup-metadata.json');
  interface BackupMetadataFile {
    date: string;
    collections: { name: string; document_count: number }[];
    total_documents: number;
  }
  let metadata: BackupMetadataFile | null = null;

  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as BackupMetadataFile;
    console.log('📋 Backup Information:');
    console.log(`   Date: ${metadata.date}`);
    console.log(`   Collections: ${metadata.collections.length}`);
    console.log(`   Total documents: ${metadata.total_documents.toLocaleString()}`);
    console.log('');
  }

  // Determine which collections to restore
  let collectionsToRestore: string[];

  if (specificCollections) {
    collectionsToRestore = specificCollections;
  } else if (metadata) {
    collectionsToRestore = metadata.collections.map((c) => c.name);
  } else {
    // Scan backup folder for .json or .json.gz files
    const files = fs.readdirSync(backupFolder);
    collectionsToRestore = files
      .filter(f => f.endsWith('.json') || f.endsWith('.json.gz'))
      .map(f => f.replace('.json.gz', '').replace('.json', ''))
      .filter(f => f !== 'backup-metadata');
  }
  
  console.log(`📦 Collections to restore: ${collectionsToRestore.join(', ')}\n`);
  
  // Confirmation prompt (skip in dry-run mode)
  if (!isDryRun) {
    console.log('⚠️  WARNING: This will DELETE all existing data in these collections!');
    console.log('⚠️  Make sure you have a backup of current data before proceeding.\n');
    
    const confirmed = await askConfirmation('Are you sure you want to continue?');
    
    if (!confirmed) {
      console.log('\n❌ Restore cancelled by user');
      process.exit(0);
    }
    console.log('');
  }
  
  // Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');
  
  // Restore each collection
  console.log('📦 Restoring collections:\n');
  const startTime = Date.now();
  let totalRestored = 0;
  
  for (const collectionName of collectionsToRestore) {
    try {
      const stats = await restoreCollection(collectionName, backupFolder);
      totalRestored += stats.inserted;
    } catch (error: unknown) {
      console.error(`  ❌ ${collectionName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  
  // Disconnect
  await mongoose.disconnect();
  
  // Print summary
  console.log('\n' + '━'.repeat(70));
  console.log(isDryRun ? '✅ Dry Run Complete!' : '✅ Restore Complete!');
  console.log('━'.repeat(70));
  console.log(`📊 Collections:   ${collectionsToRestore.length}`);
  console.log(`📄 Documents:     ${totalRestored.toLocaleString()} ${isDryRun ? '(would be restored)' : 'restored'}`);
  console.log(`⏱️  Duration:      ${duration.toFixed(1)}s`);
  console.log('━'.repeat(70));
  console.log('');
}

// Run
performRestore()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  });
