import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";
import DeliveryRatesTable from "@/components/admin/delivery/DeliveryRatesTable";
import DeliveryRateImporter from "@/components/admin/delivery/DeliveryRateImporter";

export default async function DeliveryRatesPage() {
  const rates = await getAdminDeliveryRates();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink font-bold">Tarifs de livraison</h1>
          <p className="mt-1 text-sm text-ink/50">{rates.length} wilayas</p>
        </div>
        
        {/* Action Buttons Container */}
        <div className="flex items-center gap-3">
          {/* Exporter works completely fine as an <a> link because it's a file download trigger */}
          <a
            href="/api/admin/delivery-rates/export"
            className="rounded-lg border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5 transition"
          >
            Exporter en CSV
          </a>

          {/* Importer component acts as a seamless click button trigger instead of a page link */}
          <DeliveryRateImporter />
        </div>
      </div>

      <DeliveryRatesTable rates={rates} />
    </div>
  );
}