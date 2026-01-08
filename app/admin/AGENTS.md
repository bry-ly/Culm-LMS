# app/admin - Admin Dashboard

## Overview

Course management interface. All routes protected by `requireAdmin()`.

## Structure

```
app/admin/
├── layout.tsx              # Admin shell with sidebar
├── page.tsx                # Dashboard stats/charts
└── courses/
    ├── page.tsx            # Course list
    ├── create/
    │   ├── page.tsx        # New course form
    │   └── actions.ts      # CreateCourse server action
    ├── _components/
    │   └── AdminCourseCard.tsx
    └── [courseId]/
        ├── edit/
        │   ├── page.tsx
        │   ├── actions.ts  # UpdateCourse, CreateChapter, etc.
        │   └── _components/
        │       ├── EditCourseForm.tsx
        │       ├── CourseStructure.tsx  # Drag-drop chapters/lessons
        │       ├── NewChapterModal.tsx
        │       ├── NewLessonModal.tsx
        │       ├── DeleteChapter.tsx
        │       └── DeleteLesson.tsx
        ├── delete/
        │   ├── page.tsx
        │   └── actions.ts
        └── [chapterId]/[lessonId]/
            ├── page.tsx    # Lesson editor
            ├── actions.ts  # UpdateLesson
            └── _components/
                └── LessonForm.tsx
```

## Key Patterns

### Server Action Structure
```typescript
"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

export async function ActionName(values: SchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();
  
  // Rate limiting
  const req = await request();
  const decision = await aj.protect(req, { fingerprint: session.user.id });
  if (decision.isDenied()) return { status: "error", message: "Rate limited" };
  
  // Validation
  const validation = schema.safeParse(values);
  if (!validation.success) return { status: "error", message: "Invalid data" };
  
  // Prisma operation + Stripe sync if needed
  return { status: "success", message: "Done" };
}
```

### Course Structure DnD

Uses `@dnd-kit` for drag-drop reordering:
- `CourseStructure.tsx` - Main container
- Chapters and lessons have `position` field
- Reorder updates all affected positions in DB

## Where to Look

| Task | Location |
|------|----------|
| Course CRUD | `courses/create/actions.ts`, `courses/[courseId]/edit/actions.ts` |
| Lesson editing | `[courseId]/[chapterId]/[lessonId]/` |
| Drag-drop logic | `edit/_components/CourseStructure.tsx` |
| S3 uploads | Uses `components/file-uploader/Uploader.tsx` |

## Data Flow

1. Page loads → `requireAdmin()` checks auth
2. Page fetches via `app/data/admin/` functions
3. User submits form → Server action validates + rate limits
4. Action calls Prisma + Stripe API
5. Returns `ApiResponse` → Client shows toast
