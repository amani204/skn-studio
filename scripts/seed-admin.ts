import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const plainPassword = process.env.ADMIN_PASSWORD_PLAIN!;

  if (!email || !plainPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD_PLAIN in .env.local first");
  }

  const hashed = await bcrypt.hash(plainPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });

  console.log("Admin ready:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());