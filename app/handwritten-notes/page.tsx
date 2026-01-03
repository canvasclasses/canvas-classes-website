import { Metadata } from "next";
import HandwrittenNotesClient from "./HandwrittenNotesClient";

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

export default function HandwrittenNotesPage() {
    return <HandwrittenNotesClient />;
}
