"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminNotifications } from "./AdminNotifications"; 

export function AdminTopbar(){
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-powder/30  bg-[#fffdf9] px-4 backdrop-blur-sm lg:px-8">
      {/* Title block */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate font-sans text-lg text-ink ">
        Tableau de bord
        </h1>
        <p className="truncate font-sans text-xs text-ink/40">Vue d'ensemble de votre boutique</p>
      </div>
      {/* Dynamic Inventory Tracker Dropdown Replacing the Old Static Button */}
      <AdminNotifications />
      {/* Admin Avatar Identity Block */}
      <div className="flex items-center gap-3 border-l border-navy/40 pl-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-navy font-sans text-xs font-medium text-white">
            A
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="font-sans text-xs font-medium text-ink">Admin</span>
         <span className="font-sans text-[10px] text-ink/40">admin@sknstudio.dz</span>
        </div>
      </div>
    </header>
  );
}