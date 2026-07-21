"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2, Loader2, MessageSquareX, AlertCircle, X, ExternalLink } from "lucide-react";

export type ReviewItem = {
  id: string;
  rating: number;
  reviewerName: string | null;
  comment: string | null;
  createdAt: string;
  product: { id: string; name: string; slug: string };
};

interface ReviewsTableProps {
  reviews: ReviewItem[];
  searchQuery?: string;
}

export default function ReviewsTable({ reviews, searchQuery = "" }: ReviewsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter reviews by reviewer name, product name, or comment text
  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.reviewerName?.toLowerCase().includes(q) ||
      r.product.name.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.")) {
      return;
    }

    setErrorMsg(null);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        let message = `Erreur ${res.status}`;
        try {
          const data = JSON.parse(text);
          message = data.error || message;
        } catch {
          // Fallback if endpoint returns plain text/HTML
        }
        throw new Error(message);
      }

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de supprimer l'avis.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="p-1 rounded-md text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Container matching ProductsTable */}
      <div className="overflow-x-auto rounded-lg border border-powder/40">
        <table className="w-full text-sm">
          <thead className="border-b border-powder/40 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Évaluation</th>
              <th className="px-4 py-3">Auteur & Commentaire</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-ink/40">
                  <MessageSquareX className="w-8 h-8 mx-auto mb-2 stroke-1 text-ink/30" />
                  <p className="font-medium text-ink/70">Aucun avis trouvé</p>
                  <p className="text-xs text-ink/40 mt-0.5">
                    {searchQuery
                      ? "Essayez de modifier votre recherche"
                      : "Les avis de vos clients apparaîtront ici"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredReviews.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-powder/20 last:border-0 hover:bg-powder/5 transition-colors"
                >
                  {/* Product Link */}
                  <td className="px-4 py-3 font-medium text-ink max-w-xs">
                    <Link
                      href={`/products/${r.product.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 hover:text-navy transition-colors group"
                    >
                      <span className="truncate">{r.product.name}</span>
                      <ExternalLink className="w-3 h-3 text-ink/30 group-hover:text-navy shrink-0" />
                    </Link>
                  </td>

                  {/* Rating Stars */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating
                              ? "fill-amber-400 text-amber-500"
                              : "text-powder"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Reviewer & Comment */}
                  <td className="px-4 py-3 max-w-md">
                    <p className="text-xs font-medium text-ink">
                      {r.reviewerName || "Client Anonyme"}
                    </p>
                    {r.comment ? (
                      <p className="text-xs text-ink/70 mt-0.5 line-clamp-2">
                        {r.comment}
                      </p>
                    ) : (
                      <span className="text-[11px] italic text-ink/40">
                        Aucun commentaire écrit
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-ink/50 whitespace-nowrap font-mono">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="p-1.5 rounded-md text-ink/50 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Supprimer l'avis"
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}