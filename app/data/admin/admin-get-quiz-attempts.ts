import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireAdmin } from "./require-admin";

export const adminGetQuizAttempts = cache(async (quizId: string) => {
  await requireAdmin();

  return prisma.quizAttempt.findMany({
    where: { quizId },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });
});

export type AdminQuizAttemptsType = Awaited<
  ReturnType<typeof adminGetQuizAttempts>
>;
export type AdminQuizAttemptType = AdminQuizAttemptsType[number];
