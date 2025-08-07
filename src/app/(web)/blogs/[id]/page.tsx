

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPost, getPosts, getCategories } from "@/lib/data";
import { BlogContent } from "./components/blog-content";
import { BlogSidebar } from "../../components/blog-sidebar";

interface BlogPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const plainContent = post.content.replace(/<[^>]+>/g, '').substring(0, 160);
  const imageUrl = post.banner_image || "https://placehold.co/1200x630.png";

  return {
    title: `${post.title} | Blog`,
    description: plainContent,
    openGraph: {
      title: post.title,
      description: plainContent,
      type: 'article',
      publishedTime: post.createdAt,
      url: `/blogs/${post.id}`,
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
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getPost(params.id);

  if (!post || post.status !== 'Published') {
    notFound();
  }
  
  const allPosts = await getPosts();
  const categories = await getCategories();

  return (
     <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
           <BlogContent post={post} />
        </div>
        <div className="lg:col-span-1">
          <BlogSidebar allPosts={allPosts} categories={categories} />
        </div>
      </div>
    </div>
  )
}
