import Hero from "@/components/storefront/home/Hero";
import Marquee from "@/components/storefront/home/Marquee";
import ProductGrid from "@/components/storefront/home/ProductGrid";
import BrandStatement from "@/components/storefront/home/BrandStatement";
import AboutPillars from "@/components/storefront/home/AboutPillars";
import Testimonials from "@/components/storefront/home/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <ProductGrid />
      <BrandStatement />
      <AboutPillars />
      <Testimonials />
    </main>
  );
}
