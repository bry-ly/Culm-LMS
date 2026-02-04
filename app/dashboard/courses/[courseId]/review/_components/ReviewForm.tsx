"use client";

import { useTransition } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { tryCatch } from "@/hooks/try-catch";
import { reviewSchema, ReviewSchemaType } from "@/lib/zodSchemas";
import { createReview, updateReview, deleteReview } from "../actions";
import { UserReviewType } from "@/app/data/user/get-user-review";
import { cn } from "@/lib/utils";

interface ReviewFormValues {
  rating: number;
  title: string;
  content: string;
  courseId: string;
}

interface ReviewFormProps {
  courseId: string;
  courseName: string;
  existingReview?: UserReviewType | null;
}

export function ReviewForm({
  courseId,
  courseName,
  existingReview,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = !!existingReview;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewFormValues>,
    defaultValues: {
      rating: existingReview?.rating ?? 5,
      title: existingReview?.title ?? "",
      content: existingReview?.content ?? "",
      courseId,
    },
  });

  function onSubmit(values: ReviewFormValues) {
    startTransition(async () => {
      const action = isEditing
        ? updateReview(existingReview.id, values as ReviewSchemaType)
        : createReview(values as ReviewSchemaType);

      const { data, error } = await tryCatch(action);

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push(`/dashboard/courses/${courseId}`);
    });
  }

  function handleDelete() {
    if (!existingReview) return;

    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteReview(existingReview.id, courseId)
      );

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push(`/dashboard/courses/${courseId}`);
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? `Update your review for "${courseName}"`
            : `Share your experience with "${courseName}"`}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="focus:ring-primary rounded focus:ring-2 focus:outline-none"
                        >
                          <StarIcon
                            className={cn(
                              "size-8 transition-colors",
                              star <= field.value
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Click the stars to set your rating
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Summarize your experience..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell others about your experience with this course..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share what you liked or didn&apos;t like about this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {isEditing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isPending}
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      Delete Review
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your review will be
                        permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Updating..."
                    : "Submitting..."
                  : isEditing
                    ? "Update Review"
                    : "Submit Review"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
