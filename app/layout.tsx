import type { Metadata } from "next";
import { Playfair_Display_SC, Inter } from "next/font/google";
import Navbar from "@/components/storefront/Navbar";
import CartSlider from "@/components/storefront/CartSlider";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/storefront/Footer";
import "./globals.css";

const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SKN Studio",
  description: "Skincare, considered.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <CartSlider />
          {children}
        </CartProvider>
        <Footer/>
      </body>
    </html>
  );
}