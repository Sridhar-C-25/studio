import { getPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostCard } from "../../_components/blog-post-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { makeSlug } from "@/lib/helper";

interface TagBlogPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: TagBlogPageProps): Promise<Metadata> {
  const allPosts = await getPosts();
  const tagName = allPosts
    .flatMap((post) => post.keywords?.split(",").map((k) => k.trim()) || [])
    .find((tag) => makeSlug(tag) === params.slug);

  if (!tagName) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `Posts tagged with "${tagName}" | Blog`,
    description: `Browse all blog posts tagged with "${tagName}".`,
  };
}

export default async function TagBlogPage({
  params,
  searchParams,
}: TagBlogPageProps) {
  const allPosts = await getPosts();
  const publishedPosts = allPosts.filter(
    (post) =>
      post.status === "Published" &&
      post.keywords
        ?.split(",")
        .map((k) => makeSlug(k.trim()))
        .includes(params.slug)
  );

  const tagName = allPosts
    .flatMap((post) => post.keywords?.split(",").map((k) => k.trim()) || [])
    .find((tag) => makeSlug(tag) === params.slug);

  if (!tagName) {
    notFound();
  }

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
            <BreadcrumbPage>Tag: {tagName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold font-headline mb-2">
        Tag: {tagName}
      </h1>
      <p className="text-muted-foreground mb-8">
        Found {publishedPosts.length} posts with this tag.
      </p>
      {paginatedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No posts found!</h2>
          <p className="text-muted-foreground">
            There are no posts with this tag yet.
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
