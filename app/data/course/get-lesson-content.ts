import "server-only";
import { requireUser } from "../user/require-user";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getLessonContent = cache(async (lessonId: string) => {
  const session = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: session.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      quizzes: {
        select: {
          id: true,
          title: true,
          description: true,
          passingScore: true,
          timeLimit: true,
          allowRetake: true,
          maxAttempts: true,
          _count: {
            select: {
              questions: true,
            },
          },
          attempts: {
            where: {
              userId: session.id,
            },
            select: {
              id: true,
              score: true,
              percentage: true,
              passed: true,
              status: true,
              completedAt: true,
            },
            orderBy: {
              completedAt: "desc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
              enrollment: {
                where: {
                  userId: session.id,
                  status: "Active",
                },
                select: {
                  status: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  const isEnrolled = lesson.chapter.course.enrollment.length > 0;

  if (!isEnrolled) {
    return notFound();
  }

  return lesson;
});

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
