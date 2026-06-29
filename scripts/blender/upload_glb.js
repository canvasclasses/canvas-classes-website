/**
 * Upload a local .glb to Cloudflare R2 (the same bucket the Live Books pipeline
 * uses) and print its public URL. Mirrors packages/core/r2-storage.ts getR2Config.
 *
 * Usage: node scripts/blender/upload_glb.js <localPath> <r2Key>
 *   e.g. node scripts/blender/upload_glb.js /tmp/heart.glb models/anatomy/heart-v1.glb
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function main() {
  const [localPath, key] = process.argv.slice(2);
  if (!localPath || !key) {
    console.error('usage: node upload_glb.js <localPath> <r2Key>');
    process.exit(2);
  }
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY in .env.local');
    process.exit(1);
  }

  const body = fs.readFileSync(localPath);
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: 'model/gltf-binary',
  }));
  console.log(`UPLOADED ${body.length} bytes`);
  console.log(`${publicBase}/${key}`);
}

main().catch((e) => { console.error('UPLOAD FAILED:', e.message); process.exit(1); });
