import Hero from "@/components/storefront/home/Hero";
import ProductGrid from "@/components/storefront/home/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";
import BrandStatement from "@/components/storefront/home/BrandStatement";
import AboutPillars from "@/components/storefront/home/AboutPillars";
import Testimonials from "@/components/storefront/home/Testimonials";
import ShippingInfo from "@/components/storefront/home/ShippingInfo";
import Contact from "@/components/storefront/home/Contact";


export default async  function Home() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <main>
      <Hero />
      <ProductGrid products={featuredProducts} />
      <BrandStatement />
      <AboutPillars />
      <Testimonials />
      <ShippingInfo />
      <Contact/>
    </main>
  );
}
