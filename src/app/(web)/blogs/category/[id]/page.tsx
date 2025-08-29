import { getPosts, getCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostCard } from "../../../_components/blog-post-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";

interface CategoryBlogPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryBlogPageProps): Promise<Metadata> {
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

export default async function CategoryBlogPage({
  params,
  searchParams,
}: CategoryBlogPageProps) {
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

  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);

  const paginatedPosts = publishedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold font-headline mb-2">
        Posts in: {category.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        Found {publishedPosts.length} posts in this category.
      </p>
      {paginatedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
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
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
