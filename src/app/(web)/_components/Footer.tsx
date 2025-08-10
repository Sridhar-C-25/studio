import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YouTubeIcon, GitHubIcon } from "./icon";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container flex flex-col gap-8 px-4 py-7 md:px-6 lg:py-10">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold hover:text-foreground transition-colors"
          >
            <Image
              src="/logo.png"
              alt="Code A Program"
              width={40}
              height={40}
              className="rounded-full border"
            />
            <span>Code A Program</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Learn web development with Code A Program. Expert tutorials on
            Next.js, React.js, Vue.js, Tailwind CSS, TypeScript, and modern web
            technologies...{" "}
            <Link
              href="/about"
              className="text-primary underline hover:text-cyan-500/80 transition-colors"
            >
              About Us
            </Link>
          </p>
          <div className="flex gap-4 lg:justify-end">
            <Link
              href="https://www.instagram.com/codeaprogram/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors border size-10 grid place-items-center rounded-lg"
            >
              <InstagramIcon />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.youtube.com/@codeaprogram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors border size-10 grid place-items-center rounded-lg"
            >
              <YouTubeIcon />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="https://github.com/sridhar-c-25"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors border size-10 grid place-items-center rounded-lg"
            >
              <GitHubIcon />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Code A Program. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
