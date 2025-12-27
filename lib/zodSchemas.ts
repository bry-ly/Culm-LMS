import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archive"] as const;
export const courseCategory = [
  "Development",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
  "IT & Software",
  "Personal Development",
  "Photography",
  "Music",
  "Health & Fitness",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title must be at most 100 characters" }),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  filekey: z.string().min(1, { message: "Thumbnail Image is required" }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1" }).max(500, { message: "Duration must be at most 500" }),
  level: z.enum(courseLevels, {
    message: "Please select a valid course level",
  }),
  category: z.enum(courseCategory, { message: "Category is required" }),
  smallDescription: z.string().min(3, { message: "Small description must be at least 3 characters" }).max(200, { message: "Small description must be at most 200 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(courseStatus, { message: "Please select a valid status" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
