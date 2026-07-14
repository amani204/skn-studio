import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 1. This is the secret path you share with nobody
const SECRET_LOGIN_PATH = "/admin/portal-97x-login";

// 2. This is your actual clean folder path in VS Code
const ACTUAL_LOGIN_FOLDER = "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthorized = token?.role === "admin";

  // If they try to go directly to the standard "/admin/login" folder, block them!
  if (pathname === ACTUAL_LOGIN_FOLDER) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If they use your secret URL
  if (pathname === SECRET_LOGIN_PATH) {
    if (isAuthorized) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    // 💡 THE MAGIC TRICK:
    // Keep "/admin/portal-97x-login" in the browser URL, but internally render "/admin/login"
    return NextResponse.rewrite(new URL(ACTUAL_LOGIN_FOLDER, req.url));
  }

  // Handle unauthorized access to dashboard areas
  if (!isAuthorized) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};