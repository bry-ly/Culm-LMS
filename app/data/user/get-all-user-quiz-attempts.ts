import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireUser } from "./require-user";

export const getAllUserQuizAttempts = cache(async () => {
  const user = await requireUser();

  return prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      status: {
        in: ["Completed", "TimedOut"],
      },
    },
    select: {
      id: true,
      score: true,
      totalPoints: true,
      percentage: true,
      passed: true,
      startedAt: true,
      completedAt: true,
      status: true,
      quiz: {
        select: {
          id: true,
          title: true,
          passingScore: true,
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
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
  });
});

export type AllUserQuizAttemptsType = Awaited<
  ReturnType<typeof getAllUserQuizAttempts>
>;
export type AllUserQuizAttemptType = AllUserQuizAttemptsType[number];
