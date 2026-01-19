import { Metadata } from "next";
import Hero from "./components/Hero";
import PeriodicTablePreview from "./components/PeriodicTablePreview";
import PeriodicTrendsTeaser from "./components/PeriodicTrendsTeaser";
import PathfinderQuiz from "./components/PathfinderQuiz";
import MyNotesSection from "./components/MyNotesSection";
import NCERTBoardsSection from "./components/NCERTBoardsSection";

export const metadata: Metadata = {
  title: "Canvas Classes - Free JEE & NEET Chemistry Preparation",
  description:
    "Master Chemistry for JEE, NEET & CBSE with free video lectures, handwritten notes, NCERT solutions, flashcards, and practice materials by Paaras Sir.",
  keywords: [
    "JEE Chemistry",
    "NEET Chemistry",
    "Free chemistry coaching",
    "Paaras Sir",
    "Canvas Classes",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <PeriodicTablePreview />
      <PeriodicTrendsTeaser />
      <PathfinderQuiz />
      <NCERTBoardsSection />
    </main>
  );
}

