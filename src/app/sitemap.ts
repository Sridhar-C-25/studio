import { getPosts, getCategories } from "@/lib/data";
import { MetadataRoute } from "next";
import { makeSlug } from "@/lib/helper";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.codeaprogram.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getPosts();
    const publishedPosts = posts.filter((post) => post.status === "Published");

    // Blog post URLs
    const postUrls = publishedPosts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Category URLs
    const categories = await getCategories();
    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/blogs/category/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    
    // Tag URLs
    const allKeywords = publishedPosts.flatMap(
      (post) => post.keywords?.split(",").map((k) => k.trim()) || []
    );
    const uniqueKeywords = [...new Set(allKeywords)];
    const tagUrls = uniqueKeywords.map((tag) => ({
      url: `${baseUrl}/tag/${makeSlug(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));


    // Static page URLs
    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/youtube`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/search?q=`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];

    return [...staticUrls, ...postUrls, ...categoryUrls, ...tagUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap with just static pages
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];
  }
}
