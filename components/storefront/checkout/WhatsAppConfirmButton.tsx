"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppConfirmButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
    >
      <MessageCircle size={18} />
      Confirmer via WhatsApp
    </a>
  );
}