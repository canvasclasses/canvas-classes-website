import { Metadata } from "next";
import Hero from "./components/Hero";
import StudentTestimonialCards from "./components/StudentTestimonialCards";
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
      <StudentTestimonialCards />
      <MyNotesSection />
      <NCERTBoardsSection />
    </main>
  );
}
