"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { questionSchema } from "@/lib/zodSchemas";

type ApiResponse = { status: "success" | "error"; message: string };

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 30,
  })
);

export async function createQuestion(values: unknown): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const validation = questionSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" };
    }

    const { quizId, options, correctAnswer, ...rest } = validation.data;

    const lastQuestion = await prisma.question.findFirst({
      where: { quizId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = (lastQuestion?.position ?? 0) + 1;

    await prisma.question.create({
      data: {
        ...rest,
        quizId,
        options: options,
        correctAnswer: correctAnswer,
        position: nextPosition,
      },
    });

    revalidatePath(`/admin/quizzes/${quizId}`);
    return { status: "success", message: "Question created successfully" };
  } catch (error) {
    console.error("Error creating question:", error);
    return { status: "error", message: "Failed to create question" };
  }
}

export async function updateQuestion(
  questionId: string,
  values: unknown
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const validation = questionSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" };
    }

    const { quizId, options, correctAnswer, ...rest } = validation.data;

    await prisma.question.update({
      where: { id: questionId },
      data: {
        ...rest,
        options: options,
        correctAnswer: correctAnswer,
      },
    });

    revalidatePath(`/admin/quizzes/${quizId}`);
    return { status: "success", message: "Question updated successfully" };
  } catch (error) {
    console.error("Error updating question:", error);
    return { status: "error", message: "Failed to update question" };
  }
}

export async function deleteQuestion(
  questionId: string,
  quizId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    await prisma.question.delete({
      where: { id: questionId },
    });

    revalidatePath(`/admin/quizzes/${quizId}`);
    return { status: "success", message: "Question deleted successfully" };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { status: "error", message: "Failed to delete question" };
  }
}

export async function reorderQuestions(
  quizId: string,
  items: { id: string; position: number }[]
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.question.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    revalidatePath(`/admin/quizzes/${quizId}`);
    return { status: "success", message: "Questions reordered successfully" };
  } catch (error) {
    console.error("Error reordering questions:", error);
    return { status: "error", message: "Failed to reorder questions" };
  }
}
