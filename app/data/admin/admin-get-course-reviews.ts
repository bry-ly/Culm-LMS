import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetCourseReviews = cache(async (courseId: string) => {
  await requireAdmin();

  return prisma.review.findMany({
    where: {
      courseId,
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type AdminCourseReviewsType = Awaited<
  ReturnType<typeof adminGetCourseReviews>
>;
export type AdminCourseReviewType = AdminCourseReviewsType[number];
