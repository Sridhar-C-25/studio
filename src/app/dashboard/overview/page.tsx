import { getPosts, getCategories } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookText, LayoutGrid } from "lucide-react";

export default async function OverviewPage() {
  const posts = await getPosts();
  const categories = await getCategories();

  const totalPosts = posts.length;
  const totalCategories = categories.length;
  const publishedCount = posts.filter(post => post.status === 'Published').length;
  const draftCount = posts.filter(post => post.status === 'Draft').length;

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
    </div>
  );
}
