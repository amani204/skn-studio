// Your store's WhatsApp number, digits only, country code, no + or spaces.
// e.g. Algeria +213 555 12 34 56 -> "213555123456"
const STORE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER;

function buildWhatsAppLink(message: string): string {
  if (!STORE_WHATSAPP_NUMBER) {
    console.warn("NEXT_PUBLIC_STORE_WHATSAPP_NUMBER is not set");
    return "#";
  }
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** "Order via WhatsApp" button on a product page - inquiry before checkout. */
export function buildProductInquiryLink(productName: string, price: number, quantity = 1): string {
  const message = `Bonjour, je suis intéressé(e) par :\n${productName} (x${quantity}) - ${(
    price * quantity
  ).toLocaleString()} DA\n\nEst-il disponible ?`;
  return buildWhatsAppLink(message);
}

type OrderConfirmationData = {
  orderNumber: string;
  fullName: string;
  items: { productName: string; quantity: number; price: number }[];
  shippingCost: number;
  total: number;
  wilaya: string;
  deliveryMethod: "HOME" | "DESK";
};

/** "Confirm via WhatsApp" button on the order success page. */
export function buildOrderConfirmationLink(order: OrderConfirmationData): string {
  const itemsList = order.items
    .map((i) => `- ${i.productName} x${i.quantity} (${(i.price * i.quantity).toLocaleString()} DA)`)
    .join("\n");

  const methodLabel = order.deliveryMethod === "HOME" ? "Livraison à domicile" : "Point de retrait";

  const message = `Bonjour, je viens de passer une commande sur le site.

N° de commande : ${order.orderNumber}
Nom : ${order.fullName}
Wilaya : ${order.wilaya} (${methodLabel})

${itemsList}

Frais de livraison : ${order.shippingCost.toLocaleString()} DA
Total : ${order.total.toLocaleString()} DA

Merci de confirmer ma commande.`;

  return buildWhatsAppLink(message);
}