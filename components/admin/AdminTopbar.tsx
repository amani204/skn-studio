"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminNotifications } from "./AdminNotifications"; 

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  adminName?: string;
  adminEmail?: string;
  actions?: React.ReactNode;
}

export function AdminTopbar({
  title,
  subtitle,
  adminName,
  adminEmail,
  actions,
}: AdminTopbarProps) {
  const initials = (adminName ?? adminEmail ?? "A")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-powder/30  bg-[#fffdf9] px-4 backdrop-blur-sm lg:px-8">
      {/* Title block */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="font-display text-lg text-ink font-bold">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate font-sans text-xs text-ink/40">{subtitle}</p>
        ) : null}
      </div>

      {/* Optional Topbar Context Actions placeholder */}
      {actions}

      {/* Dynamic Inventory Tracker Dropdown Replacing the Old Static Button */}
      <AdminNotifications />

      {/* Admin Avatar Identity Block */}
      <div className="flex items-center gap-3 border-l border-navy/40 pl-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-navy font-sans text-xs font-medium text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="font-sans text-xs font-medium text-ink">{adminName ?? "Admin"}</span>
          {adminEmail ? (
            <span className="font-sans text-[10px] text-ink/40">{adminEmail}</span>
          ) : null}
        </div>
      </div>
    </header>
  );
}