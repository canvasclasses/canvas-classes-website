import { Metadata } from "next";
import NewHero from "../components/NewHero";
import FeaturesBento from "../components/FeaturesBento";
import PainSection from "../components/landing/PainSection";
import MethodSection from "../components/landing/MethodSection";
import ComparisonSection from "../components/landing/ComparisonSection";
import SocialProofSection from "../components/landing/SocialProofSection";
import PaarasSirSection from "../components/landing/PaarasSirSection";
import FinalCTASection from "../components/landing/FinalCTASection";

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
            <MethodSection />

            {/* Features Bento Grid - The arsenal */}
            <FeaturesBento />

            {/* Comparison - Before vs After Canvas */}
            <ComparisonSection />

            {/* Social Proof - Stats & testimonials */}
            <SocialProofSection />

            {/* Paaras Sir - Mentor credibility */}
            <PaarasSirSection />

            {/* Final CTA - Urgency & action */}
            <FinalCTASection />
        </main>
    );
}