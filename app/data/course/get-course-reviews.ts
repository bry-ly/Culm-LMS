import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";

export const getCourseReviews = cache(async (courseId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      courseId,
      status: "Approved",
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = await prisma.review.aggregate({
    where: {
      courseId,
      status: "Approved",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    reviews,
    averageRating: stats._avg.rating ?? 0,
    totalReviews: stats._count.rating,
  };
});

export type CourseReviewsType = Awaited<ReturnType<typeof getCourseReviews>>;
export type CourseReviewType = CourseReviewsType["reviews"][number];
