"use server";

import { requireUser } from "@/app/data/user/require-user";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { reviewSchema, ReviewSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1h",
    max: 5,
  })
);

export async function createReview(
  values: ReviewSchemaType
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many reviews. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked.",
      };
    }

    const validation = reviewSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const { courseId, rating, title, content } = validation.data;

    const isEnrolled = await checkIfCourseBought(courseId);

    if (!isEnrolled) {
      return {
        status: "error",
        message: "You must be enrolled in this course to leave a review.",
      };
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existingReview) {
      return {
        status: "error",
        message: "You have already reviewed this course.",
      };
    }

    await prisma.review.create({
      data: {
        rating,
        title,
        content,
        status: "Approved",
        userId: user.id,
        courseId,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);

    return {
      status: "success",
      message: "Review submitted successfully.",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      status: "error",
      message: "Failed to create review",
    };
  }
}

export async function updateReview(
  reviewId: string,
  values: ReviewSchemaType
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const validation = reviewSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const { courseId, rating, title, content } = validation.data;

    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return {
        status: "error",
        message: "Review not found.",
      };
    }

    if (existingReview.userId !== user.id) {
      return {
        status: "error",
        message: "You can only edit your own reviews.",
      };
    }

    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating,
        title,
        content,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);

    return {
      status: "success",
      message: "Review updated successfully.",
    };
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      status: "error",
      message: "Failed to update review",
    };
  }
}

export async function deleteReview(
  reviewId: string,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return {
        status: "error",
        message: "Review not found.",
      };
    }

    if (existingReview.userId !== user.id) {
      return {
        status: "error",
        message: "You can only delete your own reviews.",
      };
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);

    return {
      status: "success",
      message: "Review deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      status: "error",
      message: "Failed to delete review",
    };
  }
}
