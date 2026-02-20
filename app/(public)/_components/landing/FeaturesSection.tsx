import {
  BookCopy,
  Gamepad2Icon,
  AlignEndHorizontalIcon,
  User2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function FeaturesSection() {
  return (
    <section className="space-y-8 py-12 md:py-20">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Why Choose Culm LMS?
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Everything you need to succeed in your learning journey, built right
          into the platform.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-pattern-striped bg-muted/40 hover:bg-muted/60 border-none transition-shadow"
          >
            <CardHeader>
              <div className="text-primary mb-4 text-4xl">{feature.icon}</div>
              <CardTitle className="">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
