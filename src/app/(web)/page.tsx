import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlogLayout from "./_components/BlogLayout";
import { YouTubeFilledIcon } from "./_components/icon";

export default function Page() {
  return (
    <section
      className="w-full py-20 md:py-32 lg:py-40 overflow-hidden"
      aria-label="Hero Section"
    >
      <div className="container px-4 md:px-6 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#2f2f2f_1px,transparent_1px),linear-gradient(to_bottom,#2f2f2f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Your Hub for Modern Web Dev
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore expert tutorials, free source code, and video guides on
            Next.js, React, Tailwind CSS, and more. Level up your coding skills
            with Code A Program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href="/youtube">
                <YouTubeFilledIcon className="mr-2" />
                Watch Videos
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href="/blogs">Browse Articles</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20"></div>
          <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
          <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
        </div>
      </div>
      <div className="container px-4 md:px-6">
        <BlogLayout />
      </div>
    </section>
  );
}
