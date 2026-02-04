import "server-only";

import { cache } from "react";

import prisma from "@/lib/db";

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      position: "asc",
    },
  });
});

export type CategoriesType = Awaited<ReturnType<typeof getCategories>>;
