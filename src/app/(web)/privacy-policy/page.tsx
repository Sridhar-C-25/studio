import Link from "next/link";

// metadata
export const metadata = {
  title: "Privacy Policy | Code A Program - Web Development Blog & Tutorials",
  description:
    "Learn about the privacy policy of Code A Program. We are committed to protecting your personal information and your right to privacy.",
  keywords: [
    "privacy policy",
    "data protection",
    "Code A Program privacy",
    "@codeaprogram",
  ],
  openGraph: {
    title: "Privacy Policy | Code A Program - Web Development Blog & Tutorials",
    description:
      "Learn about the privacy policy of Code A Program. We are committed to protecting your personal information and your right to privacy.",
    url: "https://codeaprogram.com/privacy-policy",
    siteName: "Code A Program",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <section className="max-w-screen-md mx-auto py-16 px-5 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
        <p>
          At Code A Program, accessible from{" "}
          <Link href="/" className="text-primary hover:underline">
            codeaprogram.tech
          </Link>
          , one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by Code A Program and how we use it.
        </p>

        <h2 className="text-2xl font-bold">Information We Collect</h2>
        <p>
          The personal information that you are asked to provide, and the
          reasons why you are asked to provide it, will be made clear to you at
          the point we ask you to provide your personal information.
        </p>
        <p>
          If you contact us directly, we may receive additional information
          about you such as your name, email address, phone number, the contents
          of the message and/or attachments you may send us, and any other
          information you may choose to provide.
        </p>

        <h2 className="text-2xl font-bold">How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-bold">Log Files and Cookies</h2>
        <p>
          Code A Program follows a standard procedure of using log files. These
          files log visitors when they visit websites. The information collected
          by log files include internet protocol (IP) addresses, browser type,
          Internet Service Provider (ISP), date and time stamp, referring/exit
          pages, and possibly the number of clicks. These are not linked to any
          information that is personally identifiable. The purpose of the
          information is for analyzing trends, administering the site, tracking
          users' movement on the website, and gathering demographic information.
        </p>
        <p>
          Like any other website, Code A Program uses 'cookies'. These cookies
          are used to store information including visitors' preferences, and the
          pages on the website that the visitor accessed or visited. The
          information is used to optimize the users&apos; experience by
          customizing our web page content based on visitors' browser type
          and/or other information.
        </p>

        <h2 className="text-2xl font-bold">Third-Party Privacy Policies</h2>
        <p>
          Code A Program's Privacy Policy does not apply to other advertisers or
          websites. Thus, we are advising you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed
          information. It may include their practices and instructions about how
          to opt-out of certain options.
        </p>

        <h2 className="text-2xl font-bold">Your Privacy Rights</h2>
        <p>
          Under data protection laws like CCPA and GDPR, you have rights
          including the right to access, update, or delete the information we
          have on you. If you wish to exercise any of these rights, please
          contact us.
        </p>

        <h2 className="text-2xl font-bold">Children's Information</h2>
        <p>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity. Code A
          Program does not knowingly collect any Personal Identifiable
          Information from children under the age of 13.
        </p>

        <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us at{" "}
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
