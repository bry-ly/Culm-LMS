import { Suspense } from "react";
import { MessageSquareIcon } from "lucide-react";

import { ReviewsTable } from "./_components/ReviewsTable";
import { adminGetReviews } from "@/app/data/admin/admin-get-reviews";

async function ReviewsContent() {
  const reviews = await adminGetReviews();

  return <ReviewsTable reviews={reviews} />;
}

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessageSquareIcon className="size-6" />
            Reviews
          </h1>
          <p className="text-muted-foreground">
            Manage course reviews and ratings
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground animate-pulse">
              Loading reviews...
            </div>
          </div>
        }
      >
        <ReviewsContent />
      </Suspense>
    </div>
  );
}
