import Link from "next/link";

// metadata
export const metadata = {
  title: "Privacy Policy | Code A Program - Web Development Blog & Tutorials",
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
    "Code A Program Privacy Policy",
    "@codeaprogram",
  ],
  openGraph: {
    title: "Privacy Policy | Code A Program - Web Development Blog & Tutorials",
    description:
      "Learn web development with Code A Program. Expert tutorials on Next.js, React.js, Vue.js, Tailwind CSS, TypeScript, and modern web technologies. Free source code and video tutorials.",
    url: "https://codeaprogram.com/privacy-policy",
    siteName: "Code A Program",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <section className="max-w-screen-xl md:min-h-[calc(100vh-18rem)] mx-auto py-16 px-5 grid grid-cols-1 md:grid-cols-3 gap-x-4">
      <div className="flex flex-col gap-4 col-span-2">
        <h2 className="text-4xl font-bold">Privacy Policy</h2>
        <p className="text-md text-muted-foreground">
          At Code A Program, we value the privacy of our visitors. This Privacy
          Policy explains how we collect, use, and safeguard your information
          when you visit our website{" "}
          <Link
            href="https://codeaprogram.tech"
            className="text-cyan-500 hover:text-cyan-500/80 transition-colors"
          >
            (https://codeaprogram.tech)
          </Link>
          . By using our website, you agree to the terms of this Privacy Policy.
        </p>
        <h3 className="text-2xl font-bold">Information We Collect</h3>
        <p className="text-md text-muted-foreground">
          When you visit our website, we may collect the following information:
        </p>
        <ul className="list-disc list-inside text-md text-muted-foreground space-y-3">
          <li>
            <span className="font-bold">Personal Information:</span> We may
            collect your name, email address, and other contact information if
            you provide it to us.
          </li>
          <li>
            <span className="font-bold">Usage Information:</span> We may collect
            information about how you use our website, such as the pages you
            visit, the links you click, and the actions you take.
          </li>
          <li>
            <span className="font-bold">Technical Information:</span> We may
            collect information about your device, such as your IP address,
            browser type, and operating system.
          </li>
        </ul>
      </div>
    </section>
  );
}
