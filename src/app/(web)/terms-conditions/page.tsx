import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// metadata
export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using the Code A Program website. By accessing our site, you agree to these terms.",
  keywords: ["terms and conditions", "legal", "Code A Program terms"],
  openGraph: {
    title: "Terms & Conditions | Code A Program",
    description:
      "Read the terms and conditions for using the Code A Program website.",
    url: "https://codeaprogram.com/terms-conditions",
    siteName: "Code A Program",
    type: "website",
  },
};

export default function TermsAndConditions() {
  return (
    <section className="max-w-screen-md mx-auto py-16 px-5 space-y-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        <p className="text-muted-foreground mt-2">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-full">
        <h2 className="text-2xl font-bold">1. Introduction</h2>
        <p>
          Welcome to Code A Program! These terms and conditions outline the
          return; rules and regulations for the use of Code A Program&apos;s
          Website, located at{" "}
          <Link href="/" className="text-primary hover:underline">
            codeaprogram.tech
          </Link>
          . By accessing this website we assume you accept these terms and
          conditions. Do not continue to use Code A Program if you do not agree
          to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-bold">2. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, Code A Program
          and/or its licensors own all the intellectual property rights and
          materials contained in this Website. You are granted limited license
          only for purposes of viewing the material contained on this Website.
          This includes all tutorials, source code, and other materials unless
          otherwise stated.
        </p>

        <h2 className="text-2xl font-bold">3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
          <li>
            Publishing any Website material in any other media without proper
            attribution.
          </li>
          <li>
            Selling, sublicensing and/or otherwise commercializing any Website
            material.
          </li>
          <li>
            Using this Website in any way that is or may be damaging to this
            Website.
          </li>
          <li>
            Using this Website contrary to applicable laws and regulations, or
            in any way may cause harm to the Website, or to any person or
            business entity.
          </li>
        </ul>

        <h2 className="text-2xl font-bold">4. Your Content</h2>
        <p>
          In these Website Standard Terms and Conditions, “Your Content” shall
          mean any audio, video text, images or other material you choose to
          display on this Website. By displaying Your Content, you grant Code A
          Program a non-exclusive, worldwide irrevocable, sub licensable license
          to use, reproduce, adapt, publish, translate and distribute it in any
          and all media.
        </p>

        <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
        <p>
          In no event shall Code A Program, nor any of its officers, directors
          and employees, be held liable for anything arising out of or in any
          way connected with your use of this Website whether such liability is
          under contract. Code A Program, including its officers, directors and
          employees shall not be held liable for any indirect, consequential or
          special liability arising out of or in any way related to your use of
          this Website.
        </p>

        <h2 className="text-2xl font-bold">6. Changes to These Terms</h2>
        <p>
          We reserve the right to revise these terms and conditions at any time.
          By using this Website you are expected to review these terms on a
          regular basis to ensure you understand all terms and conditions
          governing use of this Website.
        </p>

        <h2 className="text-2xl font-bold">7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:codeaprogram@gmail.com"
            className="text-primary hover:underline"
          >
            codeaprogram@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
