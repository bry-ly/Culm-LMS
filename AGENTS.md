# Agent Guidelines

## Commands

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server

**Code Quality:**
- `npm run lint` - Run ESLint (uses next/core-web-vitals and next/typescript configs)
- No test suite configured yet

## Code Style

### Imports
- Use path alias `@/*` for root-level imports (e.g., `@/lib/utils`, `@/components/ui/button`)
- Group external imports first, then internal imports
- Sort imports alphabetically within groups
- No unused imports

### TypeScript
- Strict mode enabled - always type function parameters and return types
- Use PascalCase for type interfaces and type aliases
- Export types used in multiple places
- Use discriminated unions for result types (see hooks/try-catch.ts)

### Naming Conventions
- **Components:** PascalCase with `export function ComponentName()`
- **Custom Hooks:** camelCase with `use` prefix (e.g., `useCourseProgress`)
- **Utilities:** camelCase functions (e.g., `cn()`, `tryCatch()`)
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE or camelCase depending on scope
- **Files:** kebab-case for components (e.g., `Login-Form.tsx`), camelCase for utilities

### Server vs Client Components
- Server components by default (no "use client" directive)
- Add `"use client";` at top of file when using:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs
  - Event handlers
  - Interactive UI libraries

### Component Structure
- Props interface defined above component
- Destructure props in function signature
- Use `React.ComponentProps` for forwarding DOM element props to UI components
- Export components with `export function ComponentName()`
- UI components in `components/ui/` use Radix UI patterns

### Data Fetching
- Server-side data fetching functions in `app/data/` directory
- Organize by feature: `app/data/admin/`, `app/data/course/`, `app/data/user/`
- Use async functions that fetch data directly from Prisma
- Use `prisma` instance from `@/lib/db`
- For protected routes, use `requireAdmin()` or `requireUser()` from `app/data/`

### Error Handling
- Use `tryCatch()` wrapper from `@/hooks/try-catch` for promise error handling
- Show user-facing errors with `toast.error()` from `sonner`
- Use `toast.success()` for success messages
- API routes return appropriate HTTP status codes and error messages

### Database (Prisma)
- Import prisma instance from `@/lib/db`
- Use generated types from `@/lib/generated/prisma/client`
- Schema in `prisma/schema.prisma`
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema to database

### Styling
- Use Tailwind CSS classes
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Shadcn UI components in `components/ui/` follow Radix UI patterns
- Use `size-*` classes instead of `w-* h-*` when dimensions match

### Authentication
- Use `auth` from `@/lib/auth` for Better Auth integration
- Get session with `auth.api.getSession({ headers: await headers() })`
- For client auth, use `authClient` from `@/lib/auth-client`
- Use `server-only` import for server-only auth functions

### File Organization
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components organized by feature
- `hooks/` - Custom React hooks
- `lib/` - Utility functions, clients, and shared logic
- `prisma/` - Database schema and configuration
- `public/` - Static assets

### Important Patterns
- Use `redirect()` from `next/navigation` for redirects
- Use `headers()` from `next/headers` to get request headers in server components
- Use `cache()` from React for memoizing expensive server operations
- Use `useMemo()` and `useCallback()` in client components for performance
- Cleanup object URLs with `URL.revokeObjectURL()` in cleanup functions

### Comments
- DO NOT add comments unless explicitly asked
- Code should be self-documenting

### Security
- Never commit secrets or credentials (.env files are ignored)
- Validate user input with Zod schemas (see lib/zodSchemas.ts)
- Use Arcjet for bot protection (configured in lib/arcjet.ts)
- All admin routes protected with `requireAdmin()`
