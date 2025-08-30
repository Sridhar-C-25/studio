"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  BrainCircuit,
  Loader2,
  Wand2,
  Check,
  ChevronsUpDown,
  Upload,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { suggestDescription } from "@/ai/flows/suggest-description";
import { Textarea } from "./ui/textarea";
import { TiptapEditor } from "./tiptap-editor";
import { createPost, updatePost, uploadFile, getPosts } from "@/lib/data";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(100, "Content must be at least 100 characters long."),
  description: z.string().optional(),
  category: z.array(z.string()).min(1, "Please select at least one category."),
  adsenseTag: z.string().optional(),
  banner_image: z.any().optional(),
  src_link: z.string().optional(),
  keywords: z.string().optional(),
});

type BlogEditorFormValues = z.infer<typeof formSchema>;

interface BlogEditorFormProps {
  initialData?: BlogPost & { category: string[] };
  categories: Category[];
}

export function BlogEditorForm({
  initialData,
  categories,
}: BlogEditorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<
    "titles" | "keywords" | "description" | "none"
  >("none");
  const [titleVariants, setTitleVariants] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.banner_image || null
  );
  
  // New states for tag suggestions
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [selectedTagCategory, setSelectedTagCategory] = useState<string>("");
  const [categoryBasedTags, setCategoryBasedTags] = useState<string[]>([]);

  const form = useForm<BlogEditorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      {
        ...initialData,
        banner_image: undefined,
        keywords: initialData?.keywords || "",
        description: initialData?.description || "",
      } || {
        title: "",
        content: "",
        description: "",
        category: [],
        adsenseTag: "",
        banner_image: undefined,
        src_link: null,
        keywords: "",
      },
  });

  const contentValue = form.watch("content");
  const titleValue = form.watch("title");
  const selectedCategories = form.watch("category");

  useEffect(() => {
    // Fetch all posts on component mount
    const fetchPosts = async () => {
      const posts = await getPosts();
      setAllPosts(posts);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedTagCategory) {
      const relatedPosts = allPosts.filter(post => 
        post.category.some(cat => cat.id === selectedTagCategory)
      );
      const tags = relatedPosts.flatMap(post => post.keywords?.split(',').map(k => k.trim()) || []);
      const uniqueTags = [...new Set(tags)].filter(Boolean);
      setCategoryBasedTags(uniqueTags);
    } else {
      setCategoryBasedTags([]);
    }
  }, [selectedTagCategory, allPosts]);

  const onSubmit = async (
    data: BlogEditorFormValues,
    status: "Draft" | "Published"
  ) => {
    setLoading(true);
    try {
      let bannerImageUrl: string | undefined = initialData?.banner_image;

      if (
        data.banner_image &&
        typeof data.banner_image === "object" &&
        data.banner_image.size > 0
      ) {
        const imageFile = data.banner_image as File;
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const uploadedFile = await uploadFile(
          `data:${imageFile.type};base64,${base64}`,
          imageFile.name
        );
        bannerImageUrl = uploadedFile?.fileUrl;
      }

      const postData = {
        title: data.title,
        content: data.content,
        description: data.description,
        category: data.category,
        adsenseTag: data.adsenseTag,
        status,
        banner_image: bannerImageUrl,
        src_link: data.src_link,
        keywords: data.keywords,
      };

      if (initialData) {
        await updatePost(initialData.id, postData);
        toast({
          title: "Post updated!",
          description: `Your post "${data.title}" has been saved.`,
        });
      } else {
        await createPost(postData);
        toast({
          title: `Post ${
            status === "Published" ? "published" : "saved as draft"
          }!`,
          description: `Your post "${data.title}" has been saved.`,
        });
      }
      router.push("/dashboard/blogs");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          error.message || "Could not save the post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTitles = async () => {
    if (!contentValue) {
      toast({
        variant: "destructive",
        title: "Content is empty",
        description: "Please write some content before suggesting titles.",
      });
      return;
    }
    setAiLoading("titles");
    setTitleVariants([]);
    try {
      const result = await suggestTitleVariants({
        blogContent: contentValue,
        numVariants: 5,
      });
      setTitleVariants(result.titleVariants);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to suggest titles. Please try again.",
      });
    } finally {
      setAiLoading("none");
    }
  };

  const handleSuggestKeywords = async () => {
    if (!contentValue) {
      toast({
        variant: "destructive",
        title: "Content is empty",
        description: "Please write some content before suggesting keywords.",
      });
      return;
    }
    setAiLoading("keywords");
    try {
      const result = await suggestRelatedKeywords({
        blogContent: contentValue,
      });
      const currentKeywords = form.getValues("keywords") || "";
      const newKeywords = [...new Set([...currentKeywords.split(','), ...result.keywords])].filter(Boolean).join(', ');
      form.setValue("keywords", newKeywords, { shouldValidate: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to suggest keywords. Please try again.",
      });
    } finally {
      setAiLoading("none");
    }
  };

  const handleSuggestDescription = async () => {
    if (!contentValue || !titleValue) {
      toast({
        variant: "destructive",
        title: "Content or title is empty",
        description:
          "Please write title and content before suggesting a description.",
      });
      return;
    }
    setAiLoading("description");
    try {
      const result = await suggestDescription({
        blogContent: contentValue,
        title: titleValue,
      });
      form.setValue("description", result.description, {
        shouldValidate: true,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to suggest a description. Please try again.",
      });
    } finally {
      setAiLoading("none");
    }
  };

  const onPreview = () => {
    if (initialData) {
      router.push(`/blogs/${initialData.slug}/preview`);
    } else {
      toast({
        variant: "destructive",
        title: "Cannot preview",
        description: "Please save the post as a draft first to enable preview.",
      });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const currentCategories = form.getValues("category") || [];
    if (currentCategories.includes(categoryId)) {
      form.setValue(
        "category",
        currentCategories.filter((id) => id !== categoryId)
      );
    } else {
      form.setValue("category", [...currentCategories, categoryId]);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    const currentKeywords = form.getValues("keywords") || "";
    const keywordsArray = currentKeywords.split(",").map(k => k.trim()).filter(Boolean);
    if (!keywordsArray.includes(keyword)) {
      const newKeywords = [...keywordsArray, keyword].join(", ");
      form.setValue("keywords", newKeywords, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form>
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A short, compelling description for SEO (max 160 characters)."
                            {...field}
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
                  name="banner_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center justify-center w-full">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                              </div>
                            )}
                            <Input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                  setImagePreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="src_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Link</FormLabel>
                      <FormDescription>
                        Add a source link for the post.{" "}
                        <span className="text-xs">
                          (ex:
                          https://github.com/Sridhar-C-25/React_stepper/archive/refs/heads/main.zip)
                        </span>
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                              {selectedCategories &&
                              selectedCategories.length > 0
                                ? categories
                                    .filter((cat) =>
                                      selectedCategories.includes(cat.id)
                                    )
                                    .map((cat) => cat.name)
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
                                        selectedCategories &&
                                          selectedCategories.includes(
                                            category.id
                                          )
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
                
                {/* Tag suggestion selector */}
                <div className="space-y-2">
                  <FormLabel>Suggest Tags From Category</FormLabel>
                  <Select
                    onValueChange={setSelectedTagCategory}
                    disabled={!selectedCategories || selectedCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category to see tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(cat => selectedCategories.includes(cat.id))
                        .map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   {categoryBasedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-md border p-2">
                      {categoryBasedTags.map((keyword, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleKeywordClick(keyword)}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormDescription>
                        Comma-separated keywords for SEO.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., nextjs, react, tailwind"
                          {...field}
                        />
                      </FormControl>
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
              <CardFooter className="flex flex-col justify-between">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={onPreview}
                >
                  Preview
                </Button>
                <div className="flex flex-col items-center gap-2 w-full mt-2">
                  <Button
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "Draft")
                    )}
                    className="w-full"
                    variant="secondary"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Draft
                  </Button>
                  <Button
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "Published")
                    )}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {initialData?.status === "Published"
                      ? "Update & Publish"
                      : "Publish"}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5" />
                  AI Content Tools
                </CardTitle>
                <CardDescription>Enhance your content with AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSuggestDescription}
                    disabled={aiLoading !== "none"}
                  >
                    {aiLoading === "description" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Suggest Description
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSuggestTitles}
                    disabled={aiLoading !== "none"}
                  >
                    {aiLoading === "titles" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Suggest Title Variants
                  </Button>
                  {titleVariants.length > 0 && (
                    <div className="space-y-2 rounded-md border p-2">
                      {titleVariants.map((variant, i) => (
                        <div
                          key={i}
                          className="cursor-pointer rounded-md p-2 text-sm hover:bg-muted"
                          onClick={() =>
                            form.setValue("title", variant, {
                              shouldValidate: true,
                            })
                          }
                        >
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
                    disabled={aiLoading !== "none"}
                  >
                    {aiLoading === "keywords" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Suggest Related Keywords
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
