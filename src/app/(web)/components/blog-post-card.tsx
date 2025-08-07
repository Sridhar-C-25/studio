
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";
import { getFilePreview } from '@/lib/data';

interface BlogPostCardProps {
  post: BlogPost;
}



export async function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
    >
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          <Link href={`/blogs/${post.id}`}>
            <Image
              src={post.banner_image?.length ? post.banner_image + '&mode=admin' : "https://placehold.co/600x400.png"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="blog abstract"
            />
          </Link>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          {post.category?.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="text-xs">
              <Link href={`/blogs/category/${cat.id}`}>{cat.name}</Link>
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 flex-grow">
          <Link href={`/blogs/${post.id}`}>{post.title}</Link>
        </h3>
          <Link href={`/blogs/${post.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm p-0 h-auto self-start"
          >
            Read More →
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
