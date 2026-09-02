import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-display", 
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: {
    default: "SKN Studio",
    template: "%s | SKN Studio",
  },
  description: "Skincare, considered.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}