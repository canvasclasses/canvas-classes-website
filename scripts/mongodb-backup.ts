/**
 * MongoDB Backup Script
 * 
 * Creates complete backups of all critical MongoDB collections
 * Supports both local filesystem and R2 cloud storage
 * 
 * Usage:
 *   npx tsx scripts/mongodb-backup.ts [--local] [--r2] [--collections=col1,col2]
 * 
 * Examples:
 *   npx tsx scripts/mongodb-backup.ts --local                    # Local backup only
 *   npx tsx scripts/mongodb-backup.ts --r2                       # R2 cloud backup only
 *   npx tsx scripts/mongodb-backup.ts --local --r2               # Both
 *   npx tsx scripts/mongodb-backup.ts --collections=questions_v2 # Specific collection
 * 
 * Environment Variables Required:
 *   MONGODB_URI           - MongoDB connection string
 *   R2_ACCOUNT_ID         - Cloudflare R2 account ID (for --r2)
 *   R2_ACCESS_KEY_ID      - R2 access key (for --r2)
 *   R2_SECRET_ACCESS_KEY  - R2 secret key (for --r2)
 *   R2_BUCKET_NAME        - R2 bucket name (default: canvas-chemistry-assets)
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI!;
const BACKUP_DIR = './backups';

// Critical collections to backup
const CRITICAL_COLLECTIONS = [
  'questions_v2',           // Question bank
  'student_responses',      // User practice data
  'student_chapter_profiles', // User proficiency
  'example_view_sessions',  // Worked examples tracking
  'activity_logs',          // User activity
  'assets',                 // Asset metadata
  'audit_logs',             // Audit trail
  'chapters',               // Chapter data (backup)
  'taxonomy',               // Taxonomy data (backup)
];

// Parse command line arguments
const args = process.argv.slice(2);
const useLocal = args.includes('--local');
const useR2 = args.includes('--r2');
const collectionsArg = args.find(arg => arg.startsWith('--collections='));
const specificCollections = collectionsArg 
  ? collectionsArg.split('=')[1].split(',')
  : null;

// Default to local if no flags specified
const shouldBackupLocal = useLocal || (!useLocal && !useR2);
const shouldBackupR2 = useR2;

// R2 Client (only if needed)
let r2Client: S3Client | null = null;
if (shouldBackupR2) {
  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
  
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

interface BackupMetadata {
  timestamp: string;
  date: string;
  collections: {
    name: string;
    document_count: number;
    size_bytes: number;
    compressed_size_bytes?: number;
  }[];
  total_documents: number;
  total_size_bytes: number;
  total_compressed_bytes?: number;
  duration_seconds: number;
  mongodb_uri_host: string;
  backup_locations: string[];
}

async function backupCollection(
  collectionName: string,
  outputDir: string
): Promise<{ count: number; size: number; compressedSize?: number }> {
  const collection = mongoose.connection.collection(collectionName);
  
  // Get all documents
  const documents = await collection.find({}).toArray();
  const count = documents.length;
  
  if (count === 0) {
    console.log(`  ⚠️  ${collectionName}: Empty collection, skipping`);
    return { count: 0, size: 0 };
  }
  
  // Convert to JSON
  const json = JSON.stringify(documents, null, 2);
  const size = Buffer.byteLength(json, 'utf8');
  
  // Save uncompressed (for easy inspection)
  const jsonPath = path.join(outputDir, `${collectionName}.json`);
  fs.writeFileSync(jsonPath, json);
  
  // Save compressed (for storage efficiency)
  const gzPath = path.join(outputDir, `${collectionName}.json.gz`);
  const compressed = zlib.gzipSync(json);
  fs.writeFileSync(gzPath, compressed);
  const compressedSize = compressed.length;
  
  const compressionRatio = ((1 - compressedSize / size) * 100).toFixed(1);
  console.log(`  ✅ ${collectionName}: ${count.toLocaleString()} docs, ${formatBytes(size)} → ${formatBytes(compressedSize)} (${compressionRatio}% saved)`);
  
  return { count, size, compressedSize };
}

async function uploadToR2(filePath: string, r2Key: string): Promise<void> {
  if (!r2Client) throw new Error('R2 client not initialized');
  
  const fileContent = fs.readFileSync(filePath);
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileContent,
    ContentType: filePath.endsWith('.gz') ? 'application/gzip' : 'application/json',
  });
  
  await r2Client.send(command);
}

async function performBackup(): Promise<void> {
  const timestamp = new Date().toISOString();
  const dateFolder = timestamp.replace(/:/g, '-').replace(/\..+/, '');
  const backupFolder = path.join(BACKUP_DIR, `mongodb_${dateFolder}`);
  
  console.log('🔄 MongoDB Backup Tool');
  console.log('━'.repeat(70));
  console.log(`📅 Timestamp:     ${timestamp}`);
  console.log(`📁 Local folder:  ${path.resolve(backupFolder)}`);
  console.log(`☁️  R2 backup:     ${shouldBackupR2 ? 'Enabled' : 'Disabled'}`);
  console.log(`📊 Collections:   ${specificCollections ? specificCollections.join(', ') : 'All critical collections'}`);
  console.log('━'.repeat(70));
  console.log('');
  
  // Create backup directory
  if (shouldBackupLocal && !fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }
  
  // Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');
  
  // Determine which collections to backup
  const collectionsToBackup = specificCollections || CRITICAL_COLLECTIONS;
  
  // Backup each collection
  console.log('📦 Backing up collections:\n');
  const startTime = Date.now();
  const metadata: BackupMetadata = {
    timestamp,
    date: new Date().toLocaleString(),
    collections: [],
    total_documents: 0,
    total_size_bytes: 0,
    total_compressed_bytes: 0,
    duration_seconds: 0,
    mongodb_uri_host: new URL(MONGODB_URI).host,
    backup_locations: [],
  };
  
  for (const collectionName of collectionsToBackup) {
    try {
      const stats = await backupCollection(collectionName, backupFolder);
      
      metadata.collections.push({
        name: collectionName,
        document_count: stats.count,
        size_bytes: stats.size,
        compressed_size_bytes: stats.compressedSize,
      });
      
      metadata.total_documents += stats.count;
      metadata.total_size_bytes += stats.size;
      if (stats.compressedSize) {
        metadata.total_compressed_bytes! += stats.compressedSize;
      }
    } catch (error: unknown) {
      console.error(`  ❌ ${collectionName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  metadata.duration_seconds = duration;

  // Save metadata
  if (shouldBackupLocal) {
    const metadataPath = path.join(backupFolder, 'backup-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    metadata.backup_locations.push(`local:${path.resolve(backupFolder)}`);
  }
  
  // Upload to R2 if enabled
  if (shouldBackupR2 && r2Client) {
    console.log('\n☁️  Uploading to R2...\n');
    const r2Prefix = `backups/mongodb/${dateFolder}`;
    
    for (const file of fs.readdirSync(backupFolder)) {
      const filePath = path.join(backupFolder, file);
      const r2Key = `${r2Prefix}/${file}`;
      
      try {
        await uploadToR2(filePath, r2Key);
        console.log(`  ✅ Uploaded: ${file}`);
      } catch (error: unknown) {
        console.error(`  ❌ Failed to upload ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
    metadata.backup_locations.push(`r2://${R2_BUCKET_NAME}/${r2Prefix}`);
  }
  
  // Disconnect
  await mongoose.disconnect();
  
  // Print summary
  console.log('\n' + '━'.repeat(70));
  console.log('✅ Backup Complete!');
  console.log('━'.repeat(70));
  console.log(`📊 Collections:   ${metadata.collections.length}`);
  console.log(`📄 Documents:     ${metadata.total_documents.toLocaleString()}`);
  console.log(`💾 Total size:    ${formatBytes(metadata.total_size_bytes)}`);
  if (metadata.total_compressed_bytes) {
    const ratio = ((1 - metadata.total_compressed_bytes / metadata.total_size_bytes) * 100).toFixed(1);
    console.log(`🗜️  Compressed:    ${formatBytes(metadata.total_compressed_bytes)} (${ratio}% saved)`);
  }
  console.log(`⏱️  Duration:      ${duration.toFixed(1)}s`);
  console.log(`📁 Locations:`);
  metadata.backup_locations.forEach(loc => console.log(`   - ${loc}`));
  console.log('━'.repeat(70));
  console.log('');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Run
performBackup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  });
