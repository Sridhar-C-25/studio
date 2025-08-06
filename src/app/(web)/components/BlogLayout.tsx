
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

export default async function BlogLayout() {
  const allPosts = await getPosts();
  const publishedPosts = allPosts.filter(
    (post) => post.status === "Published"
  );

  const popularPosts = publishedPosts.slice(0, 5);
  const categories: Category[] = await getCategories();

  const categoriesWithCount = categories.map(category => {
    const postCount = allPosts.filter(post => post.category?.some(cat => cat.id === category.id)).length;
    return {
      ...category,
      postCount
    }
  });


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
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                   <Image
                      src="https://placehold.co/600x400.png"
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="blog abstract"
                    />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {post.category.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                   <Link href={`/blogs/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs p-0 h-auto"
                    >
                      Read More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
        <div className="lg:col-span-1 space-y-6">
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
                <div className="flex items-center justify-between p-3 bg-red-600 text-white rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <GitHubFilledIcon className="w-8 h-8" />
                    <span className="text-sm">GitHub</span>
                  </div>
                  <span className="text-sm">400+ Followers</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Advertisement */}

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
                      src="https://placehold.co/100x100.png"
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
                      <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                    </h4>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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

          {/* Featured Post */}
          <Card className="bg-yellow-500 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-xs">JS</span>
                </div>
                <h4 className="font-semibold text-sm mb-2">
                  JAVASCRIPT PROJECTS
                </h4>
                <p className="text-xs opacity-90 mb-3">
                  Best 30+ JavaScript Projects for Practice (With Source Code)
                </p>
                <p className="text-xs">Coming Soon</p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
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
    </div>
  );
}
