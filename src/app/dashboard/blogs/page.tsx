import { getPosts } from "@/lib/data";
import ClientPage from "./components/client";
import type { BlogPost } from "@/types";

export default async function BlogsPage() {
  const posts: BlogPost[] = await getPosts();
  
  const formattedPosts = posts.map(post => {
    return {
        ...post,
        categoryName: post.category ? post.category.name : "Uncategorized",
    }
  });

  return (
    <div className="space-y-4">
      <ClientPage data={formattedPosts} />
    </div>
  );
}
