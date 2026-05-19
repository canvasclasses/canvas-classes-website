import { Metadata } from "next";
import NewHero from "./NewHero";
import BentoShowcase from "./BentoShowcase";
import VedicLearningSection from "./VedicLearningSection";
import StatsSection from "./StatsSection";
import PaarasSirSection from "./PaarasSirSection";
import FinalCTASection from "./FinalCTASection";

export const metadata: Metadata = {
    title: "Academics, Mindset & Life — under one Canvas | Canvas Classes",
    description: "From Class 9 to JEE. Interactive tools, adaptive practice, and lessons that go beyond textbooks — built by Paaras Sir.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            <NewHero />
            <BentoShowcase />
            <VedicLearningSection />
            <StatsSection />
            <PaarasSirSection />
            <FinalCTASection />
        </main>
    );
}