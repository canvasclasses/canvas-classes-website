import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlashcard extends Document {
  flashcard_id: string;
  chapter: {
    id: string;
    name: string;
    category: string;
  };
  topic: {
    name: string;
    order: number;
  };
  question: string;
  answer: string;
  metadata: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags: string[];
    source: string;
    class_num: number;
    created_at: Date;
    updated_at: Date;
  };
  deleted_at: Date | null;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    flashcard_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    chapter: {
      id: {
        type: String,
        required: true,
        index: true,
      },
      name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'JEE PYQ'],
        index: true,
      },
    },
    topic: {
      name: {
        type: String,
        required: true,
      },
      order: {
        type: Number,
        default: 0,
      },
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    metadata: {
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
      },
      tags: {
        type: [String],
        default: [],
        index: true,
      },
      source: {
        type: String,
        default: 'NCERT',
      },
      class_num: {
        type: Number,
        default: 12,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    },
    deleted_at: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    collection: 'flashcards',
  }
);

// Indexes for performance
FlashcardSchema.index({ 'chapter.id': 1, deleted_at: 1 });
FlashcardSchema.index({ 'chapter.category': 1, deleted_at: 1 });
FlashcardSchema.index({ 'topic.name': 1, deleted_at: 1 });
FlashcardSchema.index({ flashcard_id: 1, deleted_at: 1 });

// Pre-save hook to update metadata.updated_at
FlashcardSchema.pre('save', async function () {
  this.metadata.updated_at = new Date();
});

// Static method to get active flashcards (not deleted)
FlashcardSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, deleted_at: null });
};

// Static method to soft delete
FlashcardSchema.statics.softDelete = function (flashcard_id: string) {
  return this.findOneAndUpdate(
    { flashcard_id },
    { deleted_at: new Date() },
    { new: true }
  );
};

// Export model
const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);

export default Flashcard;
