import { posts, categories } from "@/lib/data";
import ClientPage from "./components/client";

export default function BlogsPage() {
  // In a real app, you'd fetch this from your database
  const formattedPosts = posts.map(post => ({
    ...post,
    categoryName: categories.find(c => c.name === post.category)?.name || 'N/A'
  }));

  return (
    <div className="space-y-4">
      <ClientPage data={formattedPosts} />
    </div>
  );
}
