
export interface JEEQuestion {
    id: string;
    chapterId: string;
    questionNumber: number; // For ordering within the chapter (1-25)
    
    // Metadata
    year: number;
    session?: string; // e.g., "Jan 27 Shift 1"
    difficulty: 'Easy' | 'Medium' | 'Hard';
    concept: string; // e.g., "Raoult's Law", "Colligative Properties"
    tags: string[]; // e.g., ["Top 25", "Calculation Intensive", "Tricky"]
    
    // Content
    questionText: string;
    hasImage: boolean; // Expects /jee-pyqs/images/{id}.webp
    
    // Multiple Choice Options
    options: {
        id: 'A' | 'B' | 'C' | 'D';
        text?: string;
        hasImage?: boolean; // Expects /jee-pyqs/images/{id}_{optionId}.webp
    }[];
    
    correctOption: 'A' | 'B' | 'C' | 'D';
    
    // Solutions
    videoSolutionUrl?: string; // YouTube ID or Full URL
    textSolution?: string;     // Markdown/LaTeX supported
}

export const JEE_CHAPTERS = [
    { id: 'solutions', name: 'Solutions', category: 'Physical' },
    { id: 'electrochemistry', name: 'Electrochemistry', category: 'Physical' },
    { id: 'chemical-kinetics', name: 'Chemical Kinetics', category: 'Physical' },
    // Add more as needed
] as const;

// SAMPLE DATA - Can be moved to separate files per chapter later if it grows too large
export const JEE_QUESTIONS: JEEQuestion[] = [
    {
        id: 'SOL_JP_01',
        chapterId: 'solutions',
        questionNumber: 1,
        year: 2024,
        session: 'Jan 27 Shift 1',
        difficulty: 'Medium',
        concept: "Raoult's Law",
        tags: ['Top 25', 'Important'],
        questionText: "A solution is prepared by mixing 20g of component A and 30g of component B. If the vapor pressure of pure A is 200 mmHg and pure B is 100 mmHg, what is the mole fraction of A in the vapor phase? (Molar mass A = 20, B = 30)",
        hasImage: false,
        options: [
            { id: 'A', text: "0.50" },
            { id: 'B', text: "0.67" },
            { id: 'C', text: "0.33" },
            { id: 'D', text: "0.25" }
        ],
        correctOption: 'B',
        videoSolutionUrl: 'https://youtu.be/example1',
        textSolution: "Calculate moles of A and B first. Then use Raoult's law to find partial pressures (P_A and P_B). Finally, Y_A = P_A / P_Total."
    },
    // Add more questions here
];

// DATA ACCESS UTILITIES

export function getQuestionsByChapter(chapterId: string) {
    return JEE_QUESTIONS
        .filter(q => q.chapterId === chapterId)
        .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getAllChapters() {
    return JEE_CHAPTERS;
}

export function getQuestionById(id: string) {
    return JEE_QUESTIONS.find(q => q.id === id);
}
