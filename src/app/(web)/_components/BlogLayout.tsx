import { Button } from "@/components/ui/button";
import { getCategories, getPosts } from "@/lib/data";
import { Category } from "@/types";
import { BlogPostCard } from "./blog-post-card";
import { BlogSidebar } from "./blog-sidebar";

export default async function BlogLayout() {
  const allPosts = await getPosts();
  const categories: Category[] = await getCategories();
  const publishedPosts = allPosts.filter((post) => post.status === "Published");

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Recent Posts</h2>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-center items-center gap-2 mt-8">
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
          </div> */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <BlogSidebar allPosts={allPosts} categories={categories} />
        </div>
      </div>
    </div>
  );
}
