import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Top 50 Chemistry Concepts for JEE & NEET",
    description:
        "Master the top 50 most important chemistry concepts for JEE and NEET exams. High-yield topics with quick explanations and key formulas.",
    keywords: [
        "top 50 chemistry concepts",
        "important chemistry topics",
        "JEE chemistry",
        "NEET chemistry",
    ],
};

export default function Top50Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
