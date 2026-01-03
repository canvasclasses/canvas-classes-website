import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chemistry Sample Papers for CBSE Board Exams",
    description:
        "Download free sample papers for CBSE Chemistry board exams. Practice with previous year question papers and solved examples.",
    keywords: [
        "chemistry sample papers",
        "CBSE sample papers",
        "board exam practice",
        "chemistry question papers",
    ],
};

export default function SamplePapersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
