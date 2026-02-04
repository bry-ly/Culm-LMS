import {
  CourseFilters as CourseFiltersType,
  getAllCourses,
} from "@/app/data/course/get-all-courses";
import { getCategories } from "@/app/data/course/get-categories";
import { EmptyCourseState } from "@/components/general/EmptyState";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";
import { CourseFilters } from "../_components/CourseFilters";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  search?: string;
  category?: string;
  level?: string;
  priceType?: string;
}>;

export default async function PublicCoursesRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [params, categories] = await Promise.all([
    searchParams,
    getCategories(),
  ]);

  return (
    <div className="mt-5">
      <div className="mb-6 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explore Courses
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Browse our courses and start learning today.
        </p>
      </div>
      <Suspense fallback={null}>
        <CourseFilters categories={categories} />
      </Suspense>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses filters={params} />
      </Suspense>
    </div>
  );
}

async function RenderCourses({
  filters,
}: {
  filters: {
    search?: string;
    category?: string;
    level?: string;
    priceType?: string;
  };
}) {
  const courseFilters: CourseFiltersType = {
    search: filters.search,
    category: filters.category,
    level: filters.level,
    priceType: filters.priceType as "all" | "free" | "paid" | undefined,
  };

  const courses = await getAllCourses(courseFilters);

  if (courses.length === 0) {
    const session = await auth.api.getSession({ headers: await headers() });
    const isAdmin = session?.user?.role === "admin";

    const hasFilters =
      courseFilters.search ||
      courseFilters.category ||
      courseFilters.level ||
      courseFilters.priceType;

    return (
      <EmptyCourseState
        title={
          hasFilters ? "No courses match your filters" : "No courses available"
        }
        description={
          hasFilters
            ? "Try adjusting your search or filters."
            : "Check back later for new courses."
        }
        buttonText={isAdmin ? "Create Course" : null}
        href={isAdmin ? "/admin/courses/create" : null}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
