import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quick Chemistry Recap Videos",
    description:
        "Watch quick chemistry recap videos covering important topics for JEE, NEET, and CBSE exams. Fast revision in bite-sized videos.",
    keywords: [
        "chemistry recap",
        "quick revision chemistry",
        "short chemistry videos",
        "JEE NEET revision",
    ],
};

export default function QuickRecapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
