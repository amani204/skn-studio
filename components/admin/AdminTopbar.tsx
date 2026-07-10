"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  adminName?: string;
  adminEmail?: string;
  notifications?: number;
  actions?: React.ReactNode;
}

export function AdminTopbar({
  title,
  subtitle,
  adminName,
  adminEmail,
  notifications,
  actions,
}: AdminTopbarProps) {
  const initials = (adminName ?? adminEmail ?? "A")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-powder/30 bg-white/80 px-4 backdrop-blur-sm lg:px-8">
      {/* Title */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="font-display text-lg  text-ink">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate font-sans text-xs text-ink/40">{subtitle}</p>
        ) : null}
      </div>

      {/* Actions */}
      {actions}

      {/* Notifications */}
      <button
        type="button"
        className="relative rounded-lg p-2 text-ink/40 hover:bg-powder/10"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.5} />
        {notifications && notifications > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-sans text-[9px] font-semibold text-white">
            {notifications}
          </span>
        ) : null}
      </button>

      {/* Admin Avatar */}
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