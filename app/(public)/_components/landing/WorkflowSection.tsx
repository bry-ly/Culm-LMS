import { Compass, BookOpen, Award } from "lucide-react";

const workflowSteps = [
  {
    title: "Explore & Enroll",
    description:
      "Browse our extensive catalog and find the perfect course for your goals.",
    icon: <Compass className="text-primary h-8 w-8" />,
  },
  {
    title: "Learn & Engage",
    description:
      "Participate in interactive lessons, assignments, and discussions.",
    icon: <BookOpen className="text-primary h-8 w-8" />,
  },
  {
    title: "Achieve & Succeed",
    description:
      "Earn certificates, track progress, and reach your full potential.",
    icon: <Award className="text-primary h-8 w-8" />,
  },
];

export function WorkflowSection() {
  return (
    <section className="border-t py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          How It Works
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Your journey to mastery in three simple steps.
        </p>
      </div>
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="bg-border/50 absolute top-[20%] right-[16.66%] left-[16.66%] -z-10 hidden h-0.5 md:block" />
        {workflowSteps.map((step) => (
          <div
            key={step.title}
            className="bg-background flex flex-col items-center space-y-4 text-center"
          >
            <div className="bg-muted flex items-center justify-center rounded-full p-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground max-w-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
