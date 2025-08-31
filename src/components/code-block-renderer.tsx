"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { shikiHighlighter } from "@/lib/shiki-highlighter";
import { BundledTheme } from "shiki";

interface ShikiCodeBlockRendererProps {
  children: React.ReactNode;
  language?: string;
  theme?: BundledTheme;
  showLineNumbers?: boolean;
  className?: string;
}

export function ShikiCodeBlockRenderer({
  children,
  language = "plaintext",
  theme = "github-dark",
  showLineNumbers = false,
  className = "",
}: ShikiCodeBlockRendererProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const code = String(children).replace(/\n$/, "");

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        await shikiHighlighter.initialize();
        const highlighted = await shikiHighlighter.highlight(
          code,
          language,
          theme
        );
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        // Fallback to escaped plain text
        setHighlightedCode(escapeHtml(code));
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language, theme]);

  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy code to clipboard.",
      });
    }
  };

  return (
    <div className={`relative group shiki-container ${className}`}>
      {/* Code Block Container */}
      <div className="relative  rounded-lg border border-gray-800 overflow-hidden">
        {/* Header with language label and copy button */}
        {language && language !== "plaintext" && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800">
            <span className="text-xs text-gray-300 font-mono">
              {shikiHighlighter.getLanguageLabel(language)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-70 hover:opacity-100 text-gray-300 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}

        {/* Code Content */}
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            {isLoading ? (
              <code className="shiki-code text-gray-300">{code}</code>
            ) : (
              <code
                className={`shiki-code language-${language}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            )}
          </pre>

          {/* Copy Button - only show if no header */}
          {(!language || language === "plaintext") && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Legacy component name for backward compatibility
export const CodeBlockRenderer = ShikiCodeBlockRenderer;
