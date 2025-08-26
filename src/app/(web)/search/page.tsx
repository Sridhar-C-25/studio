import { searchPosts } from "@/lib/data";
import { Suspense } from "react";
import { BlogPostCard } from "../_components/blog-post-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { SearchIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q;
  return {
    title: `Search results for "${query}"`,
    description: `Find blog posts related to "${query}".`,
  };
}

async function SearchResults({ query }: { query: string }) {
  const posts = await searchPosts(query);

  return (
    <>
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-muted-foreground">
            Try searching for something else.
          </p>
        </div>
      )}
    </>
  );
}

function SearchSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  if (!query) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Search for something</h2>
        <p className="text-muted-foreground">
          Enter a term in the search bar to find blog posts.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:px-4 px-1 py-8">
      <div className="flex items-center gap-2 mb-8">
        <SearchIcon className="h-8 w-8 text-primary"/>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Search results for:{" "}
          <span className="text-primary">&quot;{query}&quot;</span>
        </h1>
      </div>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
