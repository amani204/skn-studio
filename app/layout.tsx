import type { Metadata } from "next";
import { Playfair_Display_SC, Inter } from "next/font/google";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import "./globals.css";

// Playfair Display SC only ships weight 400 — that's expected, it's a
// display/small-caps cut, not a full text family.
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
