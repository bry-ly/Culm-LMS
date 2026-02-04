import "server-only";

import { cache } from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetCategories = cache(async () => {
  await requireAdmin();

  return prisma.category.findMany({
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageKey: true,
      position: true,
      createdAt: true,
      _count: {
        select: { courses: true },
      },
    },
  });
});

export type AdminCategoryType = Awaited<
  ReturnType<typeof adminGetCategories>
>[0];
