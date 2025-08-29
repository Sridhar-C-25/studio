// meta tag
import { Metadata } from "next";
import {
  YouTubeFilledIcon,
  GitHubFilledIcon,
  InstagramFilledIcon,
} from "../_components/icon";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Contact Us | Code A Program",
  description:
    "Get in touch with Code A Program. We welcome your questions, feedback, and collaboration inquiries. Contact us via email or connect on social media.",
  keywords: [
    "Contact",
    "Code A Program Contact",
    "coding blogs",
    "web development contact",
  ],
  openGraph: {
    title: "Contact Us | Code A Program",
    description:
      "Get in touch with Code A Program. We welcome your questions, feedback, and collaboration inquiries. Contact us via email or connect on social media.",
    url: "https://codeaprogram.com/contact",
    siteName: "Code A Program",
  },
};

export default function Contact() {
  return (
    <section className="max-w-screen-lg mx-auto py-16 px-5 md:min-h-[calc(100vh-18rem)]">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Get In Touch</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have a question, feedback, or a project proposal? I&apos;d love to
          hear from you. The best way to reach me is by email. I typically
          respond within 24 hours.
        </p>
        <a
          href="mailto:codeaprogram@gmail.com"
          className="inline-block bg-primary text-primary-foreground text-lg font-semibold px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          codeaprogram@gmail.com
        </a>
      </div>

      {/* Connect Section */}
      <div className="mt-20 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Connect With Us on Social Media
        </h2>
        <p className="text-md text-muted-foreground text-center max-w-2xl mx-auto">
          Join our growing community and stay updated with the latest tutorials,
          projects, and web development insights.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="https://www.youtube.com/@codeaprogram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <YouTubeFilledIcon />
            Watch Tutorials on YouTube
          </Link>
          <Link
            href="https://github.com/sridhar-c-25"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            <GitHubFilledIcon />
            View Projects on GitHub
          </Link>
          <Link
            href="https://www.instagram.com/codeaprogram/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
          >
            <InstagramFilledIcon />
            Follow Us on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
