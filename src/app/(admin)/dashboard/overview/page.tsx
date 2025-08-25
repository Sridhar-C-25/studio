
import { getPosts, getCategories } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookText, LayoutGrid } from "lucide-react";
import { CategoryChart } from "./components/category-chart";
import { Category } from "@/types";

export default async function OverviewPage() {
  const posts = await getPosts();
  const categories: Category[] = await getCategories();

  const totalPosts = posts.length;
  const totalCategories = categories.length;
  const publishedCount = posts.filter(post => post.status === 'Published').length;
  const draftCount = posts.filter(post => post.status === 'Draft').length;

  const categoryPostCounts = categories.map((category, index) => {
    const count = posts.filter(post => post.category?.some(cat => cat.id === category.id)).length;
    return { name: category.name, postCount: count, fill: `hsl(var(--chart-${(index % 5) + 1}))` };
  }).filter(cat => cat.postCount > 0);


  return (
    <div>
      <h1 className="font-headline text-3xl font-bold tracking-tight">Overview</h1>
      <p className="text-muted-foreground mb-6">Welcome to your dashboard.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Posts
            </CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCount} published, {draftCount} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
             <p className="text-xs text-muted-foreground invisible">.</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-6 grid gap-6 md:grid-cols-2">
          <CategoryChart data={categoryPostCounts} />
        </div>
    </div>
  );
}
