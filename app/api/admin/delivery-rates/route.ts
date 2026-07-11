import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const rates = await getAdminDeliveryRates();
  return NextResponse.json({ rates });
}