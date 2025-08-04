import { getCategories } from "@/lib/data";
import { BlogEditorForm } from "@/components/blog-editor-form";

export default async function NewBlogPage() {
  const categories = await getCategories();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new blog post.</p>
      </div>
      <BlogEditorForm categories={categories} />
    </div>
  );
}
