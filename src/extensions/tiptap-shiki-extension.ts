import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { ShikiHighlighterService } from "@/lib/shiki-highlighter";

export interface ShikiCodeBlockOptions {
  HTMLAttributes: Record<string, any>;
  defaultLanguage: string;
  highlighter: ShikiHighlighterService;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shikiCodeBlock: {
      /**
       * Set a code block with language
       */
      setCodeBlock: (attributes?: { language?: string }) => ReturnType;
      /**
       * Toggle a code block with language
       */
      toggleCodeBlock: (attributes?: { language?: string }) => ReturnType;
    };
  }
}

/**
 * Custom TipTap extension for Shiki-powered code blocks
 * Replaces the lowlight-based CodeBlock extension
 */
export const ShikiCodeBlockExtension = Node.create<ShikiCodeBlockOptions>({
  name: "shikiCodeBlock",

  group: "block",

  content: "text*",

  marks: "",

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      defaultLanguage: "plaintext",
      highlighter: ShikiHighlighterService.getInstance(),
    };
  },

  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => {
          const language = element.getAttribute("data-language");
          return language || this.options.defaultLanguage;
        },
        renderHTML: (attributes) => {
          return {
            "data-language": attributes.language,
            class: `language-${attributes.language}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs: (element) => {
          const codeElement = element.querySelector("code");
          if (!codeElement) return false;

          const language = element.getAttribute("data-language") || 
                          codeElement.className.match(/language-(\w+)/)?.[1] ||
                          this.options.defaultLanguage;

          return { language };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || this.options.defaultLanguage;
    
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-language": language,
        class: `shiki-code-block language-${language}`,
      }),
      ["code", {}, 0],
    ];
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      "Mod-Shift-\\": () => this.editor.commands.toggleCodeBlock(),
      // Exit code block with Enter twice
      "Enter": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name !== this.name) {
          return false;
        }

        // Check if at end of code block and previous line is empty
        const textContent = $from.parent.textContent;
        const lines = textContent.split('\n');
        const currentLineIndex = textContent.slice(0, $from.parentOffset).split('\n').length - 1;
        
        if (currentLineIndex === lines.length - 1 && lines[currentLineIndex] === '') {
          return editor.commands.exitCode();
        }

        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("shikiCodeBlockHighlight"),
        state: {
          init: () => DecorationSet.empty,
          apply: (transaction, decorationSet, oldState, newState) => {
            const oldNodeName = oldState.selection.$head.parent.type.name;
            const newNodeName = newState.selection.$head.parent.type.name;

            // Only update if we're in a code block or content changed
            if (
              oldNodeName !== this.name &&
              newNodeName !== this.name &&
              !transaction.docChanged
            ) {
              return decorationSet.map(transaction.mapping, transaction.doc);
            }

            const decorations: Decoration[] = [];

            // Find all code blocks and apply highlighting
            transaction.doc.descendants((node, pos) => {
              if (node.type.name !== this.name) {
                return;
              }

              const language = node.attrs.language || this.options.defaultLanguage;
              const code = node.textContent;

              if (code.trim()) {
                // Create decoration for syntax highlighting
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: `shiki-highlighted language-${language}`,
                  "data-language": language,
                });
                decorations.push(decoration);
              }
            });

            return DecorationSet.create(transaction.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});