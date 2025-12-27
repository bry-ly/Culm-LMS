

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCopy, Gamepad2Icon, AlignEndHorizontalIcon, User2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of courses designed to enhance your skills and knowledge.",
    icon: <BookCopy className="h-6 w-6" />,
  },
  {
    title: "Interactive Learning",
    description: "Engage with interactive content, quizzes, and assignments to reinforce your learning.",
    icon: <Gamepad2Icon className="h-6 w-6" />,
  },
  {
    title: " Progress Tracking",
    description: "Track your progress and achievements with detailed analytics and personalized dashboards.",
    icon: <AlignEndHorizontalIcon className="h-6 w-6" />,
  },
  {
    title: "Community Support",
    description: "Connect with fellow learners and instructors through our community forums.",
    icon: <User2 className="h-6 w-6" />,
  },
];

export default function Home() {
  return (
    <>
      <section className=" relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">Hyperlinking you to a bright future!</Badge>
          <h1 className="text-4xl md:text-6xl tracking-tight font-semibold">Elevate your learning experience</h1>
          <p className="max-w-2xl text-muted-foreground md:text-xl">Discover a new way to learn with our modern, interactive learning management system. Access high-quality courses anytime, anywhere.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
               <CardTitle className="">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">{feature.description}</p></CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
