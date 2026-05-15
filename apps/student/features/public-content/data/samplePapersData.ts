export interface SamplePaper {
    id: string;
    title: string;
    subject: 'Chemistry' | 'Physics' | 'Maths' | 'Biology';
    year: string;
    pdfUrl: string;
    solutionUrl?: string;
}

// Simulated data to start with. Replace with fetch logic if CSV is provided later.
const samplePapers: SamplePaper[] = [
    {
        id: '1',
        title: 'CBSE Class 12 Chemistry Sample Paper 2024-25',
        subject: 'Chemistry',
        year: '2024-25',
        pdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2024_25/Chemistry-SQP.pdf',
        solutionUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2024_25/Chemistry-MS.pdf'
    },
    {
        id: '2',
        title: 'CBSE Class 12 Chemistry Sample Paper 2023-24',
        subject: 'Chemistry',
        year: '2023-24',
        pdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Chemistry-SQP.pdf',
        solutionUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Chemistry-MS.pdf'
    },
    {
        id: '3',
        title: 'CBSE Class 12 Physics Sample Paper 2024-25',
        subject: 'Physics',
        year: '2024-25',
        pdfUrl: '#',
    },
    {
        id: '4',
        title: 'CBSE Class 12 Maths Sample Paper 2024-25',
        subject: 'Maths',
        year: '2024-25',
        pdfUrl: '#',
    }
];

export async function fetchSamplePapers(): Promise<SamplePaper[]> {
    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => resolve(samplePapers), 500));
}
