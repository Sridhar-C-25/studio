import { getPosts, getCategories } from "@/lib/data";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const publishedPosts = posts.filter((post) => post.status === "Published");

  const postUrls = publishedPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.createdAt),
    priority: 0.9,
  }));

  const categories = await getCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blogs/category/${category.id}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 }, // homepage gets highest priority
    { url: `${baseUrl}/blogs`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/youtube`, lastModified: new Date(), priority: 0.7 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...postUrls, ...categoryUrls];
}
