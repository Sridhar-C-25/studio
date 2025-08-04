import { getCategories } from "@/lib/data";
import { CategoryClient } from "./components/client";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-4">
      <CategoryClient data={categories} />
    </div>
  );
}
