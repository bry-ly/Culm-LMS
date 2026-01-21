# Culm LMS - Agent Guidelines

**Generated:** 2026-01-08 | **Commit:** c11c88e | **Branch:** main

## Overview

LMS SaaS built with Next.js 16 (App Router), Prisma/PostgreSQL, Better Auth, Stripe payments, S3 storage.

## Structure

```
lms-saas/
├── app/
│   ├── (auth)/           # Login, verify-request routes
│   ├── (public)/         # Public pages, course catalog
│   ├── admin/            # Admin dashboard, course CRUD
│   ├── dashboard/        # Student dashboard, lesson viewer
│   ├── data/             # Server-side data fetching (see app/data/AGENTS.md)
│   ├── api/              # Route handlers (auth, s3, stripe webhook)
│   └── payment/          # Payment success/cancel pages
├── components/
│   ├── ui/               # Shadcn/Radix components (see components/ui/AGENTS.md)
│   ├── sidebar/          # Admin sidebar components
│   ├── file-uploader/    # S3 file upload
│   └── rich-text-editor/ # Tiptap editor
├── hooks/                # Custom hooks
├── lib/                  # Utilities, clients, config
└── prisma/               # Database schema
```

## Where to Look

| Task             | Location                                                           | Notes                            |
| ---------------- | ------------------------------------------------------------------ | -------------------------------- |
| Auth logic       | `lib/auth.ts`, `lib/auth-client.ts`                                | Better Auth config               |
| Protected routes | `app/data/admin/require-admin.ts`, `app/data/user/require-user.ts` | Use `cache()` wrapper            |
| Data fetching    | `app/data/{admin,course,user}/`                                    | Server-only, Prisma queries      |
| Server actions   | `app/**/actions.ts`                                                | Colocated with pages             |
| API routes       | `app/api/`                                                         | S3 upload/delete, Stripe webhook |
| UI primitives    | `components/ui/`                                                   | Shadcn pattern                   |
| Zod schemas      | `lib/zodSchemas.ts`                                                | All form validation              |
| Stripe           | `lib/stripe.ts`                                                    | Payment processing               |
| S3               | `lib/S3Client.ts`                                                  | File storage                     |

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npx prisma generate  # After schema changes
npx prisma db push   # Sync schema to DB
```

## Conventions

### Imports

- Use `@/*` path alias for all internal imports
- External imports first, then internal (alphabetical within groups)

### Components

- `export function ComponentName()` - named exports
- Props interface above component
- Server components by default, `"use client";` only when needed

### Data Fetching

- Server-side only in `app/data/` directory
- Wrap with `cache()` from React
- Return type exports: `export type FooType = Awaited<ReturnType<typeof foo>>`

### Error Handling

- `tryCatch()` from `@/hooks/try-catch` for promise handling
- `toast.error()` / `toast.success()` from sonner for user feedback
- Server actions return `ApiResponse` type: `{ status: "success" | "error", message: string }`

### File Naming

- Components: kebab-case (`Login-Form.tsx`)
- Utilities: camelCase (`tryCatch.ts`)
- Data functions: kebab-case descriptive (`admin-get-course.ts`)

## Anti-Patterns

- **No comments** unless explicitly asked
- **No `as any`, `@ts-ignore`, `@ts-expect-error`**
- **No empty catch blocks**
- Use `size-*` not `w-* h-*` when dimensions match

## Key Patterns

### Protected Server Actions

```typescript
"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";

export async function MyAction(values: SchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();
  // Rate limiting with Arcjet
  const req = await request();
  const decision = await aj.protect(req, { fingerprint: session.user.id });
  // Zod validation
  const validation = mySchema.safeParse(values);
  // Prisma operation
}
```

### Data Fetching Functions

```typescript
import "server-only";
import { cache } from "react";

export const getData = cache(async (id: string) => {
  await requireAdmin(); // or requireUser()
  return prisma.model.findUnique({ where: { id } });
});

export type DataType = Awaited<ReturnType<typeof getData>>;
```

### Result Type Pattern

```typescript
import { tryCatch } from "@/hooks/try-catch";

const { data, error } = await tryCatch(somePromise);
if (error) {
  toast.error("Failed");
  return;
}
// data is typed correctly
```

## Database

Models: `User`, `Session`, `Account`, `Course`, `Chapter`, `Lesson`, `Enrollment`, `lessonProgress`

Key relationships:

- User → Course (creator)
- User → Enrollment → Course (student)
- Course → Chapter → Lesson
- User → lessonProgress → Lesson

## Security

- Arcjet for bot protection and rate limiting
- Better Auth with Google/GitHub OAuth + email OTP
- All admin routes require `requireAdmin()`
- Never commit `.env` files
