import Navigation from "./_components/layout/Navigation"
import HeroSection from "./_components/home/HeroSection"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      <HeroSection />
    </main>
  );
}