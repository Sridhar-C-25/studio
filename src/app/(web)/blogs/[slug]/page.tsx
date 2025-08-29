import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPostBySlug, getPosts, getCategories } from "@/lib/data";
import { BlogContent } from "./components/blog-content";
import { BlogSidebar } from "../../_components/blog-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const plainContent = post.content.replace(/<[^>]+>/g, "").substring(0, 160);
  const description = post.description || plainContent;
  const imageUrl = post.banner_image || "https://placehold.co/1200x630.png";
  const postKeywords = post.keywords
    ? post.keywords.split(",").map((k) => k.trim())
    : [];

  return {
    title: `${post.title}`,
    description: description,
    keywords: postKeywords,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.createdAt,
      url: `/blogs/${post.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    authors: [
      {
        name: "Code A Program",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      },
    ],
    other: {
      "article:tag": postKeywords,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.status !== "Published") {
    notFound();
  }

  const allPosts = await getPosts();
  const categories = await getCategories();

  const plainContent = post.content.replace(/<[^>]+>/g, "").substring(0, 160);
  const description = post.description || plainContent;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.banner_image || "https://placehold.co/1200x630.png",
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: "Sridhar Chandrasekar",
      url: "https://www.codeaprogram.tech/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Code A Program",
      logo: {
        "@type": "ImageObject",
        url: "https://www.codeaprogram.tech/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.codeaprogram.tech/blog/${post?.slug}`,
    },
    description: description,
    keywords: post.keywords || "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-4">
            <BlogContent post={post} />
          </div>
          <div className="lg:col-span-2">
            <BlogSidebar allPosts={allPosts} categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}