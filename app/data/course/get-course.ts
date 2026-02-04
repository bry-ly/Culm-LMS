import "server-only";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getIndividualCourse = cache(async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      filekey: true,
      price: true,
      duration: true,
      level: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      smallDescription: true,
      isFree: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lesson: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
});
