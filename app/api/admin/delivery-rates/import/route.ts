import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import Papa from "papaparse";

interface CSVRow {
  Code: string | number;
  Wilaya: string;
  "Prix Domicile (DA)": string | number;
  "Prix Bureau (DA)": string | number;
  Actif?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const csvText = await file.text();
    const parsed = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Le fichier CSV est vide" }, { status: 400 });
    }

    await prisma.$transaction(
      rows.map((row) => {
        // Safe conversion to integer for your schema (e.g., "01" or "1" becomes 1)
        const code = parseInt(String(row["Code"]), 10); 
        const wilayaName = row["Wilaya"];
        const homePrice = parseFloat(String(row["Prix Domicile (DA)"])) || 0;
        const deskPrice = parseFloat(String(row["Prix Bureau (DA)"])) || 0;
        const isActive = row["Actif"]?.toLowerCase() === "non" ? false : true;

        if (isNaN(code)) {
          throw new Error(`Le code Wilaya pour "${wilayaName}" n'est pas un nombre valide.`);
        }

        return prisma.deliveryRate.upsert({
          where: { wilayaCode: code }, // Uses Int lookup matching your schema!
          update: {
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
      })
    );

    return NextResponse.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error("Error importing CSV:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'importation", details: error.message },
      { status: 500 }
    );
  }
}