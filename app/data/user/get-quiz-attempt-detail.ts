import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireUser } from "./require-user";
import { redirect } from "next/navigation";

export const getQuizAttemptDetail = cache(async (attemptId: string) => {
  const user = await requireUser();

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      id: attemptId,
      userId: user.id,
    },
    select: {
      id: true,
      score: true,
      totalPoints: true,
      percentage: true,
      passed: true,
      answers: true,
      startedAt: true,
      completedAt: true,
      status: true,
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          passingScore: true,
          timeLimit: true,
          allowRetake: true,
          maxAttempts: true,
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
                      slug: true,
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
                  slug: true,
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
          _count: {
            select: {
              attempts: {
                where: {
                  userId: user.id,
                  status: "Completed",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    redirect("/dashboard/quiz/history");
  }

  return attempt;
});

export type QuizAttemptDetailType = Awaited<
  ReturnType<typeof getQuizAttemptDetail>
>;
