'use server';

import { Question as QuestionPageType, TaxonomyNode } from './types';
import connectToDatabase from '@/lib/mongodb';
import { Question as QuestionModel, Taxonomy as TaxonomyModel } from '@/lib/models';
import { supabase } from '../../lib/supabase';

// Helper to map DB Documents -> Question (camelCase)
const mapDocToQuestion = (doc: any): QuestionPageType => ({
    id: doc._id || doc.id,
    textMarkdown: doc.text_markdown || doc.textMarkdown,
    options: doc.options || [],
    integerAnswer: doc.integer_answer || doc.integerAnswer || "",
    solution: {
        textSolutionLatex: doc.solution?.text_latex || doc.solution?.textSolutionLatex || "",
        videoUrl: doc.solution?.video_url || doc.solution?.videoUrl,
        videoTimestampStart: doc.solution?.video_timestamp_start || doc.solution?.videoTimestampStart,
        audioExplanationUrl: doc.solution?.audio_url || doc.solution?.audioExplanationUrl,
        handwrittenSolutionImageUrl: doc.solution?.image_url || doc.solution?.handwrittenSolutionImageUrl
    },
    difficulty: doc.meta?.difficulty || doc.difficulty,
    chapterId: doc.chapter_id || doc.chapterId,
    examSource: doc.exam_source || (() => {
        const pyqRef = doc.source_references?.find((r: any) => r.type === 'PYQ');
        if (pyqRef && pyqRef.pyqShift) {
            return `${pyqRef.pyqExam || (doc.meta?.exam || 'JEE Main')} ${pyqRef.pyqYear || doc.meta?.year || ''} - ${pyqRef.pyqShift}`;
        }
        return (doc.meta?.exam ? `${doc.meta.exam} ${doc.meta.year || ''}` : doc.examSource);
    })(),
    isPYQ: doc.is_pyq || doc.isPYQ,
    isTopPYQ: doc.is_top_pyq || doc.isTopPYQ,
    questionType: doc.type || doc.questionType || 'SCQ',
    conceptTags: (doc.tags || doc.conceptTags || []).map((t: any) => ({
        tagId: t.tag_id || t.tagId,
        weight: t.weight
    })),
    tagId: doc.tag_id || doc.tagId,
    imageScale: doc.image_scale || doc.imageScale,
    solutionImageScale: doc.solution_image_scale || doc.solutionImageScale,
    sourceReferences: doc.source_references
});

// Helper to map Question (camelCase) -> DB Document (snake_case)
const mapQuestionToDoc = (q: QuestionPageType) => {
    // Priority: conceptTags (Rich) > tagId (Legacy/Simple)
    let tags: { tag_id: string; weight: number }[] = [];
    if (q.conceptTags && q.conceptTags.length > 0) {
        tags = q.conceptTags.map(t => ({ tag_id: t.tagId, weight: t.weight }));
    } else if (q.tagId) {
        tags = [{ tag_id: q.tagId, weight: 1.0 }];
    }

    return {
        _id: q.id,
        text_markdown: q.textMarkdown,
        type: q.questionType,
        options: q.options,
        integer_answer: q.integerAnswer,
        tags,
        meta: {
            difficulty: q.difficulty,
            // Extract exam name (e.g., "JEE Main" from "JEE Main 2026 - Jan 21 Morning Shift")
            exam: q.examSource?.match(/^([A-Za-z\s]+)\d/)?.[1]?.trim() || 'Other',
            // Extract year (e.g., 2026 from "JEE Main 2026 - Jan 21 Morning Shift")
            year: parseInt(q.examSource?.match(/(\d{4})/)?.[1] || '0') || undefined,
            avg_time_sec: 120
        },
        chapter_id: q.chapterId,
        is_pyq: q.isPYQ,
        is_top_pyq: q.isTopPYQ,
        exam_source: q.examSource,
        solution: {
            text_latex: q.solution.textSolutionLatex,
            video_url: q.solution.videoUrl,
            video_timestamp_start: q.solution.videoTimestampStart,
            audio_url: q.solution.audioExplanationUrl,
            image_url: q.solution.handwrittenSolutionImageUrl
        },
        tag_id: q.tagId,
        image_scale: q.imageScale,
        solution_image_scale: q.solutionImageScale,
        source_references: q.sourceReferences
    };
};

export async function getQuestions(): Promise<QuestionPageType[]> {
    try {
        await connectToDatabase();
        let docs = await QuestionModel.find({}).lean();

        // REMOVED: Auto-recovery on read is dangerous and can cause usage spikes.
        // if (!docs || docs.length === 0) {
        //    await syncSupabaseToMongo(); ...
        // }

        return (docs || []).map(mapDocToQuestion);
    } catch (error) {
        console.error("Failed to load questions from MongoDB:", error);
        return [];
    }
}

export async function saveQuestion(updatedQuestion: QuestionPageType): Promise<{ success: boolean; message: string }> {
    try {
        await connectToDatabase();
        const doc = mapQuestionToDoc(updatedQuestion);

        await QuestionModel.findOneAndUpdate(
            { _id: updatedQuestion.id },
            { $set: doc },
            { upsert: true, new: true }
        );

        return { success: true, message: 'Saved successfully to MongoDB Atlas' };
    } catch (error) {
        console.error("Failed to save question to MongoDB:", error);
        return { success: false, message: 'Failed to save to MongoDB' };
    }
}

export async function deleteQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    try {
        await connectToDatabase();

        // 1. Delete from MongoDB (Primary)
        const result = await QuestionModel.deleteOne({ _id: questionId });

        if (result.deletedCount === 0) {
            return { success: false, message: 'Question not found in MongoDB' };
        }

        // 2. Delete from Supabase (Secondary/Legacy) to prevent sync resurrection
        // We do this best-effort
        const { error: sbError } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);

        if (sbError) {
            console.warn("Deleted from Mongo but failed to delete from Supabase:", sbError);
        }

        return { success: true, message: 'Question deleted successfully' };
    } catch (error) {
        console.error("Failed to delete question:", error);
        return { success: false, message: 'Failed to delete question' };
    }
}

// --- Taxonomy Actions ---

export async function getTaxonomy(): Promise<TaxonomyNode[]> {
    try {
        await connectToDatabase();
        const docs = await TaxonomyModel.find({}).sort({ sequence_order: 1, name: 1 }).lean();

        return (docs || []).map((doc: any) => ({
            id: doc._id || doc.id,
            name: doc.name,
            parent_id: doc.parent_id,
            type: doc.type || (doc.parent_id ? 'topic' : 'chapter'),
            sequence_order: doc.sequence_order,
            class_level: doc.class_level,
            remedial_video_url: doc.remedial_video_url,
            remedial_notes_url: doc.remedial_notes_url,
        }));
    } catch (error) {
        console.error("Failed to load taxonomy from MongoDB:", error);
        return [];
    }
}

export async function saveTaxonomyNode(node: TaxonomyNode): Promise<{ success: boolean; message: string }> {
    try {
        await connectToDatabase();

        // Auto-detect type: nodes with parent_id are topics, nodes without are chapters
        const nodeType = node.type || (node.parent_id ? 'topic' : 'chapter');

        const doc: any = {
            _id: node.id,
            name: node.name,
            parent_id: node.parent_id,
            type: nodeType,
            sequence_order: node.sequence_order,
            class_level: node.class_level
        };

        // Include remedial fields if provided
        if (node.remedial_video_url !== undefined) {
            doc.remedial_video_url = node.remedial_video_url || null;
        }
        if (node.remedial_notes_url !== undefined) {
            doc.remedial_notes_url = node.remedial_notes_url || null;
        }

        await TaxonomyModel.findOneAndUpdate(
            { _id: node.id },
            { $set: doc },
            { upsert: true, new: true }
        );

        return { success: true, message: 'Taxonomy saved to MongoDB' };
    } catch (error) {
        console.error("Failed to save taxonomy node to MongoDB:", error);
        return { success: false, message: 'Failed to save taxonomy' };
    }
}

export async function deleteTaxonomyNode(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await connectToDatabase();
        await TaxonomyModel.deleteOne({ _id: id });
        return { success: true, message: 'Deleted from MongoDB' };
    } catch (error) {
        console.error("Failed to delete taxonomy node from MongoDB:", error);
        return { success: false, message: 'Failed to delete' };
    }
}
// --- Migration Utility ---

export async function syncSupabaseToMongo(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
        await connectToDatabase();

        // 1. Sync Questions
        const { data: sbQuestions, error: qError } = await supabase
            .from('questions')
            .select('*');

        if (qError) throw qError;

        if (sbQuestions && sbQuestions.length > 0) {

            const docs = sbQuestions.map(row => {
                // Use a modified version of mapQuestionToDoc logic since row is snake_case
                return {
                    _id: row.id,
                    text_markdown: row.text_markdown,
                    type: row.question_type || 'SCQ',
                    options: row.options,
                    integer_answer: row.integer_answer,
                    tags: (row.concept_tags || []).map((t: any) => ({
                        tag_id: t.tagId || t.tag_id,
                        weight: t.weight
                    })),
                    meta: {
                        difficulty: row.difficulty || 'Medium',
                        // Extract exam name (e.g., "JEE Main" from "JEE Main 2026 - Jan 21 Morning Shift")
                        exam: row.exam_source?.match(/^([A-Za-z\s]+)\d/)?.[1]?.trim() || 'Other',
                        year: parseInt(row.exam_source?.match(/(\d{4})/)?.[1] || '0') || undefined,
                        avg_time_sec: 120
                    },
                    chapter_id: row.chapter_id,
                    is_pyq: row.is_pyq,
                    is_top_pyq: row.is_top_pyq,
                    exam_source: row.exam_source, // Copy directly from Supabase - no transformation
                    solution: {
                        text_latex: row.solution?.textSolutionLatex || row.solution?.text_latex || "",
                        video_url: row.solution?.videoUrl || row.solution?.video_url,
                        video_timestamp_start: row.solution?.videoTimestampStart || row.solution?.video_timestamp_start,
                        audio_url: row.solution?.audioExplanationUrl || row.solution?.audio_url,
                        image_url: row.solution?.handwrittenSolutionImageUrl || row.solution?.image_url
                    },
                    tag_id: row.tag_id
                };
            });

            // Bulk upsert
            for (const doc of docs) {
                await QuestionModel.findOneAndUpdate(
                    { _id: doc._id },
                    { $set: doc },
                    { upsert: true }
                );
            }
        }

        // 2. Sync ALL Taxonomy nodes (chapters AND topics/tags)
        // First, delete all existing taxonomy to clean up any stale nodes
        await TaxonomyModel.deleteMany({});

        const { data: sbTaxonomy, error: tError } = await supabase
            .from('taxonomy')
            .select('*'); // Sync ALL nodes (chapters + topics/tags)

        if (tError) throw tError;

        if (sbTaxonomy && sbTaxonomy.length > 0) {
            for (const node of sbTaxonomy) {
                await TaxonomyModel.findOneAndUpdate(
                    { _id: node.id },
                    {
                        $set: {
                            _id: node.id,
                            name: node.name,
                            parent_id: node.parent_id,
                            type: node.type || 'chapter',
                            sequence_order: node.sequence_order,
                            class_level: node.class_level
                        }
                    },
                    { upsert: true }
                );
            }
        }

        return {
            success: true,
            message: `Successfully migrated ${sbQuestions?.length || 0} questions and ${sbTaxonomy?.length || 0} nodes.`,
            count: sbQuestions?.length
        };
    } catch (error) {
        console.error("Migration failed:", error);
        return { success: false, message: String(error) };
    }
}
