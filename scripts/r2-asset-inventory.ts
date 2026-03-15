/**
 * R2 Asset Inventory Generator
 * 
 * Scans the entire R2 bucket and generates:
 * 1. CSV inventory of all assets (filterable by type)
 * 2. Statistics by asset type
 * 3. List of all URLs for easy backup
 * 
 * Usage:
 *   npx tsx scripts/r2-asset-inventory.ts
 */

import { S3Client, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.dev`;

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

interface AssetInfo {
  key: string;
  size: number;
  lastModified: Date;
  type: 'audio' | 'video' | 'svg' | 'image' | 'other';
  questionId: string | null;
  publicUrl: string;
}

function getAssetType(key: string): 'audio' | 'video' | 'svg' | 'image' | 'other' {
  if (key.includes('/audio/') || key.endsWith('.mp3') || key.endsWith('.wav') || key.endsWith('.webm') || key.endsWith('.ogg')) return 'audio';
  if (key.includes('/video/') || key.endsWith('.mp4')) return 'video';
  if (key.includes('/svg/') || key.endsWith('.svg')) return 'svg';
  if (key.includes('/image/') || key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.webp')) return 'image';
  return 'other';
}

function extractQuestionId(key: string): string | null {
  // Pattern: questions/{question_id}/{type}/{filename}
  const match = key.match(/^questions\/([^\/]+)\//);
  return match ? match[1] : null;
}

async function listAllObjects(): Promise<_Object[]> {
  const allObjects: _Object[] = [];
  let continuationToken: string | undefined;

  console.log('📦 Scanning R2 bucket:', R2_BUCKET_NAME);
  console.log('⏳ This may take a few minutes for large buckets...\n');

  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });

    const response = await r2Client.send(command);
    
    if (response.Contents) {
      allObjects.push(...response.Contents);
      console.log(`   Found ${allObjects.length} objects so far...`);
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return allObjects;
}

async function generateInventory() {
  const objects = await listAllObjects();
  
  console.log(`\n✅ Total objects found: ${objects.length}\n`);

  // Process objects
  const assets: AssetInfo[] = objects
    .filter(obj => obj.Key && obj.Size && obj.LastModified)
    .map(obj => ({
      key: obj.Key!,
      size: obj.Size!,
      lastModified: obj.LastModified!,
      type: getAssetType(obj.Key!),
      questionId: extractQuestionId(obj.Key!),
      publicUrl: `${R2_PUBLIC_URL}/${obj.Key}`,
    }));

  // Statistics
  const stats = {
    audio: assets.filter(a => a.type === 'audio'),
    video: assets.filter(a => a.type === 'video'),
    svg: assets.filter(a => a.type === 'svg'),
    image: assets.filter(a => a.type === 'image'),
    other: assets.filter(a => a.type === 'other'),
  };

  const totalSize = assets.reduce((sum, a) => sum + a.size, 0);

  // Print statistics
  console.log('📊 Asset Statistics:');
  console.log('━'.repeat(60));
  console.log(`🎵 Audio files:  ${stats.audio.length.toLocaleString()} (${formatBytes(stats.audio.reduce((s, a) => s + a.size, 0))})`);
  console.log(`🎬 Video files:  ${stats.video.length.toLocaleString()} (${formatBytes(stats.video.reduce((s, a) => s + a.size, 0))})`);
  console.log(`📐 SVG files:    ${stats.svg.length.toLocaleString()} (${formatBytes(stats.svg.reduce((s, a) => s + a.size, 0))})`);
  console.log(`🖼️  Image files:  ${stats.image.length.toLocaleString()} (${formatBytes(stats.image.reduce((s, a) => s + a.size, 0))})`);
  console.log(`📄 Other files:  ${stats.other.length.toLocaleString()} (${formatBytes(stats.other.reduce((s, a) => s + a.size, 0))})`);
  console.log('━'.repeat(60));
  console.log(`📦 Total:        ${assets.length.toLocaleString()} files (${formatBytes(totalSize)})`);
  console.log('');

  // Unique questions with assets
  const questionsWithAssets = new Set(assets.filter(a => a.questionId).map(a => a.questionId));
  console.log(`🔢 Questions with assets: ${questionsWithAssets.size.toLocaleString()}\n`);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'r2-inventory');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate CSV files
  console.log('📝 Generating inventory files...\n');

  // 1. Full inventory CSV
  const fullCsvPath = path.join(outputDir, 'full-inventory.csv');
  const fullCsv = [
    'Type,Question ID,File Path,Public URL,Size (bytes),Size (MB),Last Modified',
    ...assets.map(a => 
      `${a.type},${a.questionId || 'N/A'},"${a.key}","${a.publicUrl}",${a.size},${(a.size / 1024 / 1024).toFixed(2)},${a.lastModified.toISOString()}`
    )
  ].join('\n');
  fs.writeFileSync(fullCsvPath, fullCsv);
  console.log(`✅ Full inventory: ${fullCsvPath}`);

  // 2. Audio files only
  const audioCsvPath = path.join(outputDir, 'audio-files.csv');
  const audioCsv = [
    'Question ID,File Path,Public URL,Size (MB),Last Modified',
    ...stats.audio.map(a => 
      `${a.questionId || 'N/A'},"${a.key}","${a.publicUrl}",${(a.size / 1024 / 1024).toFixed(2)},${a.lastModified.toISOString()}`
    )
  ].join('\n');
  fs.writeFileSync(audioCsvPath, audioCsv);
  console.log(`✅ Audio files:    ${audioCsvPath}`);

  // 3. Video files only
  const videoCsvPath = path.join(outputDir, 'video-files.csv');
  const videoCsv = [
    'Question ID,File Path,Public URL,Size (MB),Last Modified',
    ...stats.video.map(a => 
      `${a.questionId || 'N/A'},"${a.key}","${a.publicUrl}",${(a.size / 1024 / 1024).toFixed(2)},${a.lastModified.toISOString()}`
    )
  ].join('\n');
  fs.writeFileSync(videoCsvPath, videoCsv);
  console.log(`✅ Video files:    ${videoCsvPath}`);

  // 4. SVG files only
  const svgCsvPath = path.join(outputDir, 'svg-files.csv');
  const svgCsv = [
    'Question ID,File Path,Public URL,Size (KB),Last Modified',
    ...stats.svg.map(a => 
      `${a.questionId || 'N/A'},"${a.key}","${a.publicUrl}",${(a.size / 1024).toFixed(2)},${a.lastModified.toISOString()}`
    )
  ].join('\n');
  fs.writeFileSync(svgCsvPath, svgCsv);
  console.log(`✅ SVG files:      ${svgCsvPath}`);

  // 5. URL list for backup (wget/curl friendly)
  const urlListPath = path.join(outputDir, 'all-urls.txt');
  const urlList = assets.map(a => a.publicUrl).join('\n');
  fs.writeFileSync(urlListPath, urlList);
  console.log(`✅ URL list:       ${urlListPath}`);

  // 6. Statistics JSON
  const statsJsonPath = path.join(outputDir, 'statistics.json');
  const statsJson = JSON.stringify({
    generated_at: new Date().toISOString(),
    total_files: assets.length,
    total_size_bytes: totalSize,
    total_size_mb: (totalSize / 1024 / 1024).toFixed(2),
    questions_with_assets: questionsWithAssets.size,
    by_type: {
      audio: {
        count: stats.audio.length,
        size_bytes: stats.audio.reduce((s, a) => s + a.size, 0),
        size_mb: (stats.audio.reduce((s, a) => s + a.size, 0) / 1024 / 1024).toFixed(2),
      },
      video: {
        count: stats.video.length,
        size_bytes: stats.video.reduce((s, a) => s + a.size, 0),
        size_mb: (stats.video.reduce((s, a) => s + a.size, 0) / 1024 / 1024).toFixed(2),
      },
      svg: {
        count: stats.svg.length,
        size_bytes: stats.svg.reduce((s, a) => s + a.size, 0),
        size_mb: (stats.svg.reduce((s, a) => s + a.size, 0) / 1024 / 1024).toFixed(2),
      },
      image: {
        count: stats.image.length,
        size_bytes: stats.image.reduce((s, a) => s + a.size, 0),
        size_mb: (stats.image.reduce((s, a) => s + a.size, 0) / 1024 / 1024).toFixed(2),
      },
    },
  }, null, 2);
  fs.writeFileSync(statsJsonPath, statsJson);
  console.log(`✅ Statistics:     ${statsJsonPath}`);

  console.log(`\n✨ All files saved to: ${outputDir}\n`);
  console.log('💡 You can now:');
  console.log('   - Open CSV files in Excel/Google Sheets to filter and analyze');
  console.log('   - Use all-urls.txt for bulk download: wget -i all-urls.txt');
  console.log('   - View statistics.json for programmatic access\n');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Run
generateInventory().catch(console.error);
