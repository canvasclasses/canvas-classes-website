
import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

// Client-side Supabase client (using public key)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UploadResult {
    url: string;
    path: string;
    originalName: string;
}

export const compressImage = async (file: File): Promise<File> => {
    // Skip compression for SVGs
    if (file.type === 'image/svg+xml') return file;

    const options = {
        maxSizeMB: 0.5, // Max 500KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Compression failed, using original file:", error);
        return file;
    }
};

export const uploadAsset = async (
    file: File,
    bucket: 'questions' | 'audio',
    prefix: string = ''
): Promise<UploadResult> => {

    let fileToUpload = file;

    // Compress if it's an image (and not SVG)
    if (bucket === 'questions' && file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
    }

    const fileExt = file.name.split('.').pop();
    // Unique ID: prefix + timestamp + random
    const uniqueName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueName, fileToUpload, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw error;
    }

    const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return {
        url: publicData.publicUrl,
        path: data.path,
        originalName: file.name
    };
};
