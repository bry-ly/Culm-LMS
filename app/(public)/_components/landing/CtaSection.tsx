import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="space-y-8 border-t py-20 text-center md:py-32">
      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
        Ready to Start Learning?
      </h2>
      <p className="text-muted-foreground mx-auto max-w-2xl md:text-xl">
        Join thousands of learners and start your journey today. Unlock your
        full potential with Culm LMS.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
          Create an Account
        </Link>
      </div>
    </section>
  );
}
