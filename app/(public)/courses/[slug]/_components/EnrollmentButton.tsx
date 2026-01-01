"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { EnrollmentCourseAction } from "../actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        EnrollmentCourseAction(courseId)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        // Check if we have a checkoutUrl to redirect to
        if ("checkoutUrl" in result && result.checkoutUrl) {
          // Redirect to checkout page
          window.location.href = result.checkoutUrl as string;
        } else {
          toast.success(result.message);
        }
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        "Enroll Now!"
      )}
    </Button>
  );
}
