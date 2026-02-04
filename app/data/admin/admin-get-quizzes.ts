import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetQuizzes = cache(async () => {
  await requireAdmin();

  return prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      passingScore: true,
      timeLimit: true,
      allowRetake: true,
      maxAttempts: true,
      shuffleQuestions: true,
      position: true,
      createdAt: true,
      lesson: {
        select: {
          id: true,
          title: true,
          chapter: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      chapter: {
        select: {
          id: true,
          title: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type AdminQuizzesType = Awaited<ReturnType<typeof adminGetQuizzes>>;
export type AdminQuizType = AdminQuizzesType[number];
