import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rename this to something non-obvious if you want extra obscurity,
// e.g. "/admin/portal-x7k" instead of "/admin/login".
// Just remember to update the matcher below and any links pointing to it.
const LOGIN_PATH = "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page itself through, unauthenticated
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthorized = token?.role === "admin";

  if (!isAuthorized) {
    // API routes need a real error response, not a redirect —
    // a fetch() call following a redirect to "/" would get HTML back, not JSON.
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Page routes redirect to the homepage, not a login page —
    // reveals nothing about an admin panel existing at all.
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};