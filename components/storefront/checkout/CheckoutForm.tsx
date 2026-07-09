"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { DeliveryRateData } from "@/lib/delivery";
import WilayaSelect from "@/components/storefront/checkout/WilayaSelect";
import DeliveryMethodSelector from "@/components/storefront/checkout/DeliveryMethodSelector";
import OrderSummary from "@/components/storefront/checkout/OrderSummary";
import { User, MapPin, CreditCard, ShoppingBag, ArrowRight, Check } from "lucide-react";

export default function CheckoutForm({ deliveryRates }: { deliveryRates: DeliveryRateData[] }) {
  const router = useRouter();
  const { items, isHydrated, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState<number | null>(null);
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"HOME" | "DESK">("HOME");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedRate = deliveryRates.find((r) => r.wilayaCode === wilayaCode) ?? null;
  const shippingCost = selectedRate
    ? deliveryMethod === "HOME"
      ? selectedRate.homePrice
      : selectedRate.deskPrice
    : 0;

  // Wait for cart hydration before deciding it's empty
  if (isHydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-powder/20">
          <ShoppingBag size={28} className="text-ink/20" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-ink/60">Votre panier est vide.</p>
        <Link
          href="/products"
          className="mt-4 inline-block border-b border-navy pb-0.5 text-sm uppercase tracking-widest text-navy/60 transition-colors hover:border-navy hover:text-navy"
        >
          Continuer vos achats →
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!wilayaCode) {
      setErrorMessage("Veuillez sélectionner votre wilaya.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          wilayaCode,
          commune,
          address: address || undefined,
          deliveryMethod,
          notes: notes || undefined,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }
      router.push(`/checkout/success/${data.orderNumber}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  }

  const steps = [
    { id: "info", label: "Informations", icon: User },
    { id: "delivery", label: "Livraison", icon: MapPin },
    { id: "payment", label: "Paiement", icon: CreditCard },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
          Finaliser votre commande
        </span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Paiement à la livraison
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          Remplissez vos informations et confirmez votre commande
        </p>

        {/* Steps */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === 0;
            const isCompleted = false;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    isActive ? "text-navy" : "text-ink/30"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "border-navy bg-navy text-white"
                        : "border-ink/10 bg-transparent text-ink/30"
                    }`}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </div>
                  <span className="hidden text-xs font-medium uppercase tracking-widest sm:block">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-2 h-px w-8 bg-powder/30 sm:mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          {/* Informations */}
          <div className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm transition-all hover:border-navy/10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-sm font-medium text-navy">
                01
              </div>
              <h2 className="font-display text-lg text-ink">Vos informations</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60"
                >
                  Nom complet
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-powder/30 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
                  placeholder="Amani A."
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60"
                >
                  Téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  maxLength={20}
                  placeholder="0555 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-powder/30 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
                />
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm transition-all hover:border-navy/10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-sm font-medium text-navy">
                02
              </div>
              <h2 className="font-display text-lg text-ink">Livraison</h2>
            </div>

            <div className="space-y-4">
              <WilayaSelect rates={deliveryRates} value={wilayaCode} onChange={setWilayaCode} />

              <div>
                <label
                  htmlFor="commune"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60"
                >
                  Commune
                </label>
                <input
                  id="commune"
                  type="text"
                  required
                  maxLength={100}
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full rounded-lg border border-powder/30 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
                  placeholder="Hydra"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60"
                >
                  Adresse (optionnel)
                </label>
                <input
                  id="address"
                  type="text"
                  maxLength={300}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-powder/30 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
                  placeholder="Rue, résidence, repère"
                />
              </div>

              <DeliveryMethodSelector
                selectedRate={selectedRate}
                value={deliveryMethod}
                onChange={setDeliveryMethod}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm transition-all hover:border-navy/10">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/60"
            >
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              rows={2}
              maxLength={1000}
              placeholder="Instructions de livraison, message cadeau..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-lg border border-powder/30 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !wilayaCode}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-navy px-6 py-4 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <span>Confirmer la commande</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </>
            )}
          </button>

          <p className="text-center text-xs text-ink/25">
            Paiement à la livraison · Vous payez à la réception de votre colis
          </p>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <OrderSummary shippingCost={shippingCost} />
        </div>
      </div>
    </main>
  );
}