import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import Papa from "papaparse";

interface CSVRow {
  Code?: string | number;
  code?: string | number;
  Wilaya?: string;
  wilaya?: string;
  "Prix Domicile (DA)"?: string | number;
  homePrice?: string | number;
  "Prix Bureau (DA)"?: string | number;
  deskPrice?: string | number;
  Actif?: string;
  isActive?: string | boolean;
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const parsed = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    const rows = parsed.data;
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Le fichier CSV est vide" },
        { status: 400 }
      );
    }

    // Build batch database operations
    const operations = rows.map((row) => {
      const rawCode = row.Code ?? row.code;
      const wilayaName = String(row.Wilaya ?? row.wilaya ?? "").trim();
      const rawHomePrice = row["Prix Domicile (DA)"] ?? row.homePrice;
      const rawDeskPrice = row["Prix Bureau (DA)"] ?? row.deskPrice;
      const rawActive = row.Actif ?? row.isActive;

      const code = parseInt(String(rawCode), 10);
      const homePrice = parseFloat(String(rawHomePrice)) || 0;
      const deskPrice = parseFloat(String(rawDeskPrice)) || 0;

      const isActive =
        typeof rawActive === "boolean"
          ? rawActive
          : String(rawActive ?? "").toLowerCase() !== "non" &&
            String(rawActive ?? "").toLowerCase() !== "false";

      if (isNaN(code)) {
        throw new Error(
          `Le code Wilaya "${rawCode}" pour "${wilayaName}" n'est pas un nombre valide.`
        );
      }

      return prisma.deliveryRate.upsert({
        where: { wilayaCode: code },
        update: {
          wilaya: wilayaName || undefined,
          homePrice,
          deskPrice,
          isActive,
        },
        create: {
          wilayaCode: code,
          wilaya: wilayaName,
          homePrice,
          deskPrice,
          isActive,
        },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error("Erreur lors de l'importation du CSV:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'importation", details: error.message },
      { status: 500 }
    );
  }
}