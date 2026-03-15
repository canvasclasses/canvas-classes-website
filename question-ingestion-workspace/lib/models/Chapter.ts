import mongoose, { Schema } from 'mongoose';

// ============================================
// CHAPTER MODEL - Organize questions by chapter
// Manages display IDs and statistics
// ============================================

export interface IChapterStats {
  total_questions: number;
  published_questions: number;
  draft_questions: number;
  avg_difficulty: 'Easy' | 'Medium' | 'Hard';
  pyq_count: number;
}

export interface IChapter {
  _id: string; // e.g., "chapter_atomic_structure"
  name: string;
  display_order: number;
  
  question_sequence: number; // Auto-increments for display_id generation
  
  class_level: '11' | '12';
  subject: string;
  
  stats: IChapterStats;
  
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const ChapterStatsSchema = new Schema<IChapterStats>({
  total_questions: { type: Number, default: 0 },
  published_questions: { type: Number, default: 0 },
  draft_questions: { type: Number, default: 0 },
  avg_difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  pyq_count: { type: Number, default: 0 }
}, { _id: false });

const ChapterSchema = new Schema<IChapter>({
  _id: { 
    type: String, 
    required: true,
  },
  name: { type: String, required: true },
  display_order: { type: Number, required: true },
  
  question_sequence: { type: Number, default: 0 },
  
  class_level: { 
    type: String, 
    enum: ['11', '12'], 
    required: true 
  },
  subject: { type: String, required: true },
  
  stats: { type: ChapterStatsSchema, default: {} },
  
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'chapters'
});

// Indexes
ChapterSchema.index({ display_order: 1 });
ChapterSchema.index({ class_level: 1, subject: 1 });
ChapterSchema.index({ is_active: 1 });

// Pre-save middleware
ChapterSchema.pre('save', function(this: any, next: any) {
  this.updated_at = new Date();
  next();
});

export const Chapter = mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);
