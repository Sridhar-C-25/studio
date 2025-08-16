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

          gtag('config', 'G-22XPTRPZX4');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5330892218225177"
        crossOrigin="anonymous"
      />
      <Nav />
      <main className="md:container">{children}</main>
      <Footer />
    </>
  );
}
