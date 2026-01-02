export interface RevisionChapter {
    id: number;
    title: string;
    branch: 'Physical' | 'Inorganic' | 'Organic';
    infographicsCount: number;
    flashcardsCount: number;
    slug: string;
    topicsCount: number;
}

export const revisionChapters: RevisionChapter[] = [
    {
        id: 1,
        title: "Solutions",
        branch: "Physical",
        infographicsCount: 13,
        flashcardsCount: 56,
        slug: "solutions",
        topicsCount: 13
    },
    {
        id: 2,
        title: "Electrochemistry",
        branch: "Physical",
        infographicsCount: 14,
        flashcardsCount: 42,
        slug: "electrochemistry",
        topicsCount: 14
    },
    {
        id: 3,
        title: "Chemical Kinetics",
        branch: "Physical",
        infographicsCount: 9,
        flashcardsCount: 48,
        slug: "chemical-kinetics",
        topicsCount: 9
    },
    {
        id: 4,
        title: "d- and f- Block Elements",
        branch: "Inorganic",
        infographicsCount: 7,
        flashcardsCount: 35,
        slug: "d-and-f-block-elements",
        topicsCount: 7
    },
    {
        id: 5,
        title: "Coordination Compounds",
        branch: "Inorganic",
        infographicsCount: 8,
        flashcardsCount: 40,
        slug: "coordination-compounds",
        topicsCount: 8
    },
    {
        id: 6,
        title: "Haloalkanes and Haloarenes",
        branch: "Organic",
        infographicsCount: 10,
        flashcardsCount: 0,
        slug: "haloalkanes-and-haloarenes",
        topicsCount: 10
    },
    {
        id: 7,
        title: "Alcohols, Phenols and Ethers",
        branch: "Organic",
        infographicsCount: 12,
        flashcardsCount: 0,
        slug: "alcohols-phenols-and-ethers",
        topicsCount: 12
    },
    {
        id: 8,
        title: "Aldehydes, Ketones and Carboxylic Acids",
        branch: "Organic",
        infographicsCount: 15,
        flashcardsCount: 0,
        slug: "aldehydes-ketones-and-carboxylic-acids",
        topicsCount: 15
    },
    {
        id: 9,
        title: "Amines",
        branch: "Organic",
        infographicsCount: 8,
        flashcardsCount: 0,
        slug: "amines",
        topicsCount: 8
    },
    {
        id: 10,
        title: "Biomolecules",
        branch: "Organic",
        infographicsCount: 7,
        flashcardsCount: 0,
        slug: "biomolecules",
        topicsCount: 7
    },
    {
        id: 11,
        title: "Complete Revision",
        branch: "Physical",
        infographicsCount: 3,
        flashcardsCount: 0,
        slug: "complete-revision",
        topicsCount: 3
    }
];

export async function getRevisionChapters(): Promise<RevisionChapter[]> {
    // Simulate API delay if needed, or just return data
    return revisionChapters;
}
