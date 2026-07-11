import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminReviews } from "@/lib/admin/reviews";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const reviews = await getAdminReviews();
  return NextResponse.json({ reviews });
}