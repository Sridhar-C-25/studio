
import { getPosts, getCategory } from "@/lib/data";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <Link href={`/blogs/${post.id}`} key={post.id} className="group">
              <Card className="h-full flex flex-col transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  {post.category && post.category.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.category.map((cat) => (
                        <Badge key={cat.id} variant="secondary">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.content.replace(/<[^>]+>/g, "").substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center font-semibold text-primary">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
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
