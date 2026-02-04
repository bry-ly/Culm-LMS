import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetChaptersForSelect = cache(async () => {
  await requireAdmin();

  return prisma.chapter.findMany({
    select: {
      id: true,
      title: true,
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: [{ course: { title: "asc" } }, { position: "asc" }],
  });
});

export type AdminChaptersForSelectType = Awaited<
  ReturnType<typeof adminGetChaptersForSelect>
>;
