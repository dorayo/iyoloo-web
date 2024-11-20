import Navigation from "./_components/layout/Navigation"
import HeroSection from "./_components/home/HeroSection"
import ValuesSection from "./_components/home/ValuesSection";
import ElitePortraitsSection from "./_components/home/ElitePortraitsSection";
import FeaturesSection from "./_components/home/FeaturesSection";
import MembershipBenefitsSection from "./_components/home/MembershipBenefitsSection";
import SecuritySection from "./_components/home/SecuritySection";
import CTASection from "./_components/home/CTASection";
import Footer from "./_components/layout/Footer"
import PhilosophySection from "./_components/home/PhilosophySection";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <PhilosophySection />
      <ValuesSection />
      <ElitePortraitsSection />
      <FeaturesSection />
      <MembershipBenefitsSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  );
}