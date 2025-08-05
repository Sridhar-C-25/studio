"use client";

import React from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold, Italic, Strikethrough, Code, Pilcrow, List, ListOrdered, 
  Quote, Minus, Code2, Image as ImageIcon, Youtube
} from "lucide-react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import YoutubeExtension from "@tiptap/extension-youtube";
import { createLowlight } from 'lowlight';
import 'highlight.js/styles/github-dark.css';

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// Language configuration with aliases
const languageConfig = [
  { value: 'javascript', label: 'JavaScript', aliases: ['js'] },
  { value: 'typescript', label: 'TypeScript', aliases: ['ts'] },
  { value: 'python', label: 'Python', aliases: ['py'] },
  { value: 'html', label: 'HTML', aliases: [] },
  { value: 'css', label: 'CSS', aliases: [] },
  { value: 'json', label: 'JSON', aliases: [] },
  { value: 'bash', label: 'Bash', aliases: ['sh', 'shell'] },
  { value: 'sql', label: 'SQL', aliases: [] },
  { value: 'java', label: 'Java', aliases: [] },
  { value: 'csharp', label: 'C#', aliases: ['cs'] },
  { value: 'cpp', label: 'C++', aliases: ['c++'] },
  { value: 'c', label: 'C', aliases: [] },
  { value: 'php', label: 'PHP', aliases: [] },
  { value: 'ruby', label: 'Ruby', aliases: ['rb'] },
  { value: 'go', label: 'Go', aliases: ['golang'] },
  { value: 'rust', label: 'Rust', aliases: ['rs'] },
  { value: 'kotlin', label: 'Kotlin', aliases: ['kt'] },
  { value: 'swift', label: 'Swift', aliases: [] },
  { value: 'dart', label: 'Dart', aliases: [] },
  { value: 'scala', label: 'Scala', aliases: [] },
  { value: 'r', label: 'R', aliases: [] },
  { value: 'matlab', label: 'Matlab', aliases: [] },
  { value: 'yaml', label: 'YAML', aliases: ['yml'] },
  { value: 'xml', label: 'XML', aliases: [] },
  { value: 'markdown', label: 'Markdown', aliases: ['md'] },
  { value: 'dockerfile', label: 'Dockerfile', aliases: ['docker'] },
  { value: 'nginx', label: 'Nginx', aliases: [] },
  { value: 'makefile', label: 'Makefile', aliases: ['make'] },
  { value: 'ini', label: 'INI', aliases: [] },
  { value: 'properties', label: 'Properties', aliases: [] },
  { value: 'diff', label: 'Diff', aliases: [] },
  { value: 'jsx', label: 'JSX', aliases: ['react'] },
  { value: 'tsx', label: 'TSX', aliases: [] },
  { value: 'scss', label: 'SCSS', aliases: ['sass'] },
  { value: 'less', label: 'Less', aliases: [] },
  { value: 'stylus', label: 'Stylus', aliases: ['styl'] },
  { value: 'lua', label: 'Lua', aliases: [] },
  { value: 'perl', label: 'Perl', aliases: ['pl'] },
  { value: 'powershell', label: 'PowerShell', aliases: ['ps'] },
  { value: 'groovy', label: 'Groovy', aliases: [] },
  { value: 'haskell', label: 'Haskell', aliases: ['hs'] },
  { value: 'elixir', label: 'Elixir', aliases: ['ex'] },
  { value: 'erlang', label: 'Erlang', aliases: ['erl'] },
  { value: 'clojure', label: 'Clojure', aliases: ['clj'] },
  { value: 'julia', label: 'Julia', aliases: ['jl'] },
  { value: 'lisp', label: 'Lisp', aliases: [] },
  { value: 'scheme', label: 'Scheme', aliases: ['scm'] },
  { value: 'prolog', label: 'Prolog', aliases: ['pl'] },
  { value: 'fortran', label: 'Fortran', aliases: ['f90', 'f95'] },
  { value: 'objectivec', label: 'Objective-C', aliases: ['objc'] },
  { value: 'delphi', label: 'Delphi', aliases: ['pascal'] },
  { value: 'vbnet', label: 'VB.NET', aliases: ['vb'] },
  { value: 'arduino', label: 'Arduino', aliases: [] },
  { value: 'verilog', label: 'Verilog', aliases: ['v'] },
  { value: 'vhdl', label: 'VHDL', aliases: [] },
  { value: 'coffeescript', label: 'CoffeeScript', aliases: ['coffee'] },
  { value: 'ocaml', label: 'OCaml', aliases: ['ml'] },
  { value: 'cmake', label: 'CMake', aliases: [] },
  { value: 'protobuf', label: 'Protobuf', aliases: ['proto'] },
  { value: 'abnf', label: 'ABNF', aliases: [] },
  { value: 'actionscript', label: 'ActionScript', aliases: ['as'] },
  { value: 'ada', label: 'Ada', aliases: [] },
  { value: 'apache', label: 'Apache', aliases: ['apacheconf'] },
  { value: 'applescript', label: 'AppleScript', aliases: [] },
  { value: 'basic', label: 'BASIC', aliases: [] },
  { value: 'brainfuck', label: 'Brainfuck', aliases: ['bf'] },
  { value: 'dart', label: 'Dart', aliases: [] },
  { value: 'elm', label: 'Elm', aliases: [] },
  { value: 'gams', label: 'GAMS', aliases: [] },
  { value: 'http', label: 'HTTP', aliases: ['https'] },
  { value: 'tcl', label: 'TCL', aliases: [] },
  { value: '1c', label: '1C', aliases: [] },
];

// Initialize lowlight
const lowlight = createLowlight();

// Dynamically import and register languages
const registerLanguages = async () => {
  for (const lang of languageConfig) {
    try {
      const langModule = await import(`highlight.js/lib/languages/${lang.value}`);
      lowlight.register(lang.value, langModule.default);
      
      // Register all aliases
      lang.aliases.forEach(alias => {
        lowlight.register(alias, langModule.default);
      });
    } catch (err) {
      console.error(`Failed to load language ${lang.value}:`, err);
    }
  }
  
  // Special cases
  try {
    const xmlModule = await import('highlight.js/lib/languages/xml');
    lowlight.register('html', xmlModule.default);
  } catch (err) {
    console.error('Failed to load HTML language:', err);
  }
};

// Register languages on first use
registerLanguages();

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  
  if (!editor) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (src) editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const setCodeBlockLanguage = (language: string) => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-input bg-card p-2">
      {/* Text Formatting */}
      <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("code")} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8" />
      
      {/* Headings */}
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("paragraph")} onPressedChange={() => editor.chain().focus().setParagraph().run()}>
        <Pilcrow className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Lists and Blocks */}
      <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Toggle>
      
      {/* Code Block Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 px-2.5">
            <Code2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[60vh] w-48 overflow-y-auto">
          {languageConfig.map((lang) => (
            <DropdownMenuItem 
              key={lang.value}
              onClick={() => setCodeBlockLanguage(lang.value)}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />
      
      {/* Media */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      <Toggle size="sm" onPressedChange={() => imageInputRef.current?.click()}>
        <ImageIcon className="h-4 w-4" />
      </Toggle>

      <Toggle size="sm" onPressedChange={addYoutubeVideo}>
        <Youtube className="h-4 w-4" />
      </Toggle>

      <Toggle size="sm" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Using CodeBlockLowlight instead
      }),
      Image,
      YoutubeExtension.configure({
        nocookie: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap min-h-[200px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col">
      <Toolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="rounded-b-md border border-t-0 border-input bg-background"
      />
    </div>
  );
};