import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlogLayout from "./components/BlogLayout";

export default function Page() {
  return (
    <section
      className="w-full py-20 md:py-32 lg:py-40 overflow-hidden"
      aria-label="Hero Section"
    >
      <div className="container px-4 md:px-6 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Build & Ship Web Apps Fast
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse production-ready templates, components, and source code for
            Next.js, Tailwind Css, React, Vue, Shadcn UI, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href="/youtube">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"></path>
                </svg>
                Watch Videos
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href="/youtube">Browse Components</Link>
            </Button>
          </div>
          {/* <div className="flex items-center gap-x-3 justify-center mt-8 text-primary/50">
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
          </div> */}
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20"></div>
          <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
          <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
        </div>
      </div>
      <div className="container px-4 md:px-6">
        
        <BlogLayout/>
      </div>
    </section>
  )
}
