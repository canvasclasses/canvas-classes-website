import { fetchOrganicReactions } from './organicReactionsData';
import { fetchTop50Data } from './top50Data';
import { fetch2MinData } from './twoMinData';
import { fetchLecturesData } from './lecturesData';

export type SearchItem = {
    id: string;
    title: string;
    subtitle: string;
    category: 'Tools' | 'Reactions' | 'Concepts' | 'Videos' | 'Chapters' | 'General' | 'Lectures';
    url: string;
    keywords?: string[];
    icon?: string;
};

export async function getSearchItems(): Promise<SearchItem[]> {
    try {
        // Fetch all dynamic data concurrently
        const [reactions, top50, shortVideos, chapters] = await Promise.all([
            fetchOrganicReactions(),
            fetchTop50Data(),
            fetch2MinData(),
            fetchLecturesData(),
        ]);

        // Transform Organic Reactions
        const reactionItems: SearchItem[] = reactions.map(r => ({
            id: `reaction-${r.id}`,
            title: r.reactionName,
            subtitle: `Organic Name Reaction (Class ${r.classNum})`,
            category: 'Reactions',
            url: `/organic-name-reactions?id=${r.id}`,
            keywords: [r.reactionType, r.difficulty, 'mechanism', 'organic']
        }));

        // Transform Top 50 Concepts
        const conceptItems: SearchItem[] = top50.map(c => ({
            id: `concept-${c.id}`,
            title: c.title,
            subtitle: `Top 50 Concept #${c.videoNumber} (${c.category})`,
            category: 'Concepts',
            url: `/top-50-concepts?id=${c.id}`,
            keywords: [c.category, 'important', 'jee', 'neet']
        }));

        // Transform 2 Minute Chemistry
        const videoItems: SearchItem[] = shortVideos.map(v => ({
            id: `2min-${v.id}`,
            title: v.title,
            subtitle: `2 Min Chemistry (${v.duration})`,
            category: 'Videos',
            url: `/2-minute-chemistry?id=${v.id}`,
            keywords: [v.category, 'quick', 'revision']
        }));

        // Transform Lecture Chapters
        const chapterItems: SearchItem[] = chapters.map(c => ({
            id: `chapter-${c.slug}`,
            title: c.name,
            subtitle: `Class ${c.class} Lecture Series`,
            category: 'Chapters',
            url: `/detailed-lectures/${c.slug}`,
            keywords: ['chapter', 'detailed', 'notes', ...c.keyTopics]
        }));

        // Detailed Lectures (The Chapter Hub)
        const detailedItems: SearchItem[] = chapters.map(c => ({
            id: `detailed-${c.slug}`,
            title: `${c.name}`,
            subtitle: `Detailed Lectures (Class ${c.class})`,
            category: 'Lectures',
            url: `/detailed-lectures/${c.slug}`,
            keywords: ['chapter', 'detailed', 'video', ...c.keyTopics]
        }));

        // One Shot Lectures (Inferred)
        const oneShotItems: SearchItem[] = chapters.map(c => ({
            id: `oneshot-${c.slug}`,
            title: `${c.name} (One Shot)`,
            subtitle: `Quick Revision`,
            category: 'Videos',
            url: `/one-shot-lectures?chapter=${c.slug}`,
            keywords: ['one shot', 'summary', 'revision', c.name]
        }));

        // Flashcards (Deep Link)
        const flashcardItems: SearchItem[] = chapters.map(c => ({
            id: `flashcard-${c.slug}`,
            title: `${c.name} Flashcards`,
            subtitle: `Practice Key Concepts`,
            category: 'Concepts',
            url: `/chemistry-flashcards/${c.slug}`,
            keywords: ['flashcards', 'cards', 'revision', c.name]
        }));

        // Notes (Check if link exists)
        const noteItems: SearchItem[] = chapters
            .filter(c => c.notesLink)
            .map(c => ({
                id: `note-${c.slug}`,
                title: `${c.name} Notes`,
                subtitle: `Download PDF`,
                category: 'General',
                url: c.notesLink,
                keywords: ['notes', 'pdf', 'handwritten', c.name]
            }));

        // Assertion Reason (Generic for now)
        const assertionItems: SearchItem[] = chapters.map(c => ({
            id: `assertion-${c.slug}`,
            title: `${c.name} A&R`,
            subtitle: `Assertion & Reason Qs`,
            category: 'Reactions',
            url: `/assertion-reason`,
            keywords: ['test', 'quiz', 'assertion', 'reason', c.name]
        }));

        // Combine all items
        return [
            ...reactionItems,
            ...detailedItems,
            ...oneShotItems,
            ...flashcardItems,
            ...noteItems,
            ...assertionItems,
            ...conceptItems,
            ...videoItems,
            ...chapterItems, // Include generic chapter items too if distinct
        ];
    } catch (error) {
        console.error('Error getting search items:', error);
        return [];
    }
}
