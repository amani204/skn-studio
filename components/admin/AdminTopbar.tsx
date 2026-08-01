"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminNotifications } from "./AdminNotifications";

interface AdminTopbarProps {
  adminName?: string | null;
  adminEmail?: string | null;
}

export function AdminTopbar({ adminName, adminEmail }: AdminTopbarProps) {
  // Compute initials from name or email
  const getInitials = () => {
    if (adminName) {
      const parts = adminName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (adminEmail) {
      return adminEmail.slice(0, 2).toUpperCase();
    }
    return "A";
  };

  const initials = getInitials();
  const displayName = adminName || "Admin";
  const displayEmail = adminEmail || "admin@sknstudio.dz";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-powder/30 bg-[#fffdf9] px-4 backdrop-blur-sm lg:px-8">
      {/* Title block  */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate font-sans text-lg text-ink">Tableau de bord</h1>
        <p className="truncate font-sans text-xs text-ink/40">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Notifications */}
      <AdminNotifications />

      {/* Admin Avatar Identity Block  */}
      <div className="flex items-center gap-3 border-l border-navy/40 pl-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-navy font-sans text-xs font-medium text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="font-sans text-xs font-medium text-ink">{displayName}</span>
          <span className="font-sans text-[10px] text-ink/40">{displayEmail}</span>
        </div>
      </div>
    </header>
  );
}