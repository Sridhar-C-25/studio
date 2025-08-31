import { getCategories, getPosts } from "@/lib/data";
import { Category } from "@/types";
import { BlogPostCard } from "./blog-post-card";
import { BlogSidebar } from "./blog-sidebar";
import { Pagination } from "@/components/ui/pagination";

export default async function BlogLayout({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const publishedPosts = await getPosts();
  const categories: Category[] = await getCategories();

  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);

  const paginatedPosts = publishedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Recent Posts</h2>
          </div>

          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedPosts.map((post) => (
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
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <BlogSidebar allPosts={publishedPosts} categories={categories} />
        </div>
      </div>
    </div>
  );
}
