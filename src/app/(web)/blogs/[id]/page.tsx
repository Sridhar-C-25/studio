
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPost } from "@/lib/data";
import { BlogContent } from "./components/blog-content";

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

  return {
    title: `${post.title} | Blog`,
    description: post.content.replace(/<[^>]+>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]+>/g, '').substring(0, 160),
      type: 'article',
      publishedTime: post.createdAt,
      url: `/blogs/${post.id}`,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getPost(params.id);

  if (!post || post.status !== 'Published') {
    notFound();
  }

  return <BlogContent post={post} />;
}
