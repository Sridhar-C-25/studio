import { posts, categories } from "@/lib/data";
import { BlogEditorForm } from "@/components/blog-editor-form";
import { notFound } from "next/navigation";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Update the details of your blog post.</p>
      </div>
      <BlogEditorForm initialData={post} categories={categories} />
    </div>
  );
}
