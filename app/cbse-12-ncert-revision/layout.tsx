import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CBSE Class 12 Chemistry NCERT Revision Notes",
    description:
        "Chapter-wise NCERT revision notes for Class 12 Chemistry with summaries, formulas, graphs, common mistakes, flashcards, and infographics for CBSE boards.",
    keywords: [
        "CBSE chemistry revision",
        "Class 12 NCERT notes",
        "chemistry flashcards",
        "board exam preparation",
    ],
};

export default function CBSERevisionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
