import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ============================================
// CLOUDFLARE R2 CONFIGURATION
// S3-compatible API for audio/image storage
// ============================================

// All R2 config is read at call time (inside functions) to avoid Next.js module cache issues.
// Do NOT read process.env at module level — values may be undefined on first load.

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID!;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicUrl = process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`;
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl, endpoint };
}

function getR2Client() {
  const { accessKeyId, secretAccessKey, endpoint } = getR2Config();
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// Keep a named export for legacy callers that import r2Client directly
export const r2Client = new S3Client({ region: 'auto', endpoint: 'https://placeholder.r2.cloudflarestorage.com', credentials: { accessKeyId: 'placeholder', secretAccessKey: 'placeholder' } });

// Asset type configuration
export type AssetType = 'audio' | 'svg' | 'image' | 'video';

interface AssetConfig {
  folder: string;
  allowedTypes: string[];
  maxSize: number; // in bytes
}

const ASSET_CONFIG: Record<AssetType, AssetConfig> = {
  audio: {
    folder: 'audio',
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/webm', 'audio/webm;codecs=opus'],
    maxSize: 50 * 1024 * 1024, // 50 MB
  },
  svg: {
    folder: 'svg',
    allowedTypes: ['image/svg+xml'],
    maxSize: 5 * 1024 * 1024, // 5 MB
  },
  image: {
    folder: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  video: {
    folder: 'videos',
    allowedTypes: ['video/mp4', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100 MB
  },
};

// ============================================
// UPLOAD FUNCTIONS
// ============================================

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  size?: number;
}

// R2_PUBLIC_URL is resolved at call time (inside the function) to avoid Next.js module cache issues

/**
 * Upload file to Cloudflare R2
 * @param file - File buffer
 * @param fileName - Original filename (used only as fallback for path generation)
 * @param assetType - Asset type for config lookup
 * @param contentType - MIME type
 * @param explicitPath - If provided, use this as the R2 key (organised path from caller)
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  assetType: AssetType,
  contentType: string,
  explicitPath?: string
): Promise<UploadResult> {
  try {
    const config = ASSET_CONFIG[assetType];
    
    // Validate file size
    if (file.length > config.maxSize) {
      return {
        success: false,
        error: `File too large. Max size: ${config.maxSize / 1024 / 1024}MB`,
      };
    }

    // Validate content type — SVG files may arrive as 'text/plain' from some browsers, allow it
    // Audio/webm may include codec suffix (e.g. 'audio/webm;codecs=opus'), match by base type
    const baseContentType = contentType.split(';')[0].trim();
    const isAllowed = config.allowedTypes.includes(contentType)
      || config.allowedTypes.includes(baseContentType)
      || (assetType === 'svg' && (contentType === 'text/plain' || contentType === 'application/octet-stream'))
      || (assetType === 'audio' && baseContentType.startsWith('audio/'));
    if (!isAllowed) {
      return {
        success: false,
        error: `Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`,
      };
    }

    // Use caller-supplied path if provided, otherwise generate one
    const timestamp = Date.now();
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = explicitPath || `${config.folder}/${timestamp}_${safeFileName}`;

    // Upload to R2 — create client and read config at call time
    const { bucketName, publicUrl: r2PublicBase } = getR2Config();
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
      Body: file,
      ContentType: contentType,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': fileName,
      },
    });

    await client.send(command);

    const publicUrl = `${r2PublicBase}/${storagePath}`;

    return {
      success: true,
      url: publicUrl,
      path: storagePath,
      size: file.length,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get signed URL for temporary access (optional)
 */
export async function getSignedR2Url(
  storagePath: string,
  expirationSeconds: number = 3600
): Promise<string | null> {
  try {
    const { bucketName } = getR2Config();
    const client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
    });

    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: expirationSeconds,
    });

    return signedUrl;
  } catch (error) {
    console.error('R2 signed URL error:', error);
    return null;
  }
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(storagePath: string): Promise<boolean> {
  try {
    const { bucketName } = getR2Config();
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error('R2 delete error:', error);
    return false;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique filename for question assets
 */
export function generateAssetFileName(
  questionDisplayId: string,
  assetType: AssetType,
  extension: string
): string {
  const timestamp = Date.now();
  return `${questionDisplayId}_${assetType}_${timestamp}.${extension}`;
}

/**
 * Extract file extension from mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
    'image/svg+xml': 'svg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
  };
  return map[mimeType] || 'bin';
}
