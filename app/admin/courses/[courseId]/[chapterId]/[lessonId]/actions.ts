"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}
