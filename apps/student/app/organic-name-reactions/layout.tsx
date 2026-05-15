import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Organic Name Reactions for JEE & NEET Chemistry",
    description:
        "Complete list of all important organic name reactions from NCERT with mechanisms, key details, and handwritten images. Master Cannizzaro, Aldol, Sandmeyer reactions.",
    keywords: [
        "organic name reactions",
        "JEE organic chemistry",
        "NEET reactions",
        "NCERT chemistry",
    ],
};

export default function OrganicReactionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
