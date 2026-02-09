
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader, FileImage, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadAsset } from '../../lib/uploadUtils';

interface SmartUploaderProps {
    onUploadComplete: (url: string, filename: string) => void;
    questionId: string;
    bucket?: 'questions' | 'audio';
    className?: string;
}

export default function SmartUploader({
    onUploadComplete,
    questionId,
    bucket = 'questions',
    className = ''
}: SmartUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            // Process files sequentially
            for (const file of acceptedFiles) {
                const result = await uploadAsset(file, bucket, questionId);
                onUploadComplete(result.url, result.originalName);
            }
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, [bucket, questionId, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: bucket === 'questions'
            ? { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] }
            : { 'audio/*': ['.mp3', '.webm', '.wav'] }
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 hover:border-gray-500 bg-black/20'}
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
                ${className}
            `}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-2 text-gray-400">
                {uploading ? (
                    <>
                        <Loader size={24} className="animate-spin text-emerald-400" />
                        <span className="text-sm">Uploading & Compressing...</span>
                    </>
                ) : error ? (
                    <>
                        <AlertCircle size={24} className="text-red-400" />
                        <span className="text-sm text-red-400">{error}</span>
                    </>
                ) : (
                    <>
                        {isDragActive ? (
                            <Upload size={24} className="text-emerald-400" />
                        ) : (
                            <FileImage size={24} />
                        )}
                        <span className="text-xs">
                            {isDragActive ? "Drop here!" : "Drag images/SVGs here (or click)"}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
