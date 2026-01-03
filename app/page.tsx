import { Metadata } from "next";
import Hero from "./components/Hero";
import OfferingsSection from "./components/OfferingsSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import NCERTSection from "./components/NCERTSection";

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
      <OfferingsSection />
      <WhyChooseUsSection />
      <NCERTSection />
    </main>
  );
}
