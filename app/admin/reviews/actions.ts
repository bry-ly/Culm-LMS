"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { ReviewStatus } from "@/lib/generated/prisma/client";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 20,
  })
);

export async function adminUpdateReviewStatus(
  reviewId: string,
  status: ReviewStatus
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked.",
      };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return {
        status: "error",
        message: "Review not found",
      };
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    revalidatePath("/admin/reviews");

    return {
      status: "success",
      message: `Review ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.error("Error updating review status:", error);
    return {
      status: "error",
      message: "Failed to update review status",
    };
  }
}

export async function adminDeleteReview(
  reviewId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked.",
      };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return {
        status: "error",
        message: "Review not found",
      };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");

    return {
      status: "success",
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      status: "error",
      message: "Failed to delete review",
    };
  }
}
