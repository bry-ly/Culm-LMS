import "server-only";
import { requireUser } from "./require-user";
import prisma from "@/lib/db";
import { cache } from "react";

export const getEnrolledCourses = cache(async () => {
  const user = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          filekey: true,
          level: true,
          duration: true,
          slug: true,
          category: true,
          price: true,
          chapter: {
            select: {
              id: true,
              lesson: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      completed: true,
                      id: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
});

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
