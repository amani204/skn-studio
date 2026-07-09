import "server-only";
import { prisma } from "@/lib/prisma";

export type DeliveryRateData = {
  wilaya: string;
  wilayaCode: number;
  homePrice: number;
  deskPrice: number;
};

/** For display on the checkout page - all active wilayas and their prices. */
export async function getDeliveryRates(): Promise<DeliveryRateData[]> {
  const rates = await prisma.deliveryRate.findMany({
    where: { isActive: true },
    orderBy: { wilayaCode: "asc" },
  });

  return rates.map((r) => ({
    wilaya: r.wilaya,
    wilayaCode: r.wilayaCode,
    homePrice: Number(r.homePrice),
    deskPrice: Number(r.deskPrice),
  }));
}

/**
 * Authoritative server-side lookup, used inside the checkout API route.
 * Never trust a shipping cost sent from the client — always re-derive it from this.
 */
export async function getDeliveryRateByWilayaCode(
  wilayaCode: number
): Promise<DeliveryRateData | null> {
  const rate = await prisma.deliveryRate.findUnique({ where: { wilayaCode } });

  if (!rate || !rate.isActive) return null;

  return {
    wilaya: rate.wilaya,
    wilayaCode: rate.wilayaCode,
    homePrice: Number(rate.homePrice),
    deskPrice: Number(rate.deskPrice),
  };
}

export function calculateShippingCost(
  rate: DeliveryRateData,
  method: "HOME" | "DESK"
): number {
  return method === "HOME" ? rate.homePrice : rate.deskPrice;
}