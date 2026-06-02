import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify",
];
const ADMIN_PATHS = ["/admin", "/super-admin"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // Always allow public paths, static files, and API routes
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Unauthenticated → redirect to login
  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role guard: admin-only routes
  const role = session.user.role;
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
