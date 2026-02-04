import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetLessonsForSelect = cache(async () => {
  await requireAdmin();

  return prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      chapter: {
        select: {
          title: true,
          course: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: [
      { chapter: { course: { title: "asc" } } },
      { chapter: { title: "asc" } },
      { position: "asc" },
    ],
  });
});

export type AdminLessonsForSelectType = Awaited<
  ReturnType<typeof adminGetLessonsForSelect>
>;
