import prisma from "@/lib/db";
import { cache } from "react";
import { Prisma, CourseLevel } from "@/lib/generated/prisma/client";

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  priceType?: "all" | "free" | "paid";
}

export const getAllCourses = cache(async (filters?: CourseFilters) => {
  const where: Prisma.CourseWhereInput = {
    status: "Published",
  };

  // Apply search filter
  if (filters?.search && filters.search.trim() !== "") {
    where.title = {
      contains: filters.search.trim(),
      mode: "insensitive",
    };
  }

  // Apply category filter (by category slug)
  if (filters?.category && filters.category !== "all") {
    where.category = {
      slug: filters.category,
    };
  }

  // Apply level filter
  if (filters?.level && filters.level !== "all") {
    where.level = filters.level as CourseLevel;
  }

  // Apply price type filter
  if (filters?.priceType === "free") {
    where.isFree = true;
  } else if (filters?.priceType === "paid") {
    where.isFree = false;
  }

  const data = await prisma.course.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      price: true,
      smallDescription: true,
      filekey: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      id: true,
      level: true,
      duration: true,
      slug: true,
      isFree: true,
    },
  });

  return data;
});

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
