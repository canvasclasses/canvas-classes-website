import mongoose, { Schema } from 'mongoose';

// ============================================
// ASSET MODEL - For SVG, Images, Audio, Video
// Centralized asset management with tracking
// ============================================

export interface IAssetFile {
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  cdn_url: string;
  checksum: string; // SHA-256 hash for integrity
}

export interface IAssetUsage {
  questions: string[]; // Array of question UUIDs
  question_field: string; // e.g., "solution.assets.svg"
}

export interface IAssetMetadata {
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration_seconds?: number; // For audio/video
}

export interface IAsset {
  _id: string; // UUID v4
  type: 'image' | 'svg' | 'audio' | 'video';
  file: IAssetFile;
  used_in: IAssetUsage;
  metadata: IAssetMetadata;
  
  version: number;
  previous_versions: string[]; // Array of previous asset UUIDs
  
  created_at: Date;
  created_by: string;
  updated_at: Date;
  
  deleted_at?: Date;
  
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_error?: string;
}

const AssetFileSchema = new Schema<IAssetFile>({
  original_name: { type: String, required: true },
  mime_type: { type: String, required: true },
  size_bytes: { type: Number, required: true },
  storage_path: { type: String, required: true },
  cdn_url: { type: String, required: true },
  checksum: { type: String, required: true }
}, { _id: false });

const AssetUsageSchema = new Schema<IAssetUsage>({
  questions: [{ type: String }],
  question_field: { type: String }
}, { _id: false });

const AssetMetadataSchema = new Schema<IAssetMetadata>({
  alt_text: { type: String },
  caption: { type: String },
  width: { type: Number },
  height: { type: Number },
  duration_seconds: { type: Number }
}, { _id: false });

const AssetSchema = new Schema<IAsset>({
  _id: { 
    type: String, 
    required: true,
    match: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  },
  type: { 
    type: String, 
    enum: ['image', 'svg', 'audio', 'video'], 
    required: true 
  },
  file: { type: AssetFileSchema, required: true },
  used_in: { type: AssetUsageSchema, required: true },
  metadata: { type: AssetMetadataSchema, default: {} },
  
  version: { type: Number, default: 1 },
  previous_versions: [{ type: String }],
  
  created_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  
  deleted_at: { type: Date },
  
  processing_status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  processing_error: { type: String }
}, {
  timestamps: false,
  collection: 'assets'
});

// Indexes for performance
AssetSchema.index({ 'used_in.questions': 1 });
AssetSchema.index({ type: 1, deleted_at: 1 });
AssetSchema.index({ 'file.checksum': 1 }); // Detect duplicates
AssetSchema.index({ created_at: -1 });
AssetSchema.index({ processing_status: 1 });

// Pre-save middleware
AssetSchema.pre('save', async function(this: any) {
  this.updated_at = new Date();
});

export const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
