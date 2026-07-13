import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  try {
    // Correct Auth Check
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const rates = await getAdminDeliveryRates();

    const header = ["Code", "Wilaya", "Prix Domicile (DA)", "Prix Bureau (DA)", "Actif"];
    const rows = rates.map((r) => [
      r.wilayaCode,
      r.wilaya,
      r.homePrice,
      r.deskPrice,
      r.isActive ? "Oui" : "Non",
    ]);

    const csvLines = [header, ...rows].map((row) => row.map(escapeCsvField).join(","));
    const csvContent = "\uFEFF" + csvLines.join("\r\n"); 

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tarifs-livraison-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error in GET delivery rates CSV:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}