import { categories } from "@/lib/data";
import { CategoryClient } from "./components/client";

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <CategoryClient data={categories} />
    </div>
  );
}
