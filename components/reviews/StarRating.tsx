import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => {
          const filled = star <= rating;
          const StarComponent = interactive ? "button" : "span";

          return (
            <StarComponent
              key={star}
              type={interactive ? "button" : undefined}
              onClick={
                interactive && onChange ? () => onChange(star) : undefined
              }
              className={cn(
                interactive &&
                  "focus:ring-primary rounded focus:ring-2 focus:outline-none"
              )}
            >
              <StarIcon
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted-foreground"
                )}
              />
            </StarComponent>
          );
        })}
      </div>
      {showValue && (
        <span className="text-muted-foreground ml-1 text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
