import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  

  await new Promise((resolve) => setTimeout(resolve, 2000));

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
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
