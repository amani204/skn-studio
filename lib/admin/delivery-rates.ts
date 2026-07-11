import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminDeliveryRates() {
  const rates = await prisma.deliveryRate.findMany({
    orderBy: { wilayaCode: "asc" },
  });

  return rates.map((r) => ({
    ...r,
    homePrice: Number(r.homePrice),
    deskPrice: Number(r.deskPrice),
  }));
}

export async function getAdminDeliveryRateById(id: string) {
  const rate = await prisma.deliveryRate.findUnique({ where: { id } });
  if (!rate) return null;

  return {
    ...rate,
    homePrice: Number(rate.homePrice),
    deskPrice: Number(rate.deskPrice),
  };
}