import { getCategory } from "@/lib/data";
import { CategoryEditorForm } from "@/components/category-editor-form";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">Update the details of your category.</p>
      </div>
      <CategoryEditorForm initialData={category} />
    </div>
  );
}
