import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect /dashboard — only ADMIN
    if (pathname.startsWith("/dashboard") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/pengunjung", req.url));
    }

    // Protect /pengunjung — must be logged in (any role)
    if (pathname.startsWith("/pengunjung") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/pengunjung/:path*"],
};
