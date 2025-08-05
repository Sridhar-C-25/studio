
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BrainCircuit, Loader2, Wand2, Check, ChevronsUpDown, X } from "lucide-react";

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost, Category } from "@/types";
import { suggestTitleVariants } from "@/ai/flows/suggest-title-variants";
import { suggestRelatedKeywords } from "@/ai/flows/suggest-related-keywords";
import { Textarea } from './ui/textarea';
import { TiptapEditor } from "./tiptap-editor";
import { createPost, updatePost } from "@/lib/data";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(100, "Content must be at least 100 characters long."),
  category: z.array(z.string()).min(1, "Please select at least one category."),
  adsenseTag: z.string().optional(),
});

type BlogEditorFormValues = z.infer<typeof formSchema>;

interface BlogEditorFormProps {
  initialData?: BlogPost & { category: string[] };
  categories: Category[];
}

export function BlogEditorForm({ initialData, categories }: BlogEditorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<
    "titles" | "keywords" | "none"
  >("none");
  const [titleVariants, setTitleVariants] = useState<string[]>([]);
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  const form = useForm<BlogEditorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      category: [],
      adsenseTag: "",
    },
  });
  
  const contentValue = form.watch('content');
  const titleValue = form.watch('title');
  const selectedCategories = form.watch('category');

  const onSubmit = async (data: BlogEditorFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await updatePost(initialData.id, data);
        toast({
          title: "Post updated!",
          description: `Your post "${data.title}" has been saved.`,
        });
      } else {
        await createPost(data);
        toast({
          title: "Post created!",
          description: `Your post "${data.title}" has been saved as a draft.`,
        });
      }
      router.push("/dashboard/blogs");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error.message || "Could not save the post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTitles = async () => {
    if (!contentValue) {
      toast({
        variant: 'destructive',
        title: 'Content is empty',
        description: 'Please write some content before suggesting titles.'
      });
      return;
    }
    setAiLoading("titles");
    setTitleVariants([]);
    try {
      const result = await suggestTitleVariants({ blogContent: contentValue });
      setTitleVariants(result.titleVariants);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to suggest titles. Please try again.'
      });
    } finally {
      setAiLoading("none");
    }
  };

  const handleSuggestKeywords = async () => {
    if (!contentValue) {
      toast({
        variant: 'destructive',
        title: 'Content is empty',
        description: 'Please write some content before suggesting keywords.'
      });
      return;
    }
    setAiLoading("keywords");
    setRelatedKeywords([]);
    try {
      const result = await suggestRelatedKeywords({ blogContent: contentValue });
      setRelatedKeywords(result.keywords);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to suggest keywords. Please try again.'
      });
    } finally {
      setAiLoading("none");
    }
  };

  const onPreview = () => {
    if (initialData) {
      router.push(`/blogs/${initialData.id}/preview`);
    } else {
      toast({
        variant: "destructive",
        title: "Cannot preview",
        description: "Please save the post as a draft first to enable preview.",
      });
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    const currentCategories = form.getValues('category');
    if (currentCategories.includes(categoryId)) {
      form.setValue('category', currentCategories.filter(id => id !== categoryId));
    } else {
      form.setValue('category', [...currentCategories, categoryId]);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., The Future of Artificial Intelligence"
                            {...field}
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <TiptapEditor
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
                <CardDescription>
                  Configure and publish your post.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Categories</FormLabel>
                       <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                             <span className="truncate">
                              {selectedCategories.length > 0
                                ? categories
                                    .filter(cat => selectedCategories.includes(cat.id))
                                    .map(cat => cat.name)
                                    .join(", ")
                                : "Select categories..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                            <CommandInput placeholder="Search categories..." />
                            <CommandList>
                              <CommandEmpty>No categories found.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => {
                                      handleCategorySelect(category.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCategories.includes(category.id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="adsenseTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google AdSense Tag</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="&lt;script&gt;...&lt;/script&gt;"
                            {...field}
                            className="font-code text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
              <CardFooter className="flex justify-between">
                 <Button variant="outline" type="button" onClick={onPreview}>Preview</Button>
                 <div className="flex items-center gap-2">
                  <Button type="submit" variant="secondary" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Draft
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {initialData ? "Update & Publish" : "Publish"}
                  </Button>
                 </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-accent" />
                  AI Content Tools
                </CardTitle>
                <CardDescription>
                  Enhance your content with AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSuggestTitles}
                    disabled={aiLoading !== 'none'}
                  >
                    {aiLoading === 'titles' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Suggest Title Variants
                  </Button>
                  {titleVariants.length > 0 && (
                     <div className="space-y-2 rounded-md border p-2">
                       {titleVariants.map((variant, i) => (
                         <div key={i} className="cursor-pointer rounded-md p-2 text-sm hover:bg-muted" onClick={() => form.setValue('title', variant, { shouldValidate: true })}>
                          {variant}
                         </div>
                       ))}
                     </div>
                  )}
                </div>
                <div className="space-y-2">
                   <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSuggestKeywords}
                    disabled={aiLoading !== 'none'}
                  >
                    {aiLoading === 'keywords' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Suggest Related Keywords
                  </Button>
                  {relatedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-md border p-2">
                      {relatedKeywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}

    