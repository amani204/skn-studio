"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminSection =
  | "dashboard"
  | "products"
  | "orders"
  | "reviews"
  | "deliveryRates"

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  onSignOut?: () => void;
}

const items: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingBag },
  { id: "reviews", label: "Avis", icon: Star },
  { id: "deliveryRates", label: "Livraison", icon: Truck },
];

// ==================== DESKTOP SIDEBAR ====================
export function AdminSidebar({ active, onChange, onSignOut }: AdminSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-powder/30 bg-white/80 backdrop-blur-sm lg:flex">
      {/* Logo - Like Navbar */}
      <div className=" p-4 items-center border-b border-powder/30 px-6">
        <Link href="/admin" className="font-display text-sm uppercase tracking-[0.15em] text-navy sm:text-lg">
          SKN Studio
        </Link>
        <p className="text-xs text-ink/50 py-2" >Tableau de bord</p>
      </div>


      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-all",
                isActive
                  ? "bg-navy/90 text-white shadow-sm"
                  : "text-ink/60 hover:bg-powder/10 hover:text-navy"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      {onSignOut ? (
        <div className="border-t border-powder/30 p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-ink/40 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Déconnexion
          </button>
        </div>
      ) : null}
    </aside>
  );
}

// ==================== MOBILE BOTTOM BAR ====================

interface MobileBottomBarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  onSignOut?: () => void;
}

export function AdminMobileBottomBar({ active, onChange, onSignOut }: MobileBottomBarProps) {
  const bottomItems = items.slice(0, 4);
  const extraItems = items.slice(4);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-powder/30 bg-white/95 backdrop-blur-sm lg:hidden">
      {bottomItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 p-2 transition-all",
              isActive ? "text-navy" : "text-ink/40"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[8px] uppercase tracking-widest">
              {item.label === "Tableau de bord" ? "Accueil" : item.label}
            </span>
          </button>
        );
      })}

      {/* Extra Items Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            const dropdown = document.getElementById("admin-more-dropdown");
            if (dropdown) {
              dropdown.classList.toggle("hidden");
            }
          }}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 transition-all",
            extraItems.some((item) => item.id === active) ? "text-navy" : "text-ink/40"
          )}
        >
          <span className="text-xl font-medium leading-none">•••</span>
          <span className="text-[8px] uppercase tracking-widest">Plus</span>
        </button>

        {/* Dropdown Menu */}
        <div
          id="admin-more-dropdown"
          className="absolute bottom-14 right-0 hidden min-w-[160px] rounded-xl border border-powder/30 bg-white/95 p-2 shadow-xl"
        >
          {extraItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  const dropdown = document.getElementById("admin-more-dropdown");
                  if (dropdown) dropdown.classList.add("hidden");
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm font-medium transition-all",
                  isActive
                    ? "bg-navy text-white shadow-sm"
                    : "text-ink/60 hover:bg-powder/10 hover:text-navy"
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
          {onSignOut && (
            <>
              <div className="my-1 border-t border-powder/30" />
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm font-medium text-red-400 transition-all hover:bg-red-50"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}