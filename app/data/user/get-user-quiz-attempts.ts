import "server-only";

import prisma from "@/lib/db";
import { cache } from "react";
import { requireUser } from "./require-user";

export const getUserQuizAttempts = cache(async (quizId: string) => {
  const user = await requireUser();

  return prisma.quizAttempt.findMany({
    where: {
      quizId,
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
    },
    orderBy: {
      startedAt: "desc",
    },
  });
});

export type UserQuizAttemptsType = Awaited<
  ReturnType<typeof getUserQuizAttempts>
>;
export type UserQuizAttemptType = UserQuizAttemptsType[number];
