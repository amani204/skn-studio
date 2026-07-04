import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Your Store Name",
    template: "%s | Your Store Name",
  },
  description: "Clean, effective skincare.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}