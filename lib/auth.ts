import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — admin sessions expire, don't stay alive forever
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use email as the rate-limit key — simple and effective at this scale
        const rateLimitKey = credentials.email.toLowerCase();

        if (isRateLimited(rateLimitKey)) {
          throw new Error("Too many attempts. Try again in 15 minutes.");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        // Deliberately generic error for both "no such admin" and "wrong password" —
        // never reveal which one it was, that leaks whether an email exists in the system
        if (!admin) {
          recordFailedAttempt(rateLimitKey);
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, admin.password);

        if (!isValidPassword) {
          recordFailedAttempt(rateLimitKey);
          throw new Error("Invalid email or password");
        }

        clearAttempts(rateLimitKey);

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name ?? "Admin",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};