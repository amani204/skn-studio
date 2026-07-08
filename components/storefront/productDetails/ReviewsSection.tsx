"use client";

import { useEffect, useState } from "react";
import { Star, User, Calendar, CheckCircle } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  reviewerName: string | null;
  comment: string | null;
  createdAt: string;
};

type ReviewSectionProps = {
  productId: string;
};

export default function ReviewsSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // ==================== FETCH REVIEWS ====================
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // ==================== SUBMIT REVIEW ====================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      setStatus("error");
      setErrorMessage("Veuillez sélectionner une note.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, reviewerName, comment, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setStatus("done");
      setRating(0);
      setReviewerName("");
      setComment("");
      
      await fetchReviews();
      setTimeout(() => setStatus("idle"), 3000);

    } catch (error) {
      console.error("Error submitting review:", error);
      setStatus("error");
      setErrorMessage("Une erreur s'est produite. Réessayez.");
    }
  }

  // ==================== RENDER ====================
  return (
    <section className="border-t border-powder/30 pt-20">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-blue">
          Avis
        </span>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Ce que nos clientes pensent
        </h2>
        {reviews.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl text-blue">★</span>
              <span className="text-lg font-medium text-ink">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-ink/40">
              ({reviews.length} avis{reviews.length > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Review Form - Show first */}
      <div className="mt-10 rounded-2xl border border-powder/30 bg-white/30 p-6 sm:p-8">
        <div className="text-center">
          <h3 className="text-xs font-medium uppercase tracking-widest text-ink/60">
            Partager votre expérience
          </h3>
          <p className="mt-1 text-sm text-ink/40">
            Votre avis nous aide à améliorer nos produits.
          </p>
        </div>
        
        {status === "done" ? (
          <div className="mt-6 rounded-xl bg-emerald-50 px-6 py-4 text-center">
            <CheckCircle size={24} className="mx-auto text-emerald-500" />
            <p className="mt-2 text-sm font-medium text-emerald-700">
              Merci pour votre avis !
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-lg space-y-5">
            {/* Honeypot */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Rating */}
            <div>
              <label className="mb-2 block text-center text-xs font-medium uppercase tracking-widest text-ink/60">
                Votre note
              </label>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group relative text-3xl leading-none transition-all hover:scale-110 focus:outline-none"
                    aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                  >
                    <span
                      className={`transition-colors ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-powder/30 hover:text-powder/50"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-1 text-xs text-ink/40">
                  {rating === 1 && "Très déçu(e)"}
                  {rating === 2 && "Déçu(e)"}
                  {rating === 3 && "Moyen"}
                  {rating === 4 && "Bien"}
                  {rating === 5 && "Excellent !"}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-left text-xs font-medium uppercase tracking-widest text-ink/60">
                Nom
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full rounded-lg border border-powder/30 bg-white/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20"
                placeholder="Votre nom (optionnel)"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-left text-xs font-medium uppercase tracking-widest text-ink/60">
                Commentaire
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-powder/30 bg-white/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-navy/30 focus:outline-none focus:ring-1 focus:ring-navy/20 resize-none"
                placeholder="Partagez votre expérience avec ce produit..."
              />
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Envoyer l'avis</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List - Show after form */}
      <div className="mt-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-powder/30 bg-white/30 p-6 animate-pulse">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-4 w-32 bg-powder/30 rounded" />
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 w-4 bg-powder/30 rounded" />
                      ))}
                    </div>
                  </div>
                  <div className="h-3 w-24 bg-powder/30 rounded" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-powder/30 rounded" />
                  <div className="h-3 w-3/4 bg-powder/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-powder/30 bg-white/30 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-powder/20">
              <Star size={28} className="text-ink/20" strokeWidth={1} />
            </div>
            <p className="text-sm text-ink/40">
              Aucun avis pour l'instant.<br />
              Soyez le premier à donner votre avis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group rounded-xl border border-powder/30 bg-white/30 p-6 transition-all hover:border-navy/10 hover:bg-white/60 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5">
                        <User size={16} className="text-navy/40" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-ink">
                          {review.reviewerName ?? "Anonyme"}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm transition-colors ${
                                i < review.rating ? "text-yellow-400" : "text-powder/30"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-ink/60">
                        {review.comment}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink/30 sm:flex-shrink-0">
                    <Calendar size={12} strokeWidth={1.5} />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}