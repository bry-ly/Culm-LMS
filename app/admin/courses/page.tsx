import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard, AdminCoursesCardSekeleton } from "./_components/AdminCourseCard";
import { EmptyCourseState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default function CoursesPage() {
  return (
    <>
      <div className="flex item-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>
      <div>
        <h1>Here you will see all of the courses</h1>
      </div>

      <Suspense fallback={<AdminCoursesCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();
  return (
    <>
      {data.length === 0 ? (
        <EmptyCourseState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCoursesCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCoursesCardSekeleton key={index} />
      ))}
    </div>
  );
}
