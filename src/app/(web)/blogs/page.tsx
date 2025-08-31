import { getPosts, getCategories } from "@/lib/data";
import { BlogPostCard } from "../_components/blog-post-card";
import { BlogSidebar } from "../_components/blog-sidebar";
import type { Category } from "@/types";
import { Pagination } from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import Script from "next/script";

// Define metadata for the blogs page
export const metadata: Metadata = {
  title: "Blog | Code A Program",
  description:
    "Explore our collection of articles about React.js, Tailwind CSS, Next.js, JavaScript, HTML, CSS and modern web development techniques and best practices.",
  alternates: {
    canonical: "https://www.codeaprogram.tech/blogs",
  },
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
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

  // Structured data for blog listing page
  const blogListingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.codeaprogram.tech/blogs#webpage",
    url: `https://www.codeaprogram.tech/blogs${
      currentPage > 1 ? `?page=${currentPage}` : ""
    }`,
    name: "Blog | Firebase Studio",
    description:
      "Explore our collection of articles about Firebase, Next.js, and modern web development techniques and best practices.",
    isPartOf: {
      "@id": "https://www.codeaprogram.tech/#website",
    },
    breadcrumb: {
      "@id": "https://www.codeaprogram.tech/blogs#breadcrumb",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: paginatedPosts.map((post, index) => ({
        "@type": "ListItem",
        position: (currentPage - 1) * postsPerPage + index + 1,
        name: post.title,
        url: `https://www.codeaprogram.tech/blogs/${post.slug}`,
      })),
    },
    inLanguage: "en-US",
  };

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      {/* Add structured data for blog listing */}
      <Script
        id="blog-listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogListingJsonLd),
        }}
      />

      {/* Add breadcrumb structured data */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": "https://www.codeaprogram.tech/blogs#breadcrumb",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.codeaprogram.tech",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.codeaprogram.tech/blogs",
              },
            ],
          }),
        }}
      />

      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blogs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mb-8 px-4">
            <h1 className="md:text-4xl text-3xl font-bold font-headline mb-4">
              Our Blog
            </h1>
            <p className="text-muted-foreground">
              {publishedPosts.length}{" "}
              {publishedPosts.length === 1 ? "article" : "articles"} available
            </p>
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
        <div className="lg:col-span-2 mt-20">
          <BlogSidebar allPosts={publishedPosts} categories={categories} />
        </div>
      </div>
    </div>
  );
}
