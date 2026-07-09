"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  rates: { wilayaCode: number; wilaya: string }[];
  value: number | null;
  onChange: (wilayaCode: number) => void;
};

export default function WilayaSelect({ rates, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60">
        Wilaya
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-powder/30 bg-white/50 px-4 py-2.5 pr-10 text-sm text-ink transition-all focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
        >
          <option value="" disabled>
            Sélectionnez votre wilaya
          </option>
          {rates.map((rate) => (
            <option key={rate.wilayaCode} value={rate.wilayaCode}>
              {String(rate.wilayaCode).padStart(2, "0")} — {rate.wilaya}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/30"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}