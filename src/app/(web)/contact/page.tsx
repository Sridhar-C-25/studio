// meta tag
import { Metadata } from "next";
import {
  YouTubeFilledIcon,
  GitHubFilledIcon,
  InstagramFilledIcon,
} from "../components/icon";

export const metadata: Metadata = {
  title: "Contact Us | Code A Program",
  description:
    "Code A Program is a blog where we post blogs related to React js, Tailwind CSS, Next js, React js, Html, Css, Javascript and more. If you have any queries, please do not hesitate to contact me.",
  keywords: ["Contact", "Code A Program Contact", "coding blogs"],
  openGraph: {
    title: "Contact Us | Code A Program",
    description:
      "Code A Program is a blog where we post blogs related to React js, Tailwind CSS, Next js, React js, Html, Css, Javascript and more. If you have any queries, please do not hesitate to contact me.",
    url: "https://codeaprogram.com/contact",
    siteName: "Code A Program",
  },
};

export default function Contact() {
  return (
    <section className="py-10 px-4 pb-20">
      <div className="container mx-auto px-4 space-y-4 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-4xl font-bold">Contact Us</h2>
          <br />
          <p className="text-gray-300">
            We value your questions and feedback regarding our content. Please
            get in touch with us directly at{" "}
            <a
              href="mailto:codeaprogram@gmail.com"
              className="text-cyan-500 underline"
            >
              codeaprogram@gmail.com
            </a>{" "}
            for any inquiries or suggestions.
          </p>
          <br />
          <p className="text-gray-300">
            For freelance work, product feedback, or community contributions,
            just send a message using the form below or via email. I usually
            respond within 24 hours.
          </p>
        </div>
      </div>
      <div></div>
      {/* Connect Section */}
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center">Connect With Us</h2>
        <p className="text-md text-muted-foreground text-center max-w-2xl mx-auto">
          Join our community and stay updated with the latest tutorials,
          projects, and web development insights.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://www.youtube.com/@codeaprogram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <YouTubeFilledIcon />
            Watch Tutorials on YouTube
          </a>
          <a
            href="https://github.com/sridhar-c-25"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            <GitHubFilledIcon />
            View Projects on GitHub
          </a>
          <a
            href="https://www.instagram.com/codeaprogram/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
          >
            <InstagramFilledIcon />
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
