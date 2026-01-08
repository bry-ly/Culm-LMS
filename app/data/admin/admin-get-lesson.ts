import "server-only";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";
import { cache } from "react";

export const adminGetLesson = cache(async (id: string) => {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if (!data) {
    notFound();
  }

  return data;
});

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
