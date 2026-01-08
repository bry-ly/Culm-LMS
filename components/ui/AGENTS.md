# components/ui - Shadcn UI Components

## Overview

57 Radix-based UI primitives following Shadcn patterns. Auto-generated via `npx shadcn@latest add`.

## Pattern

All components follow this structure:

```typescript
import { cn } from "@/lib/utils"

function ComponentName({ className, ...props }: React.ComponentProps<"element">) {
  return <element className={cn("base-classes", className)} {...props} />
}

export { ComponentName }
```

## Conventions

- **Named function exports** - `export { Button }` not `export default`
- **`data-slot` attributes** - Every component has `data-slot="component-name"` for styling
- **`cn()` for class merging** - Always use for className prop
- **Radix primitives** - Import from `@radix-ui/react-*`
- **cva for variants** - Use `class-variance-authority` for variant props

## Variants Pattern

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "h-9", sm: "h-8", lg: "h-10", icon: "size-9" }
  },
  defaultVariants: { variant: "default", size: "default" }
})

function Button({ variant, size, className, ...props }: Props) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

## Custom Props

Some components have project-specific additions:
- `DialogContent` - `showCloseButton?: boolean` (default true)

## Where to Look

| Need | File |
|------|------|
| Buttons | `button.tsx` |
| Forms | `form.tsx`, `input.tsx`, `select.tsx`, `checkbox.tsx` |
| Modals | `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `drawer.tsx` |
| Navigation | `sidebar.tsx`, `navigation-menu.tsx`, `tabs.tsx` |
| Feedback | `sonner.tsx` (toasts), `skeleton.tsx`, `spinner.tsx` |
| Layout | `card.tsx`, `separator.tsx`, `scroll-area.tsx` |

## Anti-Patterns

- **Never modify base styles directly** - Override via className prop
- **Never remove `data-slot` attributes** - Used for global styling
- **No inline styles** - Tailwind only
