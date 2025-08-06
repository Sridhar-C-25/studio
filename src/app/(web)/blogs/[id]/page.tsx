
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import parse, { domToReact, Element, HTMLReactParserOptions } from "html-react-parser";
import SyntaxHighlighter  from "react-syntax-highlighter";
import { vs2015 as syntaxTheme } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Link from "next/link";

import { getPost } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types";

interface BlogPageProps {
  params: {
    id: string;
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "pre") {
        const codeNode = domNode.children.find((child) => child.type === "tag" && child.tagName === "code");

        if (codeNode instanceof Element && codeNode.children[0]?.type === 'text') {
          const language = codeNode.attribs.class?.replace("language-", "") || "plaintext";
          const code = codeNode.children[0].data;

          return (
            <CodeBlockWithCopyButton language={language}>
              {code }
            </CodeBlockWithCopyButton>
          )
        }
      }
      if (domNode instanceof Element && domNode.tagName === "iframe") {
        return <iframe {...domNode.attribs} className="w-full aspect-video rounded-md border" />;
      }
    },
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(params.id);
        if (!postData || postData.status !== 'Published') {
          notFound();
          return;
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
  
  function CodeBlockWithCopyButton({ children, language }: { children: React.ReactNode; language?: string }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, '');

    const handleCopy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        toast({ title: "Copied!", description: "Code copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
      }, (err) => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy code to clipboard.",
        });
      });
    };

    return (
      <div className="relative">
        <SyntaxHighlighter language={language} style={syntaxTheme} showLineNumbers>
          {code}
        </SyntaxHighlighter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
       <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/blogs">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Posts
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <article className="prose prose-lg dark:prose-invert max-w-full rounded-lg border bg-card p-6 shadow-sm">
          {post.category && post.category.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.category.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="mb-4 text-sm text-muted-foreground">
            Published on{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1
            className="font-headline text-4xl font-bold !leading-tight tracking-tight md:text-5xl"
          >{post.title}</h1>
          
          <Separator className="my-8" />

          <div>{parse(post.content, parserOptions)}</div>
          
          {post.adsenseTag && (
             <div className="mt-8 rounded-md border border-dashed p-4">
               <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                 Advertisement
               </h3>
               <div>{parse(post.adsenseTag)}</div>
             </div>
           )}
        </article>
      </main>
    </div>
  );
}
