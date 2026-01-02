import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OfferingsSection from "./components/OfferingsSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import NCERTSection from "./components/NCERTSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <OfferingsSection />
      <WhyChooseUsSection />
      <NCERTSection />
    </main>
  );
}
