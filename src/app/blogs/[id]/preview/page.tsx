"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, Loader2, Sparkles } from "lucide-react";

import { getPost, getCategory } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { evaluateBlogEffectiveness, EvaluateBlogEffectivenessOutput } from "@/ai/flows/evaluate-blog-effectiveness";
import type { BlogPost, Category } from "@/types";

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluateBlogEffectivenessOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(params.id);
        if (!postData) {
          notFound();
          return;
        }
        setPost(postData);
        if (postData.category) {
          // Assuming category is an ID
           const categoryData = await getCategory(postData.category);
           setCategory(categoryData);
        }
      } catch (error) {
        notFound();
      }
    };

    fetchPost();
  }, [params.id]);


  if (!post) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const result = await evaluateBlogEffectiveness({ blogContent: post.content });
      setEvaluation(result);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Evaluation Failed",
        description: "The AI evaluation failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
          <div className="flex items-center gap-4">
            <Button onClick={handleEvaluate} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Evaluate Effectiveness
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <article className="prose prose-lg dark:prose-invert max-w-full rounded-lg border bg-card p-6 shadow-sm">
          {category && (
            <Badge variant="outline" className="mb-4">
              {category.name}
            </Badge>
          )}
          <div className="mb-4 text-sm text-muted-foreground">
            Published on {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div
            className="font-headline text-4xl font-bold !leading-tight tracking-tight md:text-5xl"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <Separator className="my-8" />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.adsenseTag && (
             <div className="mt-8 rounded-md border border-dashed p-4">
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">AdSense Tag Preview</h3>
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-code text-xs">
                  <code>{post.adsenseTag}</code>
                </pre>
            </div>
          )}
        </article>
      </main>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="h-6 w-6 text-primary" />
              Blog Post Evaluation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Here's the AI's assessment of your blog post's effectiveness.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {evaluation && (
            <div className="max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Assessment</h3>
                  <p className="text-muted-foreground">{evaluation.overallAssessment}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">SEO Score: {evaluation.seoScore}/100</h3>
                  <Progress value={evaluation.seoScore} className="w-full" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Suggestions for Improvement</h3>
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {evaluation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
