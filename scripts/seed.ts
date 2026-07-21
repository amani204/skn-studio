import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Explicit interface to prevent TypeScript union inference bugs
interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  categorySlug: string;
  images: string[];
}

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== ADMIN ====================
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sknstudio.dz";
  const adminPassword = process.env.ADMIN_PASSWORD_PLAIN || "admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log("✅ Admin created");

  // ==================== CATEGORIES ====================
  const categories = [
    { name: "Sérums", slug: "serums" },
    { name: "Nettoyants", slug: "cleansers" },
    { name: "Crèmes", slug: "creams" },
    { name: "Huiles", slug: "oils" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    createdCategories.push(created);
    console.log(`✅ Category: ${cat.name}`);
  }

  // ==================== PRODUCTS ====================
  const products: SeedProduct[] = [
    {
      name: "Le Sérum Barrière",
      slug: "barrier-serum",
      description:
        "Calme les rougeurs et renforce la barrière cutanée. Formulé avec 5 ingrédients actifs pour une peau apaisée en 14 jours.",
      price: 8000,
      oldPrice: 9500,
      stock: 25,
      categorySlug: "serums",
      images: [],
    },
    {
      name: "Nettoyant Nuage",
      slug: "cloud-cleanser",
      description:
        "Un nettoyant gel-lait qui n'agresse jamais. Dissout les impuretés tout en respectant le film hydrolipidique de la peau.",
      price: 4500,
      oldPrice: null,
      stock: 30,
      categorySlug: "cleansers",
      images: [],
    },
    {
      name: "Crème Barrière Quotidienne",
      slug: "daily-barrier-cream",
      description:
        "Une hydratation légère qui dure toute la journée. Idéale pour renforcer la barrière cutanée au quotidien.",
      price: 6200,
      oldPrice: 7200,
      stock: 20,
      categorySlug: "creams",
      images: [],
    },
    {
      name: "Huile de Renouveau Nocturne",
      slug: "overnight-renewal-oil",
      description:
        "Un mélange nourrissant d'huiles végétales qui répare et régénère la peau pendant votre sommeil.",
      price: 8800,
      oldPrice: null,
      stock: 15,
      categorySlug: "oils",
      images: [],
    },
  ];

  for (const productData of products) {
    const category = createdCategories.find(
      (c) => c.slug === productData.categorySlug
    );

    if (!category) {
      console.error(`❌ Category not found: ${productData.categorySlug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        oldPrice: productData.oldPrice,
        stock: productData.stock,
        categoryId: category.id,
        isPublished: true,
      },
      create: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        oldPrice: productData.oldPrice,
        stock: productData.stock,
        categoryId: category.id,
        isPublished: true,
        images: {
          create: productData.images.map((url, index) => ({
            url,
            order: index,
            alt: productData.name,
          })),
        },
      },
    });

    console.log(`✅ Product: ${product.name}`);
  }

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });