import 'server-only';
import mongoose, { Schema } from 'mongoose';

// Per-chapter visit counter for the handwritten-notes trust strip.
//
// One document per chapter slug; `count` is incremented once per browser
// session (client deduplicates via sessionStorage). The number rendered in
// the chapter page hero is THIS counter, not a synthesised trend — so it
// can be referenced honestly as "students visited this chapter."
//
// We deliberately don't store IPs, user IDs, or any per-visit metadata
// here — those live in our analytics pipeline (Vercel / Cloudflare /
// Mixpanel). This collection is purely a public-facing trust signal that
// SSG builds can read at revalidate time.

export interface IChapterView {
    _id: string;          // chapter slug (e.g. 'mole-concept')
    count: number;        // total unique-session visits
    updated_at: Date;
}

const ChapterViewSchema = new Schema<IChapterView>(
    {
        _id: { type: String, required: true },
        count: { type: Number, required: true, default: 0 },
        updated_at: { type: Date, required: true, default: Date.now },
    },
    {
        _id: false,
        collection: 'chapter_views',
        versionKey: false,
    }
);

export const ChapterView =
    mongoose.models.ChapterView ||
    mongoose.model<IChapterView>('ChapterView', ChapterViewSchema);
