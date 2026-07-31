import React from "react";
import Navbar from "@/components/storefront/Navbar";
import CartSlider from "@/components/storefront/CartSlider";
import WhatsAppButton from "@/components/storefront/WhatsappButton";
import Footer from "@/components/storefront/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Public storefront top navigation */}
      <Navbar />
      
      {/* Slide-out shopping cart panel */}
      <CartSlider />
      
      {/* Main page content wrapper */}
      <main className="flex-1">{children}</main>
      
      {/* Floating help triggers */}
      <WhatsAppButton />
      
      {/* Public storefront footer */}
      <Footer />
    </div>
  );
}