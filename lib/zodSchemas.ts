import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archive"] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  filekey: z.string().min(1, { message: "Thumbnail Image is required" }),
  isFree: z.boolean().default(false),
  price: z.coerce.number().min(0, { message: "Price must be at least 0" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must be at most 500" }),
  level: z.enum(courseLevels, {
    message: "Please select a valid course level",
  }),
  categoryId: z
    .string()
    .uuid({ message: "Category is required" })
    .optional()
    .nullable(),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, { message: "Small description must be at most 200 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(courseStatus, { message: "Please select a valid status" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  chapterId: z.string().uuid({ message: "Invalid chapter id" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;

// Explicit form values type for react-hook-form compatibility with Zod 4
// Zod 4's z.coerce.number() infers 'unknown' which breaks react-hook-form
export type CourseFormValues = Omit<CourseSchemaType, "price" | "duration"> & {
  price: number;
  duration: number;
  isFree: boolean;
};

// Category schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be at most 50 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must only contain lowercase letters, numbers, and hyphens",
    }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters" })
    .optional(),
  imageKey: z.string().optional(),
  position: z.coerce.number().min(0).default(0),
});

// Tag schema
export const tagSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(30, { message: "Name must be at most 30 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(30, { message: "Slug must be at most 30 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must only contain lowercase letters, numbers, and hyphens",
    }),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  title: z
    .string()
    .max(100, { message: "Title must be at most 100 characters" })
    .optional(),
  content: z
    .string()
    .max(2000, { message: "Review must be at most 2000 characters" })
    .optional(),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

// Quiz schema
export const quizSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be at most 200 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
  passingScore: z.coerce
    .number()
    .min(0, { message: "Passing score must be at least 0" })
    .max(100, { message: "Passing score must be at most 100" })
    .default(70),
  timeLimit: z.coerce.number().min(1).optional(),
  allowRetake: z.boolean().default(true),
  maxAttempts: z.coerce.number().min(1).optional(),
  shuffleQuestions: z.boolean().default(false),
  lessonId: z.string().uuid().optional(),
  chapterId: z.string().uuid().optional(),
});

// Question schema
export const questionTypes = [
  "MultipleChoice",
  "TrueFalse",
  "MultiSelect",
  "FillInBlank",
  "Matching",
  "ShortAnswer",
] as const;

export const questionSchema = z.object({
  questionText: z
    .string()
    .min(3, { message: "Question must be at least 3 characters" })
    .max(1000, { message: "Question must be at most 1000 characters" }),
  questionType: z.enum(questionTypes, {
    message: "Please select a valid question type",
  }),
  options: z
    .array(z.string())
    .min(2, { message: "At least 2 options required" }),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z
    .string()
    .max(1000, { message: "Explanation must be at most 1000 characters" })
    .optional(),
  points: z.coerce.number().min(1).default(1),
  quizId: z.string().uuid({ message: "Invalid quiz id" }),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;

// Explicit form values type for react-hook-form compatibility with Zod 4
// Zod 4's z.coerce.number() infers 'unknown' which breaks react-hook-form
export type CategoryFormValues = Omit<CategorySchemaType, "position"> & {
  position: number;
};
export type TagSchemaType = z.infer<typeof tagSchema>;
export type ReviewSchemaType = z.infer<typeof reviewSchema>;
export type QuizSchemaType = z.infer<typeof quizSchema>;
export type QuestionSchemaType = z.infer<typeof questionSchema>;

// Explicit form values type for react-hook-form compatibility with Zod 4
export type QuizFormValues = {
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  allowRetake: boolean;
  maxAttempts?: number;
  shuffleQuestions: boolean;
  lessonId?: string;
  chapterId?: string;
};

export type QuestionFormValues = {
  questionText: string;
  questionType:
    | "MultipleChoice"
    | "TrueFalse"
    | "MultiSelect"
    | "FillInBlank"
    | "Matching"
    | "ShortAnswer";
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  quizId: string;
};

export const quizSubmissionSchema = z.object({
  quizId: z.string().uuid({ message: "Invalid quiz id" }),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export type QuizSubmissionType = z.infer<typeof quizSubmissionSchema>;
