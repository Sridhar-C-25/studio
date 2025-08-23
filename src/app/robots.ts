import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/contact",
        "/blogs",
        "/blogs/*",
        "/blogs/category/*",
        "/youtube",
        "/privacy-policy",
        "/terms-conditions",
      ],
      disallow: ["/dashboard/*", "/api/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
