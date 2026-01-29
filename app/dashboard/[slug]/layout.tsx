import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { MobileCourseSidebar } from "../_components/MobileCourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ params, children }: iAppProps) {
  const { slug } = await params;

  // Server-side security check and lightweight data fetching
  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      <div className="border-border hidden w-80 shrink-0 border-r md:block">
        <CourseSidebar course={course} />
      </div>
      <div className="md:hidden">
        <MobileCourseSidebar>
          <CourseSidebar course={course} />
        </MobileCourseSidebar>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
