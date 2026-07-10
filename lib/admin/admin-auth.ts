import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the admin session, or null if not authenticated as admin. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}