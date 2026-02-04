import { adminGetCategories } from "@/app/data/admin/admin-get-categories";
import { CreateCourseForm } from "./_components/CreateCourseForm";

export default async function CourseCreationPage() {
  const categories = await adminGetCategories();

  return <CreateCourseForm categories={categories} />;
}
