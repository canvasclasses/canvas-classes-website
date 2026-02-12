import { Metadata } from "next";
import NewHero from "../components/NewHero";
import OfferingsSection from "../components/OfferingsSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import StudentTestimonialCards from "../components/StudentTestimonialCards";
import FAQSection from "../components/FAQSection";
import { MoveRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Join the Revolution in Chemistry Education | Canvas Classes",
    description: "Experience a new way of learning Chemistry with Paaras Sir. From foundation to advanced JEE/NEET concepts, explore our comprehensive free resources.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            {/* Hero Section - The Primary Hook */}
            <NewHero />

            {/* Offerings Section - Breadth of Free Content */}
            <OfferingsSection />

            {/* Why Choose Us - Mission & Quality Assurance */}
            <WhyChooseUsSection />

            {/* Targeted Learning Paths - JEE & NEET Goals */}
            <StudentTestimonialCards />

            {/* FAQ Section - Addressing Common Queries */}
            <FAQSection />

            {/* Final Call to Action - Conversion Point */}
            <section className="relative py-24 bg-slate-950 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-16 border border-white/10 bg-slate-900/40 backdrop-blur-xl text-center shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm font-semibold uppercase tracking-wider">Ready to Start?</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Mastery</span> Starts Here
                        </h2>

                        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                            Don't let chemistry be the reason you miss your dream college. Join 1M+ students learning the right way, for free.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/detailed-lectures" className="w-full sm:w-auto">
                                <button className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 group">
                                    Explore All Lectures
                                    <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/handwritten-notes" className="w-full sm:w-auto">
                                <button className="w-full cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all active:scale-95">
                                    Download Notes
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}