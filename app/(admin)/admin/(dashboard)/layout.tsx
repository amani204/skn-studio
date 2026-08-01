"use client";

import React from "react";
import { signOut, useSession, SessionProvider } from "next-auth/react"; // 👈 import SessionProvider
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
    if (pathname.startsWith("/admin/settings")) return "settings";
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
      settings: "/admin/settings",
    };
    router.push(routes[section]);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/portal-97x-login" });
  };

  
  return (
    <SessionProvider>
      <DashboardContent
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onSignOut={handleSignOut}
        children={children}
      />
    </SessionProvider>
  );
}


function DashboardContent({
  activeSection,
  onSectionChange,
  onSignOut,
  children,
}: {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // Extract user data
  const user = session?.user as { name?: string; email?: string } | undefined;
  const adminName = user?.name || null;
  const adminEmail = user?.email || null;

  // Optional: show a loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/50">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      <AdminSidebar
        active={activeSection}
        onChange={onSectionChange}
        onSignOut={onSignOut}
      />
      <AdminMobileBottomBar
        active={activeSection}
        onChange={onSectionChange}
        onSignOut={onSignOut}
      />
      <div className="lg:pl-64 pb-16 lg:pb-0">
        <AdminTopbar adminName={adminName} adminEmail={adminEmail} />
        <main className="p-6 sm:p-8 block">{children}</main>
      </div>
    </div>
  );
}