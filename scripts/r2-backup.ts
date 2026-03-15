/**
 * R2 Backup Script
 * 
 * Downloads all assets from R2 bucket to local filesystem
 * Preserves the folder structure for easy restoration
 * 
 * Usage:
 *   npx tsx scripts/r2-backup.ts [output-directory]
 * 
 * Example:
 *   npx tsx scripts/r2-backup.ts ./r2-backup
 */

import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function downloadFile(key: string, outputPath: string): Promise<void> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  
  if (!response.Body) {
    throw new Error(`No body in response for ${key}`);
  }

  const buffer = await streamToBuffer(response.Body as Readable);
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
}

async function listAllObjects(): Promise<string[]> {
  const allKeys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });

    const response = await r2Client.send(command);
    
    if (response.Contents) {
      allKeys.push(...response.Contents.filter(obj => obj.Key).map(obj => obj.Key!));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return allKeys;
}

async function backup() {
  const outputDir = process.argv[2] || './r2-backup';
  
  console.log('🔄 R2 Backup Tool');
  console.log('━'.repeat(60));
  console.log(`📦 Bucket:        ${R2_BUCKET_NAME}`);
  console.log(`📁 Output:        ${path.resolve(outputDir)}`);
  console.log('━'.repeat(60));
  console.log('');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // List all objects
  console.log('📋 Listing all objects...');
  const keys = await listAllObjects();
  console.log(`✅ Found ${keys.length.toLocaleString()} files\n`);

  // Download all files
  let downloaded = 0;
  let failed = 0;
  const startTime = Date.now();

  for (const key of keys) {
    try {
      const outputPath = path.join(outputDir, key);
      await downloadFile(key, outputPath);
      downloaded++;
      
      // Progress update every 10 files
      if (downloaded % 10 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = downloaded / elapsed;
        const remaining = keys.length - downloaded;
        const eta = remaining / rate;
        
        console.log(`⏳ Progress: ${downloaded}/${keys.length} (${((downloaded / keys.length) * 100).toFixed(1)}%) - ETA: ${formatTime(eta)}`);
      }
    } catch (error) {
      console.error(`❌ Failed to download ${key}:`, error);
      failed++;
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;

  console.log('');
  console.log('━'.repeat(60));
  console.log('✅ Backup Complete!');
  console.log('━'.repeat(60));
  console.log(`✅ Downloaded:    ${downloaded.toLocaleString()} files`);
  console.log(`❌ Failed:        ${failed.toLocaleString()} files`);
  console.log(`⏱️  Total time:    ${formatTime(totalTime)}`);
  console.log(`📁 Location:      ${path.resolve(outputDir)}`);
  console.log('━'.repeat(60));
  console.log('');

  // Generate manifest
  const manifestPath = path.join(outputDir, 'backup-manifest.json');
  const manifest = {
    backup_date: new Date().toISOString(),
    bucket: R2_BUCKET_NAME,
    total_files: keys.length,
    downloaded: downloaded,
    failed: failed,
    duration_seconds: totalTime,
    files: keys,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📄 Manifest saved: ${manifestPath}\n`);
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

// Run
backup().catch(console.error);
