import { getPost, getCategories } from "@/lib/data";
import { BlogEditorForm } from "@/components/blog-editor-form";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const post: BlogPost | null = await getPost(params.id);
  const categories = await getCategories();
  if (!post) {
    notFound();
  }

  const postForForm = {
    ...post,
    category: post.category?.map((cat) => cat.id) || [],
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Edit Post
        </h1>
        <p className="text-muted-foreground">
          Update the details of your blog post.
        </p>
      </div>
      <BlogEditorForm initialData={postForForm} categories={categories} />
    </div>
  );
}
