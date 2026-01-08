import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

const deleteSchema = z.object({
  key: z.string().min(1, { message: "Object key is required" }),
});

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

async function verifyKeyOwnership(key: string): Promise<boolean> {
  const [courseWithKey, lessonWithThumbnail, lessonWithVideo] = await Promise.all([
    prisma.course.findFirst({
      where: { filekey: key },
      select: { id: true },
    }),
    prisma.lesson.findFirst({
      where: { thumbnailKey: key },
      select: { id: true },
    }),
    prisma.lesson.findFirst({
      where: { videoKey: key },
      select: { id: true },
    }),
  ]);

  return !!(courseWithKey || lessonWithThumbnail || lessonWithVideo);
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const validation = deleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    const { key } = validation.data;

    const isOwned = await verifyKeyOwnership(key);
    if (!isOwned) {
      return NextResponse.json(
        { error: "File not found or not associated with any course/lesson" },
        { status: 404 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("S3 deletion error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
