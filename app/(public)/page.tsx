import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturesSection } from "./_components/landing/FeaturesSection";
import { WorkflowSection } from "./_components/landing/WorkflowSection";
import { TestimonialsSection } from "./_components/landing/TestimonialsSection";
import { CtaSection } from "./_components/landing/CtaSection";
import { FooterSection } from "./_components/landing/FooterSection";
import { env } from "@/lib/env";

export default function Home() {
  const baseUrl = env.BETTER_AUTH_URL;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Culm LMS",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description:
      "A modern, interactive learning management system offering high-quality courses.",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Culm LMS",
    url: baseUrl,
    description: "Hyperlinking you to a bright future!",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <section className="relative py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant="outline">Hyperlinking you to a bright future!</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Elevate your learning experience
          </h1>
          <p className="text-muted-foreground max-w-2xl md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </>
  );
}
