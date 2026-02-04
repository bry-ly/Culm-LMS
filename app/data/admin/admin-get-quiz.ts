import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";

export const adminGetQuiz = cache(async (quizId: string) => {
  await requireAdmin();

  const quiz = await prisma.quiz.findUnique({
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
      position: true,
      lessonId: true,
      createdAt: true,
      updatedAt: true,
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
          correctAnswer: true,
          explanation: true,
          points: true,
          position: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!quiz) {
    notFound();
  }

  return quiz;
});

export type AdminQuizDetailType = Awaited<ReturnType<typeof adminGetQuiz>>;
