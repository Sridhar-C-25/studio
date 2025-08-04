"use client";

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
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import YoutubeExtension from "@tiptap/extension-youtube";
import { createLowlight } from 'lowlight';
import 'highlight.js/styles/github-dark.css';

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// Import all the languages
import a1c from 'highlight.js/lib/languages/1c';
import abnf from 'highlight.js/lib/languages/abnf';
import actionscript from 'highlight.js/lib/languages/actionscript';
import ada from 'highlight.js/lib/languages/ada';
import apache from 'highlight.js/lib/languages/apache';
import applescript from 'highlight.js/lib/languages/applescript';
import arduino from 'highlight.js/lib/languages/arduino';
import awk from 'highlight.js/lib/languages/awk';
import bash from 'highlight.js/lib/languages/bash';
import basic from 'highlight.js/lib/languages/basic';
import brainfuck from 'highlight.js/lib/languages/brainfuck';
import c from 'highlight.js/lib/languages/c';
import cplusplus from 'highlight.js/lib/languages/cpp';
import clojure from 'highlight.js/lib/languages/clojure';
import cmake from 'highlight.js/lib/languages/cmake';
import coffeescript from 'highlight.js/lib/languages/coffeescript';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import delphi from 'highlight.js/lib/languages/delphi';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import elixir from 'highlight.js/lib/languages/elixir';
import elm from 'highlight.js/lib/languages/elm';
import erlang from 'highlight.js/lib/languages/erlang';
import fortran from 'highlight.js/lib/languages/fortran';
import gams from 'highlight.js/lib/languages/gams';
import go from 'highlight.js/lib/languages/go';
import groovy from 'highlight.js/lib/languages/groovy';
import haskell from 'highlight.js/lib/languages/haskell';
import http from 'highlight.js/lib/languages/http';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import jsx from 'highlight.js/lib/languages/javascript';
import julia from 'highlight.js/lib/languages/julia';
import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
import lisp from 'highlight.js/lib/languages/lisp';
import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import matlab from 'highlight.js/lib/languages/matlab';
import nginx from 'highlight.js/lib/languages/nginx';
import objectivec from 'highlight.js/lib/languages/objectivec';
import ocaml from 'highlight.js/lib/languages/ocaml';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import prolog from 'highlight.js/lib/languages/prolog';
import properties from 'highlight.js/lib/languages/properties';
import protobuf from 'highlight.js/lib/languages/protobuf';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import scheme from 'highlight.js/lib/languages/scheme';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import stylus from 'highlight.js/lib/languages/stylus';
import swift from 'highlight.js/lib/languages/swift';
import tcl from 'highlight.js/lib/languages/tcl';
import tex from 'highlight.js/lib/languages/tex';
import typescript from 'highlight.js/lib/languages/typescript';
import tsx from 'highlight.js/lib/languages/typescript';
import vbnet from 'highlight.js/lib/languages/vbnet';
import verilog from 'highlight.js/lib/languages/verilog';
import vhdl from 'highlight.js/lib/languages/vhdl';
import xml from 'highlight.js/lib/languages/xml'; // for HTML
import yaml from 'highlight.js/lib/languages/yaml';


const lowlight = createLowlight();
lowlight.register('1c', a1c);
lowlight.register('abnf', abnf);
lowlight.register('actionscript', actionscript);
lowlight.register('ada', ada);
lowlight.register('apache', apache);
lowlight.register('applescript', applescript);
lowlight.register('arduino', arduino);
lowlight.register('awk', awk);
lowlight.register('bash', bash);
lowlight.register('basic', basic);
lowlight.register('brainfuck', brainfuck);
lowlight.register('c', c);
lowlight.register('cpp', cplusplus);
lowlight.register('clojure', clojure);
lowlight.register('cmake', cmake);
lowlight.register('coffeescript', coffeescript);
lowlight.register('csharp', csharp);
lowlight.register('css', css);
lowlight.register('dart', dart);
lowlight.register('delphi', delphi);
lowlight.register('diff', diff);
lowlight.register('dockerfile', dockerfile);
lowlight.register('elixir', elixir);
lowlight.register('elm', elm);
lowlight.register('erlang', erlang);
lowlight.register('fortran', fortran);
lowlight.register('gams', gams);
lowlight.register('go', go);
lowlight.register('groovy', groovy);
lowlight.register('haskell', haskell);
lowlight.register('html', xml);
lowlight.register('http', http);
lowlight.register('ini', ini);
lowlight.register('java', java);
lowlight.register('javascript', javascript);
lowlight.register('json', json);
lowlight.register('jsx', jsx);
lowlight.register('julia', julia);
lowlight.register('kotlin', kotlin);
lowlight.register('less', less);
lowlight.register('lisp', lisp);
lowlight.register('lua', lua);
lowlight.register('makefile', makefile);
lowlight.register('markdown', markdown);
lowlight.register('matlab', matlab);
lowlight.register('nginx', nginx);
lowlight.register('objectivec', objectivec);
lowlight.register('ocaml', ocaml);
lowlight.register('pascal', delphi);
lowlight.register('perl', perl);
lowlight.register('php', php);
lowlight.register('powershell', powershell);
lowlight.register('prolog', prolog);
lowlight.register('properties', properties);
lowlight.register('protobuf', protobuf);
lowlight.register('python', python);
lowlight.register('r', r);
lowlight.register('react', jsx);
lowlight.register('ruby', ruby);
lowlight.register('rust', rust);
lowlight.register('sass', scss);
lowlight.register('scala', scala);
lowlight.register('scheme', scheme);
lowlight.register('scss', scss);
lowlight.register('shell', shell);
lowlight.register('sql', sql);
lowlight.register('stylus', stylus);
lowlight.register('swift', swift);
lowlight.register('tcl', tcl);
lowlight.register('tex', tex);
lowlight.register('typescript', typescript);
lowlight.register('tsx', tsx);
lowlight.register('vbnet', vbnet);
lowlight.register('verilog', verilog);
lowlight.register('vhdl', vhdl);
lowlight.register('xml', xml);
lowlight.register('yaml', yaml);


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
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  const setCodeBlockLanguage = (language: string) => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-input bg-card p-2">
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
      
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Toggle>
       <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
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
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 px-2.5 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
            <Code2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('1c')}>1C</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('abnf')}>ABNF</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('actionscript')}>ActionScript</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('ada')}>Ada</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('apache')}>Apache</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('applescript')}>AppleScript</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('arduino')}>Arduino</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('awk')}>AWK</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('bash')}>Bash</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('basic')}>BASIC</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('brainfuck')}>Brainfuck</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('c')}>C</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('cpp')}>C++</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('clojure')}>Clojure</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('cmake')}>CMake</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('coffeescript')}>CoffeeScript</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('csharp')}>C#</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('css')}>CSS</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('dart')}>Dart</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('delphi')}>Delphi</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('diff')}>Diff</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('dockerfile')}>Dockerfile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('elixir')}>Elixir</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('elm')}>Elm</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('erlang')}>Erlang</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('fortran')}>Fortran</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('gams')}>GAMS</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('go')}>Go</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('groovy')}>Groovy</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('haskell')}>Haskell</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('html')}>HTML</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('http')}>HTTP</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('ini')}>INI</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('java')}>Java</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('javascript')}>JavaScript</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('json')}>JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('jsx')}>JSX</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('julia')}>Julia</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('kotlin')}>Kotlin</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('less')}>Less</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('lisp')}>Lisp</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('lua')}>Lua</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('makefile')}>Makefile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('markdown')}>Markdown</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('matlab')}>Matlab</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('nginx')}>Nginx</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('objectivec')}>Objective-C</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('ocaml')}>OCaml</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('pascal')}>Pascal</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('perl')}>Perl</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('php')}>PHP</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('powershell')}>PowerShell</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('prolog')}>Prolog</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('properties')}>Properties</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('protobuf')}>Protobuf</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('python')}>Python</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('r')}>R</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('react')}>React</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('ruby')}>Ruby</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('rust')}>Rust</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('sass')}>Sass</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('scala')}>Scala</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('scheme')}>Scheme</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('scss')}>SCSS</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('shell')}>Shell</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('sql')}>SQL</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('stylus')}>Stylus</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('swift')}>Swift</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('tcl')}>TCL</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('tex')}>TeX</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('typescript')}>TypeScript</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('tsx')}>TSX</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('vbnet')}>VB.NET</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('verilog')}>Verilog</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('vhdl')}>VHDL</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('xml')}>XML</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeBlockLanguage('yaml')}>YAML</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />
      
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      <Toggle
        size="sm"
        onPressedChange={() => imageInputRef.current?.click()}
      >
        <ImageIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onPressedChange={addYoutubeVideo}
      >
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
        codeBlock: false, // We are using CodeBlockLowlight instead
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
        class: "tiptap",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="rounded-b-md border border-t-0 border-input" />
    </div>
  );
};
