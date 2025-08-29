import { Metadata } from "next";
import VideoGrid from "./VideoGrid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "YouTube Videos | Code A Program",
  description:
    "Watch the latest YouTube videos from Code A Program. Tutorials, guides, and more for web development.",
  keywords: [
    "code a program youtube channel",
    "web development",
    "tutorials",
    "guides",
    "codeaprogram",
    "tailwindcss tutorial",
    "react js tailwindcss youtube tutorial",
  ],
  openGraph: {
    title: "YouTube Videos | Code A Program",
    description:
      "Watch the latest YouTube videos from Code A Program. Tutorials, guides, and more for web development.",
    url: "https://www.codeaprogram.tech/youtube",
    siteName: "Code A Program",
    type: "website",
  },
};

export default function YoutubePage() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>YouTube</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our YouTube Video Library
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Welcome to the official video library for Code A Program! Here you'll find all my hands-on coding tutorials on topics like React, Next.js, and Tailwind CSS. Don't forget to subscribe on YouTube for the latest updates!
        </p>
      </div>
      <VideoGrid />
    </section>
  );
}
