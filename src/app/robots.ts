import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"], // allow everything by default
        disallow: ["/dashboard", "/dashboard/*", "/api", "/api/*", "/sign-in", "/sign-up", "/verify-email"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
