import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminClient, getSessionClient } from "@/lib/appwrite";
import { getCurrentUser } from "./lib/authActions";

const protectedRoutesWithMethods = [
  {
    path: "/api/posts",
    methods: ["POST", "PUT", "DELETE"],
  },
  {
    path: "/api/category",
    methods: ["POST", "PUT", "DELETE"],
  },
  {
    path: "/api/upload",
    methods: ["POST"],
  },
];
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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

  if (protectedRoutesWithMethods.some((route) => route.path === pathname)) {
    const method = req.method;
    if (
      protectedRoutesWithMethods
        .find((route) => route.path === pathname)
        ?.methods.includes(method) === false
    ) {
      return NextResponse.next();
    }
    try {
      const { teams } = await getAdminClient();
      console.log("teams", teams);
      const memberships = await teams.list();

      const isAdmin = memberships.teams.some(
        (team) => team.$id === process.env.APPWRITE_ADMIN_TEAM_ID
      );

      if (!isAdmin) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to perform this action" },
          { status: 403 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to perform this action" },
        { status: 403 }
      );
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
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/api/:path*"],
};
