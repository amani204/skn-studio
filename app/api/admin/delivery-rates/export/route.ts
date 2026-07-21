import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";

function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    const rates = await getAdminDeliveryRates();

    const header = [
      "Code",
      "Wilaya",
      "Prix Domicile (DA)",
      "Prix Bureau (DA)",
      "Actif",
    ];

    const rows = rates.map((r) => [
      r.wilayaCode,
      r.wilaya,
      r.homePrice,
      r.deskPrice,
      r.isActive ? "Oui" : "Non",
    ]);

    const csvLines = [header, ...rows].map((row) =>
      row.map(escapeCsvField).join(",")
    );

    // Add UTF-8 BOM (\uFEFF) for proper Excel character encoding
    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const today = new Date().toISOString().slice(0, 10);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tarifs-livraison-${today}.csv"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation du CSV:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de l'exportation" },
      { status: 500 }
    );
  }
}