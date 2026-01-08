# app/data - Server-Side Data Layer

## Overview

Centralized Prisma queries for server components. Organized by domain: `admin/`, `course/`, `user/`.

## Structure

```
app/data/
├── admin/
│   ├── require-admin.ts       # Auth guard for admin routes
│   ├── admin-get-course.ts    # Single course with chapters/lessons
│   ├── admin-get-courses.ts   # All courses for admin
│   ├── admin-get-lesson.ts    # Single lesson details
│   ├── admin-get-chart-data.ts
│   └── admin-get-dashboard-stats.ts
├── course/
│   ├── get-course.ts          # Public course view
│   ├── get-all-courses.ts     # Course catalog
│   ├── get-lesson-content.ts  # Lesson for enrolled student
│   └── get-course-sidebar-data.ts
└── user/
    ├── require-user.ts        # Auth guard for user routes
    ├── user-is-enrolled.ts    # Enrollment check
    └── get-enrolled-courses.ts
```

## Pattern

```typescript
import "server-only";
import { cache } from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const myDataFunction = cache(async (param: string) => {
  await requireAdmin(); // or requireUser()
  
  const data = await prisma.model.findUnique({
    where: { id: param },
    select: { /* explicit fields */ }
  });
  
  if (!data) return notFound();
  return data;
});

export type MyDataType = Awaited<ReturnType<typeof myDataFunction>>;
```

## Conventions

- **Always `import "server-only"`** - Prevents client import
- **Always wrap with `cache()`** - React request memoization
- **Always auth guard first** - `requireAdmin()` or `requireUser()`
- **Use `select` not include** - Explicit field selection
- **Export return type** - `export type X = Awaited<ReturnType<typeof x>>`
- **Use `notFound()`** - From next/navigation for missing data

## Auth Guards

`requireAdmin()` - Redirects to `/login` if no session, `/not-admin` if not admin role
`requireUser()` - Redirects to `/login` if no session

Both return the session object on success.

## Anti-Patterns

- **Never call from client components** - Server-only
- **Never skip auth guards** - Always verify permissions
- **Never use `include: { relation: true }`** - Use explicit `select`
