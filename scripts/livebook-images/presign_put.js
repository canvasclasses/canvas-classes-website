// Generate a presigned PUT URL so the BROWSER (real Chrome, remote from this
// sandbox — no shared filesystem with the agent) can upload an image straight
// to R2, bypassing the need to ever download the file locally.
//
// Companion to ingest.js for environments where Claude-in-Chrome drives a
// browser that isn't the same machine as the agent's shell. Once the browser
// confirms the PUT succeeded, writeback.js finishes the job (DB write +
// journal), mirroring ingest.js steps 3-4.
//
// Usage:
//   node presign_put.js --block <id> --book <id> --chapter <n> [--contentType image/webp] [--suffix v2]
require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const blockId = arg('block');
const bookId = arg('book');
const chapter = arg('chapter');
const contentType = arg('contentType', 'image/webp');
const suffix = arg('suffix');
const ext = contentType === 'image/webp' ? 'webp' : contentType.split('/')[1];

if (!blockId || !bookId || !chapter) {
  console.error('Missing required arg. Need --block --book --chapter');
  process.exit(2);
}

(async () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`;
  const key = `books/${bookId}/ch${chapter}/${blockId}_gen${suffix ? '_' + suffix : ''}.${ext}`;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: contentType });
  const presignedUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  const publicUrl = `${publicBase}/${key}`;

  console.log(JSON.stringify({ presignedUrl, publicUrl, key }));
})().catch((e) => { console.error(e); process.exit(1); });
