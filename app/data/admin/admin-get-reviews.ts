import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetReviews = cache(async () => {
  await requireAdmin();

  return prisma.review.findMany({
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
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type AdminReviewsType = Awaited<ReturnType<typeof adminGetReviews>>;
export type AdminReviewType = AdminReviewsType[number];
