import "server-only";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { cache } from "react";

export type ChartDataPoint = {
  date: string;
  signups: number;
  enrollments: number;
};

export type TrendingCourse = {
  id: string;
  title: string;
  slug: string;
  enrollmentCount: number;
};

type DailyCount = {
  date: Date;
  count: bigint;
};

export const adminGetChartData = cache(async (year: number, month: number) => {
  await requireAdmin();

  // month is 0-indexed (0 = January, 11 = December)
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // Use database-level aggregation with raw SQL for better performance
  const [signupCounts, enrollmentCounts] = await Promise.all([
    prisma.$queryRaw<DailyCount[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "user"
      WHERE "createdAt" >= ${startOfMonth} AND "createdAt" <= ${endOfMonth}
      GROUP BY DATE("createdAt")
    `,
    prisma.$queryRaw<DailyCount[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Enrollment"
      WHERE "createdAt" >= ${startOfMonth} AND "createdAt" <= ${endOfMonth}
      GROUP BY DATE("createdAt")
    `,
  ]);

  // Build lookup maps from aggregated results
  const signupMap = new Map<string, number>();
  const enrollmentMap = new Map<string, number>();

  signupCounts.forEach((row) => {
    const dateStr = row.date.toISOString().split("T")[0];
    signupMap.set(dateStr, Number(row.count));
  });

  enrollmentCounts.forEach((row) => {
    const dateStr = row.date.toISOString().split("T")[0];
    enrollmentMap.set(dateStr, Number(row.count));
  });

  // Initialize daily data for the month and merge with aggregated counts
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const chartData: ChartDataPoint[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    chartData.push({
      date: dateStr,
      signups: signupMap.get(dateStr) ?? 0,
      enrollments: enrollmentMap.get(dateStr) ?? 0,
    });
  }

  return chartData;
});

export const adminGetTrendingCourses = cache(async (limit: number = 5) => {
  await requireAdmin();

  const trendingCourses = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      _count: {
        select: {
          enrollment: true,
        },
      },
    },
    orderBy: {
      enrollment: {
        _count: "desc",
      },
    },
    take: limit,
  });

  return trendingCourses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    enrollmentCount: course._count.enrollment,
  })) as TrendingCourse[];
});
