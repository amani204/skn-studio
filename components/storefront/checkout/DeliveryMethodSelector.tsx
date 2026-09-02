"use client";
type Props = {
  selectedRate: { homePrice: number; deskPrice: number } | null;
  value: "HOME" | "DESK";
  onChange: (method: "HOME" | "DESK") => void;
};

export default function DeliveryMethodSelector({ selectedRate, value, onChange }: Props) {
  const options: { method: "HOME" | "DESK"; label: string; hint: string; price: number | null }[] = [
    {
      method: "HOME",
      label: "Livraison à domicile",
      hint: "Courrier remis à votre porte",
      price: selectedRate?.homePrice ?? null,
    },
    {
      method: "DESK",
      label: "Point de retrait",
      hint: "Bureau de collecte partenaire",
      price: selectedRate?.deskPrice ?? null,
    },
  ];

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60">
        Mode de livraison
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const active = value === opt.method;
          const isAvailable = opt.price !== null;

          return (
            <button
              key={opt.method}
              type="button"
              onClick={() => isAvailable && onChange(opt.method)}
              disabled={!isAvailable}
              className={`group flex flex-col items-start gap-1.5 rounded-lg border px-5 py-4 text-left transition-all ${
                active && isAvailable
                  ? "border-navy bg-navy text-white shadow-sm"
                  : isAvailable
                  ? "border-powder/30 bg-white/50 text-ink hover:border-navy/30 hover:bg-white/80"
                  : "cursor-not-allowed border-powder/20 bg-powder/10 text-ink/30"
              }`}
            >
              <span className={`font-display text-base ${
                active && isAvailable ? "text-white" : isAvailable ? "text-ink" : "text-ink/30"
              }`}>
                {opt.label}
              </span>
              <span className={`text-[10px] uppercase tracking-widest ${
                active && isAvailable ? "text-white/60" : isAvailable ? "text-ink/40" : "text-ink/20"
              }`}>
                {opt.hint}
              </span>
              <span className={`text-sm font-medium ${
                active && isAvailable ? "text-white" : isAvailable ? "text-navy" : "text-ink/20"
              }`}>
                {isAvailable ? `${opt.price?.toLocaleString()} DA` : "—"}
              </span>
            </button>
          );
        })}
      </div>
      {!selectedRate && (
        <p className="mt-2 text-xs text-ink/30">
          Veuillez sélectionner une wilaya pour voir les prix de livraison.
        </p>
      )}
    </div>
  );
}