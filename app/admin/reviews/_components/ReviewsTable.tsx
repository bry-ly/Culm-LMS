"use client";

import { useTransition } from "react";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tryCatch } from "@/hooks/try-catch";
import { AdminReviewsType } from "@/app/data/admin/admin-get-reviews";
import { StarRating } from "@/components/reviews/StarRating";
import { ReviewStatusSelect } from "./ReviewStatusSelect";
import { adminDeleteReview } from "../actions";
import { formatDistanceToNow } from "date-fns";

interface ReviewsTableProps {
  reviews: AdminReviewsType;
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(reviewId: string) {
    startTransition(async () => {
      const { data, error } = await tryCatch(adminDeleteReview(reviewId));

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
    });
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
        <p className="text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => {
            const initials = review.user.name
              ? review.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?";

            return (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src={review.user.image ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {review.user.name ?? "Unknown"}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {review.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/courses/${review.course.id}`}
                    className="text-sm hover:underline"
                  >
                    {review.course.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} size="sm" />
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    {review.title && (
                      <p className="truncate text-sm font-medium">
                        {review.title}
                      </p>
                    )}
                    {review.content && (
                      <p className="text-muted-foreground truncate text-xs">
                        {review.content}
                      </p>
                    )}
                    {!review.title && !review.content && (
                      <p className="text-muted-foreground text-xs italic">
                        No written review
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ReviewStatusSelect
                    reviewId={review.id}
                    currentStatus={review.status}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                        >
                          <MoreHorizontalIcon className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <TrashIcon className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The review will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
