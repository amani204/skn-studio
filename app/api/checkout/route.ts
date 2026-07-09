import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation/checkout";
import { getDeliveryRateByWilayaCode, calculateShippingCost } from "@/lib/delivery";
import { isRateLimited, recordFailedAttempt } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `checkout:${ip}`;

  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Count every well-formed attempt toward the rate limit, success or failure —
  // protects against both brute-force abuse and rapid order-spam.
  recordFailedAttempt(rateLimitKey);

  const { fullName, phone, wilayaCode, commune, address, deliveryMethod, notes, items } =
    parsed.data;

  // ── Re-derive shipping cost server-side — never trust a client-submitted value ──
  const rate = await getDeliveryRateByWilayaCode(wilayaCode);
  if (!rate) {
    return NextResponse.json({ error: "Wilaya de livraison invalide" }, { status: 400 });
  }
  const shippingCost = calculateShippingCost(rate, deliveryMethod);

  // ── Re-fetch every product server-side — never trust client-submitted prices ──
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const outOfStockNames: string[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits sont introuvables" },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      outOfStockNames.push(product.name);
    }
  }

  if (outOfStockNames.length > 0) {
    return NextResponse.json(
      { error: `Stock insuffisant pour : ${outOfStockNames.join(", ")}` },
      { status: 409 }
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const total = subtotal + shippingCost;

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        // Run all stock decrements in parallel instead of one-at-a-time —
        // each is an independent operation, so there's no need to wait for
        // one to finish before starting the next. This is what actually
        // fixes the timeout: fewer sequential network round-trips.
        const stockResults = await Promise.all(
          items.map((item) =>
            tx.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            })
          )
        );

        const failedIndex = stockResults.findIndex((r) => r.count === 0);
        if (failedIndex !== -1) {
          const product = productMap.get(items[failedIndex].productId);
          throw new Error(`OUT_OF_STOCK:${product?.name ?? items[failedIndex].productId}`);
        }

        return tx.order.create({
          data: {
            status: "PENDING",
            subtotal,
            shippingCost,
            total,
            deliveryMethod,
            notes: notes || null,
            items: {
              create: items.map((item) => {
                const product = productMap.get(item.productId)!;
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: product.price,
                  productName: product.name,
                };
              }),
            },
            shippingAddress: {
              create: {
                fullName,
                phone,
                wilaya: rate.wilaya,
                wilayaCode: rate.wilayaCode,
                commune,
                address: address || null,
              },
            },
          },
          include: { items: true, shippingAddress: true },
        });
      },
      {
        timeout: 15000, // 15s instead of the 5s default — safety net on top of the parallelization above
        maxWait: 5000,
      }
    );

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      total: Number(order.total),
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("OUT_OF_STOCK:")) {
      const productName = error.message.split(":")[1];
      return NextResponse.json(
        {
          error: `Stock insuffisant pour : ${productName}. Une autre commande vient d'être passée en même temps, réessayez.`,
        },
        { status: 409 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}