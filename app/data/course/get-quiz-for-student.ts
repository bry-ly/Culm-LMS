import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireUser } from "../user/require-user";

export const getQuizForStudent = cache(async (quizId: string) => {
  await requireUser();

  return prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      description: true,
      passingScore: true,
      timeLimit: true,
      allowRetake: true,
      maxAttempts: true,
      shuffleQuestions: true,
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
      questions: {
        select: {
          id: true,
          questionText: true,
          questionType: true,
          options: true,
          points: true,
          position: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
});

export type StudentQuizType = Awaited<ReturnType<typeof getQuizForStudent>>;
