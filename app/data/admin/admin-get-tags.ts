import "server-only";

import { cache } from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetTags = cache(async () => {
  await requireAdmin();

  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: {
        select: { courses: true },
      },
    },
  });
});

export type AdminTagType = Awaited<ReturnType<typeof adminGetTags>>[0];
