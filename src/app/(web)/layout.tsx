import { Metadata } from "next";
import Script from "next/script";
import type { PropsWithChildren } from "react";
import Footer from "./_components/Footer";
import Nav from "./_components/Nav";

export const metadata: Metadata = {
  title: "Code A Program: Your Hub for Modern Web Dev",
  description:
    "Code A Program is a blog dedicated to providing valuable and informative content about modern web development technologies such as Next.js, React, Tailwind CSS, JavaScript, HTML, CSS, and advanced web development practices.",
  // Removed keywords as they're deprecated for SEO
  metadataBase: new URL("https://www.codeaprogram.tech"),
  authors: [{ name: "Code A Program", url: "https://codeaprogram.com" }],
  openGraph: {
    title: "Code A Program: Your Hub for Modern Web Dev",
    description:
      "Code A Program is a blog dedicated to providing valuable and informative content about modern web development technologies such as Next.js, React, Tailwind CSS, JavaScript, HTML, CSS, and advanced web development practices.",
    url: "https://www.codeaprogram.tech",
    siteName: "Code A Program",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.codeaprogram.tech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
