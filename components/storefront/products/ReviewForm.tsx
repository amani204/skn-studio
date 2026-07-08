"use client";

import { useState } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real users never fill this
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, reviewerName, comment, website }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("done");
      setRating(0);
      setReviewerName("");
      setComment("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg bg-powder/20 px-4 py-3 text-center text-sm text-ink/70">
        Merci pour votre avis ! Il sera visible après validation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md bg-white/20 space-y-4 text-center">
      {/* Honeypot field — hidden from real users via CSS, bots fill it anyway */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label className="mb-1 block text-center text-xs uppercase tracking-widest text-ink/60">
          Note
        </label>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl leading-none transition-transform hover:scale-110"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <span className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-ink/20"}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-center text-xs uppercase tracking-widest text-ink/60">
          Nom (optionnel)
        </label>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-ink/60">
          Commentaire (optionnel)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
          placeholder="Partagez votre expérience..."
        />
      </div>

      {status === "error" && (
        <p className="text-center text-sm text-red-600">
          {rating === 0
            ? "Veuillez sélectionner une note."
            : "Une erreur s'est produite. Réessayez."}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Envoi..." : "Envoyer l'avis"}
      </button>
    </form>
  );
}