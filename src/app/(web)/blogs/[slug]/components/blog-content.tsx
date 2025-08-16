"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import parse, { Element, HTMLReactParserOptions } from "html-react-parser";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 as syntaxTheme } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  ArrowLeft,
  Check,
  Copy,
  Facebook,
  Linkedin,
  Twitter,
  Link2,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types";

interface BlogContentProps {
  post: BlogPost;
  isPreview?: boolean;
}

const SocialShareButtons = ({ title, url }: { title: string; url: string }) => {
  const { toast } = useToast();
  const shareUrl = `https://codeaprogram.tech${url}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "The article link has been copied to your clipboard.",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>
      <Button variant="outline" size="icon" asChild>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(
            title
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(
            title
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink}>
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function BlogContent({ post, isPreview = false }: BlogContentProps) {
  const pathname = usePathname();

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "pre") {
        const codeNode = domNode.children.find(
          (child) => child.type === "tag" && child.tagName === "code"
        );

        if (
          codeNode instanceof Element &&
          codeNode.children[0]?.type === "text"
        ) {
          const language =
            codeNode.attribs.class?.replace("language-", "") || "plaintext";
          const code = codeNode.children[0].data;

          return (
            <CodeBlockWithCopyButton language={language}>
              {code}
            </CodeBlockWithCopyButton>
          );
        }
      }
      if (domNode instanceof Element && domNode.tagName === "iframe") {
        return (
          <iframe
            {...domNode.attribs}
            className="w-full aspect-video rounded-md border"
          />
        );
      }
    },
  };

  function CodeBlockWithCopyButton({
    children,
    language,
  }: {
    children: React.ReactNode;
    language?: string;
  }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, "");

    const handleCopy = () => {
      navigator.clipboard.writeText(code).then(
        () => {
          setCopied(true);
          toast({ title: "Copied!", description: "Code copied to clipboard." });
          setTimeout(() => setCopied(false), 2000);
        },
        (err) => {
          toast({
            variant: "destructive",
            title: "Copy Failed",
            description: "Could not copy code to clipboard.",
          });
        }
      );
    };

    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {!isPreview && (
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm mb-8">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/blogs">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Posts
              </Button>
            </Link>
          </div>
        </header>
      )}

      <main>
        <article className="prose prose-lg dark:prose-invert max-w-full rounded-lg border bg-card p-6 shadow-sm">
          <div className="relative w-full aspect-video bg-gray-200 dark:bg-black rounded-md overflow-hidden mb-6">
            <Image
              src={post.banner_image || "https://placehold.co/1200x600.png"}
              alt={post.title}
              layout="fill"
              objectFit="contain"
              data-ai-hint="tech concept"
            />
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Published on{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1 className="font-headline text-4xl font-bold !leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {post.category && post.category.length > 0 && (
            <div className="my-4 flex flex-wrap gap-2">
              {post.category.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                  <Link href={`/blogs/category/${cat.id}`}>{cat.name}</Link>
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          <div>{parse(post.content, parserOptions)}</div>

          <Separator className="my-8" />

          <div className="flex justify-between items-center">
            <SocialShareButtons title={post.title} url={pathname} />
          </div>

          {/* {post.adsenseTag && (
            <div className="mt-8 rounded-md border border-dashed p-4">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                {isPreview ? "AdSense Tag Preview" : "Advertisement"}
              </h3>
              {isPreview ? (
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-code text-xs">
                  <code>{post.adsenseTag}</code>
                </pre>
              ) : (
                <div>{parse(post.adsenseTag)}</div>
              )}
            </div>
          )} */}
        </article>
      </main>
    </div>
  );
}
