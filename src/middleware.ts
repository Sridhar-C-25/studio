import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionClient } from "@/lib/appwrite";

export async function middleware(req: NextRequest) {
  console.log("middleware");
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const { account, teams } = await getSessionClient();
      const memberships = await teams.list();

      const isAdmin = memberships.teams.some(
        (team) => team.name.toLowerCase() === "super users"
      );

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.log("err", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
