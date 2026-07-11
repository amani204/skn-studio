"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  rating: number;
  reviewerName: string | null;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string };
};

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Supprimer cet avis ? Cette action est irréversible.");
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text();
        let message = `Erreur ${res.status}`;
        try {
          const data = JSON.parse(text);
          message = data.error || message;
        } catch {
          // Body wasn't JSON (likely an empty or crashed response) — keep the generic status message
        }
        throw new Error(message);
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, currentlyApproved: boolean) {
    setTogglingId(id);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentlyApproved }),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = `Erreur ${res.status}`;
        try {
          const data = JSON.parse(text);
          message = data.error || message;
        } catch {
          // Body wasn't JSON — keep the generic status message
        }
        throw new Error(message);
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setTogglingId(null);
    }
  }

  if (reviews.length === 0) {
    return <p className="py-16 text-center text-sm text-ink/40">Aucun avis pour l&apos;instant.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-powder/40 bg-white/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/products/${review.product.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-navy hover:underline"
                >
                  {review.product.name}
                </Link>
                <span className="text-sm text-blue">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                {!review.isApproved && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                    Masqué
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-ink/40">
                {review.reviewerName ?? "Anonyme"} ·{" "}
                {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {review.comment && <p className="mt-2 text-sm text-ink/70">{review.comment}</p>}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                onClick={() => handleToggle(review.id, review.isApproved)}
                disabled={togglingId === review.id}
                className="text-sm text-navy hover:underline disabled:opacity-50"
              >
                {togglingId === review.id ? "..." : review.isApproved ? "Masquer" : "Afficher"}
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                disabled={deletingId === review.id}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                {deletingId === review.id ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}