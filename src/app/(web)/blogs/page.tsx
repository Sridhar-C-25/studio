import { getPosts, getCategories } from "@/lib/data";
import { BlogPostCard } from "../_components/blog-post-card";
import { BlogSidebar } from "../_components/blog-sidebar";
import type { Category } from "@/types";

export default async function BlogsPage() {
  const allPosts = await getPosts();
  const categories: Category[] = await getCategories();
  const publishedPosts = allPosts.filter((post) => post.status === "Published");

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline mb-4">Our Blog</h1>
            <p className="text-muted-foreground">
              {publishedPosts.length}{" "}
              {publishedPosts.length === 1 ? "article" : "articles"} available
            </p>
          </div>

          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">No posts yet!</h2>
              <p className="text-muted-foreground">
                Check back later for new articles.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 mt-20">
          <BlogSidebar allPosts={allPosts} categories={categories} />
        </div>
      </div>
    </div>
  );
}
