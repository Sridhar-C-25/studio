
import { getPosts, getCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostCard } from "../../../components/blog-post-card";

interface CategoryBlogPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CategoryBlogPageProps): Promise<Metadata> {
  const category = await getCategory(params.id);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `Posts in ${category.name} | Blog`,
    description: `Browse all blog posts in the ${category.name} category.`,
  };
}

export default async function CategoryBlogPage({ params }: CategoryBlogPageProps) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  const allPosts = await getPosts();
  const publishedPosts = allPosts.filter(
    (post) =>
      post.status === "Published" &&
      post.category.some((cat) => cat.id === params.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-2">
        Posts in: {category.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        Found {publishedPosts.length} posts in this category.
      </p>
      {publishedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
             <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No posts yet!</h2>
          <p className="text-muted-foreground">
            There are no posts in this category yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
