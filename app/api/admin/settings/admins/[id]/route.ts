import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { deleteAdmin } from "@/lib/admin/adminManagment";
import { AppError } from "@/lib/errors";

const paramsSchema = z.object({ id: z.string().cuid("Identifiant invalide.") });

// DELETE 
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const requestingAdminId = (session.user as { id?: string })?.id;
  if (!requestingAdminId) {
    console.error("session.user.id is missing — check your NextAuth session callback.");
    return NextResponse.json({ error: "Session invalide." }, { status: 500 });
  }

  try {
    await deleteAdmin(parsedParams.data.id, requestingAdminId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`DELETE /api/admin/settings/admins/${resolvedParams.id} error:`, error);
    return NextResponse.json({ error: "Impossible de supprimer l'administrateur." }, { status: 500 });
  }
}