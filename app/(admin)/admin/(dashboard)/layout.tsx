// path: app/(admin)/admin/(dashboard)/layout.tsx
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar, AdminMobileBottomBar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { AdminSection } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveSection = (): AdminSection => {
    if (pathname === "/admin/dashboard") return "dashboard";
    if (pathname.startsWith("/admin/products")) return "products";
    if (pathname.startsWith("/admin/orders")) return "orders";
    if (pathname.startsWith("/admin/reviews")) return "reviews";
    if (pathname.startsWith("/admin/delivery")) return "deliveryRates";

    return "dashboard";
  };

  const activeSection = getActiveSection();

  const handleSectionChange = (section: AdminSection) => {
    const routes: Record<AdminSection, string> = {
      dashboard: "/admin",
      products: "/admin/products",
      orders: "/admin/orders",
      reviews: "/admin/reviews",
      deliveryRates: "/admin/delivery-rates",
    };
    router.push(routes[section]);
  };

  const handleSignOut = () => {
    router.push("/api/auth/signout");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Desktop Sidebar */}
      <AdminSidebar
        active={activeSection}
        onChange={handleSectionChange}
        onSignOut={handleSignOut}
      />

      {/* Mobile Bottom Bar */}
      <AdminMobileBottomBar
        active={activeSection}
        onChange={handleSectionChange}
        onSignOut={handleSignOut}
      />

      {/* Main Content Pane */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        {/* Topbar */}
        <AdminTopbar
          title="Tableau de bord"
          subtitle="Vue d'ensemble de votre boutique"
          adminName="Admin"
          adminEmail="admin@sknstudio.dz"
        />

        {/* Page Content Container */}
        <main className="p-6 sm:p-8 block">
          {children}
        </main>
      </div>
    </div>
  );
}