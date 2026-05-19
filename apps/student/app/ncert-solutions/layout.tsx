import { Metadata } from "next";

export const metadata: Metadata = {
    title: "NCERT Solutions Chemistry - Class 11 & 12",
    description:
        "Complete NCERT Solutions for Chemistry Class 11 and 12 with step-by-step detailed explanations, diagrams, and formulas. Free access to all chapter solutions.",
    keywords: [
        "NCERT solutions chemistry",
        "Class 11 chemistry solutions",
        "Class 12 chemistry solutions",
        "CBSE chemistry answers",
    ],
};

export default function NCERTSolutionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
