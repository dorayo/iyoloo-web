import Navigation from "./_components/layout/Navigation"
import HeroSection from "./_components/home/HeroSection"
import ValuesSection from "./_components/home/ValuesSection";
import TargetUsersSection from "./_components/home/TargetUsersSection";
import FeaturesSection from "./_components/home/FeaturesSection";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      <HeroSection />
      <ValuesSection />
      <TargetUsersSection />
      <FeaturesSection />
    </main>
  );
}