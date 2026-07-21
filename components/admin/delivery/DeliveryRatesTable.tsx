"use client";

import { useMemo, useState } from "react";

type DeliveryRate = {
  id: string;
  wilaya: string;
  wilayaCode: number;
  homePrice: number;
  deskPrice: number;
  isActive: boolean;
};

type Draft = { homePrice: string; deskPrice: string; isActive: boolean };

export default function DeliveryRatesTable({ rates }: { rates: DeliveryRate[] }) {
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      rates.map((r) => [
        r.id,
        { homePrice: String(r.homePrice), deskPrice: String(r.deskPrice), isActive: r.isActive },
      ])
    )
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const filteredRates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rates;
    return rates.filter(
      (r) => r.wilaya.toLowerCase().includes(query) || String(r.wilayaCode).includes(query)
    );
  }, [rates, search]);

  function isDirty(rate: DeliveryRate): boolean {
    const draft = drafts[rate.id];
    if (!draft) return false;
    return (
      draft.homePrice !== String(rate.homePrice) ||
      draft.deskPrice !== String(rate.deskPrice) ||
      draft.isActive !== rate.isActive
    );
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    setSavedId(null);
  }

  async function handleSave(rate: DeliveryRate) {
    const draft = drafts[rate.id];
    setSavingId(rate.id);
    setErrorId(null);

    try {
      const res = await fetch(`/api/admin/delivery-rates/${rate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homePrice: Number(draft.homePrice),
          deskPrice: Number(draft.deskPrice),
          isActive: draft.isActive,
        }),
      });

      if (!res.ok) throw new Error();

     
      rate.homePrice = Number(draft.homePrice);
      rate.deskPrice = Number(draft.deskPrice);
      rate.isActive = draft.isActive;

      setSavedId(rate.id);
      setTimeout(() => setSavedId((current) => (current === rate.id ? null : current)), 2000);
    } catch {
      setErrorId(rate.id);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher une wilaya..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none sm:w-64"
      />

      <div className="overflow-x-auto rounded-lg border border-powder/40">
        <table className="w-full text-sm">
          <thead className="border-b border-powder/40 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Wilaya</th>
              <th className="px-4 py-3">Domicile (DA)</th>
              <th className="px-4 py-3">Bureau (DA)</th>
              <th className="px-4 py-3">Actif</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map((rate) => {
              const draft = drafts[rate.id];
              const dirty = isDirty(rate);

              return (
                <tr key={rate.id} className="border-b border-powder/20 last:border-0">
                  <td className="px-4 py-2 text-ink/60">{rate.wilayaCode}</td>
                  <td className="px-4 py-2 text-ink">{rate.wilaya}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={draft.homePrice}
                      onChange={(e) => updateDraft(rate.id, { homePrice: e.target.value })}
                      className="w-24 rounded-md border border-powder/40 px-2 py-1 text-sm focus:border-navy/30 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={draft.deskPrice}
                      onChange={(e) => updateDraft(rate.id, { deskPrice: e.target.value })}
                      className="w-24 rounded-md border border-powder/40 px-2 py-1 text-sm focus:border-navy/30 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={draft.isActive}
                      onChange={(e) => updateDraft(rate.id, { isActive: e.target.checked })}
                      className="accent-navy"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {dirty && (
                      <button
                        onClick={() => handleSave(rate)}
                        disabled={savingId === rate.id}
                        className="rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-navy/80 disabled:opacity-50"
                      >
                        {savingId === rate.id ? "..." : "Enregistrer"}
                      </button>
                    )}
                    {savedId === rate.id && <span className="text-xs text-green-600">✓ Sauvegardé</span>}
                    {errorId === rate.id && <span className="text-xs text-red-600">Erreur</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}