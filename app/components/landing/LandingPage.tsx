import { Metadata } from "next";
import NewHero from "./NewHero";
import FeaturesBento from "./FeaturesBento";
import PainSection from "./PainSection";
import MethodSection from "./MethodSection";
import ComparisonSection from "./ComparisonSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import PaarasSirSection from "./PaarasSirSection";
import FinalCTASection from "./FinalCTASection";

export const metadata: Metadata = {
    title: "Join the Revolution in Chemistry Education | Canvas Classes",
    description: "Experience a new way of learning Chemistry with Paaras Sir. From foundation to advanced JEE/NEET concepts, explore our comprehensive free resources.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            {/* Hero Section - Clean hook with headline, search, tags */}
            <NewHero />

            {/* Pain Section - Acknowledge student struggles */}
            <PainSection />

            {/* Method Section - How Canvas approach is different */}
            {/* <MethodSection /> */}

            {/* Features Bento Grid - The arsenal */}
            <FeaturesBento />

            {/* Comparison - Before vs After Canvas */}
            <ComparisonSection />

            {/* Stats - Quantifiable social proof */}
            <StatsSection />

            {/* Testimonials - Qualitative social proof */}
            {/* <TestimonialsSection /> */}

            {/* Paaras Sir - Mentor credibility */}
            <PaarasSirSection />

            {/* Final CTA - Urgency & action */}
            <FinalCTASection />
        </main>
    );
}