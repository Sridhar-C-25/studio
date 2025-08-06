
import { Metadata } from "next";
import type { PropsWithChildren } from "react";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Code A Program: Your Hub for Modern Web Dev",
  description:
    "Explore expert tutorials, free source code, and video guides on Next.js, React, Tailwind CSS, and more. Level up your coding skills with Code A Program.",
  keywords: [
    "React js & Tailwind CSS",
    "Tailwind components",
    "Code A Program",
    "Next.js blog",
    "React UI snippets",
    "Next.js and Shadcn UI",
    "Javascript",
    "Web Dev Templates",
    "UI components for web development",
    "Web Dev Components",
    "Web Dev Source Code",
  ],
  metadataBase: new URL("https://codeaprogram.tech"),
  authors: [{ name: "Code A Program", url: "https://codeaprogram.com" }],
  openGraph: {
    title: "Code A Program: Your Hub for Modern Web Dev",
    description:
      "Explore expert tutorials, free source code, and video guides on Next.js, React, Tailwind CSS, and more. Level up your coding skills with Code A Program.",
    url: "https://codeaprogram.tech",
    siteName: "Code A Program",
    locale: "en_US",
    type: "website",
  },
};

export default function WebLayout({ children }: PropsWithChildren) {
  return (
    <>
    <Nav/>
    <main>
      {children}
    </main>
    <Footer />
    </>
  );
}
