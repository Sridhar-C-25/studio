"use client";

import React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code2,
  Image as ImageIcon,
  Youtube,
} from "lucide-react";
import Image from "@tiptap/extension-image";
import YoutubeExtension from "@tiptap/extension-youtube";
import { ShikiCodeBlockExtension } from "@/extensions/tiptap-shiki-extension";
import {
  shikiHighlighter,
  supportedLanguages,
} from "@/lib/shiki-highlighter";
import "@/styles/shiki-highlighting.css";

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    <div className="sticky top-0 z-50 flex flex-wrap items-center gap-1 rounded-t-md border border-input bg-card p-2 shadow-sm">
      {/* Text Formatting */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8" />

      {/* Headings */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("paragraph")}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8" />

      {/* Lists and Blocks */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
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
          {supportedLanguages.map((lang) => (
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

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Using Shiki CodeBlock instead
      }),
      Image,
      YoutubeExtension.configure({
        nocookie: true,
      }),
      ShikiCodeBlockExtension.configure({
        defaultLanguage: "plaintext",
        highlighter: shikiHighlighter,
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
