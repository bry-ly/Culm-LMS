import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";

export const getLessonQuiz = cache(async (lessonId: string) => {
  return prisma.quiz.findFirst({
    where: { lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      passingScore: true,
      timeLimit: true,
      allowRetake: true,
      maxAttempts: true,
      shuffleQuestions: true,
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

export type LessonQuizType = Awaited<ReturnType<typeof getLessonQuiz>>;
