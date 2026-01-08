import prisma from "@/lib/db";
import { cache } from "react";

export const getAllCourses = cache(async () => {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      price: true,
      smallDescription: true,
      filekey: true,
      category: true,
      id: true,
      level: true,
      duration: true,
      slug: true,
    },
  });

  return data;
});

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
