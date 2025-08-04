import { getPosts, getCategories } from "@/lib/data";
import ClientPage from "./components/client";

export default async function BlogsPage() {
  const posts = await getPosts();
  const categories = await getCategories();
  
  const formattedPosts = posts.map(post => {
    const category = categories.find(c => c.id === post.category);
    return {
        ...post,
        categoryName: category?.name || "Uncategorized",
    }
  });

  return (
    <div className="space-y-4">
      <ClientPage data={formattedPosts} />
    </div>
  );
}
