import Hero from "@/components/storefront/home/Hero";
import ProductGrid from "@/components/storefront/home/ProductGrid";
import BrandStatement from "@/components/storefront/home/BrandStatement";
import AboutPillars from "@/components/storefront/home/AboutPillars";
import Testimonials from "@/components/storefront/home/Testimonials";
import ShippingInfo from "@/components/storefront/home/ShippingInfo";
import Contact from "@/components/storefront/home/Contact";


export default function Home() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <BrandStatement />
      <AboutPillars />
      <Testimonials />
      <ShippingInfo />
      <Contact/>
    </main>
  );
}
