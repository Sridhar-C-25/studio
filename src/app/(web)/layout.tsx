import { Metadata } from "next";
import Script from "next/script";
import type { PropsWithChildren } from "react";
import Footer from "./_components/Footer";
import Nav from "./_components/Nav";

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
    "Free Web Development Source code",
    "Next.js and Shadcn UI",
    "Javascript",
    "html",
    "css",
    "Web Dev Templates",
    "UI components for web development",
    "Web Dev Components",
    "Web Dev Source Code",
  ],
  metadataBase: new URL("https://www.codeaprogram.tech"),
  authors: [{ name: "Code A Program", url: "https://codeaprogram.com" }],
  openGraph: {
    title: "Code A Program: Your Hub for Modern Web Dev",
    description:
      "Explore expert tutorials, free source code, and video guides on Next.js, React, Tailwind CSS, and more. Level up your coding skills with Code A Program.",
    url: "https://www.codeaprogram.tech",
    siteName: "Code A Program",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.codeaprogram.tech",
  },
};

export default function WebLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-22XPTRPZX4"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
       window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Initialize with send_page_view: false to control tracking manually
  gtag('config', 'G-22XPTRPZX4', {
    send_page_view: false
  });
  
  // Custom page tracking function
  function trackPage() {
    const path = window.location.pathname;
    const isDashboard = path.startsWith('/dashboard') 
    if (!isDashboard) {
      gtag('config', 'G-22XPTRPZX4', {
        page_path: path,
        page_title: document.title
      });
    }
  }
  // Track initial page
  trackPage();
        `}
      </Script>
      <Nav />
      <main className="md:container">{children}</main>
      <Footer />
    </>
  );
}
