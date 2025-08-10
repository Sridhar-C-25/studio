import Link from "next/link";
import {
  YouTubeFilledIcon,
  GitHubFilledIcon,
  InstagramFilledIcon,
  ArrowRightIcon,
} from "../_components/icon";

// metadata
export const metadata = {
  title: "About | Code A Program - Web Development Blog & Tutorials",
  description:
    "Learn web development with Code A Program. Expert tutorials on Next.js, React.js, Vue.js, Tailwind CSS, TypeScript, and modern web technologies. Free source code and video tutorials.",
  keywords: [
    "web development",
    "Next.js tutorials",
    "React.js tutorials",
    "Vue.js tutorials",
    "Tailwind CSS",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express.js",
    "web development blog",
    "coding tutorials",
    "frontend development",
    "backend development",
    "Code A Program About",
    "@codeaprogram",
  ],
  openGraph: {
    title: "About | Code A Program - Web Development Blog & Tutorials",
    description:
      "Learn web development with Code A Program. Expert tutorials on Next.js, React.js, Vue.js, Tailwind CSS, TypeScript, and modern web technologies. Free source code and video tutorials.",
    url: "https://codeaprogram.com/about",
    siteName: "Code A Program",
    type: "website",
  },
};

export default function About() {
  return (
    <section className="max-w-screen-xl md:min-h-[calc(100vh-18rem)] mx-auto py-16 px-5">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            About Code A Program
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trusted resource for modern web development tutorials, coding
            projects, and expert guidance
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-md text-muted-foreground leading-relaxed">
              Welcome to Code A Program, a comprehensive web development blog
              dedicated to providing valuable and informative content about
              modern web technologies. We specialize in Next.js, React.js,
              Vue.js, Tailwind CSS, TypeScript, and other cutting-edge web
              development tools that power today&apos;s digital landscape.
            </p>
            <p className="text-md text-muted-foreground leading-relaxed">
              Our mission is to make web development accessible to everyone,
              from beginners taking their first steps in coding to experienced
              developers looking to stay current with the latest technologies
              and best practices.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What We Offer</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold">In-Depth Tutorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step guides covering real-world web projects
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold">Free Source Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete, downloadable code examples for all projects
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold">Video Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive coding videos on our YouTube channel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold">Latest Technologies</h3>
                  <p className="text-sm text-muted-foreground">
                    Coverage of modern frameworks and tools
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Technologies We Cover
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Next.js",
              "React.js",
              "Vue.js",
              "TypeScript",
              "Tailwind CSS",
              "JavaScript",
              "Node.js",
              "Express.js",
              "HTML5",
              "CSS3",
              "ES6+",
              "Shadcn UI",
              "Framer Motion",
              "Git",
              "GitHub",
              "Vercel",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-muted/50 rounded-lg p-3 text-center"
              >
                <span className="text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connect Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Connect With Us</h2>
          <p className="text-md text-muted-foreground text-center max-w-2xl mx-auto">
            Join our growing community of developers and stay updated with the
            latest tutorials, projects, and web development insights.
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

        {/* Contact Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Get In Touch</h2>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Have questions about our tutorials or want to suggest topics for
            future content? We&apos;d love to hear from you and help you on your
            coding journey.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Contact Us
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
