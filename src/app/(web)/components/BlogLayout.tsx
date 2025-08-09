

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitHubFilledIcon,
  InstagramFilledIcon,
  YouTubeFilledIcon,
} from "./icon";
import Link from "next/link";
import { getCategories, getPosts } from "@/lib/data";
import { Category } from "@/types";
import Image from "next/image";
import { BlogPostCard } from "./blog-post-card";
import { BlogSidebar } from "./blog-sidebar";

export default async function BlogLayout() {
  const allPosts = await getPosts();
  const categories: Category[] = await getCategories();
  const publishedPosts = allPosts.filter(
    (post) => post.status === "Published"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Recent Posts</h1>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {publishedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled>
              ←
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm">
              41
            </Button>
            <Button variant="outline" size="sm">
              →
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar allPosts={allPosts} categories={categories} />
        </div>
      </div>
    </div>
  );
}
