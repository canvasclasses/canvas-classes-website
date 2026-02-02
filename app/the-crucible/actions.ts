'use server';

import fs from 'fs/promises';
import path from 'path';
import { Question } from './types';

const DB_PATH = path.join(process.cwd(), 'app/the-crucible/questions.json');

export async function getQuestions(): Promise<Question[]> {
    try {
        // Create file if not exists (init with empty array)
        try {
            await fs.access(DB_PATH);
        } catch {
            await fs.writeFile(DB_PATH, '[]', 'utf-8');
            return [];
        }

        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to load questions:", error);
        return [];
    }
}

export async function saveQuestion(updatedQuestion: Question): Promise<{ success: boolean; message: string }> {
    try {
        const questions = await getQuestions();
        const index = questions.findIndex(q => q.id === updatedQuestion.id);

        if (index !== -1) {
            questions[index] = updatedQuestion;
        } else {
            questions.push(updatedQuestion);
        }

        await fs.writeFile(DB_PATH, JSON.stringify(questions, null, 2));
        return { success: true, message: 'Saved successfully' };
    } catch (error) {
        console.error("Failed to save question:", error);
        return { success: false, message: 'Failed to save' };
    }
}

export async function deleteQuestion(questionId: string): Promise<void> {
    const questions = await getQuestions();
    const filtered = questions.filter(q => q.id !== questionId);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}
