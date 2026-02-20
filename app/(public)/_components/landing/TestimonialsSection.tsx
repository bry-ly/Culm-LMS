import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "Culm LMS completely transformed the way I learn. The courses are top-notch and the community is incredibly supportive.",
    name: "Alex Johnson",
    role: "Software Engineer",
    avatar: "AJ",
  },
  {
    quote:
      "An intuitive platform with engaging content. I was able to master new skills much faster than I expected.",
    name: "Sarah Lee",
    role: "UX Designer",
    avatar: "SL",
  },
  {
    quote:
      "The progress tracking feature is fantastic. It keeps me motivated and on track with my learning goals.",
    name: "Michael Chen",
    role: "Data Analyst",
    avatar: "MC",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/10 border-t py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Loved by Learners
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Don&apos;t just take our word for it. Here&apos;s what our users have
          to say.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="bg-background border-none shadow-sm"
          >
            <CardContent className="space-y-4 pt-6">
              <p className="text-muted-foreground italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center space-x-4 border-t pt-4">
                <Avatar>
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                  <span className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
