import { Metadata } from "next";
import Script from "next/script";
import type { PropsWithChildren } from "react";
import Footer from "./_components/Footer";
import Nav from "./_components/Nav";

export const metadata: Metadata = {
  title: {
    default: "Code A Program: Your Hub for Modern Web Dev",
    template: "%s | Code A Programm",
  },
  description:
    "Code A Program is a blog dedicated to providing valuable and informative content about modern web development technologies such as Next.js, React, Tailwind CSS, JavaScript, HTML, CSS, and advanced web development practices.",
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
  // Adding theme color for better mobile experience
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  keywords: ["React js Tailwind CSS components", "React js UI Components"],
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
    "Next.js UI Components",
    "React.js Tailwind CSS components",
    "Tailwind CSS UI components",
    "React js Tailwind CSS Web Components",
    "Html, CSS UI design",
    "JavaScript projects with free source code",
    "React.js Blogs",
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
    "@id": "https://www.codeaprogram.tech/#organization",
    name: "Code A Program",
    logo: {
      "@type": "ImageObject",
      url: "https://www.codeaprogram.tech/logo.png",
    },
  },
  mainEntity: {
    "@type": "Blog",
    "@id": "https://www.codeaprogram.tech/#blog",
    name: "Code A Program Blog",
    description:
      "Modern web development tutorials and coding guides for beginners. React js Tailwind CSS components, React.js UI components, and more.",
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
    "@id": "https://www.codeaprogram.tech/#organization",
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

// Breadcrumb JSON-LD
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://www.codeaprogram.tech/#breadcrumb",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.codeaprogram.tech",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://www.codeaprogram.tech/blogs",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "React.js",
      item: "https://www.codeaprogram.tech/blogs/category/react-js",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Tailwind CSS",
      item: "https://www.codeaprogram.tech/blogs/category/tailwind-css",
    },
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
      {/* Breadcrumb JSON-LD */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Nav />
      <main className="md:container">{children}</main>
      <Footer />
    </>
  );
}
