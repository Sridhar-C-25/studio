
import { getPosts, getCategory } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
             <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                   <Link href={`/blogs/${post.id}`}>
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="blog abstract"
                      />
                   </Link>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {post.category.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">
                        <Link href={`/blogs/category/${cat.id}`}>{cat.name}</Link>
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    <Link href={`/blogs/${post.id}`}>{post.title}</Link>
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
