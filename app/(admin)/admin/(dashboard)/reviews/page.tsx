import { getAdminReviews } from "@/lib/admin/reviews";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";

export default async function AdminReviewsPage() {
  const rawReviews = await getAdminReviews();

  if (!rawReviews) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Avis clients</h1>
          <p className="mt-1 text-sm text-red-500">
            Vous n'avez pas l'autorisation d'accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  const reviews = rawReviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    reviewerName: r.reviewerName,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    product: {
      id: r.product.id,
      name: r.product.name,
      slug: r.product.slug,
    },
  }));

  return (
      <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
              Avis clients
            </h1>
            <p className="mt-1 text-sm text-ink/60 font-body">
              {reviews.length} {reviews.length > 1 ? "avis au total" : "avis au total"}
            </p>
            </div>
          </div>
        </div>

      {/* Reviews List */}
      <div className="mt-6">
        <ReviewsTable reviews={reviews} />
      </div>
    </div>
  );
}