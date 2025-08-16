// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSessionClient } from "@/lib/appwrite";
// import { getCurrentUser } from "./lib/authActions";

// export async function middleware(req: NextRequest) {
//   const user = await getCurrentUser();

//   if (req.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!user) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     try {
//       const { teams } = await getSessionClient();
//       const memberships = await teams.list();

//       const isAdmin = memberships.teams.some(
//         (team) => team.$id === process.env.APPWRITE_ADMIN_TEAM_ID
//       );

//       if (!isAdmin) {
//         return NextResponse.redirect(new URL("/", req.url));
//       }
//     } catch (err) {
//       console.log("err", err);
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }
//   }

//   if (user && (req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/sign-up"))) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminClient, getSessionClient } from "@/lib/appwrite";
import { getCurrentUser } from "./lib/authActions";

// Types for better type safety
interface AdminCheckResult {
  isAdmin: boolean;
  user: any;
  error?: string;
}

// Enhanced admin check with detailed error handling
async function checkAdminStatus(): Promise<AdminCheckResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        isAdmin: false,
        user: null,
        error: "No authenticated user found",
      };
    }

    const { teams } = await getSessionClient();
    const memberships = await teams.list();

    const isAdmin = memberships.teams.some(
      (team) => team.$id === process.env.APPWRITE_ADMIN_TEAM_ID
    );

    if (!isAdmin) {
      return {
        isAdmin: false,
        user,
        error: `User ${user.email} is not in admin team`,
      };
    }

    return { isAdmin: true, user };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return {
      isAdmin: false,
      user: null,
      error: `Admin check failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

// Configuration for protected routes
const PROTECTED_API_ROUTES = {
  "/api/posts": ["POST", "PUT", "DELETE"],
  "/api/category": ["POST", "PUT", "DELETE"],
  "/api/upload": ["POST", "DELETE"],
};

// Check if the current request needs admin protection
function requiresAdminAccess(pathname: string, method: string): boolean {
  for (const [route, methods] of Object.entries(PROTECTED_API_ROUTES)) {
    if (pathname.startsWith(route) && methods.includes(method)) {
      return true;
    }
  }
  return false;
}

// Create detailed error responses
function createErrorResponse(status: number, error: string, details?: string) {
  const response = {
    error,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };

  return NextResponse.json(response, { status });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const userAgent = req.headers.get("user-agent") || "unknown";

  // Log API requests for monitoring
  if (pathname.startsWith("/api/")) {
    console.log(
      `API Request: ${method} ${pathname} - User-Agent: ${userAgent}`
    );
  }

  // Protect admin API routes
  if (requiresAdminAccess(pathname, method)) {
    const adminCheck = await checkAdminStatus();
    console.log("adminCheck", adminCheck);
    const adminClient = getAdminClient();
    const { users } = await adminClient;
    if (!adminCheck.isAdmin) {
      console.warn(
        `Unauthorized API access attempt: ${method} ${pathname} - ${adminCheck.error}`
      );

      if (!adminCheck.user) {
        return createErrorResponse(
          401,
          "Authentication required",
          "Please sign in to access this resource"
        );
      }
      return createErrorResponse(
        403,
        "Forbidden: Admin access required",
        "You don't have permission to perform this action"
      );
    }

    console.log(
      `Admin API access granted: ${method} ${pathname} - User: ${adminCheck.user.email}`
    );
  }

  // Dashboard protection (existing logic with enhancements)
  if (pathname.startsWith("/dashboard")) {
    const adminCheck = await checkAdminStatus();

    if (!adminCheck.isAdmin) {
      console.warn(`Dashboard access denied: ${adminCheck.error}`);

      if (!adminCheck.user) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }

      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log(`Dashboard access granted: User: ${adminCheck.user.email}`);
  }

  // Redirect authenticated users away from auth pages
  try {
    const user = await getCurrentUser();
    if (
      user &&
      (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    ) {
      console.log(
        `Redirecting authenticated user ${user.email} from auth page to dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    console.error("Error checking user status for auth redirect:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Dashboard routes
    "/dashboard/:path*",

    // Auth pages
    "/sign-in",
    "/sign-up",

    // Protected API routes
    "/api/posts/:path*",
    "/api/category/:path*",
    "/api/upload/:path*",
  ],
};

// Export helper function for use in API routes (optional)
export { checkAdminStatus };
