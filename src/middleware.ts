import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionClient } from "@/lib/appwrite";
import { getCurrentUser } from "./lib/authActions";

export async function middleware(req: NextRequest) {
  const user = await getCurrentUser();

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      const { teams } = await getSessionClient();
      const memberships = await teams.list();

      const isAdmin = memberships.teams.some(
        (team) => team.$id === process.env.APPWRITE_ADMIN_TEAM_ID
      );

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.log("err", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (
    user &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
