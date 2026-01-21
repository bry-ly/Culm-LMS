# Contributing to Culm LMS

Thank you for your interest in contributing to Culm LMS. To maintain code quality and consistency, please follow these guidelines.

## Development Workflow

1. **Fork and Clone**: Fork the repository and clone it to your local machine.
2. **Install Dependencies**: Use pnpm to install the project dependencies.
   ```bash
   pnpm install
   ```
3. **Create a Feature Branch**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. **Development**: Make your changes in the local environment. Ensure that you follow the project conventions.
5. **Lint and Format**: Before committing, run linting and formatting checks.
   ```bash
   npm run lint
   npm run format
   ```
6. **Pre-commit Hooks**: The project uses Husky and lint-staged to run linting and formatting automatically on every commit. Ensure these checks pass before pushing.

## Code Style

- **Linting and Formatting**: ESLint and Prettier are strictly enforced. Do not bypass the pre-commit hooks.
- **TypeScript**: Use strict mode for all TypeScript files.
- **Type Safety**: Avoid using `as any`, `@ts-ignore`, or `@ts-expect-error`. Define proper interfaces and types for all data structures.
- **Path Aliases**: Use the `@/*` path alias for all internal imports to maintain clean and manageable import statements.
- **React Components**:
  - Use Server Components by default.
  - Use the `"use client";` directive only when necessary (e.g., for interactivity or using browser APIs).
  - Use named exports for all components: `export function MyComponent() {}`.

## Commit Guidelines

- **Conventional Commits**: Use the conventional commit format for all commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for changes that do not affect the meaning of the code (white-space, formatting, etc.)
  - `refactor:` for code changes that neither fix a bug nor add a feature
  - `test:` for adding missing tests or correcting existing tests
  - `chore:` for updating build tasks, package manager configs, etc.
- **Descriptive Messages**: Write concise but descriptive commit messages that explain the "why" behind the changes.

## Pull Request Process

1. **Self-Review**: Review your changes to ensure they meet the project's quality standards.
2. **Checks**: Ensure all CI/CD checks pass, including linting, formatting, and type checking.
3. **Documentation**: Update the relevant documentation if your changes introduce new features or modify existing behavior.
4. **Request Review**: Submit your pull request and request a review from the maintainers.
5. **Address Feedback**: Be prepared to address feedback and make necessary adjustments to your PR.

## Project Conventions

- **File Naming**:
  - Components: Use kebab-case (e.g., `course-card.tsx`).
  - Utilities and Hooks: Use camelCase (e.g., `useAuth.ts`, `tryCatch.ts`).
  - Data Functions: Use kebab-case with descriptive names (e.g., `get-course-data.ts`).
- **Data Fetching**: All server-side data fetching logic must be placed in the `app/data/` directory. Use React's `cache()` to optimize performance.
- **Server Actions**: Colocate server actions with the pages or components that use them.
- **Validation**: Place all Zod schemas in `lib/zodSchemas.ts` to ensure centralized and reusable validation logic.
- **Imports**:
  - Group external imports at the top, followed by internal imports.
  - Keep imports alphabetized within their respective groups.
