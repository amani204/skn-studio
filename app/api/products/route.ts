import { NextRequest, NextResponse } from "next/server";
import { getProducts, parseProductFilters } from "@/lib/products";

export async function GET(req: NextRequest) {
  const filters = parseProductFilters(req.nextUrl.searchParams);
  const products = await getProducts(filters);
  return NextResponse.json(products);
}