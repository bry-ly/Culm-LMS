import "server-only";
import { requireAdmin } from "./require-admin";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const adminGetCourse = cache(async (courseId: string) => {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      filekey: true,
      price: true,
      duration: true,
      smallDescription: true,
      status: true,
      slug: true,
      level: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      isFree: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lesson: {
            select: {
              id: true,
              title: true,
              position: true,
              thumbnailKey: true,
              videoKey: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
});

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
