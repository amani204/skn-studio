import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllAdmins, createAdmin } from "@/lib/admin/adminManagment";
import { createAdminSchema } from "@/lib/validation/admin";
import { AppError } from "@/lib/errors";

//list all admin accounts
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const admins = await getAllAdmins();
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/settings/admins error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les administrateurs." },
      { status: 500 }
    );
  }
}

//  create a new admin account
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  try {
    const data = createAdminSchema.parse(body);
    const admin = await createAdmin(data);
    return NextResponse.json({ admin }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides.", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("POST /api/admin/settings/admins error:", error);
    return NextResponse.json({ error: "Impossible de créer l'administrateur." }, { status: 500 });
  }
}