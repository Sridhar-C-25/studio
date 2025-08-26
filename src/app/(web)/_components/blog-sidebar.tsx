import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitHubFilledIcon,
  InstagramFilledIcon,
  YouTubeFilledIcon,
} from "./icon";
import Link from "next/link";
import type { BlogPost, Category } from "@/types";
import Image from "next/image";
import { SearchBar } from "./search-bar";

interface BlogSidebarProps {
  allPosts: BlogPost[];
  categories: Category[];
}

export function BlogSidebar({ allPosts, categories }: BlogSidebarProps) {
  const publishedPosts = allPosts.filter((post) => post.status === "Published");

  const popularPosts = publishedPosts.slice(0, 5);

  const categoriesWithCount = categories.map((category) => {
    const postCount = allPosts.filter((post) =>
      post.category?.some((cat) => cat.id === category.id)
    ).length;
    return {
      ...category,
      postCount,
    };
  });

  return (
    <div className="space-y-6 h-full">
      {/* Search Bar */}
       <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Search</h3>
        </CardHeader>
        <CardContent>
          <SearchBar />
        </CardContent>
      </Card>
      {/* Follow Us Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Follow Us</h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2.5">
          <Link
            href="https://www.youtube.com/@codeaprogram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between p-3 bg-red-600 text-white rounded-lg border">
              <div className="flex items-center gap-3">
                <YouTubeFilledIcon className="w-8 h-8" />
                <span className="text-sm">YouTube</span>
              </div>
              <span className="text-sm">10k+ Subscribers</span>
            </div>
          </Link>
          <Link
            href="https://www.instagram.com/codeaprogram/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg border">
              <div className="flex items-center gap-3">
                <InstagramFilledIcon className="w-8 h-8" />
                <span className="text-sm">Instagram</span>
              </div>
              <span className="text-sm">130+ Followers</span>
            </div>
          </Link>
          {/* github */}
          <Link
            href="https://github.com/sridhar-c-25"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg border">
              <div className="flex items-center gap-3">
                <GitHubFilledIcon className="w-8 h-8" />
                <span className="text-sm">GitHub</span>
              </div>
              <span className="text-sm">400+ Followers</span>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Most Popular */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Most Popular</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post.id} className="flex gap-3">
              <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center relative overflow-hidden">
                <Image
                  src={post.banner_image || "https://placehold.co/100x100.png"}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="tech abstract"
                />
                <span className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 mb-1 hover:text-primary">
                  <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" disabled>
              ←
            </Button>
            <Button variant="outline" size="sm">
              →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="sticky top-24">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Categories</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoriesWithCount.map((category) => (
                <Link
                  href={`/blogs/category/${category.id}`}
                  key={category.id}
                  className="flex justify-between items-center py-1 group"
                >
                  <span className="text-sm group-hover:text-primary cursor-pointer transition-colors">
                    {category.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {category.postCount}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
