import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chemistry Video Lectures for JEE & NEET",
    description:
        "Free in-depth chemistry video lectures covering complete CBSE, JEE & NEET syllabus. Learn organic, inorganic, and physical chemistry from basics to advanced.",
    keywords: [
        "chemistry video lectures",
        "JEE chemistry",
        "NEET chemistry",
        "free chemistry coaching",
    ],
};

export default function LecturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
