import { CategoryEditorForm } from "@/components/category-editor-form";

export default async function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Create New Category</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new category.</p>
      </div>
      <CategoryEditorForm />
    </div>
  );
}
