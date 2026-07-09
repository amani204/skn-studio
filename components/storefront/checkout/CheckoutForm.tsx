"use client";
import { useState } from "react";
import WilayaSelect from "./WilayaSelect";
import DeliveryMethodSelector from "./DeliveryMethodSelector";
import OrderSummary from "./OrderSummary";
import { Check, Package, Truck, CreditCard } from "lucide-react";

export type DeliveryRateData = {
  wilayaCode: number;
  wilaya: string;
  homePrice: number;
  deskPrice: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Props = {
  deliveryRates: DeliveryRateData[];
  items: CartItem[];
};

const inputClass =
  "w-full rounded-lg border border-powder/30 bg-white/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20 transition-all";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60";

export default function CheckoutForm({ deliveryRates, items }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState<number | null>(null);
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"HOME" | "DESK">("HOME");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const selectedRate = deliveryRates.find((r) => r.wilayaCode === wilayaCode) ?? null;
  const shippingCost = selectedRate
    ? deliveryMethod === "HOME"
      ? selectedRate.homePrice
      : selectedRate.deskPrice
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    if (!wilayaCode) {
      setErrorMessage("Veuillez sélectionner votre wilaya.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-8 sm:py-32">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <Check size={32} className="text-emerald-500" strokeWidth={1.5} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-blue">
          Commande reçue
        </p>
        <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">
          Merci, {fullName || "cher client"}.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/50">
          Votre commande a été enregistrée. Un membre du studio vous contactera au
          numéro fourni pour confirmer les détails de livraison.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-8 rounded-lg border border-navy/15 px-8 py-3 text-sm font-medium uppercase tracking-widest text-navy/60 transition-all hover:border-navy/30 hover:bg-navy hover:text-white"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20  pb-24 pt-32 sm:pt-40">
      {/* Header */}
      <header className="mb-12 text-center sm:mb-16">
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
          Étape finale
        </span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Votre commande
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          Paiement à la livraison
        </p>

        {/* Steps */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-ink/30">
          <span className="text-ink">01 Panier</span>
          <span className="h-px w-8 bg-powder/30" />
          <span className="text-ink">02 Détails</span>
          <span className="h-px w-8 bg-powder/30" />
          <span>03 Confirmation</span>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Contact */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-xs font-medium text-navy">
                01
              </span>
              <h2 className="font-display text-xl text-ink">Vos informations</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Nom complet</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Amani A."
                />
              </div>
              <div>
                <label className={labelClass}>Téléphone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="0555 00 00 00"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-xs font-medium text-navy">
                02
              </span>
              <h2 className="font-display text-xl text-ink">Livraison</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <WilayaSelect
                rates={deliveryRates}
                value={wilayaCode}
                onChange={setWilayaCode}
              />
              <div>
                <label className={labelClass}>Commune</label>
                <input
                  type="text"
                  required
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className={inputClass}
                  placeholder="Hydra"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse (optionnel)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                placeholder="Rue, résidence, repère"
              />
            </div>

            <DeliveryMethodSelector
              selectedRate={selectedRate}
              value={deliveryMethod}
              onChange={setDeliveryMethod}
            />
          </section>

          {/* Notes */}
          <section className="space-y-3">
            <label className={labelClass}>Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-powder/30 bg-white/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20 transition-all resize-none"
              placeholder="Instructions particulières pour la livraison…"
            />
          </section>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !wilayaCode}
            className="group flex w-full items-center justify-center gap-3 rounded-lg bg-navy px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} strokeWidth={1.5} />
                <span>Confirmer la commande</span>
                <span className="text-sm">→</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-ink/25">
            Paiement à la livraison · Vous payez à la réception de votre colis
          </p>
        </form>

        {/* Order Summary */}
        <OrderSummary shippingCost={shippingCost} />
      </div>
    </div>
  );
}