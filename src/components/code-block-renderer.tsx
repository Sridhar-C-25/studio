"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { syntaxHighlighter } from "@/lib/syntax-highlighter";

interface CodeBlockRendererProps {
  children: React.ReactNode;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlockRenderer({ 
  children, 
  language = "plaintext", 
  showLineNumbers = true,
  className = ""
}: CodeBlockRendererProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const code = String(children).replace(/\n$/, "");
  const highlightedCode = syntaxHighlighter.highlight(code, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ 
        title: "Copied!", 
        description: "Code copied to clipboard." 
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
    <div className={`relative group ${className}`}>
      {/* Code Block Container */}
      <div className="relative bg-[#0d1117] rounded-lg border border-gray-800 overflow-hidden">
        {/* Header with language label */}
        {language && language !== 'plaintext' && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800">
            <span className="text-xs text-gray-300 font-mono">
              {syntaxHighlighter.getLanguageLabel(language)}
            </span>
          </div>
        )}
        
        {/* Code Content */}
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code 
              className={`hljs language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
          
          {/* Copy Button */}
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
        </div>
      </div>
    </div>
  );
}