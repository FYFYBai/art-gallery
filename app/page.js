import Hero from "@/components/hero/Hero";
import ShopCategorySection from "@/components/home/shop-category/ShopCategorySection";
import CuratorFavoritesSection from "@/components/home/curator-favorites/CuratorFavoritesSection";
import WhyOriginalSection from "@/components/home/why-original/WhyOriginalSection";
import WhyShopSection from "@/components/home/why-shop/WhyShopSection";
import FeaturedRowsSection from "@/components/home/featured-rows/FeaturedRowsSection";
import CuratedExperienceSection from "@/components/home/curated-experience/CuratedExperienceSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ShopCategorySection />
      <WhyOriginalSection />
      <CuratorFavoritesSection />
      <WhyShopSection />
      <FeaturedRowsSection />
      <CuratedExperienceSection />
    </main>
  );
}
