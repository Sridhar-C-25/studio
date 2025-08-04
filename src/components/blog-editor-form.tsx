"use client";

import 'react-quill/dist/quill.snow.css';
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BrainCircuit, Loader2, Wand2 } from "lucide-react";
import dynamic from 'next/dynamic';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost, Category } from "@/types";
import { suggestTitleVariants } from "@/ai/flows/suggest-title-variants";
import { suggestRelatedKeywords } from "@/ai/flows/suggest-related-keywords";
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(100, "Content must be at least 100 characters long."),
  category: z.string({ required_error: "Please select a category." }),
  adsenseTag: z.string().optional(),
});

type BlogEditorFormValues = z.infer<typeof formSchema>;

interface BlogEditorFormProps {
  initialData?: BlogPost;
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

  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  const form = useForm<BlogEditorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      adsenseTag: "",
    },
  });
  
  const contentValue = form.watch('content');
  const titleValue = form.watch('title');

  const onSubmit = (data: BlogEditorFormValues) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: initialData ? "Post updated!" : "Post created!",
        description: `Your post "${data.title}" has been saved.`,
      });
      router.push("/dashboard/blogs");
    }, 1000);
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
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-96"
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
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            placeholder="<script>...</script>"
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
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {initialData ? "Update Post" : "Create Post"}
                </Button>
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
