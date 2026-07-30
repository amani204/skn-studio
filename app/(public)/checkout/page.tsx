import { getDeliveryRates } from "@/lib/delivery";
import CheckoutForm from "@/components/storefront/checkout/CheckoutForm";

export const metadata = {
  title: "Commande",
};

export default async function CheckoutPage() {
  const deliveryRates = await getDeliveryRates();

  return <CheckoutForm deliveryRates={deliveryRates}  />;
}