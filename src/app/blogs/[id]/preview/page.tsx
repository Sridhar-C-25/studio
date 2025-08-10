"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, Loader2, Sparkles } from "lucide-react";

import { getPost } from "@/lib/data";
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
import { useToast } from "@/hooks/use-toast";
import {
  evaluateBlogEffectiveness,
  EvaluateBlogEffectivenessOutput,
} from "@/ai/flows/evaluate-blog-effectiveness";
import type { BlogPost } from "@/types";
import { BlogContent } from "@/app/(web)/blogs/[id]/components/blog-content";

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] =
    useState<EvaluateBlogEffectivenessOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(params.id);
        if (!postData) {
          notFound();
        }
        setPost(postData);
      } catch (error) {
        notFound();
      }
    };

    fetchPost();
  }, [params.id]);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const result = await evaluateBlogEffectiveness({
        blogContent: post.content,
      });
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

      <BlogContent post={post} isPreview={true} />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="h-6 w-6 text-primary" />
              Blog Post Evaluation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Here&apos;s the AI&apos;s assessment of your blog post&apos;s
              effectiveness.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {evaluation && (
            <div className="max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Assessment</h3>
                  <p className="text-muted-foreground">
                    {evaluation.overallAssessment}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    SEO Score: {evaluation.seoScore}/100
                  </h3>
                  <Progress value={evaluation.seoScore} className="w-full" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Suggestions for Improvement
                  </h3>
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
