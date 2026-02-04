import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireUser } from "./require-user";

export const getUserReview = cache(async (courseId: string) => {
  const user = await requireUser();

  return prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});

export type UserReviewType = Awaited<ReturnType<typeof getUserReview>>;
