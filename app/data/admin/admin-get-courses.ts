import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { cache } from "react";

export const adminGetCourses = cache(async () => {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      slug: true,
      status: true,
      price: true,
      category: true,
      filekey: true,
    },
  });

  return data;
});

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
