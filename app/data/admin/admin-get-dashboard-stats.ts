import "server-only";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { cache } from "react";

export const adminGetDashboardStats = cache(async () => {
  await requireAdmin();

  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      // user counts
      prisma.user.count(),

      //total customers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),

      // Total courses
      prisma.course.count(),

      // Total lessons
      prisma.lesson.count(),
    ]);

  return {
    totalCourses,
    totalLessons,
    totalSignups,
    totalCustomers,
  };
});
