
import { getPosts, getCategories } from "@/lib/data";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const publishedPosts = posts.filter((post) => post.status === "Published");

  const postUrls = publishedPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.id}`,
    lastModified: new Date(post.createdAt),
  }));

  const categories = await getCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blogs/category/${category.id}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/youtube`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date() },
  ];

  return [...staticUrls, ...postUrls];
}
