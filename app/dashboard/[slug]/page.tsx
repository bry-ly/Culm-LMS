import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}
export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  const firstChapter = course.chapter[0];
  const firstLesson = firstChapter?.lesson[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return (
    <div className="flex h-full items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">No lessons available</h2>
    </div>
  );
}
