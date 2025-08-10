"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types";
import { createCategory, updateCategory } from "@/lib/data";

const formSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryEditorFormProps {
  initialData?: Category;
}

export function CategoryEditorForm({ initialData }: CategoryEditorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await updateCategory(initialData.id, data.name);
        toast({
          title: "Category updated!",
          description: `The category has been renamed to "${data.name}".`,
        });
      } else {
        await createCategory(data.name);
        toast({
          title: "Category created!",
          description: `Category "${data.name}" has been created.`,
        });
      }
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          error.message || "Could not save the category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/dashboard/categories");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>
              {initialData ? "Edit Category" : "Create Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Category" : "Create Category"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
