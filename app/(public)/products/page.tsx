
import { getShopData } from "@/lib/products";
import ShopPageClient from "@/components/storefront/products/ShopPageClient";

export const metadata = {
  title: "Boutique | SKN Studio",
  description: "Découvrez nos soins de la peau formulés avec des ingrédients actifs.",
};

export default async function ShopPage() {
  const { products, categories } = await getShopData();

  return (
    <ShopPageClient
      products={products}
      categories={categories}
    />
  );
}
