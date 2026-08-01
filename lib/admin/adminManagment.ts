import "server-only";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { CreateAdminInput } from "@/lib/validation/admin";

const BCRYPT_ROUNDS = 12;

/**
 * Lists all admin accounts. Password hashes are never selected — this data
 * goes straight into a Client Component list, so leaving `password` out at
 * the query level (not just by omitting it on render) is the safe default.
 */
export async function getAllAdmins() {
  try {
    return await prisma.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Database error in getAllAdmins:", error);
    throw new Error("Impossible de récupérer les administrateurs.");
  }
}

/**
 * Creates a new admin account. Rejects duplicate emails with a friendly
 * 409 instead of letting the raw unique-constraint error bubble up.
 */
export async function createAdmin(data: CreateAdminInput) {
  const existing = await prisma.admin.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError("Un administrateur avec cet e-mail existe déjà.", 409, "DUPLICATE_EMAIL");
  }

  const hashedPassword = await hash(data.password, BCRYPT_ROUNDS);

  try {
    return await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AppError("Un administrateur avec cet e-mail existe déjà.", 409, "DUPLICATE_EMAIL");
    }
    console.error("Database error in createAdmin:", error);
    throw new AppError("Impossible de créer l'administrateur.", 500);
  }
}

/**
 * Deletes an admin account.
 * - Refuses to delete your own account (avoids self-lockout mid-session).
 * - Refuses to delete the last remaining admin (avoids locking everyone out
 *   of the dashboard permanently, since there's no public admin sign-up).
 */
export async function deleteAdmin(targetId: string, requestingAdminId: string) {
  if (targetId === requestingAdminId) {
    throw new AppError("Vous ne pouvez pas supprimer votre propre compte.", 400, "CANNOT_DELETE_SELF");
  }

  const totalAdmins = await prisma.admin.count();
  if (totalAdmins <= 1) {
    throw new AppError(
      "Impossible de supprimer le dernier administrateur restant.",
      400,
      "LAST_ADMIN"
    );
  }

  try {
    await prisma.admin.delete({ where: { id: targetId } });
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Administrateur introuvable.", 404, "ADMIN_NOT_FOUND");
    }
    console.error(`Database error in deleteAdmin for ID ${targetId}:`, error);
    throw new AppError("Impossible de supprimer l'administrateur.", 500);
  }
}