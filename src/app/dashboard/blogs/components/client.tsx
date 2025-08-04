"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { BlogPost } from "@/types";

interface ClientPageProps {
  data: (BlogPost & { categoryName: string })[];
}

export default function ClientPage({ data }: ClientPageProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts here.</p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} searchKey="title" />
    </>
  );
}
