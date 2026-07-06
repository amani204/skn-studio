export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number; // DA
  oldPrice?: number; // DA — present when the product is on sale
  stock: number; // 0 = sold out
  categorySlug: string;
  description: string;
  images: [string, string]; // [front, hover]
};

export type Category = {
  slug: string;
  name: string;
};

export const CATEGORIES: Category[] = [
  { slug: "all", name: "All" },
  { slug: "serums", name: "Serums" },
  { slug: "cleansers", name: "Cleansers" },
  { slug: "moisturizers", name: "Moisturizers" },
  { slug: "oils", name: "Oils" },
];

// Swap this out for a real fetch (e.g. `prisma.product.findMany(...)`
// via an API route) once the backend is wired up — the shape already
// matches what that query would return.
export const PRODUCTS: Product[] = [
  {
    id: "barrier-serum",
    name: "The Barrier Serum",
    slug: "barrier-serum",
    price: 8000,
    stock: 12,
    categorySlug: "serums",
    description: "Calms redness and strengthens the skin barrier.",
    images: ["/products/serum-front.jpg", "/products/serum-texture.jpg"],
  },
  {
    id: "vitamin-c-serum",
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-serum",
    price: 7200,
    stock: 0,
    categorySlug: "serums",
    description: "Evens tone and softens the look of dark spots.",
    images: ["/products/vitamin-c-front.jpg", "/products/vitamin-c-texture.jpg"],
  },
  {
    id: "hyaluronic-serum",
    name: "Hyaluronic Boost Serum",
    slug: "hyaluronic-serum",
    price: 6800,
    stock: 20,
    categorySlug: "serums",
    description: "Multi-weight hyaluronic acid for lasting hydration.",
    images: ["/products/hyaluronic-front.jpg", "/products/hyaluronic-texture.jpg"],
  },
  {
    id: "eye-contour-serum",
    name: "Eye Contour Serum",
    slug: "eye-contour-serum",
    price: 5400,
    oldPrice: 6200,
    stock: 7,
    categorySlug: "serums",
    description: "Lightweight formula for the eye area, morning or night.",
    images: ["/products/eye-serum-front.jpg", "/products/eye-serum-texture.jpg"],
  },
  {
    id: "cloud-cleanser",
    name: "Cloud Cleanser",
    slug: "cloud-cleanser",
    price: 4500,
    stock: 30,
    categorySlug: "cleansers",
    description: "A gel-to-milk cleanser that never strips.",
    images: ["/products/cleanser-front.jpg", "/products/cleanser-texture.jpg"],
  },
  {
    id: "micellar-cleanser",
    name: "Micellar Milk Cleanser",
    slug: "micellar-cleanser",
    price: 3900,
    stock: 0,
    categorySlug: "cleansers",
    description: "Lifts makeup and impurities without a rinse.",
    images: ["/products/micellar-front.jpg", "/products/micellar-texture.jpg"],
  },
  {
    id: "charcoal-cleanser",
    name: "Charcoal Detox Cleanser",
    slug: "charcoal-cleanser",
    price: 4200,
    stock: 15,
    categorySlug: "cleansers",
    description: "Deep-cleans pores without disturbing the skin barrier.",
    images: ["/products/charcoal-front.jpg", "/products/charcoal-texture.jpg"],
  },
  {
    id: "daily-barrier-cream",
    name: "Daily Barrier Cream",
    slug: "daily-barrier-cream",
    price: 6200,
    stock: 18,
    categorySlug: "moisturizers",
    description: "Lightweight hydration that lasts all day.",
    images: ["/products/cream-front.jpg", "/products/cream-texture.jpg"],
  },
  {
    id: "overnight-renewal-cream",
    name: "Overnight Renewal Cream",
    slug: "overnight-renewal-cream",
    price: 7400,
    stock: 10,
    categorySlug: "moisturizers",
    description: "Richer texture for repair while you sleep.",
    images: ["/products/renewal-cream-front.jpg", "/products/renewal-cream-texture.jpg"],
  },
  {
    id: "gel-moisturizer",
    name: "Lightweight Gel Moisturizer",
    slug: "gel-moisturizer",
    price: 5200,
    stock: 0,
    categorySlug: "moisturizers",
    description: "Oil-free hydration for combination skin.",
    images: ["/products/gel-moisturizer-front.jpg", "/products/gel-moisturizer-texture.jpg"],
  },
  {
    id: "spf-fluid",
    name: "SPF 50 Daily Fluid",
    slug: "spf-fluid",
    price: 4800,
    oldPrice: 5600,
    stock: 25,
    categorySlug: "moisturizers",
    description: "Broad-spectrum protection with no white cast.",
    images: ["/products/spf-front.jpg", "/products/spf-texture.jpg"],
  },
  {
    id: "overnight-renewal-oil",
    name: "Overnight Renewal Oil",
    slug: "overnight-renewal-oil",
    price: 8800,
    stock: 9,
    categorySlug: "oils",
    description: "A nourishing blend that repairs while you sleep.",
    images: ["/products/oil-front.jpg", "/products/oil-texture.jpg"],
  },
  {
    id: "rosehip-oil",
    name: "Rosehip Repair Oil",
    slug: "rosehip-oil",
    price: 6600,
    stock: 14,
    categorySlug: "oils",
    description: "Cold-pressed rosehip for fading scars and marks.",
    images: ["/products/rosehip-front.jpg", "/products/rosehip-texture.jpg"],
  },
  {
    id: "squalane-oil",
    name: "Squalane Face Oil",
    slug: "squalane-oil",
    price: 5900,
    stock: 22,
    categorySlug: "oils",
    description: "A single ingredient that mimics skin's own oils.",
    images: ["/products/squalane-front.jpg", "/products/squalane-texture.jpg"],
  },
];