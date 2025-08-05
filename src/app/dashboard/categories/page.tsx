import { getCategories, getPosts } from "@/lib/data";
import { CategoryClient } from "./components/client";
import { Category } from "@/types";

export default async function CategoriesPage() {
  const categories = await getCategories();
  const posts = await getPosts();

  const categoriesWithCount = categories.map(category => {
    const postCount = posts.filter(post => post.category?.$id === category.id).length;
    return {
      ...category,
      postCount
    }
  })

  return (
    <div className="space-y-4">
      <CategoryClient data={categoriesWithCount} />
    </div>
  );
}
