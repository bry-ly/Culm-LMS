"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { quizSchema, QuizSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 20,
  })
);

export async function createQuiz(values: QuizSchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }
      return { status: "error", message: "Request blocked" };
    }

    const validation = quizSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" };
    }

    const { lessonId, chapterId, ...rest } = validation.data;

    // Get max position for new quiz
    const maxPosition = await prisma.quiz.aggregate({
      _max: { position: true },
      where: lessonId ? { lessonId } : undefined,
    });

    await prisma.quiz.create({
      data: {
        ...rest,
        lessonId: lessonId || null,
        chapterId: chapterId || null,
        position: (maxPosition._max.position ?? -1) + 1,
      },
    });

    revalidatePath("/admin/quizzes");
    return { status: "success", message: "Quiz created successfully" };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return { status: "error", message: "Failed to create quiz" };
  }
}

export async function updateQuiz(
  id: string,
  values: QuizSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }
      return { status: "error", message: "Request blocked" };
    }

    const validation = quizSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" };
    }

    const { lessonId, chapterId, ...rest } = validation.data;

    await prisma.quiz.update({
      where: { id },
      data: {
        ...rest,
        lessonId: lessonId || null,
        chapterId: chapterId || null,
      },
    });

    revalidatePath("/admin/quizzes");
    revalidatePath(`/admin/quizzes/${id}`);
    return { status: "success", message: "Quiz updated successfully" };
  } catch (error) {
    console.error("Error updating quiz:", error);
    return { status: "error", message: "Failed to update quiz" };
  }
}

export async function deleteQuiz(id: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }
      return { status: "error", message: "Request blocked" };
    }

    await prisma.quiz.delete({
      where: { id },
    });

    revalidatePath("/admin/quizzes");
    return { status: "success", message: "Quiz deleted successfully" };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return { status: "error", message: "Failed to delete quiz" };
  }
}
