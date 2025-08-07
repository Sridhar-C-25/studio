
import { getPosts } from "@/lib/data";
import { BlogPostCard } from "../components/blog-post-card";


export default async function BlogsPage() {
  const posts = await getPosts();
  const publishedPosts = posts.filter((post) => post.status === "Published");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">Our Blog</h1>
      {publishedPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No posts yet!</h2>
          <p className="text-muted-foreground">Check back later for new articles.</p>
        </div>
      )}
    </div>
  );
}
