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
// Organization JSON-LD structured data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.codeaprogram.tech/#organization",
  name: "Code A Program",
  alternateName: "@codeaprogram",
  url: "https://www.codeaprogram.tech",
  logo: {
    "@type": "ImageObject",
    url: "https://www.codeaprogram.tech/logo.png",
    width: 512,
    height: 512,
  },
  image: "https://www.codeaprogram.tech/logo.png",
  description:
    "Code A Program is a blog dedicated to providing valuable and informative content about modern web development technologies such as Next.js, React, Tailwind CSS, JavaScript, HTML, CSS, and advanced web development practices.",
  founder: {
    "@type": "Person",
    name: "Sridhar Chandrasekar",
    url: "https://www.codeaprogram.tech/about",
  },
  foundingDate: "2025",
  knowsAbout: [
    "Web Development",
    "Next.js",
    "React.js",
    "Vue.js",
    "Tailwind CSS",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express.js",
    "HTML5",
    "CSS3",
    "Frontend Development",
    "Backend Development",
    "Modern Web Development Practices",
  ],
  sameAs: [
    "https://www.youtube.com/@codeaprogram",
    "https://github.com/sridhar-c-25",
    "https://www.instagram.com/codeaprogram/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "codeaprogram@gmail.com",
    contactType: "Customer Service",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
};

// Website JSON-LD structured data
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.codeaprogram.tech/#website",
  name: "Code A Program",
  alternateName: "Code A Program Blog",
  url: "https://www.codeaprogram.tech",
  description:
    "Code A Program is a blog dedicated to providing valuable and informative content about modern web development technologies such as Next.js, React, Tailwind CSS, JavaScript, HTML, CSS, and advanced web development practices.",
  publisher: {
    "@type": "Organization",
    name: "Code A Program",
    logo: {
      "@type": "ImageObject",
      url: "https://www.codeaprogram.tech/logo.png",
    },
  },
  mainEntity: {
    "@type": "Blog",
    name: "Code A Program Blog",
    description: "Modern web development tutorials and coding guides",
    url: "https://www.codeaprogram.tech/blogs",
    publisher: {
      "@type": "Organization",
      name: "Code A Program",
    },
  },
  inLanguage: "en-US",
};

// Blog JSON-LD
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.codeaprogram.tech/#blog",
  name: "Code A Program Blog",
  url: "https://www.codeaprogram.tech/blogs",
  description:
    "Expert tutorials and guides on modern web development technologies including Next.js, React, Tailwind CSS, and more",
  publisher: {
    "@type": "Organization",
    name: "Code A Program",
    logo: {
      "@type": "ImageObject",
      url: "https://www.codeaprogram.tech/logo.png",
    },
  },
  author: {
    "@type": "Person",
    name: "Sridhar Chandrasekar",
    url: "https://www.codeaprogram.tech/about",
  },
  inLanguage: "en-US",
  about: [
    "Web Development",
    "Next.js",
    "React.js",
    "Tailwind CSS",
    "TypeScript",
    "JavaScript",
    "Programming Tutorials",
  ],
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
      {/* Organization JSON-LD */}
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      {/* Website JSON-LD */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      {/* Blog JSON-LD */}
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd),
        }}
      />
      <Nav />
      <main className="md:container">{children}</main>
      <Footer />
    </>
  );
}
