import { Metadata } from "next";

export const metadata: Metadata = {
    title: "2 Minute Chemistry Tips & Tricks",
    description:
        "Learn chemistry concepts in just 2 minutes! Quick tips, tricks, and shortcuts for JEE, NEET, and CBSE Chemistry exams.",
    keywords: [
        "2 minute chemistry",
        "chemistry tips",
        "quick chemistry tricks",
        "JEE shortcuts",
    ],
};

export default function TwoMinChemistryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
