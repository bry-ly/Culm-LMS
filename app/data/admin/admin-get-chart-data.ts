import "server only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

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

export async function adminGetChartData(year: number, month: number) {
  await requireAdmin();

  // month is 0-indexed (0 = January, 11 = December)
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // Get all signups for the month
  const signups = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Get all enrollments for the month
  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Initialize daily data for the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyData = new Map<string, { signups: number; enrollments: number }>();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    dailyData.set(dateStr, { signups: 0, enrollments: 0 });
  }

  // Aggregate signups by day
  signups.forEach((signup) => {
    const dateStr = signup.createdAt.toISOString().split("T")[0];
    const existing = dailyData.get(dateStr);
    if (existing) {
      existing.signups += 1;
    }
  });

  // Aggregate enrollments by day
  enrollments.forEach((enrollment) => {
    const dateStr = enrollment.createdAt.toISOString().split("T")[0];
    const existing = dailyData.get(dateStr);
    if (existing) {
      existing.enrollments += 1;
    }
  });

  // Convert to array and sort by date
  const chartData: ChartDataPoint[] = Array.from(dailyData.entries())
    .map(([date, counts]) => ({
      date,
      signups: counts.signups,
      enrollments: counts.enrollments,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
}

export async function adminGetTrendingCourses(limit: number = 5) {
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
}
