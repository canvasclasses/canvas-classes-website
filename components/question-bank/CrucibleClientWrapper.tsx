'use client';

import CrucibleUnified from './CrucibleUnified';

// Using old Question type for student app compatibility
interface Question {
    id: string;
    textMarkdown: string;
    chapterId?: string;
    difficulty?: string;
    examSource?: string;
    isTopPYQ?: boolean;
    [key: string]: any;
}

interface TaxonomyNode {
    id: string;
    name: string;
    type: string;
    [key: string]: any;
}

interface CrucibleClientWrapperProps {
    initialQuestions: Question[];
    taxonomy: TaxonomyNode[];
}

export default function CrucibleClientWrapper({ initialQuestions, taxonomy }: CrucibleClientWrapperProps) {
    return (
        <CrucibleUnified 
            initialQuestions={initialQuestions} 
            taxonomy={taxonomy}
        />
    );
}
