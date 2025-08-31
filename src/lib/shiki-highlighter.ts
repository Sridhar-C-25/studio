import { 
  createHighlighter, 
  Highlighter, 
  BundledLanguage, 
  BundledTheme 
} from 'shiki';
import { transformerNotationDiff } from '@shikijs/transformers';

// Language configuration interface
export interface Language {
  value: BundledLanguage;
  label: string;
  aliases?: string[];
}

// Supported languages with proper JSX/TSX support
export const supportedLanguages: Language[] = [
  { value: "javascript", label: "JavaScript", aliases: ["js"] },
  { value: "typescript", label: "TypeScript", aliases: ["ts"] },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python", aliases: ["py"] },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash", aliases: ["sh", "shell"] },
  { value: "sql", label: "SQL" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#", aliases: ["cs"] },
  { value: "cpp", label: "C++", aliases: ["c++"] },
  { value: "c", label: "C" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML", aliases: ["yml"] },
  { value: "markdown", label: "Markdown", aliases: ["md"] },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust", aliases: ["rs"] }
];

/**
 * Shiki-based syntax highlighter service providing consistent highlighting
 * across the editor and preview components with superior JSX/TSX support
 */
export class ShikiHighlighterService {
  private static instance: ShikiHighlighterService;
  private highlighter: Highlighter | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ShikiHighlighterService {
    if (!ShikiHighlighterService.instance) {
      ShikiHighlighterService.instance = new ShikiHighlighterService();
    }
    return ShikiHighlighterService.instance;
  }

  /**
   * Initialize Shiki highlighter with required languages and themes
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize();
    await this.initPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      // Extract language values for Shiki
      const languages = supportedLanguages.map(lang => lang.value);
      
      this.highlighter = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: languages,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Shiki highlighter:', error);
      throw error;
    }
  }

  /**
   * Highlight code and return HTML string
   */
  async highlight(
    code: string, 
    language: string = "plaintext",
    theme: BundledTheme = "github-dark"
  ): Promise<string> {
    await this.initialize();
    
    if (!this.highlighter) {
      throw new Error('Shiki highlighter not initialized');
    }

    try {
      // Clean up the code first
      const cleanCode = this.cleanCode(code);
      
      if (!language || language === "plaintext") {
        return this.escapeHtml(cleanCode);
      }

      // Validate language support
      const normalizedLang = this.normalizeLanguage(language);
      if (!this.isLanguageSupported(normalizedLang)) {
        console.warn(`Language "${language}" not supported, falling back to plaintext`);
        return this.escapeHtml(cleanCode);
      }

      // Use Shiki to highlight the code
      const html = this.highlighter.codeToHtml(cleanCode, {
        lang: normalizedLang as BundledLanguage,
        theme,
        transformers: [transformerNotationDiff()],
      });

      // Extract only the inner content (remove the pre wrapper)
      return this.extractCodeContent(html);
    } catch (error) {
      console.warn(`Failed to highlight code with language "${language}":`, error);
      return this.escapeHtml(code);
    }
  }

  /**
   * Highlight code and return full HTML with pre wrapper
   */
  async highlightToHtml(
    code: string, 
    language: string = "plaintext",
    theme: BundledTheme = "github-dark"
  ): Promise<string> {
    await this.initialize();
    
    if (!this.highlighter) {
      throw new Error('Shiki highlighter not initialized');
    }

    try {
      const cleanCode = this.cleanCode(code);
      
      if (!language || language === "plaintext") {
        return `<pre><code>${this.escapeHtml(cleanCode)}</code></pre>`;
      }

      const normalizedLang = this.normalizeLanguage(language);
      if (!this.isLanguageSupported(normalizedLang)) {
        return `<pre><code>${this.escapeHtml(cleanCode)}</code></pre>`;
      }

      return this.highlighter.codeToHtml(cleanCode, {
        lang: normalizedLang as BundledLanguage,
        theme,
        transformers: [transformerNotationDiff()],
      });
    } catch (error) {
      console.warn(`Failed to highlight code with language "${language}":`, error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  /**
   * Extract code content from Shiki's HTML output (remove pre wrapper)
   */
  private extractCodeContent(html: string): string {
    // Remove the outer pre tag and extract the inner content
    const match = html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
    return match ? match[1] : html;
  }

  /**
   * Clean up code input (remove existing highlighting, decode entities)
   */
  private cleanCode(code: string): string {
    let cleaned = code;

    // Remove existing Shiki/hljs highlighting
    cleaned = cleaned.replace(/<span[^>]*class="[^"]*shiki[^"]*"[^>]*>/g, '');
    cleaned = cleaned.replace(/<span[^>]*class="[^"]*hljs[^"]*"[^>]*>/g, '');
    cleaned = cleaned.replace(/<\/span>/g, '');
    cleaned = cleaned.replace(/<span[^>]*>/g, '');

    // Decode HTML entities
    cleaned = cleaned
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');

    return cleaned.trim();
  }

  /**
   * Normalize language names to Shiki supported languages
   */
  private normalizeLanguage(language: string): string {
    const lang = language.toLowerCase();
    
    // Handle aliases
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'sh': 'bash',
      'shell': 'bash',
      'cs': 'csharp',
      'c++': 'cpp',
      'yml': 'yaml',
      'md': 'markdown',
      'rs': 'rust'
    };

    return languageMap[lang] || lang;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language: string): boolean {
    const normalizedLang = this.normalizeLanguage(language);
    return supportedLanguages.some(lang => 
      lang.value === normalizedLang || 
      (lang.aliases && lang.aliases.includes(language.toLowerCase()))
    );
  }

  /**
   * Get display label for language
   */
  getLanguageLabel(language: string): string {
    const normalizedLang = this.normalizeLanguage(language);
    const lang = supportedLanguages.find(l => l.value === normalizedLang);
    return lang ? lang.label : language.charAt(0).toUpperCase() + language.slice(1);
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Language[] {
    return [...supportedLanguages];
  }

  /**
   * Escape HTML characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): BundledTheme[] {
    return ['github-dark', 'github-light'];
  }

  /**
   * Check if highlighter is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const shikiHighlighter = ShikiHighlighterService.getInstance();