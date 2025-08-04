"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types";

interface CellActionProps {
  data: BlogPost;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onCopyId = () => {
    navigator.clipboard.writeText(data.id);
    toast({ title: "Copied!", description: "Post ID copied to clipboard." });
  };

  const onEdit = () => {
    router.push(`/dashboard/blogs/${data.id}/edit`);
  };
  
  const onPreview = () => {
    router.push(`/blogs/${data.id}/preview`);
  }

  const onDelete = () => {
    // In a real app, you would show a confirmation modal and then delete
    toast({ title: "Deleted", description: `Post "${data.title}" deleted.` });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId}>
          <Copy className="mr-2 h-4 w-4" /> Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPreview}>
          <Eye className="mr-2 h-4 w-4" /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
