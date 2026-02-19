/**
 * Asset Management Utilities
 * Manages storage and organization of audio files and SVGs
 * Ensures scalable storage structure for thousands of questions
 */

import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

// Client-side Supabase client (lazy-initialized to avoid build-time errors)
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase is not configured');
    return createClient(url, key);
}

export interface AssetUploadConfig {
    questionId: string;
    chapterId?: string;
    file: File;
    type: 'image' | 'audio' | 'svg';
}

export interface AssetUploadResult {
    url: string;
    path: string;
    originalName: string;
    size: number;
    type: string;
}

export interface AssetMetadata {
    questionId: string;
    chapterId?: string;
    uploadedAt: string;
    originalName: string;
    size: number;
    type: 'image' | 'audio' | 'svg';
}

/**
 * Generate organized storage path for assets
 * Structure: {bucket}/{chapter_id}/{question_id}/{timestamp}_{filename}
 * Example: questions/atom_001/atom_001_20240216_143022_diagram.svg
 */
function generateStoragePath(config: AssetUploadConfig): string {
    const { questionId, chapterId, file, type } = config;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    if (chapterId) {
        return `${chapterId}/${questionId}/${timestamp}_${safeFilename}`;
    }
    
    return `${questionId}/${timestamp}_${safeFilename}`;
}

/**
 * Compress image before upload (skip SVGs)
 */
export async function compressImage(file: File, options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
}): Promise<File> {
    // Skip compression for SVGs
    if (file.type === 'image/svg+xml') return file;
    
    const compressionOptions = {
        maxSizeMB: options?.maxSizeMB || 0.5,
        maxWidthOrHeight: options?.maxWidthOrHeight || 1920,
        useWebWorker: true,
        preserveExif: false
    };
    
    try {
        return await imageCompression(file, compressionOptions);
    } catch (error) {
        console.warn('Image compression failed, using original:', error);
        return file;
    }
}

/**
 * Upload asset with proper organization and metadata
 */
export async function uploadAssetOrganized(
    config: AssetUploadConfig
): Promise<AssetUploadResult> {
    const { file, type } = config;
    
    // Determine bucket
    const bucket = type === 'audio' ? 'audio' : 'questions';
    
    // Compress if image
    let fileToUpload = file;
    if (type === 'image' && file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
    }
    
    // Generate organized path
    const path = generateStoragePath(config);
    
    // Upload to Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, fileToUpload, {
            cacheControl: '31536000', // 1 year cache
            upsert: false,
            contentType: file.type
        });
    
    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: publicData } = getSupabaseClient().storage
        .from(bucket)
        .getPublicUrl(data.path);
    
    return {
        url: publicData.publicUrl,
        path: data.path,
        originalName: file.name,
        size: fileToUpload.size,
        type: file.type
    };
}

/**
 * Delete asset from storage
 */
export async function deleteAsset(
    bucket: 'questions' | 'audio',
    path: string
): Promise<void> {
    const { error } = await getSupabaseClient().storage
        .from(bucket)
        .remove([path]);
    
    if (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }
}

/**
 * List all assets for a question
 */
export async function listQuestionAssets(
    questionId: string,
    chapterId?: string
): Promise<{ images: string[]; audio: string[] }> {
    const prefix = chapterId ? `${chapterId}/${questionId}` : questionId;
    
    const sb = getSupabaseClient();
    const [imageResult, audioResult] = await Promise.all([
        sb.storage.from('questions').list(prefix),
        sb.storage.from('audio').list(prefix)
    ]);
    
    const images = imageResult.data?.map((f: any) => 
        sb.storage.from('questions').getPublicUrl(`${prefix}/${f.name}`).data.publicUrl
    ) || [];
    
    const audio = audioResult.data?.map((f: any) => 
        sb.storage.from('audio').getPublicUrl(`${prefix}/${f.name}`).data.publicUrl
    ) || [];
    
    return { images, audio };
}

/**
 * Get asset statistics for a chapter
 */
export async function getChapterAssetStats(
    chapterId: string
): Promise<{
    totalImages: number;
    totalAudio: number;
    totalSizeMB: number;
}> {
    const sb = getSupabaseClient();
    const [imageResult, audioResult] = await Promise.all([
        sb.storage.from('questions').list(chapterId),
        sb.storage.from('audio').list(chapterId)
    ]);
    
    const images = imageResult.data || [];
    const audio = audioResult.data || [];
    
    // Calculate sizes (metadata may not always be available)
    const imageSize = images.reduce((sum: number, f: any) => sum + (f.metadata?.size || 0), 0);
    const audioSize = audio.reduce((sum: number, f: any) => sum + (f.metadata?.size || 0), 0);
    
    return {
        totalImages: images.length,
        totalAudio: audio.length,
        totalSizeMB: Math.round((imageSize + audioSize) / 1024 / 1024 * 100) / 100
    };
}

/**
 * Validate file before upload
 */
export function validateAssetFile(
    file: File,
    type: 'image' | 'audio' | 'svg'
): { valid: boolean; error?: string } {
    // Size limits
    const maxSizes = {
        image: 10 * 1024 * 1024,  // 10MB
        svg: 2 * 1024 * 1024,     // 2MB
        audio: 50 * 1024 * 1024   // 50MB
    };
    
    if (file.size > maxSizes[type]) {
        return {
            valid: false,
            error: `File too large. Max size: ${maxSizes[type] / 1024 / 1024}MB`
        };
    }
    
    // Type validation
    const allowedTypes = {
        image: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        svg: ['image/svg+xml'],
        audio: ['audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/wav', 'audio/ogg']
    };
    
    const allowed = allowedTypes[type];
    if (!allowed.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: ${allowed.join(', ')}`
        };
    }
    
    return { valid: true };
}

/**
 * Bulk upload assets for a question
 */
export async function bulkUploadAssets(
    questionId: string,
    files: File[],
    chapterId?: string
): Promise<{ success: AssetUploadResult[]; failed: { file: string; error: string }[] }> {
    const success: AssetUploadResult[] = [];
    const failed: { file: string; error: string }[] = [];
    
    for (const file of files) {
        // Determine type
        let type: 'image' | 'audio' | 'svg' = 'image';
        if (file.type.startsWith('audio/')) {
            type = 'audio';
        } else if (file.type === 'image/svg+xml') {
            type = 'svg';
        }
        
        // Validate
        const validation = validateAssetFile(file, type);
        if (!validation.valid) {
            failed.push({ file: file.name, error: validation.error! });
            continue;
        }
        
        // Upload
        try {
            const result = await uploadAssetOrganized({
                questionId,
                chapterId,
                file,
                type
            });
            success.push(result);
        } catch (error: any) {
            failed.push({ file: file.name, error: error.message });
        }
    }
    
    return { success, failed };
}

/**
 * Move assets when question ID changes (e.g., during ID migration)
 */
export async function moveQuestionAssets(
    oldQuestionId: string,
    newQuestionId: string,
    chapterId?: string
): Promise<{ moved: number; failed: number }> {
    const oldPrefix = chapterId ? `${chapterId}/${oldQuestionId}` : oldQuestionId;
    const newPrefix = chapterId ? `${chapterId}/${newQuestionId}` : newQuestionId;
    
    let moved = 0;
    let failed = 0;
    
    const sb = getSupabaseClient();
    // List and move from both buckets
    for (const bucket of ['questions', 'audio'] as const) {
        const { data: files } = await sb.storage.from(bucket).list(oldPrefix);
        
        if (!files) continue;
        
        for (const file of files) {
            const oldPath = `${oldPrefix}/${file.name}`;
            const newPath = `${newPrefix}/${file.name}`;
            
            // Download and re-upload (Supabase doesn't support move directly)
            const { data: downloadData } = await sb.storage
                .from(bucket)
                .download(oldPath);
            
            if (!downloadData) {
                failed++;
                continue;
            }
            
            try {
                // Upload to new location
                await sb.storage
                    .from(bucket)
                    .upload(newPath, downloadData, {
                        upsert: true,
                        contentType: file.metadata?.mimetype || 'application/octet-stream'
                    });
                
                // Delete old file
                await sb.storage.from(bucket).remove([oldPath]);
                moved++;
            } catch (error) {
                console.error(`Failed to move ${oldPath}:`, error);
                failed++;
            }
        }
    }
    
    return { moved, failed };
}
