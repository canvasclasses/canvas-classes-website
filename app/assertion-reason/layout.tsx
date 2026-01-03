import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Assertion & Reason Practice - JEE Chemistry",
    description:
        "Practice Assertion and Reason questions for JEE & NEET Chemistry with our gamified Circuit Breaker system. Master the 3-step decision flow for A&R questions.",
    keywords: [
        "assertion reason chemistry",
        "JEE assertion reason",
        "NEET A&R questions",
        "chemistry practice",
    ],
};

export default function AssertionReasonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
