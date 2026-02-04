"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tryCatch } from "@/hooks/try-catch";
import { adminUpdateReviewStatus } from "../actions";
import { ReviewStatus } from "@/lib/generated/prisma/client";

interface ReviewStatusSelectProps {
  reviewId: string;
  currentStatus: ReviewStatus;
}

const statusOptions: { value: ReviewStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const statusColors: Record<ReviewStatus, string> = {
  Pending: "text-yellow-600",
  Approved: "text-green-600",
  Rejected: "text-red-600",
};

export function ReviewStatusSelect({
  reviewId,
  currentStatus,
}: ReviewStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: ReviewStatus) {
    if (value === currentStatus) return;

    startTransition(async () => {
      const { data, error } = await tryCatch(
        adminUpdateReviewStatus(reviewId, value)
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
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={statusColors[option.value]}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
