import { Metadata } from "next";
import VideoGrid from "./VideoGrid";

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
      <h1 className="text-4xl font-bold mb-8 text-center">
        Popular YouTube Videos
      </h1>
      <VideoGrid />
    </section>
  );
}
