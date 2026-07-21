import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";
import { requireAdmin } from "@/lib/admin/admin-auth";
import DeliveryRatesTable from "@/components/admin/delivery/DeliveryRatesTable";
import DeliveryRateImporter from "@/components/admin/delivery/DeliveryRateImporter";
import { Download, Truck } from "lucide-react";

export default async function DeliveryRatesPage() {
  await requireAdmin();
  const rates = await getAdminDeliveryRates();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
              Tarifs de Livraison
            </h1>
            <p className="mt-1 text-sm text-ink/60 font-body">
              Gérez les frais de livraison à domicile et en bureau par wilaya.
            </p>
          </div>
        </div>

        {/* Action Controls & Counter Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/delivery-rates/export"
            className="inline-flex items-center gap-2 border rounded-lg bg-navy font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md px-5 py-2.5 text-xs  shadow-xs"
          >
            <Download className="w-4 h-4 text-white" />
            Exporter en CSV
          </a>

          <DeliveryRateImporter />
        </div>
      </div>

      {/* Main Table Container */}
      <DeliveryRatesTable rates={rates} />
    </div>
  );
}