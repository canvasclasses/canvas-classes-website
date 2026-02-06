import { Metadata } from "next";
import HandwrittenNotesClient from "./HandwrittenNotesClient";
import { fetchHandwrittenNotes } from "../lib/handwrittenNotesData";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Handwritten Notes for JEE, NEET & CBSE Chemistry",
    description:
        "Download free handwritten chemistry notes by Paaras Sir. Includes highlighted NCERTs, revision sheets, and personal notes for Organic, Inorganic, and Physical Chemistry.",
    keywords: [
        "handwritten chemistry notes",
        "JEE notes download",
        "NEET chemistry notes",
        "CBSE chemistry PDF",
        "highlighted NCERT",
        "free chemistry notes",
    ],
    openGraph: {
        title: "Handwritten Notes for JEE, NEET & CBSE Chemistry",
        description:
            "Download free handwritten chemistry notes by Paaras Sir for JEE, NEET & CBSE.",
        type: "website",
    },
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function HandwrittenNotesPage() {
    const notes = await fetchHandwrittenNotes();
    return <HandwrittenNotesClient initialNotes={notes} />;
}
