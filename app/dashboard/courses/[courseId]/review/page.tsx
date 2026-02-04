import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReviewForm } from "./_components/ReviewForm";
import { getUserReview } from "@/app/data/user/get-user-review";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import prisma from "@/lib/db";

interface ReviewPageProps {
  params: Promise<{ courseId: string }>;
}

async function ReviewPageContent({ courseId }: { courseId: string }) {
  const [course, isEnrolled, existingReview] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    }),
    checkIfCourseBought(courseId),
    getUserReview(courseId),
  ]);

  if (!course) {
    notFound();
  }

  if (!isEnrolled) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-xl font-semibold">Not Enrolled</h2>
        <p className="text-muted-foreground">
          You must be enrolled in this course to leave a review.
        </p>
      </div>
    );
  }

  return (
    <ReviewForm
      courseId={courseId}
      courseName={course.title}
      existingReview={existingReview}
    />
  );
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { courseId } = await params;

  return (
    <div className="container py-8">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-muted-foreground animate-pulse">
              Loading...
            </div>
          </div>
        }
      >
        <ReviewPageContent courseId={courseId} />
      </Suspense>
    </div>
  );
}
