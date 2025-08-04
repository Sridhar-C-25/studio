"use client";

import type { BlogPost } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<BlogPost & { categoryName: string }>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    )
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'Published' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
