import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookCopy,
  Gamepad2Icon,
  AlignEndHorizontalIcon,
  User2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of courses designed to enhance your skills and knowledge.",
    icon: <BookCopy className="h-6 w-6" />,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to reinforce your learning.",
    icon: <Gamepad2Icon className="h-6 w-6" />,
  },
  {
    title: " Progress Tracking",
    description:
      "Track your progress and achievements with detailed analytics and personalized dashboards.",
    icon: <AlignEndHorizontalIcon className="h-6 w-6" />,
  },
  {
    title: "Community Support",
    description:
      "Connect with fellow learners and instructors through our community forums.",
    icon: <User2 className="h-6 w-6" />,
  },
];

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

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-pattern-striped transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <CardTitle className="">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
