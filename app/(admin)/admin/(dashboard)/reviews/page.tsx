import { getAdminReviews } from "@/lib/admin/reviews";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Avis clients</h1>
      <p className="mt-1 text-sm text-ink/50">{reviews.length} avis au total</p>

      <div className="mt-6">
        <ReviewsTable
          reviews={reviews.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}