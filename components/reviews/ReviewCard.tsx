import { formatDistanceToNow } from "date-fns";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseReviewType } from "@/app/data/course/get-course-reviews";

interface ReviewCardProps {
  review: CourseReviewType;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user.name
    ? review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={review.user.image ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {review.user.name ?? "Anonymous"}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {review.title && <h4 className="mb-1 font-semibold">{review.title}</h4>}
        {review.content && (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">
            {review.content}
          </p>
        )}
        {!review.title && !review.content && (
          <p className="text-muted-foreground text-sm italic">
            No written review
          </p>
        )}
      </CardContent>
    </Card>
  );
}
