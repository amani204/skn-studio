import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only lets the request through if a valid session exists with role "admin"
        return token?.role === "admin";
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  // Protects everything under /admin EXCEPT /admin/login itself
  // (otherwise you'd get an infinite redirect loop: login page -> requires auth -> redirects to login page)
  matcher: ["/admin/((?!login).*)"],
};