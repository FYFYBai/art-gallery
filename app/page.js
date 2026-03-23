import Hero from "@/components/hero/Hero";
import CuratorFavoritesSection from "@/components/home/curator-favorites/CuratorFavoritesSection";
import WhyOriginalSection from "@/components/home/why-original/WhyOriginalSection";
import CuratedExperienceSection from "@/components/home/curated-experience/CuratedExperienceSection";
import DisplaySample from "@/components/home/display-sample/DisplaySample";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DisplaySample />
      <WhyOriginalSection />
      <CuratorFavoritesSection />
      <CuratedExperienceSection />
    </main>
  );
}
