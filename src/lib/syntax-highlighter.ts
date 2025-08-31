import { createLowlight } from "lowlight";

// Import languages
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";
import xml from "highlight.js/lib/languages/xml";

// Language configuration
export interface Language {
  value: string;
  label: string;
}

export const supportedLanguages: Language[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "xml", label: "jsx" },
  { value: "xml", label: "tsx" },
];

// Initialize lowlight with all languages
const lowlight = createLowlight();

// Register all languages
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("json", json);
lowlight.register("bash", bash);
lowlight.register("sql", sql);
lowlight.register("java", java);
lowlight.register("csharp", csharp);
lowlight.register("cpp", cpp);
lowlight.register("c", c);
lowlight.register("jsx", xml);
lowlight.register("tsx", xml);

// Syntax highlighter service
export class SyntaxHighlighterService {
  private static instance: SyntaxHighlighterService;

  private constructor() {}

  static getInstance(): SyntaxHighlighterService {
    if (!SyntaxHighlighterService.instance) {
      SyntaxHighlighterService.instance = new SyntaxHighlighterService();
    }
    return SyntaxHighlighterService.instance;
  }

  // Get the lowlight instance for TipTap
  getLowlight() {
    return lowlight;
  }

  // Highlight code for preview (returns HTML string)
  highlight(code: string, language: string = "plaintext"): string {
    try {
      if (!language || language === "plaintext") {
        return this.escapeHtml(code);
      }

      const result = lowlight.highlight(language, code);
      return this.convertToHtml(result);
    } catch (error) {
      // Fallback to plain text if highlighting fails
      console.warn(
        `Failed to highlight code with language "${language}":`,
        error
      );
      return this.escapeHtml(code);
    }
  }

  // Convert lowlight result to HTML string
  private convertToHtml(node: any): string {
    if (node.type === "text") {
      return this.escapeHtml(node.value);
    }

    if (node.type === "element") {
      const className = node.properties?.className
        ? ` class="${node.properties.className.join(" ")}"`
        : "";
      const children = node.children
        ? node.children.map((child: any) => this.convertToHtml(child)).join("")
        : "";
      return `<${node.tagName}${className}>${children}</${node.tagName}>`;
    }

    if (node.children) {
      return node.children
        .map((child: any) => this.convertToHtml(child))
        .join("");
    }

    return "";
  }

  // Escape HTML characters
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  // Check if language is supported
  isLanguageSupported(language: string): boolean {
    return supportedLanguages.some((lang) => lang.value === language);
  }

  // Get language label
  getLanguageLabel(language: string): string {
    const lang = supportedLanguages.find((l) => l.value === language);
    return lang ? lang.label : language;
  }
}

// Export singleton instance
export const syntaxHighlighter = SyntaxHighlighterService.getInstance();
