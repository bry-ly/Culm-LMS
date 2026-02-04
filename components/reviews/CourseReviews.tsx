import Link from "next/link";
import { MessageSquarePlusIcon } from "lucide-react";

import { ReviewCard } from "./ReviewCard";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { CourseReviewsType } from "@/app/data/course/get-course-reviews";

interface CourseReviewsProps {
  data: CourseReviewsType;
  courseId: string;
  showWriteReviewButton?: boolean;
}

export function CourseReviews({
  data,
  courseId,
  showWriteReviewButton = false,
}: CourseReviewsProps) {
  const { reviews, averageRating, totalReviews } = data;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Student Reviews</h3>
          {totalReviews > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-muted-foreground text-sm">
                {averageRating.toFixed(1)} out of 5 ({totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">No reviews yet</p>
          )}
        </div>
        {showWriteReviewButton && (
          <Button asChild>
            <Link href={`/dashboard/courses/${courseId}/review`}>
              <MessageSquarePlusIcon className="mr-2 size-4" />
              Write a Review
            </Link>
          </Button>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg border py-8 text-center">
          <p className="text-muted-foreground">
            Be the first to review this course!
          </p>
        </div>
      )}
    </section>
  );
}
