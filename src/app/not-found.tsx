import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Search,
  Book,
  ArrowLeft,
  Zap,
  Code2,
  FileX,
  RefreshCw,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Code A Program",
  description:
    "The page you're looking for doesn't exist. Explore our tutorials, blogs, and resources instead.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-primary/10 select-none leading-none">
            404
          </div>

          {/* Floating code elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Code2 className="h-16 w-16 md:h-24 md:w-24 text-primary animate-pulse" />

              {/* Floating elements */}
              <div className="absolute -top-8 -left-8 animate-bounce delay-100">
                <div className="w-4 h-4 bg-cyan-500 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -top-4 -right-12 animate-bounce delay-300">
                <div className="w-3 h-3 bg-purple-500 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -bottom-6 -left-12 animate-bounce delay-500">
                <div className="w-5 h-5 bg-green-500 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 animate-bounce delay-700">
                <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileX className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
              Page Not Found
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Oops! This page got{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              lost in the code
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist, but don't worry! Our
            tutorials and resources are still here to help you code amazing
            things.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link href="/" className="flex items-center gap-2">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>

          <Link href="/blogs" className="flex items-center gap-2">
            <Book className="mr-2 h-5 w-5" />
            Browse Tutorials
          </Link>

          <Link href="/contact" className="flex items-center gap-2">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Link>
        </div>

        {/* Popular content suggestions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Popular Content You Might Like
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Tailwind CSS Tutorials
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn modern Tailwind CSS development with our comprehensive
                  react.js guides
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/blogs/category/tailwind-css">
                    Explore Tutorials
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">React Components</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Build beautiful UIs with our React and Tailwind CSS components
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/blogs/category/react-js">View Components</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Source Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download complete project source code for all our tutorials
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/blogs">Get Source Code</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search suggestion */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Looking for something specific?
            </h3>
            <p className="text-muted-foreground mb-6">
              Try searching our blog posts or browse by categories to find what
              you need.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span>#NextJS</span>
              <span>#React</span>
              <span>#TailwindCSS</span>
              <span>#TypeScript</span>
              {/* <Button size="sm" variant="secondary" asChild>
                <Link href="/blogs/category/nextjs">#NextJS</Link>
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/blogs/category/react">#React</Link>
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/blogs/category/tailwindcss">#TailwindCSS</Link>
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/blogs/category/typescript">#TypeScript</Link>
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Contact section */}
        <div className="pt-8 border-t border-border/50 mt-16">
          <p className="text-muted-foreground mb-4">
            Still can't find what you're looking for?
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        {/* Fun fact */}
        <div className="text-sm text-muted-foreground/70 max-w-lg mx-auto leading-relaxed">
          <p className="italic">
            💡 Fun fact: HTTP 404 errors were named after a room number at CERN
            where the original web server was located!
          </p>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-green-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
