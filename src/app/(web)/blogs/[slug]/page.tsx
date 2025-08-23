import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPostBySlug, getPosts, getCategories } from "@/lib/data";
import { BlogContent } from "./components/blog-content";
import { BlogSidebar } from "../../_components/blog-sidebar";

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
  const imageUrl = post.banner_image || "https://placehold.co/1200x630.png";

  return {
    title: `${post.title}`,
    description: plainContent,
    openGraph: {
      title: post.title,
      description: plainContent,
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
      description: plainContent,
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
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.status !== "Published") {
    notFound();
  }

  const allPosts = await getPosts();
  const categories = await getCategories();

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
      url: "https://codeaprogram.tech/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Code A Program",
      logo: {
        "@type": "ImageObject",
        url: "https://codeaprogram.tech/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://codeaprogram.tech/blog/${post?.slug}`,
    },
    description: post.content
      .replace(/<[^>]+>/g, "")
      .substring(0, 160)
      .trim(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto md:px-4 px-1 py-8">
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
