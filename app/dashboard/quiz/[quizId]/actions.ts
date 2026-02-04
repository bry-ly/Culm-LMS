"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { quizSubmissionSchema } from "@/lib/zodSchemas";

type AttemptResponse =
  | { status: "success"; attemptId: string }
  | { status: "error"; message: string };

type AnswerType = string | string[] | Record<string, string>;

type QuestionResult = {
  questionId: string;
  correct: boolean;
  userAnswer: AnswerType;
  correctAnswer: AnswerType;
  explanation: string | null;
  points: number;
  earnedPoints: number;
};

type ResultResponse =
  | {
      status: "success";
      score: number;
      totalPoints: number;
      percentage: number;
      passed: boolean;
      results: QuestionResult[];
    }
  | { status: "error"; message: string };

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 30,
  })
);

export async function startQuizAttempt(
  quizId: string
): Promise<AttemptResponse> {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        attempts: {
          where: { userId: user.id },
          orderBy: { startedAt: "desc" },
        },
      },
    });

    if (!quiz) {
      return { status: "error", message: "Quiz not found" };
    }

    const existingInProgress = quiz.attempts.find(
      (a) => a.status === "InProgress"
    );
    if (existingInProgress) {
      return { status: "success", attemptId: existingInProgress.id };
    }

    const completedAttempts = quiz.attempts.filter(
      (a) => a.status === "Completed" || a.status === "TimedOut"
    );

    if (!quiz.allowRetake && completedAttempts.length > 0) {
      return {
        status: "error",
        message: "Retakes are not allowed for this quiz",
      };
    }

    if (quiz.maxAttempts && completedAttempts.length >= quiz.maxAttempts) {
      return {
        status: "error",
        message: `Maximum attempts (${quiz.maxAttempts}) reached`,
      };
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        status: "InProgress",
        answers: {},
        score: 0,
        totalPoints: 0,
        percentage: 0,
        passed: false,
      },
    });

    return { status: "success", attemptId: attempt.id };
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    return { status: "error", message: "Failed to start quiz" };
  }
}

export async function submitQuizAttempt(
  attemptId: string,
  values: unknown
): Promise<ResultResponse> {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const validation = quizSubmissionSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid submission data" };
    }

    const { quizId, answers } = validation.data;

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        userId: user.id,
        status: "InProgress",
      },
    });

    if (!attempt) {
      return { status: "error", message: "No active attempt found" };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!quiz) {
      return { status: "error", message: "Quiz not found" };
    }

    let score = 0;
    let totalPoints = 0;
    const results: QuestionResult[] = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id] as AnswerType;
      const correctAnswer = question.correctAnswer as AnswerType;

      let isCorrect = false;

      switch (question.questionType) {
        case "MultiSelect": {
          const userAnswerArray = Array.isArray(userAnswer)
            ? [...userAnswer].sort()
            : [];
          const correctAnswerArray = Array.isArray(correctAnswer)
            ? [...correctAnswer].sort()
            : [];
          isCorrect =
            userAnswerArray.length === correctAnswerArray.length &&
            userAnswerArray.every((a, i) => a === correctAnswerArray[i]);
          break;
        }

        case "FillInBlank": {
          const userBlanks = Array.isArray(userAnswer) ? userAnswer : [];
          const correctBlanks = Array.isArray(correctAnswer)
            ? correctAnswer
            : [];
          isCorrect =
            userBlanks.length === correctBlanks.length &&
            userBlanks.every(
              (ans, i) =>
                ans?.toString().trim().toLowerCase() ===
                correctBlanks[i]?.toString().trim().toLowerCase()
            );
          break;
        }

        case "Matching": {
          const userMatches =
            typeof userAnswer === "object" && !Array.isArray(userAnswer)
              ? (userAnswer as Record<string, string>)
              : {};
          let correctMatches: Record<string, string> = {};

          // correctAnswer could be a JSON string or already an object
          if (typeof correctAnswer === "string") {
            try {
              correctMatches = JSON.parse(correctAnswer) as Record<
                string,
                string
              >;
            } catch {
              correctMatches = {};
            }
          } else if (
            typeof correctAnswer === "object" &&
            !Array.isArray(correctAnswer)
          ) {
            correctMatches = correctAnswer as Record<string, string>;
          }

          const userKeys = Object.keys(userMatches).sort();
          const correctKeys = Object.keys(correctMatches).sort();

          isCorrect =
            userKeys.length === correctKeys.length &&
            userKeys.every((key) => userMatches[key] === correctMatches[key]);
          break;
        }

        case "ShortAnswer": {
          const userText =
            typeof userAnswer === "string"
              ? userAnswer.trim().toLowerCase()
              : "";
          const correctText =
            typeof correctAnswer === "string"
              ? correctAnswer.trim().toLowerCase()
              : "";

          // Check for exact match first
          if (userText === correctText) {
            isCorrect = true;
          } else {
            // Check for keyword matching if options array contains keywords
            const keywords = question.options as string[] | null;
            if (keywords && keywords.length > 0) {
              const matchedKeywords = keywords.filter((kw) =>
                userText.includes(kw.toLowerCase())
              );
              // Consider correct if at least half of keywords are present
              isCorrect =
                matchedKeywords.length >= Math.ceil(keywords.length / 2);
            }
          }
          break;
        }

        default: {
          // MultipleChoice, TrueFalse
          isCorrect = userAnswer === correctAnswer;
        }
      }

      const earnedPoints = isCorrect ? question.points : 0;
      score += earnedPoints;

      results.push({
        questionId: question.id,
        correct: isCorrect,
        userAnswer: userAnswer ?? "",
        correctAnswer,
        explanation: question.explanation,
        points: question.points,
        earnedPoints,
      });
    }

    const percentage =
      totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers,
        score,
        totalPoints,
        percentage,
        passed,
        status: "Completed",
        completedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/quiz/${quizId}`);

    return {
      status: "success",
      score,
      totalPoints,
      percentage,
      passed,
      results,
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return { status: "error", message: "Failed to submit quiz" };
  }
}

export async function getAttemptAnswers(
  attemptId: string
): Promise<
  | { status: "success"; answers: Record<string, string | string[]> }
  | { status: "error"; message: string }
> {
  const user = await requireUser();

  try {
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        userId: user.id,
      },
      select: {
        answers: true,
        status: true,
      },
    });

    if (!attempt) {
      return { status: "error", message: "Attempt not found" };
    }

    return {
      status: "success",
      answers: (attempt.answers as Record<string, string | string[]>) ?? {},
    };
  } catch (error) {
    console.error("Error getting attempt answers:", error);
    return { status: "error", message: "Failed to get answers" };
  }
}
