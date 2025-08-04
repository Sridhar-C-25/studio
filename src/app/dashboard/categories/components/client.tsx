
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../blogs/components/data-table"; // Reusing the data table
import { columns } from "./columns";
import type { Category } from "@/types";

interface CategoryClientProps {
  data: Category[];
}

export function CategoryClient({ data }: CategoryClientProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your blog categories.</p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
}
